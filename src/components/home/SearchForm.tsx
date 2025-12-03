"use client"

import { Check, ChevronsUpDown, Search } from "lucide-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface SearchSelectProps {
  label: string
  placeholder: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}

function SearchSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
}: SearchSelectProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className='flex flex-col gap-1.5 flex-1 w-full md:min-w-[140px]'>
      <span className='text-xs font-semibold text-muted-foreground ml-1'>
        {label}
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between border-0 px-1 h-auto shadow-none py-1 text-base font-normal hover:text-muted text-muted'
          >
            {value ? (
              options.find((option) => option.value === value)?.label
            ) : (
              <span className='text-muted-foreground'>{placeholder}</span>
            )}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0'>
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function SearchForm() {
  const [type, setType] = React.useState("")
  const [price, setPrice] = React.useState("")
  const [location, setLocation] = React.useState("")

  return (
    <div className='bg-white rounded-3xl md:rounded-4xl p-4 md:p-4 shadow-xl flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center max-w-5xl mx-auto w-full border border-border/50'>
      <div className='flex flex-col gap-1.5 w-full md:flex-[1.5] md:w-auto md:border-r border-border/50 md:pr-4'>
        <label
          htmlFor='looking-for'
          className='text-xs font-semibold text-muted-foreground ml-3'
        >
          Looking For
        </label>
        <Input
          id='looking-for'
          placeholder='What to look for ?'
          className='border-0 shadow-none text-muted focus-visible:ring-0 px-3 h-auto py-1 text-base placeholder:text-muted-foreground'
        />
      </div>

      <div className='h-px w-full bg-border/50 md:hidden' />
      <div className='h-12 w-px bg-border/50 hidden md:block' />

      <SearchSelect
        label='Type'
        placeholder='Property Type'
        value={type}
        onChange={setType}
        options={[
          { value: "house", label: "House" },
          { value: "apartment", label: "Apartment" },
          { value: "villa", label: "Villa" },
          { value: "land", label: "Land" },
        ]}
      />

      <div className='h-px w-full bg-border/50 md:hidden' />
      <div className='h-12 w-px bg-border/50 hidden md:block' />

      <SearchSelect
        label='Price'
        placeholder='Price'
        value={price}
        onChange={setPrice}
        options={[
          { value: "low", label: "Under $100k" },
          { value: "medium", label: "$100k - $500k" },
          { value: "high", label: "Above $500k" },
        ]}
      />

      <div className='h-px w-full bg-border/50 md:hidden' />
      <div className='h-12 w-px bg-border/50 hidden md:block' />

      <SearchSelect
        label='Location'
        placeholder='All Cities'
        value={location}
        onChange={setLocation}
        options={[
          { value: "bali", label: "Bali" },
          { value: "jakarta", label: "Jakarta" },
          { value: "surabaya", label: "Surabaya" },
          { value: "bandung", label: "Bandung" },
        ]}
      />

      <Button
        size='lg'
        className='rounded-full px-8 h-12 md:h-14 text-base font-medium bg-[#1A1A1A] hover:bg-black text-white w-full md:w-auto mt-2 md:mt-0'
      >
        <Search className='mr-2 h-5 w-5' />
        Search
      </Button>
    </div>
  )
}
