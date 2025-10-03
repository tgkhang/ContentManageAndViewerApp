import { useState } from "react";
import { createUserAPI } from "../../utils/api";
import Page from "../../components/Page";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import WorkIcon from "@mui/icons-material/Work";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LockIcon from "@mui/icons-material/Lock";

// User DTO types
interface CreateUserDto {
  name: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "editor" | "client";
  createdBy?: string;
}

export default function CreateNewUserPage() {
  // Form state
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("client");

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value);
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setSnackbarMessage("Please fill in all required fields");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSnackbarMessage("Please enter a valid email address");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      return;
    }

    const userData: CreateUserDto = {
      name,
      username,
      email,
      password,
      role: role as "admin" | "editor" | "client",
    };

    try {
      setIsLoading(true);
      await createUserAPI(userData);

      setSnackbarMessage("User added successfully!");
      setSnackbarSeverity("success");
      setShowSnackbar(true);
      handleClearForm();
    } catch (error: any) {
      console.error("Error adding user:", error);
      setSnackbarMessage(error.response?.data?.message || "Failed to add user");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearForm = () => {
    setName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setRole("client");
  };

  return (
    <Page title="Create New User">
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 1200,
          mx: "auto",
          mt: 10,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <WorkIcon sx={{ mr: 2, color: "primary.main", fontSize: 32 }} />
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: "primary.main" }}
          >
            Create New User
          </Typography>
        </Box>
        <Divider sx={{ mb: 4 }} />

        {/* Personal Information Section */}
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 500, color: "primary.main" }}
        >
          <ContactMailIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Personal Information
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid>
            <TextField
              required
              fullWidth
              id="name"
              name="name"
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid>
            <TextField
              required
              fullWidth
              id="username"
              name="username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid>
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid>
            <FormControl fullWidth required>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                label="Role"
                onChange={handleRoleChange}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
                <MenuItem value="client">Client</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Password Section */}
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 500, color: "primary.main" }}
        >
          <LockIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Security Information
        </Typography>

        <Grid container spacing={3}>
          <TextField
            required
            id="password"
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Submit Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClearForm}
            startIcon={<ClearIcon />}
            disabled={isLoading}
          >
            Clear Form
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            endIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            disabled={
              isLoading ||
              !name.trim() ||
              !username.trim() ||
              !email.trim() ||
              !password.trim()
            }
          >
            {isLoading ? "Saving..." : "Create User"}
          </Button>
        </Box>
      </Paper>

      {/* Notification Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Page>
  );
}
