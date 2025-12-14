import { Elysia, t } from "elysia"
import { UserModel } from "./model"
import { UserService } from "./service"

export const usersController = new Elysia({ prefix: "/users" })
  .get("/", ({ query }) => UserService.getAll(query), {
    query: UserModel.filterQuery,
    detail: { tags: ["Users"] },
  })
  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      const user = await UserService.getById(id)
      if (!user) {
        set.status = 404
        return "User not found"
      }
      return user
    },
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Users"] },
    }
  )
