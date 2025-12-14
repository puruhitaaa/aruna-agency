import { t } from "elysia"
import { PaginationSchema } from "../../utils/pagination"

export namespace UserModel {
  export const filterQuery = t.Composite([
    PaginationSchema,
    t.Object({
      role: t.Optional(t.String()),
    }),
  ])

  export type FilterQuery = typeof filterQuery.static
}
