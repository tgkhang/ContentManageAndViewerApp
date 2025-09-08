import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Page from "../../components/Page"
import { BlockType, type Content } from "../../types/content"
import { getContentByIdAPI } from "../../utils/api"
import { Box, Typography, Button, CircularProgress, Alert } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import EditContentModal from "../../components/EditContentModal"


export default function ContentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [content, setContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchContent()
  }, [id])

  const fetchContent = async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)
      const res = await getContentByIdAPI(id)
      setContent({ ...res.data, id: res.data._id })
    } catch (err) {
      console.error("Failed to fetch content", err)
      setError("Failed to load content. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = () => {
    setIsEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    fetchContent()
  }

  if (loading) {
    return (
      <Page title="Content Detail">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh", mt: 10 }}>
          <CircularProgress />
        </Box>
      </Page>
    )
  }

  if (error) {
    return (
      <Page title="Content Detail">
        <Box sx={{ mt: 10 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Page>
    )
  }

  if (!content) {
    return (
      <Page title="Content Detail">
        <Box sx={{ mt: 10 }}>
          <Alert severity="info">Content not found</Alert>
        </Box>
      </Page>
    )
  }

  return (
    <Page title="Content Detail">
      <Box
        sx={{
          mt: 10,
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">{content.title}</Typography>
        <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={handleEditClick}>
          Edit Content
        </Button>
      </Box>

      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "16px",
        }}
      >
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          {content.description || "No description available."}
        </Typography>

        {content.blocks.map((block, index) => {
          switch (block.type) {
            case BlockType.TEXT:
              return (
                <Box key={index} sx={{ marginBottom: 2 }}>
                  <Typography variant="body1">{block.value}</Typography>
                  {block.caption && (
                    <Typography variant="caption" color="text.secondary">
                      {block.caption}
                    </Typography>
                  )}
                </Box>
              )

            case BlockType.IMAGE:
              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    marginBottom: 2,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={block.metadata?.url ?? ""}
                    alt={block.caption ?? "Image"}
                    style={{
                      width: "100%",
                      maxWidth: "800px",
                      maxHeight: "90vh",
                      borderRadius: "8px",
                      objectFit: "contain",
                    }}
                  />
                  {block.caption && (
                    <Typography variant="caption" color="text.secondary">
                      {block.caption}
                    </Typography>
                  )}
                </Box>
              )

            case BlockType.VIDEO:
              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    marginBottom: 2,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <video
                    src={block.metadata?.url ?? ""}
                    controls
                    style={{
                      width: "100%",
                      maxWidth: "800px",
                      maxHeight: "90vh",
                      borderRadius: "8px",
                    }}
                  />
                  {block.caption && (
                    <Typography variant="caption" color="text.secondary">
                      {block.caption}
                    </Typography>
                  )}
                </Box>
              )

            default:
              return null
          }
        })}
      </Box>

      <EditContentModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        content={content}
      />
    </Page>
  )
}
