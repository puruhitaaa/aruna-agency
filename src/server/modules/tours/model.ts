import { t } from "elysia"
import { PaginationSchema } from "../../utils/pagination"

const TourStatus = t.Union([
  t.Literal("pending"),
  t.Literal("confirmed"),
  t.Literal("cancelled"),
  t.Literal("completed"),
])

export namespace TourModel {
  export const createBody = t.Object({
    propertyId: t.String(),
    buyerId: t.String(),
    agentId: t.Optional(t.String()), // Optional assignment
    date: t.String(), // ISO Date string
    notes: t.Optional(t.String()),
  })

  export const updateBody = t.Partial(
    t.Object({
      status: TourStatus,
      agentId: t.String(),
      date: t.String(),
      notes: t.String(),
    })
  )

  export const filterQuery = t.Composite([
    PaginationSchema,
    t.Object({
      status: t.Optional(TourStatus),
      propertyId: t.Optional(t.String()),
      buyerId: t.Optional(t.String()),
      agentId: t.Optional(t.String()),
      dateFrom: t.Optional(t.String()),
      dateTo: t.Optional(t.String()),
    }),
  ])

  export type CreateBody = typeof createBody.static
  export type UpdateBody = typeof updateBody.static
  export type FilterQuery = typeof filterQuery.static
}
