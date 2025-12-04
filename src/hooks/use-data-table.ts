import * as React from "react"
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  type Table,
  type RowData,
} from "@tanstack/react-table"
import {
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
  parseAsArrayOf,
} from "nuqs"

interface UseDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  defaultPerPage?: number
}

export function useDataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  defaultPerPage = 10,
}: UseDataTableProps<TData, TValue>): Table<TData> {
  // Server-side pagination state
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false })
  )
  const [perPage, setPerPage] = useQueryState(
    "perPage",
    parseAsInteger.withDefault(defaultPerPage).withOptions({ shallow: false })
  )

  // Server-side sorting state
  const [sorting, setSorting] = useQueryState(
    "sort",
    parseAsArrayOf(parseAsString, ",")
      .withDefault([])
      .withOptions({ shallow: false }) // simplified for now, often needs complex object parsing or custom serializer
  )

  // Note: Complex sorting with nuqs usually requires a custom parser or handling string format like "colId.desc"
  // For this reusable hook, we'll stick to local state for sorting/filtering if the user wants client-side,
  // but since we have pageCount, it implies server-side.
  // Let's assume for now we just handle pagination via URL, and let the consumer handle passing sorting state to their API
  // via onSortingChange if they need server-side sorting.
  // Actually, to be truly reusable, we should sync sorting to URL.

  const [sortingState, setSortingState] = React.useState<SortingState>([])

  // Sync sorting state to URL (simplified for "column.desc" format)
  // In a real app, you might want to use nuqs to parse "column.desc" back to SortingState
  // For this MVP, let's keep sorting client-side controlled but we can expose it.

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: perPage,
      },
      sorting: sortingState,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex: page - 1,
          pageSize: perPage,
        })
        setPage(newState.pageIndex + 1)
        setPerPage(newState.pageSize)
      } else {
        setPage(updater.pageIndex + 1)
        setPerPage(updater.pageSize)
      }
    },
    onSortingChange: setSortingState,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true, // vital for server-side pagination
    manualSorting: true, // vital for server-side sorting (if implemented)
    manualFiltering: true, // vital for server-side filtering
  })

  return table
}
