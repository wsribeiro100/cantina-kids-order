
'use client'

import React, { useState } from 'react'
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
  CommandEmpty,
} from '@/components/ui/command'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type Item = {
  value: string
  label: string
}

type SearchableDropdownListProps = {
  items: Item[]
  value?: string | null
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  noResultsText?: string
  className?: string
  popoverWidth?: string
}

export function SearchableDropdownList({
  items,
  value,
  onChange,
  placeholder = 'Selecione uma opção',
  searchPlaceholder = 'Buscar...',
  noResultsText = 'Nenhum resultado.',
  className,
  popoverWidth = 'w-[var(--radix-popover-trigger-width)]',
}: SearchableDropdownListProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedLabel = items.find((item) => item.value === value)?.label

  const filteredItems = searchQuery.trim() === '' 
    ? items 
    : items.filter((item) => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          <span className="truncate">{selectedLabel || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('p-0', popoverWidth)}>
        <Command className="w-full">
          <CommandInput 
            className="w-full text-left" 
            placeholder={searchPlaceholder}
            onValueChange={setSearchQuery}
            value={searchQuery}
          />
          <CommandEmpty className="text-center py-2">{noResultsText}</CommandEmpty>
          <CommandList className="max-h-[300px]">
            <CommandGroup className="text-left">
              {filteredItems.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => {
                    onChange(item.value)
                    setSearchQuery('')
                    setOpen(false)
                  }}
                  className="flex items-center justify-between py-2"
                >
                  <span>{item.label}</span>
                  {value === item.value && <Check className="h-4 w-4 opacity-100" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
