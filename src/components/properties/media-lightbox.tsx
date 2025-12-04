"use client"

import NextJsImage from "@/components/properties/next-js-image"
import Lightbox, { type Slide } from "yet-another-react-lightbox"
import Captions from "yet-another-react-lightbox/plugins/captions"
import "yet-another-react-lightbox/plugins/captions.css"
import Counter from "yet-another-react-lightbox/plugins/counter"
import "yet-another-react-lightbox/plugins/counter.css"
import Download from "yet-another-react-lightbox/plugins/download"
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen"
import Share from "yet-another-react-lightbox/plugins/share"
import Slideshow from "yet-another-react-lightbox/plugins/slideshow"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"
import "yet-another-react-lightbox/plugins/thumbnails.css"
import Video from "yet-another-react-lightbox/plugins/video"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import "yet-another-react-lightbox/styles.css"

export interface MediaItem {
  type: "image" | "video"
  url: string
  alt?: string
  thumbnail?: string
  width?: number
  height?: number
  title?: string
  description?: string
}

interface MediaLightboxProps {
  isOpen: boolean
  onClose: () => void
  media: MediaItem[]
  initialIndex?: number
}

export function MediaLightbox({
  isOpen,
  onClose,
  media,
  initialIndex = 0,
}: MediaLightboxProps) {
  // Transform our MediaItem[] to the library's Slide[] format
  const slides: Slide[] = media.map((item) => {
    if (item.type === "video") {
      return {
        type: "video",
        width: item.width,
        height: item.height,
        sources: [
          {
            src: item.url,
            type: "video/mp4",
          },
        ],
        poster: item.thumbnail,
        title: item.title,
        description: item.description,
      }
    }
    return {
      src: item.url,
      alt: item.alt,
      width: item.width,
      height: item.height,
      title: item.title,
      description: item.description,
    }
  })

  return (
    <Lightbox
      open={isOpen}
      close={onClose}
      index={initialIndex}
      slides={slides}
      plugins={[
        Captions,
        Counter,
        Download,
        Fullscreen,
        Share,
        Slideshow,
        Thumbnails,
        Video,
        Zoom,
      ]}
      render={{ slide: NextJsImage, thumbnail: NextJsImage }}
      captions={{
        showToggle: true,
        descriptionTextAlign: "start",
      }}
      counter={{ container: { style: { top: "unset", bottom: 0 } } }}
      video={{
        autoPlay: true,
        controls: true,
      }}
      zoom={{
        maxZoomPixelRatio: 5,
        scrollToZoom: true,
      }}
    />
  )
}
