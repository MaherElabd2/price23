import React from 'react'
import { cn } from '@/lib/utils'

interface SelectableCardProps {
  children: React.ReactNode
  selected?: boolean
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export function SelectableCard({ 
  children, 
  selected = false, 
  onClick, 
  className,
  disabled = false 
}: SelectableCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200",
        "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        selected 
          ? "border-primary bg-primary/5 shadow-md" 
          : "border-gray-200 bg-white hover:border-primary/50",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={disabled ? undefined : onClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled && onClick) {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {children}
    </div>
  )
}
