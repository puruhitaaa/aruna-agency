import { t } from "elysia"
import { PaginationSchema } from "../../utils/pagination"

export namespace AuditLogModel {
  export const createBody = t.Object({
    userId: t.Optional(t.String()),
    action: t.String({ maxLength: 100 }),
    entityType: t.Optional(t.String({ maxLength: 50 })),
    entityId: t.Optional(t.String()),
    details: t.Optional(t.Any()), // JSON
    ipAddress: t.Optional(t.String({ maxLength: 45 })),
    userAgent: t.Optional(t.String()),
  })

  // Audit logs are immutable, so no updateBody

  export const filterQuery = t.Composite([
    PaginationSchema,
    t.Object({
      userId: t.Optional(t.String()),
      action: t.Optional(t.String()),
      entityType: t.Optional(t.String()),
      entityId: t.Optional(t.String()),
    }),
  ])

  export type CreateBody = typeof createBody.static
  export type FilterQuery = typeof filterQuery.static
}
