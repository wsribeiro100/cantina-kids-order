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
  label: string
  value: string
}

type SearchableComboboxProps = {
  items: Item[]
  value?: string | null
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchableCombobox({
  items,
  value,
  onChange,
  placeholder = 'Selecione uma opção',
  className,
}: SearchableComboboxProps) {
  const [open, setOpen] = useState(false)

  const selectedLabel = items.find((item) => item.value === value)?.label

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full', className)}
        >
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput className="w-full text-left" placeholder="Buscar..." />
          <CommandEmpty className="w-full text-left">Nenhum resultado.</CommandEmpty>
          <CommandList className="w-full">
            <CommandGroup className="text-left">
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => {
                    onChange(item.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'w-full justify-between',
                      value === item.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}