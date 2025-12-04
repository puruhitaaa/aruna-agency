import { relations } from "drizzle-orm"
import {
  boolean,
  decimal,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { user } from "./auth-schema"

export * from "./auth-schema"

// Enums
export const propertyStatusEnum = pgEnum("property_status", [
  "draft",
  "published",
  "sold",
  "rented",
  "archived",
])
export const verificationStatusEnum = pgEnum("verification_status", [
  "pending",
  "verified",
  "rejected",
])
export const tourStatusEnum = pgEnum("tour_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
])
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
])
export const paymentPlanTypeEnum = pgEnum("payment_plan_type", [
  "full_payment",
  "installment",
])

// Landlord Profile (extends User information)
export const landlordProfiles = pgTable("landlord_profile", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  verificationStatus: verificationStatusEnum("verification_status")
    .default("pending")
    .notNull(),
  verificationDocuments: jsonb("verification_documents").$type<string[]>(), // Array of URLs
  bio: text("bio"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

// Properties
export const properties = pgTable("property", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  status: propertyStatusEnum("status").default("draft").notNull(),

  // Location
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  zipCode: varchar("zip_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),

  // Details
  size: integer("size").notNull(), // Square feet/meters
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }).notNull(),
  features: jsonb("features").$type<string[]>(), // e.g., ["pool", "garage"]

  images: jsonb("images").$type<string[]>(), // Array of image URLs

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

// Tour Scheduling
export const tours = pgTable("tour", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  agentId: text("agent_id").references(() => user.id), // Optional, if an agent is assigned
  buyerId: text("buyer_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  date: timestamp("date").notNull(),
  status: tourStatusEnum("status").default("pending").notNull(),
  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

// Payments
export const payments = pgTable("payment", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  propertyId: uuid("property_id").references(() => properties.id), // Optional, could be a general fee

  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),

  planType: paymentPlanTypeEnum("plan_type").default("full_payment").notNull(),
  installmentsTotal: integer("installments_total"), // If installment plan
  installmentNumber: integer("installment_number"), // e.g., 1 of 12

  gateway: varchar("gateway", { length: 50 }).notNull(), // stripe, paypal
  gatewayTransactionId: text("gateway_transaction_id"),
  status: paymentStatusEnum("status").default("pending").notNull(),
  metadata: jsonb("metadata"), // Flexible for gateway response

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

// Notifications
export const notifications = pgTable("notification", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(), // e.g., "tour_confirmed", "payment_received"
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  data: jsonb("data"), // Link to entity

  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Audit Logs
export const auditLogs = pgTable("audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => user.id), // Nullable for system events
  action: varchar("action", { length: 100 }).notNull(), // "create_property", "login"
  entityType: varchar("entity_type", { length: 50 }), // "property", "user"
  entityId: text("entity_id"),
  details: jsonb("details"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Relations
export const landlordProfileRelations = relations(
  landlordProfiles,
  ({ one }) => ({
    user: one(user, {
      fields: [landlordProfiles.userId],
      references: [user.id],
    }),
  })
)

export const propertyRelations = relations(properties, ({ one, many }) => ({
  owner: one(user, {
    fields: [properties.ownerId],
    references: [user.id],
  }),
  tours: many(tours),
  payments: many(payments),
}))

export const tourRelations = relations(tours, ({ one }) => ({
  property: one(properties, {
    fields: [tours.propertyId],
    references: [properties.id],
  }),
  agent: one(user, {
    fields: [tours.agentId],
    references: [user.id],
  }),
  buyer: one(user, {
    fields: [tours.buyerId],
    references: [user.id],
  }),
}))

export const paymentRelations = relations(payments, ({ one }) => ({
  user: one(user, {
    fields: [payments.userId],
    references: [user.id],
  }),
  property: one(properties, {
    fields: [payments.propertyId],
    references: [properties.id],
  }),
}))

export const notificationRelations = relations(notifications, ({ one }) => ({
  user: one(user, {
    fields: [notifications.userId],
    references: [user.id],
  }),
}))

export const auditLogRelations = relations(auditLogs, ({ one }) => ({
  user: one(user, {
    fields: [auditLogs.userId],
    references: [user.id],
  }),
}))
