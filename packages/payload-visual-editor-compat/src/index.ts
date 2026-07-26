export type PreviewCollection = 'pages' | 'posts'

export function isAllowedPreviewOrigin(origin: string, configuredOrigin: string): boolean {
  try {
    return new URL(origin).origin === new URL(configuredOrigin).origin
  } catch {
    return false
  }
}

export function previewPath(collection: PreviewCollection, slug?: string | null): string {
  const safeSlug = slug?.trim() || (collection === 'pages' ? 'home' : '')
  const path = collection === 'posts' ? `/posts/${encodeURIComponent(safeSlug)}` : `/${encodeURIComponent(safeSlug)}`
  return path === '/home' ? '/' : path
}

export function normaliseDraftBlocks<T extends { blockType?: string | null }>(
  blocks: T[] | null | undefined,
): T[] {
  return Array.isArray(blocks) ? blocks.filter((block) => Boolean(block?.blockType)) : []
}
