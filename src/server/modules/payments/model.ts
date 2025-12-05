import { t } from "elysia"
import { PaginationSchema } from "../../utils/pagination"

const PaymentStatus = t.Union([
  t.Literal("pending"),
  t.Literal("completed"),
  t.Literal("failed"),
  t.Literal("refunded"),
])

const PaymentPlanType = t.Union([
  t.Literal("full_payment"),
  t.Literal("installment"),
])

export namespace PaymentModel {
  export const createBody = t.Object({
    userId: t.String(),
    propertyId: t.Optional(t.String()),
    amount: t.String(), // Decimal
    currency: t.Optional(t.String({ default: "IDR" })),
    planType: t.Optional(PaymentPlanType),
    installmentsTotal: t.Optional(t.Integer()),
    installmentNumber: t.Optional(t.Integer()),
    gateway: t.String(),
    gatewayTransactionId: t.Optional(t.String()),
    metadata: t.Optional(t.Any()), // JSON
  })

  export const updateBody = t.Partial(
    t.Object({
      status: PaymentStatus,
      gatewayTransactionId: t.String(),
      metadata: t.Any(),
    })
  )

  export const filterQuery = t.Composite([
    PaginationSchema,
    t.Object({
      userId: t.Optional(t.String()),
      propertyId: t.Optional(t.String()),
      status: t.Optional(PaymentStatus),
      gateway: t.Optional(t.String()),
    }),
  ])

  export type CreateBody = typeof createBody.static
  export type UpdateBody = typeof updateBody.static
  export type FilterQuery = typeof filterQuery.static
}
