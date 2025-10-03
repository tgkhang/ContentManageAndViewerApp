import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { loginAPI } from "../../utils/api";

import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!validateInput()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await loginAPI({ email, password });
      const { access_token, user: userData } = response.data;

      const user = {
        id: userData.userId,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        createdAt: "",
        updatedAt: "",
      };

      await login(access_token, user);

      // Navigate to client view
      navigate("/client/contents");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials or server error");
    } finally {
      setIsLoading(false);
    }
  };

  const validateInput = () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper
          elevation={8}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                m: 1,
                bgcolor: "primary.main",
                width: 56,
                height: 56,
              }}
            >
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography
              component="h1"
              variant="h4"
              sx={{ fontWeight: 600, color: "primary.main", mb: 1 }}
            >
              Content Viewer
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sign in to view content
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  width: "100%",
                  mb: 2,
                  borderRadius: 2,
                }}
              >
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleLogin}
              noValidate
              sx={{ width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: 2,
                  "&:hover": {
                    boxShadow: 4,
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
