import { test } from "node:test"
import assert from "node:assert/strict"
import { remark } from "remark"
import { VFile } from "vfile"
import { FrontMatter } from "../plugins/transformers/frontmatter"
import { PodcastMetadata } from "../plugins/transformers/podcastMetadata"
import { BuildCtx } from "./ctx"
import { categorySlug, formatPodcastDate, podcastRating, podcastVideoLink } from "./podcast"

test("review categories become matching Quartz tag routes without changing source metadata", async () => {
  const ctx = { cfg: { configuration: { locale: "en-US" } }, allSlugs: [] } as unknown as BuildCtx
  const processor = remark()
    .use(FrontMatter().markdownPlugins!(ctx))
    .use(PodcastMetadata().markdownPlugins!(ctx))
  const source =
    '---\ntitle: Episode\nrating: 6.73\ntags: [existing]\ncategories: [Basic Neuroscience, Basic Neuroscience, "Science & Society"]\n---\nReview text.'
  const file = new VFile({ value: source })
  await processor.run(processor.parse(file), file)
  assert.deepEqual(file.data.frontmatter?.tags, [
    "existing",
    categorySlug("Basic Neuroscience"),
    categorySlug("Science & Society"),
  ])
  assert.equal(file.data.frontmatter?.rating, 6.73)
  assert.equal(file.data.frontmatter?.categories instanceof Array, true)
  assert.equal(String(file.value), source)
})

test("date-only episode dates remain the same calendar day across time zones", () => {
  const previous = process.env.TZ
  try {
    for (const zone of ["America/New_York", "America/Los_Angeles", "Asia/Tokyo"]) {
      process.env.TZ = zone
      assert.equal(formatPodcastDate("2021-01-04"), "January 4, 2021")
    }
    assert.equal(formatPodcastDate(null), "")
    assert.equal(formatPodcastDate("unknown"), "unknown")
  } finally {
    if (previous === undefined) delete process.env.TZ
    else process.env.TZ = previous
  }
})

test("ratings retain precision and missing or invalid ratings stay absent", () => {
  for (const rating of [1, 6.7, 6.73, 10]) assert.equal(podcastRating(rating), rating)
  assert.equal(podcastRating("6.70"), 6.7)
  for (const missing of [null, undefined, "", " ", false, 0, 11, NaN])
    assert.equal(podcastRating(missing), undefined)
})

test("episode video links use the recorded ID when a URL is absent", () => {
  assert.equal(
    podcastVideoLink({ "Youtube ID": "H-XfCl-HpRM" }),
    "https://www.youtube.com/watch?v=H-XfCl-HpRM",
  )
  assert.equal(podcastVideoLink({ "Youtube LInk": "javascript:alert(1)" }), undefined)
})
