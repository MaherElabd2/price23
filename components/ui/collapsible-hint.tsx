import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface CollapsibleHintProps {
  title?: string
  sectionName?: string
  children: React.ReactNode
  className?: string
  defaultOpen?: boolean
}

export function CollapsibleHint({ 
  title, 
  sectionName,
  children, 
  className,
  defaultOpen = false 
}: CollapsibleHintProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className={cn("border rounded-lg", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
        type="button"
      >
        <span className="font-medium text-sm">{title || sectionName}</span>
        <svg
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="px-4 pb-3 border-t bg-muted/25">
          <div className="pt-3 text-sm text-muted-foreground">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
