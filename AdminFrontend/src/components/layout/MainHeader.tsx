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
} from "@mui/material";
import ProfileMenu from "../ProfileMenu";
import { styled } from "@mui/material/styles";

const HeaderStyle = styled(AppBar)(({ theme }) => ({
  width: "100%",
  zIndex: theme.zIndex.drawer + 1,
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

  const handleToggleProfileMenu = (event: any) => {
    setAnchorProfile(event.currentTarget);
    setOpenProfileMenu((prev) => !prev);
  };

  const handleCloseProfileMenu = () => {
    setOpenProfileMenu(false);
  };

  return (
    <HeaderStyle position="fixed">
      <Toolbar sx={{ px: { xs: 2, sm: 3.5 } }}>
        <Typography sx={{ flexGrow: 1, fontWeight: 700, fontSize: "1.5rem" }}>
          Blog Management System
        </Typography>
        {isAuthenticated && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ClickAwayListener onClickAway={handleCloseProfileMenu}>
              <Box>
                <IconButton onClick={handleToggleProfileMenu}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      border: "2px solid",
                      //borderColor: "primary.main",
                      bgcolor: "primary.main",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 18,
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