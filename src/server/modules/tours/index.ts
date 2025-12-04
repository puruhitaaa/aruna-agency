import { Elysia, t } from "elysia"
import { TourModel } from "./model"
import { TourService } from "./service"

export const toursController = new Elysia({ prefix: "/tours" })
  .get("/", ({ query }) => TourService.getAll(query), {
    query: TourModel.filterQuery,
    detail: { tags: ["Tours"] },
  })
  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      const tour = await TourService.getById(id)
      if (!tour) {
        set.status = 404
        return "Tour not found"
      }
      return tour
    },
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Tours"] },
    }
  )
  .post("/", ({ body }) => TourService.create(body), {
    body: TourModel.createBody,
    detail: { tags: ["Tours"] },
  })
  .patch(
    "/:id",
    async ({ params: { id }, body, set }) => {
      const updated = await TourService.update(id, body)
      if (!updated) {
        set.status = 404
        return "Tour not found"
      }
      return updated
    },
    {
      params: t.Object({ id: t.String() }),
      body: TourModel.updateBody,
      detail: { tags: ["Tours"] },
    }
  )
  .delete(
    "/:id",
    async ({ params: { id }, set }) => {
      const deleted = await TourService.delete(id)
      if (!deleted) {
        set.status = 404
        return "Tour not found"
      }
      return deleted
    },
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Tours"] },
    }
  )
