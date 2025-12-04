import { Elysia, t } from "elysia"
import { PropertyModel } from "./model"
import { PropertyService } from "./service"

export const propertiesController = new Elysia({ prefix: "/properties" })
  .get("/", ({ query }) => PropertyService.getAll(query), {
    query: PropertyModel.filterQuery,
    detail: { tags: ["Properties"] },
  })
  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      const property = await PropertyService.getById(id)
      if (!property) {
        set.status = 404
        return "Property not found"
      }
      return property
    },
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Properties"] },
    },
  )
  .post("/", ({ body }) => PropertyService.create(body), {
    body: PropertyModel.createBody,
    detail: { tags: ["Properties"] },
  })
  .patch(
    "/:id",
    async ({ params: { id }, body, set }) => {
      const updated = await PropertyService.update(id, body)
      if (!updated) {
        set.status = 404
        return "Property not found"
      }
      return updated
    },
    {
      params: t.Object({ id: t.String() }),
      body: PropertyModel.updateBody,
      detail: { tags: ["Properties"] },
    },
  )
  .delete(
    "/:id",
    async ({ params: { id }, set }) => {
      const deleted = await PropertyService.delete(id)
      if (!deleted) {
        set.status = 404
        return "Property not found"
      }
      return deleted
    },
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Properties"] },
    },
  )
