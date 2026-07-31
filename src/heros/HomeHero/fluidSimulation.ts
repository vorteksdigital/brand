import * as THREE from 'three'

import { fluidShaders, type FluidShaderName } from './shaders'

type FluidConfig = {
  curl: number
  dyeDissipation: number
  dyeResolution: number
  edgeSoftness: number
  forceStrength: number
  inkColor: THREE.Color
  pressureDecay: number
  pressureIterations: number
  simResolution: number
  splatRadius: number
  threshold: number
  velocityDissipation: number
}

type DoubleRenderTarget = {
  read: THREE.WebGLRenderTarget
  swap: () => void
  write: THREE.WebGLRenderTarget
}

type FluidTargets = {
  curl: THREE.WebGLRenderTarget
  divergence: THREE.WebGLRenderTarget
  dye: DoubleRenderTarget
  pressure: DoubleRenderTarget
  velocity: DoubleRenderTarget
}

type FluidMaterials = Record<FluidShaderName, THREE.ShaderMaterial>

type UniformValue =
  | THREE.Color
  | THREE.Texture
  | THREE.Vector2
  | THREE.Vector3
  | null
  | number

const fluidConfig: FluidConfig = {
  curl: 25,
  dyeDissipation: 0.95,
  dyeResolution: 1024,
  edgeSoftness: 0,
  forceStrength: 7.5,
  inkColor: new THREE.Color(1, 1, 1),
  pressureDecay: 0.75,
  pressureIterations: 50,
  simResolution: 256,
  splatRadius: 0.275,
  threshold: 1,
  velocityDissipation: 0.95,
}

const fluidContextAttributes: WebGLContextAttributes = {
  alpha: true,
  antialias: false,
  depth: true,
  failIfMajorPerformanceCaveat: false,
  powerPreference: 'high-performance',
  premultipliedAlpha: true,
  preserveDrawingBuffer: false,
  stencil: false,
}

function hasSafePrecisionQueries(context: WebGL2RenderingContext) {
  try {
    const highVertex = context.getShaderPrecisionFormat(
      context.VERTEX_SHADER,
      context.HIGH_FLOAT,
    )

    if (!highVertex) return false

    if (highVertex.precision > 0) {
      const highFragment = context.getShaderPrecisionFormat(
        context.FRAGMENT_SHADER,
        context.HIGH_FLOAT,
      )

      if (!highFragment) return false
      if (highFragment.precision > 0) return true
    }

    const mediumVertex = context.getShaderPrecisionFormat(
      context.VERTEX_SHADER,
      context.MEDIUM_FLOAT,
    )

    if (!mediumVertex) return false
    if (mediumVertex.precision <= 0) return true

    return Boolean(
      context.getShaderPrecisionFormat(context.FRAGMENT_SHADER, context.MEDIUM_FLOAT),
    )
  } catch {
    return false
  }
}

function createFluidContext(canvas: HTMLCanvasElement) {
  try {
    const context = canvas.getContext('webgl2', fluidContextAttributes)

    return context && hasSafePrecisionQueries(context) ? context : null
  } catch {
    return null
  }
}

