import { Dashboard, AccountCircle, Group, Book } from "@mui/icons-material";

const navEditorConfig = [
  { title: "Content", path: "/editor/content", icon: <Dashboard /> },
];

const navAdminConfig = [
  { title: "User List", path: "/admin/users", icon: <Group /> },

  {
    title: "Creat New User",
    path: "/admin/createUser",
    icon: <AccountCircle />,
  },
  {
    title: "Content List",
    path: "/admin/contents",
    icon: <Book />,
  },
];

export { navEditorConfig, navAdminConfig };
