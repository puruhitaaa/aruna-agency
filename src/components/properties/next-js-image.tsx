"use client"

import Image from "next/image"
import {
  isImageFitCover,
  isImageSlide,
  useLightboxProps,
  useLightboxState,
  type Slide,
  type SlideImage,
  type RenderSlideProps,
  type RenderThumbnailProps,
} from "yet-another-react-lightbox"

function isNextJsImage(slide: Slide): slide is SlideImage {
  return (
    isImageSlide(slide) &&
    typeof slide.width === "number" &&
    typeof slide.height === "number"
  )
}

export default function NextJsImage({
  slide,
  offset,
  rect,
}: {
  slide: Slide
  offset?: number
  rect: { width: number; height: number }
}) {
  const {
    on: { click },
    carousel: { imageFit },
  } = useLightboxProps()

  const { currentIndex } = useLightboxState()

  const cover = isImageSlide(slide) && isImageFitCover(slide, imageFit)

  if (!slide || !rect) return null

  if (!isNextJsImage(slide)) return undefined

  const width = !cover
    ? Math.round(
        Math.min(rect.width, (rect.height / slide.height!) * slide.width!)
      )
    : rect.width

  const height = !cover
    ? Math.round(
        Math.min(rect.height, (rect.width / slide.width!) * slide.height!)
      )
    : rect.height

  return (
    <div style={{ position: "relative", width, height }}>
      <Image
        fill
        alt={slide.alt || ""}
        src={slide.src}
        loading='eager'
        draggable={false}
        placeholder={(slide as any).blurDataURL ? "blur" : undefined}
        style={{
          objectFit: cover ? "cover" : "contain",
          cursor: click ? "pointer" : undefined,
        }}
        sizes={`${Math.ceil((width / window.innerWidth) * 100)}vw`}
        onClick={
          offset === 0 ? () => click?.({ index: currentIndex }) : undefined
        }
      />
    </div>
  )
}
