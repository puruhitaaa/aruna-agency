import { Elysia } from "elysia"
import { auth } from "./better-auth"
import { propertiesController } from "./modules/properties"
import { toursController } from "./modules/tours"
import { landlordController } from "./modules/landlord"
import { paymentsController } from "./modules/payments"
import { notificationsController } from "./modules/notifications"
import { auditLogsController } from "./modules/audit-logs"

export const app = new Elysia({ prefix: "/api" })
  .use(propertiesController)
  .use(toursController)
  .use(landlordController)
  .use(paymentsController)
  .use(notificationsController)
  .use(auditLogsController)
  .mount(auth.handler)

export type App = typeof app // <--- Export type for Client
