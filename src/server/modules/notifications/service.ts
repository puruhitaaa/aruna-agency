import { db } from "@/server/db"
import { notifications } from "@/server/db/schema"
import { and, asc, count, desc, eq } from "drizzle-orm"
import { createPaginationResponse } from "../../utils/pagination"
import type { NotificationModel } from "./model"

export abstract class NotificationService {
  static async getAll(query: NotificationModel.FilterQuery) {
    const {
      limit = 20,
      offset = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
      userId,
      type,
      read,
    } = query

    const filters = []

    if (userId) filters.push(eq(notifications.userId, userId))
    if (type) filters.push(eq(notifications.type, type))
    if (read !== undefined) filters.push(eq(notifications.read, Boolean(read)))

    const whereClause = filters.length > 0 ? and(...filters) : undefined

    const [totalCount] = await db
      .select({ count: count() })
      .from(notifications)
      .where(whereClause)

    const data = await db
      .select()
      .from(notifications)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(
        sortOrder === "asc"
          ? asc(notifications[sortBy as keyof typeof notifications.$inferSelect])
          : desc(notifications[sortBy as keyof typeof notifications.$inferSelect]),
      )

    return createPaginationResponse(data, totalCount?.count ?? 0, query)
  }

  static async getById(id: string) {
    const [notification] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, id))
      .limit(1)
    return notification
  }

  static async create(data: NotificationModel.CreateBody) {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    ) as typeof data

    const [newNotification] = await db
      .insert(notifications)
      .values(cleanData as typeof notifications.$inferInsert)
      .returning()
    return newNotification
  }

  static async update(id: string, data: NotificationModel.UpdateBody) {
    const [updatedNotification] = await db
      .update(notifications)
      .set(data)
      .where(eq(notifications.id, id))
      .returning()

    return updatedNotification
  }

  static async delete(id: string) {
    const [deletedNotification] = await db
      .delete(notifications)
      .where(eq(notifications.id, id))
      .returning()

    return deletedNotification
  }
}
