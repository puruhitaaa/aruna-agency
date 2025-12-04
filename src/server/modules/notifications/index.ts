import { Elysia, t } from "elysia"
import { NotificationModel } from "./model"
import { NotificationService } from "./service"

export const notificationsController = new Elysia({ prefix: "/notifications" })
  .get("/", ({ query }) => NotificationService.getAll(query), {
    query: NotificationModel.filterQuery,
    detail: { tags: ["Notifications"] },
  })
  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      const notification = await NotificationService.getById(id)
      if (!notification) {
        set.status = 404
        return "Notification not found"
      }
      return notification
    },
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Notifications"] },
    }
  )
  .post("/", ({ body }) => NotificationService.create(body), {
    body: NotificationModel.createBody,
    detail: { tags: ["Notifications"] },
  })
  .patch(
    "/:id",
    async ({ params: { id }, body, set }) => {
      const updated = await NotificationService.update(id, body)
      if (!updated) {
        set.status = 404
        return "Notification not found"
      }
      return updated
    },
    {
      params: t.Object({ id: t.String() }),
      body: NotificationModel.updateBody,
      detail: { tags: ["Notifications"] },
    }
  )
  .delete(
    "/:id",
    async ({ params: { id }, set }) => {
      const deleted = await NotificationService.delete(id)
      if (!deleted) {
        set.status = 404
        return "Notification not found"
      }
      return deleted
    },
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Notifications"] },
    }
  )
