'use client'

import { useState } from 'react'

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button 
      onClick={handleCopy}
      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#912F40] to-[#702632] hover:from-[#702632] hover:to-[#912F40] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(145,47,64,0.3)] hover:scale-105"
    >
      {copied ? '✓ Copied!' : '📋 Copy Share Link'}
    </button>
  )
}

