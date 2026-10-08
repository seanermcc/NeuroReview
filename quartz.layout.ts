import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import PodcastHeader from "./quartz/components/PodcastHeader"
import HomeEpisodes from "./quartz/components/HomeEpisodes"
import PodcastNav from "./quartz/components/PodcastNav"

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "Built with": "https://quartz.jzhao.xyz/",
      YouTube: "https://www.youtube.com/@NeuroReview",
      Twitch: "https://www.twitch.tv/neuroreview",
      Contact: "mailto:sm@neuroreview.org",
    },
  }),
}

const navigation = [
  Component.PageTitle(),
  Component.Flex({
    components: [
      { Component: Component.Search(), grow: true },
      { Component: Component.Darkmode() },
    ],
  }),
  PodcastNav,
  Component.Explorer(),
]

export const defaultListPageLayout: PageLayout = {
  left: navigation,
  right: [],
  beforeBody: [Component.ArticleTitle()],
}

export const defaultContentPageLayout: PageLayout = {
  left: navigation,
  right: [Component.DesktopOnly(Component.TableOfContents()), Component.Backlinks()],
  beforeBody: [PodcastHeader, HomeEpisodes],
}
