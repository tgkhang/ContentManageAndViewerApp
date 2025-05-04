import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Popper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import useAuth from "../hooks/useAuth";

interface MenuItem {
  label: string;
  action: () => void;
}

interface ProfileMenuProps {
  user: {
    name?: string;
    role?: string;
  };
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

export default function ProfileMenu({
  user,
  anchorEl,
  open,
  onClose,
}: ProfileMenuProps): React.ReactElement {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
      onClose();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems: MenuItem[] = [
    { label: "Log Out", action: handleLogout }
  ];

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      disablePortal
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 8],
          },
        },
      ]}
      sx={{ zIndex: 1201 }}
    >
      <Paper sx={{ width: "20rem", p: 1, boxShadow: 3, borderRadius: 0 }}>
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={item.action}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Popper>
  );
}