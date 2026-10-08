import { QuartzTransformerPlugin } from "../types"
import { categorySlug, podcastCategories } from "../../util/podcast"

export const PodcastMetadata: QuartzTransformerPlugin = () => ({
  name: "PodcastMetadata",
  markdownPlugins() {
    return [
      () => (_tree, file) => {
        const metadata = file.data.frontmatter
        if (!metadata) return
        // Derive Quartz tags without rewriting the source categories or reviews.
        const categories = podcastCategories(metadata.categories).map(categorySlug).filter(Boolean)
        metadata.tags = [...new Set([...(metadata.tags ?? []), ...categories])]
      },
    ]
  },
})
