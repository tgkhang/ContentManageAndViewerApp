import { useState, useEffect, useCallback } from "react";
import { getAllUsersAPI, updateUserAPI, deleteUserAPI } from "../../utils/api";
import Page from "../../components/Page";
import { UpdateUserDto } from "../../types/user";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useAuth from "../../hooks/useAuth";

// User interface based on the API response
interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // For edit functionality
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UpdateUserDto>({});

  // For delete functionality
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // For notifications
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    if (isFetching) return; // Prevent multiple fetches

    try {
      setIsFetching(true);
      setLoading(true);
      setError(null);

      const response = await getAllUsersAPI();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load users. Please try again.");
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
      setIsFetching(false);
      setInitialLoading(false);
    }
  };

  // Handle edit user
  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      updatedBy: user._id,
    });
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditingUser(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | any>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      await updateUserAPI(editingUser._id, formData);
      setEditDialogOpen(false);
      setEditingUser(null);
      fetchUsers();
      setSnackbarMessage("User updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error updating user:", err);
      setSnackbarMessage("Failed to update user");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteClick = useCallback((user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteDialogClose = useCallback(() => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!userToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteUserAPI(userToDelete._id);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userToDelete._id)
      );
      setSnackbarMessage("User deleted successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error deleting user:", err);
      setSnackbarMessage("Failed to delete user");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  }, [userToDelete]);

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  return (
    <Page title="User Management">
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Box sx={{ my: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: "primary.main" }}
          >
            User List
          </Typography>
        </Box>

        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading state */}
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          /* User Table */
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="user table">
              <TableHead >
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        onClick={() => handleEditClick(user)}
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(user)}
                        startIcon={<DeleteIcon />}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      {/* Edit User Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username || ""}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              select
              label="Role"
              name="role"
              value={formData.role || ""}
              onChange={handleInputChange}
              SelectProps={{
                native: true,
              }}
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="client">Client</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button
            onClick={handleUpdateUser}
            variant="contained"
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm User Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user {userToDelete?.name} (
            {userToDelete?.username})? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={
              deleteLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {deleteLoading ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for operation feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Page>
  );
}
