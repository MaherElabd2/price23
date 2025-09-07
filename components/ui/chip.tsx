import React from 'react'
import { cn } from '@/lib/utils'

interface ChipProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  selected?: boolean
}

export function Chip({ 
  children, 
  variant = 'default', 
  size = 'md',
  className,
  onClick,
  selected = false
}: ChipProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  
  const variantClasses = {
    default: selected 
      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
      : "bg-primary/10 text-primary hover:bg-primary/20",
    secondary: selected
      ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      : "bg-secondary/10 text-secondary-foreground hover:bg-secondary/20",
    outline: selected
      ? "border-primary bg-primary/5 text-primary"
      : "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    destructive: selected
      ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      : "bg-destructive/10 text-destructive hover:bg-destructive/20"
  }
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  }
  
  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    >
      {children}
    </span>
  )
}
