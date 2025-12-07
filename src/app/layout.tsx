import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import { NuqsAdapter } from "nuqs/adapters/next/app"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import QueryProvider from "@/lib/react-query/QueryProvider"
import { cn } from "@/lib/utils"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

// Base URL for the application
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aruna-agency.com"

export const metadata: Metadata = {
  // Default metadata for the entire site
  metadataBase: new URL(baseUrl),

  title: {
    default: "Aruna Agency | Premium Real Estate in Indonesia",
    template: "%s | Aruna Agency",
  },
  description:
    "Discover your dream property with Aruna Agency. We offer premium real estate listings across Indonesia, from modern apartments to luxury villas. Find your perfect home today.",

  keywords: [
    "real estate",
    "property",
    "Indonesia",
    "rumah dijual",
    "properti",
    "apartemen",
    "villa",
    "luxury homes",
    "Aruna Agency",
    "Jakarta",
    "Bali",
    "Surabaya",
  ],

  authors: [{ name: "Aruna Agency", url: baseUrl }],
  creator: "Aruna Agency",
  publisher: "Aruna Agency",

  // Favicon and icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  // Manifest for PWA
  manifest: "/site.webmanifest",

  // Open Graph defaults
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: baseUrl,
    siteName: "Aruna Agency",
    title: "Aruna Agency | Premium Real Estate in Indonesia",
    description:
      "Discover your dream property with Aruna Agency. Premium real estate listings across Indonesia.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aruna Agency - Premium Real Estate",
      },
    ],
  },

  // Twitter Card defaults
  twitter: {
    card: "summary_large_image",
    title: "Aruna Agency | Premium Real Estate in Indonesia",
    description:
      "Discover your dream property with Aruna Agency. Premium real estate listings across Indonesia.",
    images: ["/og-image.png"],
    creator: "@arunaagency",
  },

  // Robots directives
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification for search consoles
  verification: {
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },

  // Category
  category: "real estate",
}

// Viewport configuration (separated from metadata in Next.js 15+)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='id' suppressHydrationWarning>
      <head>
        {/* Additional SEO tags */}
        <link rel='dns-prefetch' href='//fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
      </head>
      <body
        className={cn(
          "bg-background text-foreground min-h-screen font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <NuqsAdapter>
          <QueryProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster richColors />
            </ThemeProvider>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
