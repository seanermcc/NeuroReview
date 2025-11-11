import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// Import our custom components
import PodcastHeader from "./quartz/components/PodcastHeader"
import PodcastHostTitle from "./quartz/components/PodcastHostTitle"

// *** 1. THIS IS THE FIX for the PageList WARNING ***
// We import PageList directly from its file as a NAMED import (with braces)
import { PageList } from "./quartz/components/PageList"

// components that will be displayed on all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.MobileOnly(Component.Explorer()),
    Component.Search(),
    Component.Darkmode(),
  ],
  beforeBody: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "Built with": "https://quartz.jzhao.xyz/",
      "Youtube": "https://neuroreview.org",
      "Twitch": "https://www.twitch.tv/neuroreview",
      "Contact": "mailto:sm@neuroreview.org",
    },
  }),
}

// components that will be displayed on list pages (like /tags/psychology)
export const defaultListPageLayout: PageLayout = {
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.RecentNotes({ title: "Recently Reviewed Podcasts", limit: 5 }),
  ],
  left: [
    Component.DesktopOnly(Component.Explorer()),
    Component.DesktopOnly(Component.PageTitle()), // This will show "Category: Psychology"
    Component.TagList(), // This lists all tags/categories in the sidebar
  ],
  beforeBody: [],
  // *** 2. THIS IS THE FIX for the 404 PAGE ***
  // We use our new, directly imported 'PageList' component
  pageBody: PageList,
  afterBody: [],
}

// components that will be displayed on a single note page
export const defaultContentPageLayout: PageLayout = {
  right: [
    Component.DesktopOnly(PodcastHostTitle),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
  left: [
    Component.DesktopOnly(Component.PageTitle()),
    Component.MobileOnly(Component.Explorer()),
    Component.DesktopOnly(Component.Explorer()),
    Component.DesktopOnly(Component.Darkmode()),
    Component.Search(),
  ],
  beforeBody: [
    PodcastHeader,
  ],
  pageBody: Component.Content(), // This renders your summary
  afterBody: [],
}

// Simplified the 404 page layout
export const notFoundPageLayout: PageLayout = {
  right: [],
  left: [],
  beforeBody: [],
  pageBody: Component.NotFound(),
  afterBody: [],
}

// This exports the layouts for Quartz to use
export const pageLayout: PageLayout = defaultContentPageLayout
export const listLayout: PageLayout = defaultListPageLayout
export const notFoundLayout: PageLayout = notFoundPageLayout