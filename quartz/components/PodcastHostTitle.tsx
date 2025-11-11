import { QuartzComponent, QuartzComponentProps } from "./types"

const PodcastHostTitle: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  // Get the full file path (e.g., 'content/Huberman Lab Podcast/note.md')
  const path = fileData.filePath

  if (!path) {
    return null // No path, show nothing
  }

  const segments = path.split('/')
  
  // We need at least 3 segments: 'content', 'folder', 'file.md'
  // If it's less, it's a file in the root (like 'content/index.md'), so show nothing.
  if (segments.length < 3) {
    return null
  }

  // Get the parent folder name (e.g., 'Huberman Lab Podcast')
  const hostTitle = segments[segments.length - 2]

  return (
    <h2 className="podcast-host-title" style={{
      fontSize: "1.75rem",
      fontWeight: "600",
      color: "var(--dark)",
      marginBottom: "1rem"
    }}>
      {hostTitle}
    </h2>
  )
}

export default PodcastHostTitle