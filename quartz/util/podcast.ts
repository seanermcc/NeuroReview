import { slugTag } from "./path"

export function metadataText(value: unknown): string {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : ""
}

export function podcastCategories(value: unknown): string[] {
  const values = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : []
  return [...new Set(values.map(metadataText).filter(Boolean))]
}

export function categorySlug(category: string): string {
  return slugTag(category.trim().toLowerCase())
}

export function podcastRating(value: unknown): number | undefined {
  if (typeof value !== "number" && typeof value !== "string") return undefined
  if (typeof value === "string" && !value.trim()) return undefined
  const rating = Number(value)
  return Number.isFinite(rating) && rating >= 1 && rating <= 10 ? rating : undefined
}

export function formatPodcastDate(value: unknown): string {
  const text = metadataText(value)
  if (!text) return ""
  const date = new Date(text)
  if (!Number.isFinite(date.getTime())) return text
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

export function podcastVideoLink(metadata: Record<string, unknown>): string | undefined {
  const link = metadataText(metadata["Youtube LInk"])
  if (link) {
    try {
      const url = new URL(link)
      if (url.protocol === "https:" || url.protocol === "http:") return url.href
    } catch {
      /* Fall back to a recorded video ID. */
    }
  }
  const id = metadataText(metadata["Youtube ID"])
  return /^[\w-]{11}$/.test(id) ? `https://www.youtube.com/watch?v=${id}` : undefined
}
