import { db } from "@/server/db"
import { payments } from "@/server/db/schema"
import { and, asc, count, desc, eq } from "drizzle-orm"
import { createPaginationResponse } from "../../utils/pagination"
import type { PaymentModel } from "./model"

export abstract class PaymentService {
  static async getAll(query: PaymentModel.FilterQuery) {
    const {
      limit = 20,
      offset = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
      userId,
      propertyId,
      status,
      gateway,
    } = query

    const filters = []

    if (userId) filters.push(eq(payments.userId, userId))
    if (propertyId) filters.push(eq(payments.propertyId, propertyId))
    if (status) filters.push(eq(payments.status, status))
    if (gateway) filters.push(eq(payments.gateway, gateway))

    const whereClause = filters.length > 0 ? and(...filters) : undefined

    const [totalCount] = await db
      .select({ count: count() })
      .from(payments)
      .where(whereClause)

    const data = await db
      .select()
      .from(payments)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(
        sortOrder === "asc"
          ? asc(payments[sortBy as keyof typeof payments.$inferSelect])
          : desc(payments[sortBy as keyof typeof payments.$inferSelect])
      )

    return createPaginationResponse(data, totalCount?.count ?? 0, query)
  }

  static async getById(id: string) {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.id, id))
      .limit(1)
    return payment
  }

  static async create(data: PaymentModel.CreateBody) {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    ) as typeof data

    const [newPayment] = await db
      .insert(payments)
      .values(cleanData as typeof payments.$inferInsert)
      .returning()
    return newPayment
  }

  static async update(id: string, data: PaymentModel.UpdateBody) {
    const [updatedPayment] = await db
      .update(payments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(payments.id, id))
      .returning()

    return updatedPayment
  }

  static async delete(id: string) {
    const [deletedPayment] = await db
      .delete(payments)
      .where(eq(payments.id, id))
      .returning()

    return deletedPayment
  }
}
