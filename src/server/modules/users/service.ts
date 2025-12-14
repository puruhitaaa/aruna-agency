import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm"
import { db } from "@/server/db"
import { user } from "@/server/db/schema"
import { createPaginationResponse } from "../../utils/pagination"
import type { UserModel } from "./model"

export abstract class UserService {
  static async getAll(query: UserModel.FilterQuery) {
    const {
      limit = 20,
      offset = 0,
      sortBy = "name",
      sortOrder = "asc",
      search,
      role,
    } = query

    // Build filters
    const filters = []

    if (search) {
      filters.push(
        or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`))
      )
    }

    if (role) {
      filters.push(eq(user.role, role))
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined

    // Calculate total count for pagination
    const [totalCount] = await db
      .select({ count: count() })
      .from(user)
      .where(whereClause)

    // Query data - only return fields needed for select components
    const data = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
      .from(user)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(
        sortOrder === "asc"
          ? asc(user[sortBy as keyof typeof user.$inferSelect])
          : desc(user[sortBy as keyof typeof user.$inferSelect])
      )

    return createPaginationResponse(data, totalCount?.count ?? 0, query)
  }

  static async getById(id: string) {
    const [foundUser] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
      .from(user)
      .where(eq(user.id, id))
      .limit(1)

    return foundUser
  }
}
