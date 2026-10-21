'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const HighlightedCode = dynamic(() =>
  import('./Highlight.client').then((module) => module.HighlightedCode),
)

type Props = {
  code: string
  language?: string
}

export const Code: React.FC<Props> = ({ code, language = '' }) => {
  if (!code) return null

  return <HighlightedCode code={code} language={language} />
}
