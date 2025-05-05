import { useLocation } from "react-router-dom";
import { Paper, Typography, Divider, Box } from "@mui/material";
import Page from "../../components/Page";

export default function TestPage() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isEditor = location.pathname.startsWith("/editor");
  const isClient = location.pathname.startsWith("/client");

  if (isClient)
    return (
      <>
        <Page title="Dashboard">
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              mt: 7,
              borderRadius: 2,
            }}
          >
            <Typography variant="h4" gutterBottom>
              This is page for admin client can not acess anything here
            </Typography>
          </Paper>
        </Page>
      </>
    );

  return (
    <Page title="Dashboard">
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          mt: 7,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          {isAdmin
            ? "Admin Dashboard"
            : isEditor
            ? "Editor Dashboard"
            : "Dashboard"}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="body1" paragraph>
          Welcome to the Content Management System. This app is designed to help
          you manage users and digital content efficiently.
        </Typography>

        {isAdmin && (
          <Box>
            <Typography variant="h6">
              You are logged in as: <strong>Admin</strong>
            </Typography>
            <ul>
              <li>Manage users (create, edit, assign roles)</li>
              <li>Manage and approve content</li>
            </ul>
          </Box>
        )}

        {isEditor && (
          <Box>
            <Typography variant="h6">
              You are logged in as: <strong>Editor</strong>
            </Typography>
            <ul>
              <li>Create and edit content blocks (text, image, video)</li>
              <li>Preview and submit content for display</li>
            </ul>
          </Box>
        )}
      </Paper>
    </Page>
  );
}
