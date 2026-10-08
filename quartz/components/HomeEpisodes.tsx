import { QuartzComponent } from "./types"
import EpisodeList, { byRating } from "./EpisodeList"

const HomeEpisodes: QuartzComponent = (props) =>
  props.fileData.slug === "index" ? (
    <EpisodeList
      {...props}
      allFiles={props.allFiles.filter((page) => page.frontmatter?.id).sort(byRating)}
    />
  ) : null

HomeEpisodes.afterDOMLoaded = EpisodeList.afterDOMLoaded
export default HomeEpisodes
