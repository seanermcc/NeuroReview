import { QuartzComponent } from "./types"
import { FullSlug, resolveRelative } from "../util/path"

const PodcastNav: QuartzComponent = ({ fileData }) => (
  <nav class="podcast-nav" aria-label="Podcasts">
    <a class="internal" href={resolveRelative(fileData.slug!, "index" as FullSlug)}>
      Episodes
    </a>
    <a class="internal" href={resolveRelative(fileData.slug!, "tags/index" as FullSlug)}>
      Categories
    </a>
  </nav>
)

export default PodcastNav
