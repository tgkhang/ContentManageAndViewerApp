import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Popper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import useAuth from "../hooks/useAuth";

interface MenuItem {
  label: string;
  action: () => void;
  icon?: React.ReactNode;
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
    { 
      label: "Log Out", 
      action: handleLogout,
      icon: <LogoutIcon fontSize="small" />
    }
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
      <Paper 
        sx={{ 
          width: "20rem", 
          p: 0,
          boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)',
          borderRadius: 1,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 2, bgcolor: 'background.neutral' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user?.name || "Unknown"}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {user?.role || "unknown"}
          </Typography>
        </Box>
        
        <Divider />
        
        <List sx={{ p: 0 }}>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={item.action}
                sx={{
                  py: 1.5,
                  px: 2,
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                {item.icon && (
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {item.icon}
                  </ListItemIcon>
                )}
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: 500
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Popper>
  );
}