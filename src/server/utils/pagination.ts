import { t } from "elysia"

export const PaginationSchema = t.Object({
  limit: t.Optional(t.Numeric({ default: 20 })),
  offset: t.Optional(t.Numeric({ default: 0 })),
  sortBy: t.Optional(t.String()),
  sortOrder: t.Optional(t.Union([t.Literal("asc"), t.Literal("desc")])),
  search: t.Optional(t.String()),
})

export type PaginationParams = typeof PaginationSchema.static

export const createPaginationResponse = <T>(
  data: T[],
  total: number,
  params: PaginationParams
) => {
  return {
    data,
    meta: {
      total,
      limit: params.limit ?? 20,
      offset: params.offset ?? 0,
      page: Math.floor((params.offset ?? 0) / (params.limit ?? 20)) + 1,
    },
  }
}
