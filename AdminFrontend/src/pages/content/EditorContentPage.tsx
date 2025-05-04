import type React from "react";
import { useEffect, useState } from "react";
import Page from "../../components/Page";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useAuth from "../../hooks/useAuth";
import type { Content } from "../../types/content";
import { getContentByUserIdAPI } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import type { ContentCardProps } from "../../types/content";
import CreateContentModal from "../../components/CreateContentModal";

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate(`/admin/content/${content.id}`)}
      sx={{
        mb: 2,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {/* Title */}
          <Typography
            variant="h6"
            color="primary"
            sx={{ fontWeight: "bold", fontSize: "1rem" }}
          >
            {content.title}
          </Typography>

          {/* Created By */}
          <Typography variant="body2" color="text.secondary">
            Created by: {content?.createdBy?.name || "Unknown"}
          </Typography>

          {/* Description */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {content.description || "No description available."}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function AdminContentPage() {
  const { user } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);
      setLoading(true);
      setError(null);

      //const response = await getAllContentsAPI();
      console.log(user?.id);
      const response = await getContentByUserIdAPI(user?.id);
      console.log("Fetched contents:", response.data);

      // Map _id to id
      setContents(
        response.data.map((item: any) => ({
          ...item,
          id: item._id,
        }))
      );
    } catch (err) {
      setError("Failed to load content. Please try again.");
      console.error("Error fetching content:", err);
      setContents([]);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    fetchContents();
  };

  return (
    <Page title="Editor Content">
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Your Content Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
          >
            Create New Content
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : contents.length > 0 ? (
          contents.map((item) => <ContentCard key={item.id} content={item} />)
        ) : (
          <Box sx={{ textAlign: "center", my: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No content available. Create your first content item!
            </Typography>
          </Box>
        )}

        <CreateContentModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      </Container>
    </Page>
  );
}
