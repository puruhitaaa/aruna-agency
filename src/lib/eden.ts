import { treaty } from "@elysiajs/eden"
import type { App } from "@/server"

// Use full URL for Server Components, use current origin for Client-side
const domain =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    : window.location.origin

export const api = treaty<App>(domain).api
