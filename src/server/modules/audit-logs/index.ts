import { Elysia, t } from "elysia"
import { AuditLogModel } from "./model"
import { AuditLogService } from "./service"

export const auditLogsController = new Elysia({ prefix: "/audit-logs" })
  .get("/", ({ query }) => AuditLogService.getAll(query), {
    query: AuditLogModel.filterQuery,
    detail: { tags: ["Audit Logs"] },
  })
  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      const log = await AuditLogService.getById(id)
      if (!log) {
        set.status = 404
        return "Audit log not found"
      }
      return log
    },
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Audit Logs"] },
    }
  )
  .post("/", ({ body }) => AuditLogService.create(body), {
    body: AuditLogModel.createBody,
    detail: { tags: ["Audit Logs"] },
  })
// No update or delete for Audit Logs to maintain integrity
