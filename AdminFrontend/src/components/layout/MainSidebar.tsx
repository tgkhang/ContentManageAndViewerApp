import { useContext } from "react";
import { NavLink as RouterLink } from "react-router-dom";
// @mui
import {
  Box,
  List,
  Drawer,
  Divider,
  Typography,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// icons
import MenuIcon from "@mui/icons-material/Menu";
import { navAdminConfig, navEditorConfig } from "./NavConfig";
import { AuthContext } from "../../contexts/JWTContext";

// Types
interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

interface NavItemProps {
  item: NavItem;
  isOpenSidebar: boolean;
}

interface MainSideBarProps {
  isOpenSidebar: boolean;
  onToggleSidebar: () => void;
}

// Constants
const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 88;

const ListItemIconStyle = styled(ListItemIcon)(({ theme }) => ({
  width: 24,
  height: 24,
  color: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: theme.transitions.create(["width", "height"], {
    duration: theme.transitions.duration.shorter,
  }),
}));

// Navigation Item Component
function NavItem({ item, isOpenSidebar }: NavItemProps): React.ReactElement {
  const { title, path, icon } = item;

  const listItemButton = (
    <ListItemButton
      component={RouterLink}
      to={path}
      sx={{
        height: 48,
        position: "relative",
        textTransform: "capitalize",
        color: "text.secondary",
        borderRadius: 1,
        mx: 1,
        my: 0.5,
        "&.active": {
          color: "primary.main",
          bgcolor: "primary.lighter",
          fontWeight: "fontWeightBold",
          "&:before": {
            content: '""',
            width: 4,
            height: "100%",
            position: "absolute",
            left: 0,
            top: 0,
            bgcolor: "primary.main",
            borderRadius: "0 4px 4px 0",
          },
        },
        "&:hover": {
          bgcolor: "action.hover",
          color: "primary.main",
        },
        justifyContent: isOpenSidebar ? "center" : "flex-start",
        px: 2,
        py: 1.5,
      }}
    >
      <ListItemIconStyle>{icon}</ListItemIconStyle>
      {!isOpenSidebar && (
        <ListItemText
          primary={title}
          primaryTypographyProps={{
            fontSize: 14,
            fontWeight: "medium",
          }}
        />
      )}
    </ListItemButton>
  );

  return isOpenSidebar ? (
    <Tooltip title={title} placement="right">
      {listItemButton}
    </Tooltip>
  ) : (
    listItemButton
  );
}

// Sidebar Component
export default function MainSideBar({
  isOpenSidebar,
  onToggleSidebar,
}: MainSideBarProps): React.ReactElement {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const navConfig = user?.role === "admin" ? navAdminConfig : navEditorConfig;

  const renderContent = (
    <>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isOpenSidebar ? "center" : "space-between",
          p: isOpenSidebar ? 1 : 2,
          minHeight: 64,
        }}
      >
        {isOpenSidebar ? (
          <IconButton
            onClick={onToggleSidebar}
            color="primary"
            sx={{
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <>
            <Typography
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "primary.main",
                letterSpacing: "0.5px",
              }}
            >
              Admin Panel
            </Typography>
            <IconButton
              onClick={onToggleSidebar}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </>
        )}
      </Box>

      <Divider sx={{ borderStyle: "dashed", mx: 2 }} />

      <List disablePadding sx={{ px: 1, py: 1 }}>
        {navConfig.map((item) => (
          <NavItem key={item.title} item={item} isOpenSidebar={isOpenSidebar} />
        ))}
      </List>

      {/* Spacer to push the user profile to the bottom */}
      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ mt: 2, mx: 2 }} />

      {/* User Profile Section */}
      <Box
        sx={{
          p: 2,
          mx: 1,
          my: 1,
          borderRadius: 1,
          backgroundColor: "primary.lighter",
          display: "flex",
          alignItems: "center",
          gap: "1em",
          justifyContent: isOpenSidebar ? "center" : "flex-start",
        }}
      >
        {!isOpenSidebar && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ color: "primary.main", fontWeight: 600 }}
            >
              {user?.name || "Unknown"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", textTransform: "capitalize" }}
            >
              {user?.role || "unknown"}
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );

  return (
    <Drawer
      open={!isMobile}
      variant={isMobile ? "temporary" : "permanent"}
      sx={{
        width: isOpenSidebar ? COLLAPSED_WIDTH : DRAWER_WIDTH,
        transition: theme.transitions.create("width", {
          duration: theme.transitions.duration.standard,
        }),
        "& .MuiDrawer-paper": {
          width: isOpenSidebar ? COLLAPSED_WIDTH : DRAWER_WIDTH,
          transition: theme.transitions.create("width", {
            duration: theme.transitions.duration.standard,
          }),
          bgcolor: "background.default",
          position: "fixed",
          height: "calc(100vh - 64px)",
          marginTop: "64px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          borderRight: "none",
        },
      }}
    >
      {renderContent}
    </Drawer>
  );
}
