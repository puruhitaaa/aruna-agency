import { t } from "elysia"
import { PaginationSchema } from "../../utils/pagination"

// Enums match the DB schema
const PropertyStatus = t.Union([
  t.Literal("draft"),
  t.Literal("published"),
  t.Literal("sold"),
  t.Literal("rented"),
  t.Literal("archived"),
])

export namespace PropertyModel {
  export const createBody = t.Object({
    ownerId: t.String(),
    title: t.String({ minLength: 1, maxLength: 255 }),
    description: t.Optional(t.String()),
    price: t.String(), // Decimal passed as string to preserve precision
    status: t.Optional(PropertyStatus),
    address: t.String(),
    city: t.String({ maxLength: 100 }),
    state: t.String({ maxLength: 100 }),
    zipCode: t.String({ maxLength: 20 }),
    country: t.Optional(t.String({ default: "USA" })),
    size: t.Numeric(),
    bedrooms: t.Integer(),
    bathrooms: t.String(), // Decimal
    features: t.Optional(t.Array(t.String())),
    images: t.Optional(t.Array(t.String())),
  })

  export const updateBody = t.Partial(createBody)

  export const filterQuery = t.Composite([
    PaginationSchema,
    t.Object({
      minPrice: t.Optional(t.String()),
      maxPrice: t.Optional(t.String()),
      city: t.Optional(t.String()),
      status: t.Optional(PropertyStatus),
      bedrooms: t.Optional(t.Integer()),
    }),
  ])

  export type CreateBody = typeof createBody.static
  export type UpdateBody = typeof updateBody.static
  export type FilterQuery = typeof filterQuery.static
}
