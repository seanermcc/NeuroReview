import { QuartzComponent, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import {
  categorySlug,
  formatPodcastDate,
  metadataText,
  podcastCategories,
  podcastRating,
} from "../util/podcast"
import { QuartzPluginData } from "../plugins/vfile"
// @ts-ignore
import script from "./scripts/episodes.inline"

export function byRating(a: QuartzPluginData, b: QuartzPluginData): number {
  return (
    (podcastRating(b.frontmatter?.rating) ?? -1) - (podcastRating(a.frontmatter?.rating) ?? -1) ||
    (a.frontmatter?.title ?? "").localeCompare(b.frontmatter?.title ?? "", undefined, {
      numeric: true,
    })
  )
}

type Props = QuartzComponentProps & { compact?: boolean }

const EpisodeList: QuartzComponent = ({ allFiles, fileData, compact = false }: Props) => {
  const shows = [
    ...new Set(allFiles.map((page) => metadataText(page.frontmatter?.pod_host)).filter(Boolean)),
  ].sort()
  const categories = [
    ...new Set(allFiles.flatMap((page) => podcastCategories(page.frontmatter?.categories))),
  ].sort()
  return (
    <section
      class="episode-browser"
      data-browser-key={compact ? undefined : fileData.slug}
      aria-label="Episodes"
    >
      {!compact && (
        <>
          <form class="episode-controls" hidden>
            <label class="episode-query">
              Search episodes
              <input
                type="search"
                name="query"
                placeholder="Title, guest, or episode"
                autoComplete="off"
              />
            </label>
            <label>
              Show
              <select name="show">
                <option value="">All shows</option>
                {shows.map((show) => (
                  <option value={show}>{show}</option>
                ))}
              </select>
            </label>
            <label>
              Category
              <select name="category">
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option value={category}>{category}</option>
                ))}
              </select>
            </label>
            <label>
              Sort
              <select name="sort">
                <option value="rating-desc">Highest rated</option>
                <option value="rating-asc">Lowest rated</option>
                <option value="newest">Newest episodes</option>
                <option value="oldest">Oldest episodes</option>
                <option value="title">Title</option>
              </select>
            </label>
            <label>
              Ratings
              <select name="rating">
                <option value="">All episodes</option>
                <option value="rated">Rated</option>
                <option value="unrated">Not rated</option>
              </select>
            </label>
            <label>
              Per page
              <select name="size">
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
            </label>
            <button type="reset">Reset</button>
          </form>
          <p class="episode-count" role="status" aria-live="polite">
            {allFiles.length} episodes
          </p>
        </>
      )}
      <ul class="episode-list">
        {allFiles.map((page) => {
          const metadata = page.frontmatter!
          const title = metadataText(metadata.episode_title) || metadata.title
          const guest = metadataText(metadata.guest)
          const rating = podcastRating(metadata.rating)
          const categories = podcastCategories(metadata.categories)
          return (
            <li
              class="episode-row"
              data-title={title}
              data-search={[title, guest, metadata.title, metadataText(metadata.pod_host)]
                .join(" ")
                .toLowerCase()}
              data-show={metadataText(metadata.pod_host)}
              data-categories={JSON.stringify(categories)}
              data-rating={rating ?? ""}
              data-date={metadataText(metadata.date)}
            >
              <div class="episode-row-main">
                <p class="episode-kicker">
                  {metadata.title}
                  {metadataText(metadata.pod_host) && ` | ${metadataText(metadata.pod_host)}`}
                </p>
                <h3>
                  <a class="internal" href={resolveRelative(fileData.slug!, page.slug!)}>
                    {title}
                  </a>
                </h3>
                {guest && <p class="episode-row-guest">{guest}</p>}
                <p class="episode-row-date">{formatPodcastDate(metadata.date)}</p>
                <ul class="episode-categories">
                  {categories.map((category) => (
                    <li>
                      <a
                        class="internal"
                        href={resolveRelative(
                          fileData.slug!,
                          `tags/${categorySlug(category)}` as FullSlug,
                        )}
                      >
                        {category}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div class="episode-row-rating">
                <span>Sean's rating</span>
                <strong>{rating === undefined ? "Not rated" : `${rating}/10`}</strong>
              </div>
            </li>
          )
        })}
      </ul>
      {!compact && (
        <>
          <p class="episode-empty" hidden>
            No episodes match these filters.
          </p>
          <nav class="episode-pagination" aria-label="Episode pages" hidden>
            <button type="button" data-page="previous">
              Previous
            </button>
            <span class="episode-page-number"></span>
            <button type="button" data-page="next">
              Next
            </button>
          </nav>
        </>
      )}
    </section>
  )
}

EpisodeList.afterDOMLoaded = script
export default EpisodeList
