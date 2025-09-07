import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface QuestionExplanationProps {
  question: string
  explanation: string
  exampleKey?: string
  sector?: string
  className?: string
}

export function QuestionExplanation({ 
  question, 
  explanation, 
  exampleKey,
  sector,
  className 
}: QuestionExplanationProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className={cn("space-y-2", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        type="button"
      >
        <span className="font-medium">{question}</span>
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
        <div className="pl-4 border-l-2 border-muted">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {explanation}
          </p>
        </div>
      )}
    </div>
  )
}
