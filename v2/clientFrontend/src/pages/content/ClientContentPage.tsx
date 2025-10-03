import React from "react"
import { useEffect, useState } from "react"
import Page from "../../components/Page"
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  CardActionArea,
  TablePagination,
  InputAdornment,
  TextField,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Divider
} from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import SearchIcon from "@mui/icons-material/Search"
import ClearIcon from "@mui/icons-material/Clear"
import ViewModuleIcon from "@mui/icons-material/ViewModule"
import ViewListIcon from "@mui/icons-material/ViewList"
import ArticleIcon from "@mui/icons-material/Article"
import type { Content, PaginatedContentsResponse } from "../../types/content"
import { getAllContentsAPI } from "../../utils/api"
import { useNavigate } from "react-router-dom"
import type { ContentCardProps } from "../../types/content"

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
      <CardActionArea onClick={() => navigate(`/client/content/${content.id}`)} sx={{ flexGrow: 1 }}>
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

export default function ClientContentPage() {
  const navigate = useNavigate()
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(12)
  const [totalContents, setTotalContents] = useState(0)

  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchInput, setSearchInput] = useState("")

  useEffect(() => {
    fetchContents()
  }, [page, rowsPerPage, searchQuery])

  const fetchContents = async () => {
    if (isFetching) return

    try {
      setIsFetching(true)
      setLoading(true)
      setError(null)

      const response = await getAllContentsAPI({
        page: page + 1, // API expects 1-based page
        limit: rowsPerPage,
        search: searchQuery || undefined,
      })

      // Handle paginated response format
      if (response.data.data && Array.isArray(response.data.data)) {
        const paginatedData = response.data as PaginatedContentsResponse
        const mappedContents = paginatedData.data.map((item: any) => ({
          id: item._id || item.id,
          title: item.title,
          description: item.description,
          blocks: item.blocks || [],
          createdBy: item.createdBy,
          updatedBy: item.updatedBy,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }))

        setContents(mappedContents)
        setTotalContents(paginatedData.total)
      } else {
        setError("Unexpected data format from server")
        setContents([])
      }
    } catch (err) {
      setError("Failed to load content. Please try again.")
      console.error("Error fetching content:", err)
      setContents([])
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value)
  }

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setSearchQuery(searchInput)
    setPage(0)
  }

  const handleClearSearch = () => {
    setSearchInput("")
    setSearchQuery("")
    setPage(0)
  }

  const handleViewModeChange = (_event: React.MouseEvent<HTMLElement>, newMode: "grid" | "list" | null) => {
    if (newMode !== null) {
      setViewMode(newMode)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getBlockSummary = (content: Content) => {
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
    <Page title="Content">
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
              Content Library
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {totalContents} content {totalContents === 1 ? "item" : "items"} available
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
          >
            <ToggleButton value="grid" aria-label="grid view">
              <ViewModuleIcon sx={{ mr: 1 }} />
              Grid
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon sx={{ mr: 1 }} />
              List
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Search Bar */}
        <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by title or description..."
            value={searchInput}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchInput && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearch} edge="end" size="small">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
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
          <>
            {viewMode === "grid" ? (
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
              <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                <List>
                  {contents.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => navigate(`/client/content/${item.id}`)}
                          sx={{ py: 2 }}
                        >
                          <ListItemIcon>
                            <ArticleIcon color="primary" fontSize="large" />
                          </ListItemIcon>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {item.description || "No description available."}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                              <Chip
                                label={getBlockSummary(item)}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Avatar sx={{ width: 20, height: 20, bgcolor: "primary.main" }}>
                                  <PersonIcon sx={{ fontSize: 12 }} />
                                </Avatar>
                                <Typography variant="caption" color="text.secondary">
                                  {item?.createdBy?.name || "Unknown"}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <CalendarTodayIcon sx={{ fontSize: 12, color: "text.secondary" }} />
                                <Typography variant="caption" color="text.secondary">
                                  {formatDate(item.createdAt)}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </ListItemButton>
                      </ListItem>
                      {index < contents.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Card>
            )}

            {/* Pagination Controls */}
            {totalContents > 0 && (
              <TablePagination
                component="div"
                count={totalContents}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[6, 12, 24, 48]}
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "center",
                  borderTop: 1,
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  borderRadius: 2
                }}
              />
            )}
          </>
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
            <Typography variant="body2" color="text.secondary">
              There are no content items to display at this time.
            </Typography>
          </Box>
        )}
      </Container>
    </Page>
  )
}
