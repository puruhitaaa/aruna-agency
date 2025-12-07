import "dotenv/config"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import { properties as seedData } from "../lib/data"
import * as schema from "../server/db/schema"

/**
 * Property Seeder Script
 *
 * This script seeds the database with properties from the data.ts file.
 * It maps the Property interface from data.ts to the database schema.
 *
 * Usage: bun run db:seed
 */

const OWNER_ID = "OkNua1mHIXd2vbnSZGYgH7OiJg0iFCtb"

async function main() {
  console.log("🌱 Starting property seeder...")

  // Validate environment
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required")
  }

  console.log("📡 Connecting to database...")

  const connection = postgres(process.env.DATABASE_URL)
  const db = drizzle(connection, { schema })

  try {
    console.log(`📦 Preparing ${seedData.length} properties for insertion...`)

    // Map seed data to database schema
    const propertiesToInsert = seedData.map((property) => {
      // Extract location parts from the location string
      // Format: "City, Region" or just "City"
      const [city = property.location, state = "Indonesia"] =
        property.location.split(", ")

      return {
        ownerId: OWNER_ID,
        title: property.title,
        description: property.description,
        price: property.price.toString(),

        // Location fields
        address: `${property.title}, ${property.location}`, // Construct address from title and location
        city: city.trim(),
        state: state.trim(),
        zipCode: "00000", // Placeholder as original data doesn't have zip codes
        country: "Indonesia",

        // Property details
        size: property.area,
        bedrooms: property.beds,
        bathrooms: property.baths.toString(),
        features: property.amenities,

        // Images - collect all image URLs
        images: [
          property.image.src,
          ...property.images
            .map((img) => img.src)
            .filter((src) => src !== property.image.src),
        ],

        // Set as published
        status: "published" as const,
      }
    })

    console.log("🗑️  Clearing existing seeded properties...")

    // Delete only properties owned by the seeder owner ID
    await db
      .delete(schema.properties)
      .where(eq(schema.properties.ownerId, OWNER_ID))

    console.log("💾 Inserting properties...")

    // Insert properties
    const insertedProperties = await db
      .insert(schema.properties)
      .values(propertiesToInsert)
      .returning()

    console.log(
      `✅ Successfully seeded ${insertedProperties.length} properties:`
    )

    for (const property of insertedProperties) {
      console.log(`   - ${property.title} (${property.city})`)
    }

    console.log("\n🎉 Property seeding completed successfully!")
  } catch (error) {
    console.error("❌ Error seeding properties:", error)
    throw error
  } finally {
    // Close the database connection
    await connection.end()
    console.log("📡 Database connection closed.")
  }
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error("Fatal error:", error)
    process.exit(1)
  })
