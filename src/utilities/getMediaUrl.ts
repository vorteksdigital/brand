/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 *
 * Payload's local file endpoint requires filesystem access from the server
 * function. Vercel serves committed media reliably from `/media` instead, so
 * local Payload URLs are rewritten to that static path.
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  const resolvedUrl = url.startsWith('/api/media/file/')
    ? url.replace('/api/media/file/', '/media/')
    : url

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  return cacheTag ? `${resolvedUrl}?${cacheTag}` : resolvedUrl
}
