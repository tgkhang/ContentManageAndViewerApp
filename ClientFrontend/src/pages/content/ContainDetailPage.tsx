import Page from "../../components/Page";
import { BlockType, Content, ContentCardProps } from "../../types/content";
import {
  Box,
  Typography,
} from "@mui/material";

import { getContentByIdAPI } from "../../utils/api";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { websocketService } from "../../services/websocket.service";

export default function ContentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchContent = async () => {
      try {
        const res = await getContentByIdAPI(id);
        setContent(res.data);
      } catch (err) {
        console.error("Failed to fetch content", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    websocketService.connect();
    websocketService.joinContentRoom(id);

    const handleContentUpdate = (updatedContent: Content) => {
      if (updatedContent._id === id) {
        setContent(updatedContent);
      }
    };

    websocketService.onContentUpdate(handleContentUpdate);
    return () => {
      websocketService.leaveContentRoom(id);
      websocketService.removeContentUpdateListener(handleContentUpdate);
    };
  }, [id]);

  return (
    <Page title="Content Detail">
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "16px",
          mt:10
        }}
      >
        <Typography variant="h6">{content?.title}</Typography>
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          {content?.description || "No description available."}
        </Typography>

        {content?.blocks.map((block, index) => {
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
              );

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
              );

            default:
              return null;
          }
        })}
      </Box>
    </Page>
  );
}
