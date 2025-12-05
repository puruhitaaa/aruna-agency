import { and, asc, count, desc, eq, gte, ilike, lte, sql } from "drizzle-orm"
import { db } from "@/server/db"
import { properties } from "@/server/db/schema"
import { createPaginationResponse } from "../../utils/pagination"
import type { PropertyModel } from "./model"

export abstract class PropertyService {
  static async getAll(query: PropertyModel.FilterQuery) {
    const {
      limit = 20,
      offset = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
      minPrice,
      maxPrice,
      city,
      status,
      bedrooms,
    } = query

    // Build filters
    const filters = []

    if (search) {
      filters.push(
        sql`(${properties.title} ILIKE ${`%${search}%`} OR ${
          properties.description
        } ILIKE ${`%${search}%`})`
      )
    }
    if (minPrice) filters.push(gte(properties.price, minPrice))
    if (maxPrice) filters.push(lte(properties.price, maxPrice))
    if (city) filters.push(ilike(properties.city, `%${city}%`))
    if (status) filters.push(eq(properties.status, status))
    if (bedrooms) filters.push(gte(properties.bedrooms, bedrooms))

    const whereClause = filters.length > 0 ? and(...filters) : undefined

    // Calculate total count for pagination
    const [totalCount] = await db
      .select({ count: count() })
      .from(properties)
      .where(whereClause)

    // Query data
    const data = await db
      .select()
      .from(properties)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(
        sortOrder === "asc"
          ? asc(properties[sortBy as keyof typeof properties.$inferSelect])
          : desc(properties[sortBy as keyof typeof properties.$inferSelect])
      )

    return createPaginationResponse(data, totalCount?.count ?? 0, query)
  }

  static async getById(id: string) {
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id))
      .limit(1)

    return property
  }

  static async create(data: PropertyModel.CreateBody) {
    // Remove undefined keys to let DB defaults handle them
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    ) as typeof data

    const [newProperty] = await db
      .insert(properties)
      .values(cleanData as typeof properties.$inferInsert)
      .returning()
    return newProperty
  }

  static async update(id: string, data: PropertyModel.UpdateBody) {
    const [updatedProperty] = await db
      .update(properties)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning()

    return updatedProperty
  }

  static async delete(id: string) {
    const [deletedProperty] = await db
      .delete(properties)
      .where(eq(properties.id, id))
      .returning()

    return deletedProperty
  }
}
