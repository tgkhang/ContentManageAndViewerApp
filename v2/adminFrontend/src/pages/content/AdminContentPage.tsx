import type React from "react"
import { useEffect, useState } from "react"
import Page from "../../components/Page"
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  CardActionArea
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import PersonIcon from "@mui/icons-material/Person"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import type { Content } from "../../types/content"
import { getAllContentsAPI } from "../../utils/api"
import { useNavigate } from "react-router-dom"
import type { ContentCardProps } from "../../types/content"
import CreateContentModal from "../../components/CreateContentModal"

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  const navigate = useNavigate()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getBlockSummary = () => {
    if (!content.blocks || content.blocks.length === 0) return "No content blocks"
    const types = content.blocks.map(block => block.type)
    const textCount = types.filter(t => t === "text").length
    const imageCount = types.filter(t => t === "image").length
    const videoCount = types.filter(t => t === "video").length

    const parts = []
    if (textCount > 0) parts.push(`${textCount} text`)
    if (imageCount > 0) parts.push(`${imageCount} image`)
    if (videoCount > 0) parts.push(`${videoCount} video`)

    return parts.join(", ") + ` block${content.blocks.length > 1 ? "s" : ""}`
  }

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
          borderColor: "primary.main",
        },
      }}
    >
      <CardActionArea onClick={() => navigate(`/admin/content/${content.id}`)} sx={{ flexGrow: 1 }}>
        <CardContent sx={{ p: 3, height: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
            {/* Title */}
            <Typography
              variant="h6"
              color="primary"
              sx={{
                fontWeight: 600,
                fontSize: "1.1rem",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {content.title}
            </Typography>

            {/* Description */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                flexGrow: 1,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {content.description || "No description available."}
            </Typography>

            {/* Block Summary */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={getBlockSummary()}
                size="small"
                variant="outlined"
                color="primary"
              />
            </Box>

            {/* Metadata */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pt: 1, borderTop: 1, borderColor: "divider" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, bgcolor: "primary.main" }}>
                  <PersonIcon sx={{ fontSize: 14 }} />
                </Avatar>
                <Typography variant="caption" color="text.secondary">
                  {content?.createdBy?.name || "Unknown"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarTodayIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(content.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default function AdminContentPage() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    if (isFetching) return

    try {
      setIsFetching(true)
      setLoading(true)
      setError(null)

      const response = await getAllContentsAPI()
      console.log("Fetched contents (raw):", response.data)

      // Map the response to ensure id field exists
      const mappedContents = (Array.isArray(response.data) ? response.data : []).map((item: any) => ({
        id: item._id || item.id,
        title: item.title,
        description: item.description,
        blocks: item.blocks || [],
        createdBy: item.createdBy,
        updatedBy: item.updatedBy,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }))

      console.log("Mapped contents:", mappedContents)
      setContents(mappedContents)
    } catch (err) {
      setError("Failed to load content. Please try again.")
      console.error("Error fetching content:", err)
      setContents([])
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }

  const handleCreateClick = () => {
    setIsCreateModalOpen(true)
  }

  const handleCreateSuccess = () => {
    fetchContents()
  }

  return (
    <Page title="Content Management">
      <Container maxWidth="xl" sx={{ mt: 10, pb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: "primary.main", mb: 1 }}>
              Content Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {contents.length} content {contents.length === 1 ? "item" : "items"} total
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4
              }
            }}
          >
            Create New Content
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : contents.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {contents.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              my: 8,
              p: 4,
              bgcolor: "background.paper",
              borderRadius: 2,
              border: 1,
              borderColor: "divider"
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No content available
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Create your first content item to get started!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateClick}
            >
              Create Content
            </Button>
          </Box>
        )}

        <CreateContentModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      </Container>
    </Page>
  )
}
