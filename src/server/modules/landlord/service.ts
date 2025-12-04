import { db } from "@/server/db"
import { landlordProfiles } from "@/server/db/schema"
import { and, asc, count, desc, eq, gte } from "drizzle-orm"
import { createPaginationResponse } from "../../utils/pagination"
import type { LandlordModel } from "./model"

export abstract class LandlordService {
  static async getAll(query: LandlordModel.FilterQuery) {
    const {
      limit = 20,
      offset = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
      userId,
      verificationStatus,
      minRating,
    } = query

    const filters = []

    if (userId) filters.push(eq(landlordProfiles.userId, userId))
    if (verificationStatus)
      filters.push(eq(landlordProfiles.verificationStatus, verificationStatus))
    if (minRating) filters.push(gte(landlordProfiles.rating, minRating))

    const whereClause = filters.length > 0 ? and(...filters) : undefined

    const [totalCount] = await db
      .select({ count: count() })
      .from(landlordProfiles)
      .where(whereClause)

    const data = await db
      .select()
      .from(landlordProfiles)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(
        sortOrder === "asc"
          ? asc(
              landlordProfiles[
                sortBy as keyof typeof landlordProfiles.$inferSelect
              ],
            )
          : desc(
              landlordProfiles[
                sortBy as keyof typeof landlordProfiles.$inferSelect
              ],
            ),
      )

    return createPaginationResponse(data, totalCount?.count ?? 0, query)
  }

  static async getById(id: string) {
    const [profile] = await db
      .select()
      .from(landlordProfiles)
      .where(eq(landlordProfiles.id, id))
      .limit(1)
    return profile
  }

  static async create(data: LandlordModel.CreateBody) {
    // Remove undefined keys
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    ) as typeof data

    const [newProfile] = await db
      .insert(landlordProfiles)
      .values(cleanData as typeof landlordProfiles.$inferInsert)
      .returning()
    return newProfile
  }

  static async update(id: string, data: LandlordModel.UpdateBody) {
    const [updatedProfile] = await db
      .update(landlordProfiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(landlordProfiles.id, id))
      .returning()

    return updatedProfile
  }

  static async delete(id: string) {
    const [deletedProfile] = await db
      .delete(landlordProfiles)
      .where(eq(landlordProfiles.id, id))
      .returning()

    return deletedProfile
  }
}
