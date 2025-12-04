import { t } from "elysia"
import { PaginationSchema } from "../../utils/pagination"

export namespace NotificationModel {
  export const createBody = t.Object({
    userId: t.String(),
    type: t.String({ maxLength: 50 }),
    title: t.String(),
    message: t.String(),
    data: t.Optional(t.Any()), // JSON
  })

  export const updateBody = t.Partial(
    t.Object({
      read: t.Boolean(),
    })
  )

  export const filterQuery = t.Composite([
    PaginationSchema,
    t.Object({
      userId: t.Optional(t.String()),
      type: t.Optional(t.String()),
      read: t.Optional(t.BooleanString()), // Boolean passed as string in query
    }),
  ])

  export type CreateBody = typeof createBody.static
  export type UpdateBody = typeof updateBody.static
  export type FilterQuery = typeof filterQuery.static
}
