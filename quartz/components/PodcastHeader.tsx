import { QuartzComponent, QuartzComponentProps } from "./types"

// Function to slugify category names for links
function slugify(str: string | null | undefined) {
  if (!str) {
    return "" // If str is null or empty, return an empty string
  }
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')    // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')      // Trim - from start of text
    .replace(/-+$/, '');     // Trim - from end of text
}

const PodcastHeader: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const frontmatter = fileData.frontmatter
  if (!frontmatter) {
    return null
  }

  // Get all the properties from your frontmatter
  const guest = frontmatter.guest
  const rating = frontmatter.rating
  const pod_num = frontmatter.pod_num
  const date = frontmatter.date
  const num_views = frontmatter.num_views
  const youtube_link = frontmatter["Youtube LInk"] 
  const pod_notes = frontmatter.pod_notes
  const pod_length = frontmatter.pod_length
  const episode_title = frontmatter.episode_title
  const categories = frontmatter.categories as string[] | undefined

  // Helper to format the date
  let displayDate = ""
  if (date) {
    try {
      displayDate = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch (e) {
      displayDate = date // Fallback to raw string if formatting fails
    }
  }

  return (
    <div className="podcast-header">
      {/* 1. Guest (Large Font) */}
      {guest && (
        <>
          {/* Label Header */}
          <h4 style={{ fontSize: "1rem", fontWeight: "600", margin: "0 0 0.5rem 0", color: "var(--darkgray)" }}>
            Guest:
          </h4>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "0.5rem", marginTop: "0" }}>{guest}</h1>
        </>
      )}

      {/* 2. Title (with label) */}
      {episode_title && (
        <>
          <h4 style={{ fontSize: "1rem", fontWeight: "600", margin: "1.5rem 0 0.5rem 0", color: "var(--darkgray)" }}>
            Episode Title:
          </h4>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem", color: "var(--dark)", marginTop: "0" }}>
            {episode_title}
          </h2>
        </>
      )}
      
      {/* 3. Rating (with bolded number) */}
      {rating && (
        <h2 style={{ fontSize: "2rem", fontWeight: "500", marginBottom: "1.5rem", color: "var(--dark)" }}>
          Rating: <strong style={{ fontWeight: "700" }}>{rating}/10</strong>
        </h2>
      )}

      {/* 4. Clickable Categories (with Header) */}
      {categories && categories.length > 0 && (
        <h4 style={{ fontSize: "1rem", fontWeight: "600", margin: "0 0 0.5rem 0", color: "var(--darkgray)" }}>
          <a href="/tags" style={{ textDecoration: "none", color: "inherit" }}>
            Podcast Categories (Links):
          </a>
        </h4>
      )}
      {categories && categories.length > 0 && (
        <div className="categories-container" style={{ margin: "0 0 1.5rem 0" }}>
          {categories.filter(Boolean).map(category => (
            <a href={`/tags/${slugify(category)}`} className="category-tag" style={{
              display: "inline-block",
              padding: "0.25rem 0.75rem",
              margin: "0.25rem",
              backgroundColor: "var(--lightgray)",
              color: "var(--dark)",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "0.9rem"
            }}>
              {category}
            </a>
          ))}
        </div>
      )}

      {/* 5. Smaller metadata row */}
      
      <div className="podcast-meta" style={{ fontSize: "0.9rem", color: "var(--darkgray)", marginBottom: "1.5rem" }}>
        {pod_num && <span>Episode #{pod_num}</span>}
        {pod_length && <span style={{ marginLeft: "1.5rem" }}>Episode Length (Hours): {pod_length}</span>}
        {displayDate && <span style={{ marginLeft: "1.5rem" }}>{displayDate}</span>}
        {num_views && <span style={{ marginLeft: "1.5rem" }}>{num_views} Views</span>}
        {youtube_link && <span style={{ marginLeft: "1.5rem" }}><a href={youtube_link}>Watch on YouTube</a></span>}
      </div>

      {/* 6. Pod Notes (above the summary) */}
      {pod_notes && (
        <>
          {/* This is the new label */}
          <h4 style={{ fontSize: "1rem", fontWeight: "600", margin: "1.5rem 0 0.5rem 0", color: "var(--darkgray)" }}>
            Pod Notes (SM):
          </h4>
          <blockquote className="pod-notes" style={{
            borderLeft: "4px solid var(--gray)",
            padding: "0.5rem 1.5rem",
            margin: "0 0 1.5rem 0", // Removed top margin as it's handled by the <h4>
            fontStyle: "italic",
            backgroundColor: "var(--lightgray)",
            color: "var(--dark)"
          }}>
            <p style={{ margin: "0" }}>{pod_notes}</p>
          </blockquote>
        </>
      )}
    </div>
  )
}

// Quartz components must be default exports
export default PodcastHeader