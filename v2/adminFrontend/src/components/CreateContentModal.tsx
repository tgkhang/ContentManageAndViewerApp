import type React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  Paper,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import VideocamIcon from "@mui/icons-material/Videocam";
import {
  BlockType,
  type ContentBlock,
  type CreateContentDto,
} from "../types/content";
import { createContentAPI, uploadFileAPI } from "../utils/api";

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateContentModal: React.FC<CreateContentModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [activeBlockType, setActiveBlockType] = useState<BlockType | null>(
    null
  );

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (blocks.length === 0) {
      newErrors.blocks = "At least one content block is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddBlock = (type: BlockType) => {
    setActiveBlockType(type);

    if (type === BlockType.TEXT) {
      setBlocks([...blocks, { type, value: "", caption: "" }]);
    }
  };

  const handleTextChange = (index: number, value: string) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index].value = value;
    setBlocks(updatedBlocks);
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index].caption = caption;
    setBlocks(updatedBlocks);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: BlockType
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsSubmitting(true);
      const response = await uploadFileAPI(formData);

      // Add the new block with the uploaded file data
      setBlocks([
        ...blocks,
        {
          type,
          value: response.data.value,
          caption: "",
          metadata: response.data.metadata,
        },
      ]);

      setActiveBlockType(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveBlock = (index: number) => {
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index, 1);
    setBlocks(updatedBlocks);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const contentData: CreateContentDto = {
        title,
        description,
        blocks,
      };

      await createContentAPI(contentData);

      // Reset form and close modal
      setTitle("");
      setDescription("");
      setBlocks([]);
      setErrors({});
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating content:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBlockInput = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case BlockType.TEXT:
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            value={block.value}
            onChange={(e) => handleTextChange(index, e.target.value)}
            placeholder="Enter text content..."
            variant="outlined"
          />
        );
      case BlockType.IMAGE:
      case BlockType.VIDEO:
        return (
          <Box sx={{ width: "100%" }}>
            {block.metadata?.url && (
              <Box sx={{ mb: 2 }}>
                {block.type === BlockType.IMAGE ? (
                  <img
                    src={block.metadata.url || "/placeholder.svg"}
                    alt={block.caption || "Content image"}
                    style={{ maxWidth: "100%", maxHeight: "300px" }}
                  />
                ) : (
                  <video
                    src={block.metadata.url}
                    controls
                    style={{ maxWidth: "100%", maxHeight: "300px" }}
                  />
                )}
              </Box>
            )}
            <Typography variant="body2" color="text.secondary">
              {block.metadata?.originalName || "File uploaded successfully"}
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "8px" },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Create New Content</Typography>
        <IconButton aria-label="close" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
          />

          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Description"
            name="description"
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Content Blocks
            </Typography>

            {errors.blocks && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {errors.blocks}
              </Typography>
            )}

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid>
                <Button
                  variant="outlined"
                  startIcon={<TextFieldsIcon />}
                  onClick={() => handleAddBlock(BlockType.TEXT)}
                  size="small"
                >
                  Add Text
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  startIcon={<ImageIcon />}
                  onClick={() => handleAddBlock(BlockType.IMAGE)}
                  component="label"
                  size="small"
                >
                  Add Image
                  {activeBlockType === BlockType.IMAGE && (
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, BlockType.IMAGE)}
                    />
                  )}
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  startIcon={<VideocamIcon />}
                  onClick={() => handleAddBlock(BlockType.VIDEO)}
                  component="label"
                  size="small"
                >
                  Add Video
                  {activeBlockType === BlockType.VIDEO && (
                    <input
                      type="file"
                      hidden
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, BlockType.VIDEO)}
                    />
                  )}
                </Button>
              </Grid>
            </Grid>

            {blocks.length > 0 ? (
              blocks.map((block, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2">
                      {block.type.charAt(0).toUpperCase() + block.type.slice(1)}{" "}
                      Block
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveBlock(index)}
                      aria-label="delete block"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {renderBlockInput(block, index)}

                  <TextField
                    margin="normal"
                    fullWidth
                    label="Caption (optional)"
                    size="small"
                    value={block.caption || ""}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                  />
                </Paper>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                No content blocks added yet. Use the buttons above to add
                content.
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? "Creating..." : "Create Content"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateContentModal;
