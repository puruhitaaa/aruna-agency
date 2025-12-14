"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { CheckIcon, ChevronDownIcon, Loader2Icon } from "lucide-react"
import * as React from "react"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface AsyncSelectOption {
  value: string
  label: string
  description?: string
}

interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    limit: number
    offset: number
    page: number
  }
}

interface AsyncSelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
  // Query function that returns paginated data
  queryFn: (params: {
    limit: number
    offset: number
    search: string
  }) => Promise<PaginatedResponse<AsyncSelectOption>>
  // Query key for caching
  queryKey: string[]
  // Optional: display value when we have a value but no loaded options yet
  displayValue?: string
}

export function AsyncSelect({
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  disabled = false,
  className,
  queryFn,
  queryKey,
  displayValue,
}: AsyncSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Infinite query for paginated data
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: [...queryKey, debouncedSearch],
    queryFn: async ({ pageParam = 0 }) => {
      return queryFn({
        limit: 20,
        offset: pageParam,
        search: debouncedSearch,
      })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.meta.offset + lastPage.meta.limit
      return nextOffset < lastPage.meta.total ? nextOffset : undefined
    },
    enabled: open, // Only fetch when popover is open
  })

  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
  })

  // Load more when scrolling to bottom
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  // Flatten all pages into single array
  const options = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? []
  }, [data])

  // Find selected option label
  const selectedLabel = React.useMemo(() => {
    if (displayValue) return displayValue
    const selected = options.find((opt) => opt.value === value)
    return selected?.label
  }, [options, value, displayValue])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className='truncate'>{selectedLabel ?? placeholder}</span>
          <ChevronDownIcon className='ml-2 size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[--radix-popover-trigger-width] p-0'
        align='start'
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList className='max-h-[200px]'>
            {isLoading && (
              <div className='flex items-center justify-center py-6'>
                <Loader2Icon className='size-4 animate-spin' />
              </div>
            )}
            {isError && (
              <div className='py-6 text-center text-sm text-destructive'>
                Failed to load options
              </div>
            )}
            {!isLoading && !isError && options.length === 0 && (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            )}
            {!isLoading && options.length > 0 && (
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      onValueChange(option.value)
                      setOpen(false)
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 size-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className='flex flex-col'>
                      <span>{option.label}</span>
                      {option.description && (
                        <span className='text-xs text-muted-foreground'>
                          {option.description}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
                {/* Infinite scroll trigger */}
                {hasNextPage && (
                  <div
                    ref={loadMoreRef}
                    className='flex items-center justify-center py-2'
                  >
                    {isFetchingNextPage && (
                      <Loader2Icon className='size-4 animate-spin' />
                    )}
                  </div>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Convenience exports for common use cases
export type { PaginatedResponse }
