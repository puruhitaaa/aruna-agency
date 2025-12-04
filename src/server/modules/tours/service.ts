import { db } from "@/server/db"
import { tours } from "@/server/db/schema"
import { and, asc, count, desc, eq, gte, lte } from "drizzle-orm"
import { createPaginationResponse } from "../../utils/pagination"
import type { TourModel } from "./model"

export abstract class TourService {
  static async getAll(query: TourModel.FilterQuery) {
    const {
      limit = 20,
      offset = 0,
      sortBy = "date",
      sortOrder = "asc", // Tours usually upcoming first
      status,
      propertyId,
      buyerId,
      agentId,
      dateFrom,
      dateTo,
    } = query

    const filters = []

    if (status) filters.push(eq(tours.status, status))
    if (propertyId) filters.push(eq(tours.propertyId, propertyId))
    if (buyerId) filters.push(eq(tours.buyerId, buyerId))
    if (agentId) filters.push(eq(tours.agentId, agentId))
    if (dateFrom) filters.push(gte(tours.date, new Date(dateFrom)))
    if (dateTo) filters.push(lte(tours.date, new Date(dateTo)))

    const whereClause = filters.length > 0 ? and(...filters) : undefined

    const [totalCount] = await db
      .select({ count: count() })
      .from(tours)
      .where(whereClause)

    const data = await db
      .select()
      .from(tours)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(
        sortOrder === "asc"
          ? asc(tours[sortBy as keyof typeof tours.$inferSelect])
          : desc(tours[sortBy as keyof typeof tours.$inferSelect]),
      )

    return createPaginationResponse(data, totalCount?.count ?? 0, query)
  }

  static async getById(id: string) {
    const [tour] = await db.select().from(tours).where(eq(tours.id, id)).limit(1)
    return tour
  }

  static async create(data: TourModel.CreateBody) {
    const [newTour] = await db
      .insert(tours)
      .values({
        ...data,
        date: new Date(data.date),
      })
      .returning()
    return newTour
  }

  static async update(id: string, data: TourModel.UpdateBody) {
    const { date, ...rest } = data
    const updateData: Partial<typeof tours.$inferInsert> = { ...rest }

    if (date) {
      updateData.date = new Date(date)
    }

    const [updatedTour] = await db
      .update(tours)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(tours.id, id))
      .returning()

    return updatedTour
  }

  static async delete(id: string) {
    const [deletedTour] = await db
      .delete(tours)
      .where(eq(tours.id, id))
      .returning()

    return deletedTour
  }
}
