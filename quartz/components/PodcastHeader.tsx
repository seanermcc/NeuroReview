import { QuartzComponent } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import {
  categorySlug,
  formatPodcastDate,
  metadataText,
  podcastCategories,
  podcastRating,
  podcastVideoLink,
} from "../util/podcast"

const PodcastHeader: QuartzComponent = ({ fileData }) => {
  const metadata = fileData.frontmatter
  if (!metadata?.id) return <h1>{fileData.slug === "index" ? "NeuroReview" : metadata?.title}</h1>
  const rating = podcastRating(metadata.rating)
  const categories = podcastCategories(metadata.categories)
  const date = formatPodcastDate(metadata.date)
  const video = podcastVideoLink(metadata)
  const notes = metadataText(metadata.pod_notes)
  return (
    <div class="podcast-header">
      <p class="episode-kicker">
        {metadataText(metadata.pod_host)} · {metadata.title}
      </p>
      <h1>{metadataText(metadata.episode_title) || metadata.title}</h1>
      {metadataText(metadata.guest) && <p class="episode-guest">{metadataText(metadata.guest)}</p>}
      <p class="episode-rating">
        Sean's rating: <strong>{rating === undefined ? "Not rated" : `${rating}/10`}</strong>
      </p>
      <div class="podcast-meta">
        {date && <span>{date}</span>}
        {metadataText(metadata.pod_length) && (
          <span>{metadataText(metadata.pod_length)} hours</span>
        )}
        {video && <a href={video}>Watch on YouTube</a>}
      </div>
      <ul class="episode-categories">
        {categories.map((category) => (
          <li>
            <a
              class="internal"
              href={resolveRelative(fileData.slug!, `tags/${categorySlug(category)}` as FullSlug)}
            >
              {category}
            </a>
          </li>
        ))}
      </ul>
      {notes && (
        <>
          <h2 class="notes-heading">Sean's notes</h2>
          <blockquote>
            <p>{notes}</p>
          </blockquote>
        </>
      )}
    </div>
  )
}

export default PodcastHeader
