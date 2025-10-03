import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Page from "../../components/Page"
import { BlockType, type Content, type Block } from "../../types/content"
import { getContentByIdAPI } from "../../utils/api"
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardActionArea,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TablePagination
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import ViewListIcon from "@mui/icons-material/ViewList"
import ViewModuleIcon from "@mui/icons-material/ViewModule"
import TextFieldsIcon from "@mui/icons-material/TextFields"
import ImageIcon from "@mui/icons-material/Image"
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary"
import CloseIcon from "@mui/icons-material/Close"
import EditContentModal from "../../components/EditContentModal"


export default function ContentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [content, setContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"content" | "blocks">("content")
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const [blockDetailOpen, setBlockDetailOpen] = useState(false)
  const [blockPage, setBlockPage] = useState(0)
  const [blocksPerPage, setBlocksPerPage] = useState(5)

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

  const handleViewModeChange = (_event: React.MouseEvent<HTMLElement>, newMode: "content" | "blocks" | null) => {
    if (newMode !== null) {
      setViewMode(newMode)
    }
  }

  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block)
    setBlockDetailOpen(true)
  }

  const handleBlockDetailClose = () => {
    setBlockDetailOpen(false)
    setSelectedBlock(null)
  }

  const getBlockIcon = (type: BlockType) => {
    switch (type) {
      case BlockType.TEXT:
        return <TextFieldsIcon />
      case BlockType.IMAGE:
        return <ImageIcon />
      case BlockType.VIDEO:
        return <VideoLibraryIcon />
      default:
        return <TextFieldsIcon />
    }
  }

  const getBlockPreview = (block: Block) => {
    switch (block.type) {
      case BlockType.TEXT:
        return block.value?.substring(0, 100) + (block.value && block.value.length > 100 ? "..." : "")
      case BlockType.IMAGE:
        return block.caption || "Image block"
      case BlockType.VIDEO:
        return block.caption || "Video block"
      default:
        return "Unknown block type"
    }
  }

  const handleBlockPageChange = (_event: unknown, newPage: number) => {
    setBlockPage(newPage)
  }

  const handleBlocksPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBlocksPerPage(parseInt(event.target.value, 10))
    setBlockPage(0)
  }

  const paginatedBlocks = content?.blocks.slice(
    blockPage * blocksPerPage,
    blockPage * blocksPerPage + blocksPerPage
  ) || []

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
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
          >
            <ToggleButton value="content" aria-label="content view">
              <ViewModuleIcon sx={{ mr: 1 }} />
              Content
            </ToggleButton>
            <ToggleButton value="blocks" aria-label="blocks view">
              <ViewListIcon sx={{ mr: 1 }} />
              Blocks
            </ToggleButton>
          </ToggleButtonGroup>
          <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={handleEditClick}>
            Edit Content
          </Button>
        </Box>
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

        {viewMode === "content" ? (
          content.blocks.map((block, index) => {
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
        })
        ) : (
          <Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {paginatedBlocks.map((block, index) => {
                const actualIndex = blockPage * blocksPerPage + index
                return (
                  <Card
                    key={actualIndex}
                    sx={{
                      boxShadow: 1,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        boxShadow: 3,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <CardActionArea onClick={() => handleBlockClick(block)}>
                      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ color: "primary.main" }}>
                          {getBlockIcon(block.type)}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <Chip
                              label={block.type}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Typography variant="caption" color="text.secondary">
                              Block {actualIndex + 1}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}>
                            {getBlockPreview(block)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardActionArea>
                  </Card>
                )
              })}
            </Box>
            {content.blocks.length > 0 && (
              <TablePagination
                component="div"
                count={content.blocks.length}
                page={blockPage}
                onPageChange={handleBlockPageChange}
                rowsPerPage={blocksPerPage}
                onRowsPerPageChange={handleBlocksPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sx={{
                  mt: 2,
                  borderTop: 1,
                  borderColor: "divider"
                }}
              />
            )}
          </Box>
        )}
      </Box>

      {/* Block Detail Dialog */}
      <Dialog
        open={blockDetailOpen}
        onClose={handleBlockDetailClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {selectedBlock && getBlockIcon(selectedBlock.type)}
            <Typography variant="h6">
              Block Detail - {selectedBlock?.type}
            </Typography>
          </Box>
          <IconButton onClick={handleBlockDetailClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedBlock && (
            <Box>
              {selectedBlock.type === BlockType.TEXT && (
                <Box>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedBlock.value}
                  </Typography>
                  {selectedBlock.caption && (
                    <Typography variant="caption" color="text.secondary">
                      Caption: {selectedBlock.caption}
                    </Typography>
                  )}
                </Box>
              )}

              {selectedBlock.type === BlockType.IMAGE && (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <img
                    src={selectedBlock.metadata?.url ?? ""}
                    alt={selectedBlock.caption ?? "Image"}
                    style={{
                      width: "100%",
                      maxHeight: "70vh",
                      borderRadius: "8px",
                      objectFit: "contain",
                    }}
                  />
                  {selectedBlock.caption && (
                    <Typography variant="caption" color="text.secondary">
                      {selectedBlock.caption}
                    </Typography>
                  )}
                  {selectedBlock.metadata?.url && (
                    <Typography variant="caption" color="text.secondary" sx={{ wordBreak: "break-all" }}>
                      URL: {selectedBlock.metadata.url}
                    </Typography>
                  )}
                </Box>
              )}

              {selectedBlock.type === BlockType.VIDEO && (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <video
                    src={selectedBlock.metadata?.url ?? ""}
                    controls
                    style={{
                      width: "100%",
                      maxHeight: "70vh",
                      borderRadius: "8px",
                    }}
                  />
                  {selectedBlock.caption && (
                    <Typography variant="caption" color="text.secondary">
                      {selectedBlock.caption}
                    </Typography>
                  )}
                  {selectedBlock.metadata?.url && (
                    <Typography variant="caption" color="text.secondary" sx={{ wordBreak: "break-all" }}>
                      URL: {selectedBlock.metadata.url}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBlockDetailClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <EditContentModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        content={content}
      />
    </Page>
  )
}
