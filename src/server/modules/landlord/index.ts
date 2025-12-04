import { Elysia, t } from "elysia"
import { LandlordModel } from "./model"
import { LandlordService } from "./service"

export const landlordController = new Elysia({ prefix: "/landlords" })
  .get("/", ({ query }) => LandlordService.getAll(query), {
    query: LandlordModel.filterQuery,
    detail: { tags: ["Landlords"] },
  })
  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      const profile = await LandlordService.getById(id)
      if (!profile) {
        set.status = 404
        return "Landlord profile not found"
      }
      return profile
    },
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Landlords"] },
    }
  )
  .post("/", ({ body }) => LandlordService.create(body), {
    body: LandlordModel.createBody,
    detail: { tags: ["Landlords"] },
  })
  .patch(
    "/:id",
    async ({ params: { id }, body, set }) => {
      const updated = await LandlordService.update(id, body)
      if (!updated) {
        set.status = 404
        return "Landlord profile not found"
      }
      return updated
    },
    {
      params: t.Object({ id: t.String() }),
      body: LandlordModel.updateBody,
      detail: { tags: ["Landlords"] },
    }
  )
  .delete(
    "/:id",
    async ({ params: { id }, set }) => {
      const deleted = await LandlordService.delete(id)
      if (!deleted) {
        set.status = 404
        return "Landlord profile not found"
      }
      return deleted
    },
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Landlords"] },
    }
  )
