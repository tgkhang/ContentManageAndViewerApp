import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import {
  Avatar,
  AppBar,
  Box,
  ClickAwayListener,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ProfileMenu from "../ProfileMenu";
import { styled } from "@mui/material/styles";

const HeaderStyle = styled(AppBar)(({ theme }) => ({
  width: "100%",
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function MainHeader(): React.ReactElement | null {
  const { user, isAuthenticated } = useAuth();
  const [openProfileMenu, setOpenProfileMenu] = useState<boolean>(false);
  const [anchorProfile, setAnchorProfile] = useState<HTMLElement | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleToggleProfileMenu = (event: any) => {
    setAnchorProfile(event.currentTarget);
    setOpenProfileMenu((prev) => !prev);
  };

  const handleCloseProfileMenu = () => {
    setOpenProfileMenu(false);
  };

  return (
    <HeaderStyle position="fixed">
      <Toolbar 
        sx={{ 
          px: { xs: 2, sm: 3.5 },
          minHeight: { xs: 56, sm: 64 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 700, 
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            color: 'primary.main',
            letterSpacing: '0.5px'
          }}
        >
          Contents
        </Typography>
        {isAuthenticated && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ClickAwayListener onClickAway={handleCloseProfileMenu}>
              <Box>
                <IconButton 
                  onClick={handleToggleProfileMenu}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                      border: "2px solid",
                      borderColor: "primary.main",
                      bgcolor: "primary.main",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: { xs: 14, sm: 18 },
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    {user?.name?.charAt(0) || ""}
                  </Avatar>
                </IconButton>

                <ProfileMenu
                  user={user as User}
                  anchorEl={anchorProfile}
                  open={openProfileMenu}
                  onClose={handleCloseProfileMenu}
                />
              </Box>
            </ClickAwayListener>
          </Box>
        )}
      </Toolbar>
    </HeaderStyle>
  );
}