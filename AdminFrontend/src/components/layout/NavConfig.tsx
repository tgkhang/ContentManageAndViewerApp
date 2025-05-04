import { Dashboard, AccountCircle, Group } from "@mui/icons-material";

const navEditorConfig = [
  { title: "Content", path: "/editor/content", icon: <Dashboard /> },
];

const navAdminConfig = [
  { title: "User List", path: "/admin/user", icon: <Group /> },
  {
    title: "Content List",
    path: "/admin/content",
    icon: <AccountCircle />,
  },
];

export { navEditorConfig, navAdminConfig };
