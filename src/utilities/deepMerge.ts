type UnknownRecord = Record<string, unknown>

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: unknown): item is UnknownRecord {
  return item !== null && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export default function deepMerge<T extends object, R extends object>(target: T, source: R): T & R {
  const output = { ...target } as UnknownRecord
  const targetRecord = target as UnknownRecord

  Object.entries(source).forEach(([key, sourceValue]) => {
    const targetValue = targetRecord[key]

    output[key] =
      isObject(targetValue) && isObject(sourceValue)
        ? deepMerge(targetValue, sourceValue)
        : sourceValue
  })

  return output as T & R
}
