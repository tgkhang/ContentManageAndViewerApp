import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Box, styled, useTheme, useMediaQuery } from "@mui/material";
import MainHeader from "./MainHeader";
import MainSideBar from "./MainSidebar";

const MainStyle = styled("main")(({ theme }) => ({
  flexGrow: 1,
  minHeight: "100vh",
  paddingTop: 64,
  paddingBottom: 24,
  [theme.breakpoints.up("lg")]: {
    width: "100%",
    transition: theme.transitions.create("margin-left", {
      duration: theme.transitions.duration.shorter,
    }),
  },
  [theme.breakpoints.down("lg")]: {
    paddingTop: 56,
  },
}));

export default function MainLayout(): React.ReactElement | null {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [isCollapse, setCollapse] = useState<boolean>(!isMobile);

  useEffect(() => {
    setCollapse(!isMobile);
  }, [isMobile]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <MainHeader />

      <MainSideBar
        isOpenSidebar={isCollapse}
        onToggleSidebar={() => setCollapse(!isCollapse)}
      />

      <MainStyle>
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 3 },
            maxWidth: "100%",
            mx: "auto",
          }}
        >
          <Outlet />
        </Box>
      </MainStyle>
    </Box>
  );
}