export class FluidSimulation {
  private animationFrame = 0
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  private canvas: HTMLCanvasElement
  private config = fluidConfig
  private destroyed = false
  private dpr = 1
  private dyeSize = { height: 1, width: 1 }
  private height = 1
  private intersectionObserver: IntersectionObserver
  private isVisible = true
  private lastTime = performance.now()
  private materials: FluidMaterials
  private mouse = {
    moved: false,
    velocityX: 0,
    velocityY: 0,
    x: 0,
    y: 0,
  }
  private quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2))
  private renderer: THREE.WebGLRenderer
  private resizeObserver: ResizeObserver
  private scene = new THREE.Scene()
  private simSize = { height: 1, width: 1 }
  private targets: FluidTargets
  private width = 1

  static create(canvas: HTMLCanvasElement) {
    const context = createFluidContext(canvas)

    return context ? new FluidSimulation(canvas, context) : null
  }

  private constructor(canvas: HTMLCanvasElement, context: WebGL2RenderingContext) {
    this.canvas = canvas
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      canvas,
      context,
      powerPreference: 'high-performance',
    })
    this.scene.add(this.quad)
    this.materials = this.createMaterials()
    this.updateRendererSize()
    this.targets = this.createTargets()

    this.resizeObserver = new ResizeObserver(this.handleResize)
    this.resizeObserver.observe(canvas)
    this.intersectionObserver = new IntersectionObserver(this.handleIntersection)
    this.intersectionObserver.observe(canvas)
    window.addEventListener('pointermove', this.handlePointerMove, { passive: true })

    this.animationFrame = window.requestAnimationFrame(this.tick)
  }

  destroy() {
    if (this.destroyed) return

    this.destroyed = true
    window.cancelAnimationFrame(this.animationFrame)
    window.removeEventListener('pointermove', this.handlePointerMove)
    this.resizeObserver.disconnect()
    this.intersectionObserver.disconnect()
    this.disposeTargets()
    Object.values(this.materials).forEach((material) => material.dispose())
    this.quad.geometry.dispose()
    this.renderer.dispose()
  }

  private createDoubleRenderTarget(width: number, height: number): DoubleRenderTarget {
    const pair = {
      read: this.createRenderTarget(width, height),
      write: this.createRenderTarget(width, height),
      swap() {
        ;[pair.read, pair.write] = [pair.write, pair.read]
      },
    }

    return pair
  }

  private createMaterials(): FluidMaterials {
    const makeMaterial = (
      shaderName: FluidShaderName,
      uniforms: Record<string, THREE.IUniform<UniformValue>>,
    ) => {
      const [vertexShader, fragmentShader] = fluidShaders[shaderName]

      return new THREE.ShaderMaterial({
        fragmentShader,
        transparent: true,
        uniforms,
        vertexShader,
      })
    }

    const numberUniform = (value = 0): THREE.IUniform<number> => ({ value })
    const textureUniform = (): THREE.IUniform<null> => ({ value: null })
    const vector2Uniform = (): THREE.IUniform<THREE.Vector2> => ({
      value: new THREE.Vector2(),
    })

    return {
      advection: makeMaterial('advection', {
        dissipation: numberUniform(),
        dt: numberUniform(),
        texelSize: vector2Uniform(),
        uSource: textureUniform(),
        uVelocity: textureUniform(),
      }),
      clear: makeMaterial('clear', {
        uTexture: textureUniform(),
        value: numberUniform(),
      }),
      curl: makeMaterial('curl', {
        texelSize: vector2Uniform(),
        uVelocity: textureUniform(),
      }),
      display: makeMaterial('display', {
        edgeSoftness: numberUniform(),
        inkColor: { value: new THREE.Color() },
        threshold: numberUniform(),
        uTexture: textureUniform(),
      }),
      divergence: makeMaterial('divergence', {
        texelSize: vector2Uniform(),
        uVelocity: textureUniform(),
      }),
      gradientSubtract: makeMaterial('gradientSubtract', {
        texelSize: vector2Uniform(),
        uPressure: textureUniform(),
        uVelocity: textureUniform(),
      }),
      pressure: makeMaterial('pressure', {
        texelSize: vector2Uniform(),
        uDivergence: textureUniform(),
        uPressure: textureUniform(),
      }),
      splat: makeMaterial('splat', {
        aspectRatio: numberUniform(),
        color: { value: new THREE.Vector3() },
        point: { value: new THREE.Vector2() },
        radius: numberUniform(),
        uTarget: textureUniform(),
      }),
      vorticity: makeMaterial('vorticity', {
        curlStrength: numberUniform(),
        dt: numberUniform(),
        texelSize: vector2Uniform(),
        uCurl: textureUniform(),
        uVelocity: textureUniform(),
      }),
    }
  }

  private createRenderTarget(width: number, height: number) {
    return new THREE.WebGLRenderTarget(width, height, {
      depthBuffer: false,
      type: THREE.HalfFloatType,
    })
  }

  private createTargets(): FluidTargets {
    const aspect = this.width / this.height
    this.simSize = {
      height: Math.max(1, Math.round(this.config.simResolution / aspect)),
      width: this.config.simResolution,
    }
    this.dyeSize = {
      height: Math.max(1, Math.round(this.config.dyeResolution / aspect)),
      width: this.config.dyeResolution,
    }

    return {
      curl: this.createRenderTarget(this.simSize.width, this.simSize.height),
      divergence: this.createRenderTarget(this.simSize.width, this.simSize.height),
      dye: this.createDoubleRenderTarget(this.dyeSize.width, this.dyeSize.height),
      pressure: this.createDoubleRenderTarget(this.simSize.width, this.simSize.height),
      velocity: this.createDoubleRenderTarget(this.simSize.width, this.simSize.height),
    }
  }

  private disposeTargets() {
    const { curl, divergence, dye, pressure, velocity } = this.targets
    ;[
      curl,
      divergence,
      dye.read,
      dye.write,
      pressure.read,
      pressure.write,
      velocity.read,
      velocity.write,
    ].forEach((target) => target.dispose())
  }

  private handleIntersection: IntersectionObserverCallback = ([entry]) => {
    this.isVisible = entry?.isIntersecting ?? false
  }

  private handlePointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch' && !event.isPrimary) return

    const bounds = this.canvas.getBoundingClientRect()
    const localX = event.clientX - bounds.left
    const localY = event.clientY - bounds.top
    const isInside =
      localX >= 0 && localX <= bounds.width && localY >= 0 && localY <= bounds.height

    if (!isInside) return

    const x = localX * this.dpr
    const y = localY * this.dpr
    this.mouse.velocityX = (x - this.mouse.x) * this.config.forceStrength
    this.mouse.velocityY = (y - this.mouse.y) * this.config.forceStrength
    this.mouse.x = x
    this.mouse.y = y
    this.mouse.moved = true
  }

  private handleResize: ResizeObserverCallback = () => {
    const previousAspect = this.width / this.height
    this.updateRendererSize()
    const nextAspect = this.width / this.height

    if (Math.abs(previousAspect - nextAspect) > 0.01) {
      this.disposeTargets()
      this.targets = this.createTargets()
    }
  }

  private pass(material: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget | null) {
    this.quad.material = material
    this.renderer.setRenderTarget(target)
    this.renderer.render(this.scene, this.camera)
  }

  private render() {
    this.pass(
      this.setUniforms(this.materials.display, {
        edgeSoftness: this.config.edgeSoftness,
        inkColor: this.config.inkColor,
        threshold: this.config.threshold,
        uTexture: this.targets.dye.read.texture,
      }),
      null,
    )
  }

  private setUniforms(
    material: THREE.ShaderMaterial,
    values: Record<string, UniformValue>,
  ) {
    Object.entries(values).forEach(([key, value]) => {
      const uniform = material.uniforms[key]

      if (uniform) uniform.value = value
    })

    return material
  }

  private simulate(deltaTime: number) {
    const materials = this.materials
    const { curl, divergence, dye, pressure, velocity } = this.targets
    const simTexel = new THREE.Vector2(1 / this.simSize.width, 1 / this.simSize.height)
    const dyeTexel = new THREE.Vector2(1 / this.dyeSize.width, 1 / this.dyeSize.height)

    this.pass(
      this.setUniforms(materials.curl, {
        texelSize: simTexel,
        uVelocity: velocity.read.texture,
      }),
      curl,
    )

    this.pass(
      this.setUniforms(materials.vorticity, {
        curlStrength: this.config.curl,
        dt: deltaTime,
        texelSize: simTexel,
        uCurl: curl.texture,
        uVelocity: velocity.read.texture,
      }),
      velocity.write,
    )
    velocity.swap()

    this.pass(
      this.setUniforms(materials.divergence, {
        texelSize: simTexel,
        uVelocity: velocity.read.texture,
      }),
      divergence,
    )

    this.pass(
      this.setUniforms(materials.clear, {
        uTexture: pressure.read.texture,
        value: this.config.pressureDecay,
      }),
      pressure.write,
    )
    pressure.swap()

    this.setUniforms(materials.pressure, {
      texelSize: simTexel,
      uDivergence: divergence.texture,
    })

    for (let iteration = 0; iteration < this.config.pressureIterations; iteration += 1) {
      materials.pressure.uniforms.uPressure.value = pressure.read.texture
      this.pass(materials.pressure, pressure.write)
      pressure.swap()
    }

    this.pass(
      this.setUniforms(materials.gradientSubtract, {
        texelSize: simTexel,
        uPressure: pressure.read.texture,
        uVelocity: velocity.read.texture,
      }),
      velocity.write,
    )
    velocity.swap()

    this.pass(
      this.setUniforms(materials.advection, {
        dissipation: this.config.velocityDissipation,
        dt: deltaTime,
        texelSize: simTexel,
        uSource: velocity.read.texture,
        uVelocity: velocity.read.texture,
      }),
      velocity.write,
    )
    velocity.swap()

    this.pass(
      this.setUniforms(materials.advection, {
        dissipation: this.config.dyeDissipation,
        dt: deltaTime,
        texelSize: dyeTexel,
        uSource: dye.read.texture,
        uVelocity: velocity.read.texture,
      }),
      dye.write,
    )
    dye.swap()
  }

  private splat() {
    const { dye, velocity } = this.targets
    const sharedUniforms = {
      aspectRatio: this.width / this.height,
      point: new THREE.Vector2(this.mouse.x / this.width, 1 - this.mouse.y / this.height),
      radius: this.config.splatRadius / 100,
    }

    this.pass(
      this.setUniforms(this.materials.splat, {
        ...sharedUniforms,
        color: new THREE.Vector3(this.mouse.velocityX, -this.mouse.velocityY, 0),
        uTarget: velocity.read.texture,
      }),
      velocity.write,
    )
    velocity.swap()

    this.pass(
      this.setUniforms(this.materials.splat, {
        ...sharedUniforms,
        color: new THREE.Vector3(3, 3, 3),
        uTarget: dye.read.texture,
      }),
      dye.write,
    )
    dye.swap()
  }

  private tick = (time: number) => {
    if (this.destroyed) return

    const deltaTime = Math.min((time - this.lastTime) / 1000, 0.016)
    this.lastTime = time

    if (this.isVisible) {
      if (this.mouse.moved) {
        this.splat()
        this.mouse.moved = false
      }

      this.simulate(deltaTime)
      this.render()
    }

    this.animationFrame = window.requestAnimationFrame(this.tick)
  }

  private updateRendererSize() {
    const bounds = this.canvas.getBoundingClientRect()
    const cssWidth = Math.max(1, Math.round(bounds.width))
    const cssHeight = Math.max(1, Math.round(bounds.height))

    this.dpr = Math.min(window.devicePixelRatio, 2)
    this.renderer.setPixelRatio(this.dpr)
    this.renderer.setSize(cssWidth, cssHeight, false)
    this.width = cssWidth * this.dpr
    this.height = cssHeight * this.dpr
  }
}
