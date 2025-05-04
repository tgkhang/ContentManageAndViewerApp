import { Paper, Typography, Divider, Box } from "@mui/material";
import Page from "../components/Page";
import useAuth from "../hooks/useAuth";

export default function TestPage() {
  const { user } = useAuth();

  return (
    <Page title="Client Dashboard">
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          mt: 7,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Client Dashboard
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="body1" paragraph>
          Welcome to the Content Viewing Portal. You are logged in as a{" "}
          <strong>{user?.role}</strong>.
        </Typography>

        {/* Role-specific suggestions */}
        {user?.role === "admin" && (
          <Typography variant="body2" color="info.main" sx={{ mb: 2 }}>
            You are an admin. Visit the <strong>/admin</strong> website to manage users and content.
          </Typography>
        )}

        {user?.role === "editor" && (
          <Typography variant="body2" color="info.main" sx={{ mb: 2 }}>
            You are an editor. Visit the <strong>editor</strong> website to create or update content.
          </Typography>
        )}

        {/* Client instructions */}
        <Box>
          <Typography variant="h6">What you can do:</Typography>
          <ul>
            <li>View content that has been approved and submitted by editors.</li>
            <li>Browse all available content in the <strong>Contents</strong> tab.</li>
            <li>Click on any item to view its full detail.</li>
          </ul>
        </Box>
      </Paper>
    </Page>
  );
}
