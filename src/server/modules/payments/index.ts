import { Elysia, t } from "elysia"
import { PaymentModel } from "./model"
import { PaymentService } from "./service"

export const paymentsController = new Elysia({ prefix: "/payments" })
  .get("/", ({ query }) => PaymentService.getAll(query), {
    query: PaymentModel.filterQuery,
    detail: { tags: ["Payments"] },
  })
  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      const payment = await PaymentService.getById(id)
      if (!payment) {
        set.status = 404
        return "Payment not found"
      }
      return payment
    },
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Payments"] },
    },
  )
  .post("/", ({ body }) => PaymentService.create(body), {
    body: PaymentModel.createBody,
    detail: { tags: ["Payments"] },
  })
  .patch(
    "/:id",
    async ({ params: { id }, body, set }) => {
      const updated = await PaymentService.update(id, body)
      if (!updated) {
        set.status = 404
        return "Payment not found"
      }
      return updated
    },
    {
      params: t.Object({ id: t.String() }),
      body: PaymentModel.updateBody,
      detail: { tags: ["Payments"] },
    },
  )
  .delete(
    "/:id",
    async ({ params: { id }, set }) => {
      const deleted = await PaymentService.delete(id)
      if (!deleted) {
        set.status = 404
        return "Payment not found"
      }
      return deleted
    },
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Payments"] },
    },
  )
