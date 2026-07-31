'use client'

import type { PayloadAdminBarProps, PayloadMeUser } from '@payloadcms/admin-bar'

import { useSelectedLayoutSegments } from 'next/navigation'
import { PayloadAdminBar } from '@payloadcms/admin-bar'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import './index.scss'

import { getClientSideURL } from '@/utilities/getURL'

const baseClass = 'admin-bar'

const collectionLabels = {
  pages: {
    plural: 'Pages',
    singular: 'Page',
  },
  posts: {
    plural: 'Posts',
    singular: 'Post',
  },
  projects: {
    plural: 'Projects',
    singular: 'Project',
  },
}

const Title: React.FC = () => <span>Dashboard</span>

export const AdminBar: React.FC<{
  adminBarProps?: PayloadAdminBarProps
}> = (props) => {
  const { adminBarProps } = props || {}
  const segments = useSelectedLayoutSegments()
  const [show, setShow] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const collection = (
    collectionLabels[segments?.[1] as keyof typeof collectionLabels] ? segments[1] : 'pages'
  ) as keyof typeof collectionLabels
  const router = useRouter()

  const onAuthChange = React.useCallback((user: PayloadMeUser) => {
    setShow(Boolean(user?.id))
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const bar = barRef.current

    if (!show || !bar) {
      root.style.removeProperty('--admin-bar-height')
      return
    }

    const syncHeight = () => {
      root.style.setProperty('--admin-bar-height', `${bar.getBoundingClientRect().height}px`)
    }

    syncHeight()

    const resizeObserver = new ResizeObserver(syncHeight)
    resizeObserver.observe(bar)

    return () => {
      resizeObserver.disconnect()
      root.style.removeProperty('--admin-bar-height')
    }
  }, [show])

  return (
    <div
      className={`${baseClass} py-2 bg-black text-white`}
      data-authenticated={show}
      hidden={!show}
      ref={barRef}
    >
      <div className="container">
        <PayloadAdminBar
          {...adminBarProps}
          className="py-2 text-white"
          classNames={{
            controls: 'font-medium text-white',
            logo: 'text-white',
            user: 'text-white',
          }}
          cmsURL={getClientSideURL()}
          collectionSlug={collection}
          collectionLabels={{
            plural: collectionLabels[collection]?.plural || 'Pages',
            singular: collectionLabels[collection]?.singular || 'Page',
          }}
          logo={<Title />}
          onAuthChange={onAuthChange}
          onPreviewExit={() => {
            fetch('/next/exit-preview').then(() => {
              router.push('/')
              router.refresh()
            })
          }}
          style={{
            backgroundColor: 'transparent',
            padding: 0,
            position: 'relative',
            zIndex: 'unset',
          }}
        />
      </div>
    </div>
  )
}
