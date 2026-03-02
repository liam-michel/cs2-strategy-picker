'use client'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  autoFocus?: boolean
}

export function SearchBar({
  value: controlledValue,
  onChange,
  onSubmit,
  placeholder = 'Search...',
  disabled = false,
  className = '',
  autoFocus = false,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('')

  // Update internal value if the prop changes (like when returning to the page)
  useEffect(() => {
    setInternalValue(controlledValue ?? '')
  }, [controlledValue])

  const handleSubmit = () => {
    onSubmit?.(internalValue.trim())
  }

  const handleClear = () => {
    setInternalValue('')
    onSubmit?.('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoFocus={autoFocus}
          className="pr-10"
        />
        {internalValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={handleClear}
            disabled={disabled}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button type="button" onClick={handleSubmit} disabled={disabled || !internalValue.trim()} aria-label="Search">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  )
}
