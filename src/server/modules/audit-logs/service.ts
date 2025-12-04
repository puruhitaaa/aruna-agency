import { db } from "@/server/db"
import { auditLogs } from "@/server/db/schema"
import { and, asc, count, desc, eq } from "drizzle-orm"
import { createPaginationResponse } from "../../utils/pagination"
import type { AuditLogModel } from "./model"

export abstract class AuditLogService {
  static async getAll(query: AuditLogModel.FilterQuery) {
    const {
      limit = 20,
      offset = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
      userId,
      action,
      entityType,
      entityId,
    } = query

    const filters = []

    if (userId) filters.push(eq(auditLogs.userId, userId))
    if (action) filters.push(eq(auditLogs.action, action))
    if (entityType) filters.push(eq(auditLogs.entityType, entityType))
    if (entityId) filters.push(eq(auditLogs.entityId, entityId))

    const whereClause = filters.length > 0 ? and(...filters) : undefined

    const [totalCount] = await db
      .select({ count: count() })
      .from(auditLogs)
      .where(whereClause)

    const data = await db
      .select()
      .from(auditLogs)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(
        sortOrder === "asc"
          ? asc(auditLogs[sortBy as keyof typeof auditLogs.$inferSelect])
          : desc(auditLogs[sortBy as keyof typeof auditLogs.$inferSelect]),
      )

    return createPaginationResponse(data, totalCount?.count ?? 0, query)
  }

  static async getById(id: string) {
    const [log] = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.id, id))
      .limit(1)
    return log
  }

  static async create(data: AuditLogModel.CreateBody) {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    ) as typeof data

    const [newLog] = await db
      .insert(auditLogs)
      .values(cleanData as typeof auditLogs.$inferInsert)
      .returning()
    return newLog
  }
}
