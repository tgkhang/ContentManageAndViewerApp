import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { Box, styled } from "@mui/material";
import MainHeader from "./MainHeader";
import MainSideBar from "./MainSidebar";

const MainStyle = styled("main")(({ theme }) => ({
  flexGrow: 1,

  [theme.breakpoints.up("lg")]: {
    width: "100%",
    transition: theme.transitions.create("margin-left", {
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

export default function MainLayout(): React.ReactElement | null {
  const { user } = useAuth();

  const [isCollapse, setCollapse] = useState<boolean>(true);

  return (
    <Box
      sx={{
        display: { lg: "flex" },
        minHeight: { lg: 1 },
      }}
    >
      <MainHeader />

      <MainSideBar
        isOpenSidebar={isCollapse}
        onToggleSidebar={() => setCollapse(!isCollapse)}
      />

      <MainStyle sx={{ height: "calc(100vh - 64px)" }}>
        <Outlet />
      </MainStyle>
    </Box>
  );
}
