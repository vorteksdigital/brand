const getOrdinalSuffix = (day: number): string => {
  const remainder = day % 100

  if (remainder >= 11 && remainder <= 13) return 'th'

  if (day % 10 === 1) return 'st'
  if (day % 10 === 2) return 'nd'
  if (day % 10 === 3) return 'rd'

  return 'th'
}

export const formatEditorialDate = (timestamp?: null | string): string => {
  if (!timestamp) return ''

  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) return ''

  const day = date.getUTCDate()
  const month = new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    timeZone: 'UTC',
  }).format(date)

  return `${day}${getOrdinalSuffix(day)} ${month} ${date.getUTCFullYear()}`
}

const collectText = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.flatMap(collectText)
  if (!value || typeof value !== 'object') return []

  const record = value as Record<string, unknown>
  const ownText = typeof record.text === 'string' ? [record.text] : []
  const nestedText = Object.entries(record)
    .filter(([key]) => key !== 'text')
    .flatMap(([, nestedValue]) => collectText(nestedValue))

  return [...ownText, ...nestedText]
}

export const getReadingTime = (content: unknown, wordsPerMinute = 200): number => {
  const validWordsPerMinute = Math.max(1, wordsPerMinute)
  const wordCount = collectText(content)
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.ceil(wordCount / validWordsPerMinute))
}
