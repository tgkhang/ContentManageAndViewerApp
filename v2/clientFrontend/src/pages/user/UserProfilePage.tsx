import { useState, useEffect } from "react";
import { updateCurrentUserAPI, changePasswordAPI } from "../../utils/api";
import { setSession } from "../../utils/jwt";
import Page from "../../components/Page";
import useAuth from "../../hooks/useAuth";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Snackbar,
  TextField,
  Typography,
  Container,
  Tab,
  Tabs,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserProfilePage() {
  const { user, setUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  // Profile form state
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // UI state
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const handleUpdateProfile = async () => {
    // Basic validation
    if (!name.trim() || !username.trim() || !email.trim()) {
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

    const profileData = {
      name,
      username,
      email,
    };

    try {
      setIsLoadingProfile(true);
      const response = await updateCurrentUserAPI(profileData);

      console.log("Profile update response:", response.data);

      // Update JWT token with the new one from response
      if (response.data.access_token) {
        console.log("Updating token in localStorage");
        setSession(response.data.access_token);
      } else {
        console.warn("No access_token in response!");
      }

      // Update user context with the response data
      if (user && response.data.user) {
        const userData = response.data.user;
        const updatedUser = {
          ...user,
          id: userData._id || userData.id || user.id,
          name: userData.name,
          username: userData.username,
          email: userData.email,
        };
        console.log("Updated user:", updatedUser);
        setUser(updatedUser);

        // Also update local state
        setName(updatedUser.name);
        setUsername(updatedUser.username);
        setEmail(updatedUser.email);
      } else {
        console.warn("No user data in response!");
      }

      setSnackbarMessage("Profile updated successfully!");
      setSnackbarSeverity("success");
      setShowSnackbar(true);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setSnackbarMessage(
        error.response?.data?.message || "Failed to update profile"
      );
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    // Basic validation
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setSnackbarMessage("Please fill in all password fields");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      return;
    }

    // Password match validation
    if (newPassword !== confirmPassword) {
      setSnackbarMessage("New passwords do not match");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      return;
    }

    // Password strength validation
    if (newPassword.length < 6) {
      setSnackbarMessage("New password must be at least 6 characters long");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      return;
    }

    const passwordData = {
      currentPassword,
      newPassword,
    };

    try {
      setIsLoadingPassword(true);
      await changePasswordAPI(passwordData);

      setSnackbarMessage("Password changed successfully!");
      setSnackbarSeverity("success");
      setShowSnackbar(true);

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error changing password:", error);
      setSnackbarMessage(
        error.response?.data?.message || "Failed to change password"
      );
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    } finally {
      setIsLoadingPassword(false);
    }
  };

  return (
    <Page title="User Profile">
      <Container maxWidth="md" sx={{ mt: 10, pb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 3, bgcolor: "primary.main", color: "white" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PersonIcon sx={{ mr: 2, fontSize: 32 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                My Profile
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
              Manage your account information and security settings
            </Typography>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
              <Tab label="Profile Information" />
              <Tab label="Change Password" />
            </Tabs>
          </Box>

          {/* Profile Information Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ px: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 3, fontWeight: 500, color: "primary.main" }}
              >
                Personal Information
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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

                <TextField
                  fullWidth
                  id="role"
                  name="role"
                  label="Role"
                  value={user?.role || ""}
                  variant="outlined"
                  disabled
                  helperText="Your role cannot be changed"
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "rgba(0, 0, 0, 0.6)",
                    },
                  }}
                />
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateProfile}
                  endIcon={
                    isLoadingProfile ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  disabled={
                    isLoadingProfile ||
                    !name.trim() ||
                    !username.trim() ||
                    !email.trim()
                  }
                  sx={{ px: 4 }}
                >
                  {isLoadingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </Box>
          </TabPanel>

          {/* Change Password Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ px: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 1, fontWeight: 500, color: "primary.main" }}
              >
                <LockIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Change Password
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Ensure your password is strong and secure
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  required
                  fullWidth
                  id="currentPassword"
                  name="currentPassword"
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  variant="outlined"
                  autoComplete="current-password"
                />

                <TextField
                  required
                  fullWidth
                  id="newPassword"
                  name="newPassword"
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  variant="outlined"
                  helperText="Password must be at least 6 characters long"
                  autoComplete="new-password"
                />

                <TextField
                  required
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  variant="outlined"
                  error={
                    confirmPassword.length > 0 && newPassword !== confirmPassword
                  }
                  helperText={
                    confirmPassword.length > 0 && newPassword !== confirmPassword
                      ? "Passwords do not match"
                      : ""
                  }
                  autoComplete="new-password"
                />
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleChangePassword}
                  endIcon={
                    isLoadingPassword ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <LockIcon />
                    )
                  }
                  disabled={
                    isLoadingPassword ||
                    !currentPassword.trim() ||
                    !newPassword.trim() ||
                    !confirmPassword.trim() ||
                    newPassword !== confirmPassword
                  }
                  sx={{ px: 4 }}
                >
                  {isLoadingPassword ? "Changing..." : "Change Password"}
                </Button>
              </Box>
            </Box>
          </TabPanel>
        </Paper>
      </Container>

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
