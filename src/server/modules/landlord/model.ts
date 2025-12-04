import { t } from "elysia"
import { PaginationSchema } from "../../utils/pagination"

const VerificationStatus = t.Union([
  t.Literal("pending"),
  t.Literal("verified"),
  t.Literal("rejected"),
])

export namespace LandlordModel {
  export const createBody = t.Object({
    userId: t.String(),
    bio: t.Optional(t.String()),
    verificationDocuments: t.Optional(t.Array(t.String())),
  })

  export const updateBody = t.Partial(
    t.Object({
      verificationStatus: VerificationStatus,
      verificationDocuments: t.Array(t.String()),
      bio: t.String(),
      rating: t.String(), // Decimal as string
    })
  )

  export const filterQuery = t.Composite([
    PaginationSchema,
    t.Object({
      userId: t.Optional(t.String()),
      verificationStatus: t.Optional(VerificationStatus),
      minRating: t.Optional(t.String()),
    }),
  ])

  export type CreateBody = typeof createBody.static
  export type UpdateBody = typeof updateBody.static
  export type FilterQuery = typeof filterQuery.static
}
