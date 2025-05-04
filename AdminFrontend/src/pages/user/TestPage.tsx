import { Paper } from "@mui/material";

export default function TestPage() {
  return (
    //<Page title="Append Teacher">
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        mt: 7,
        borderRadius: 2,
      }}
    >
      <h1>Test Page</h1>
      <p>This is a test page.</p>
    </Paper>
    // </Page>
  );
}
