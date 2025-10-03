import { Dashboard, AccountCircle, Group, Book } from "@mui/icons-material";

const navEditorConfig = [
  { title: "Content", path: "/editor/contents", icon: <Dashboard /> },
];
const navClientConfig = [{ title: "Home", path: "/", icon: <Dashboard /> }];

const navAdminConfig = [
  { title: "User List", path: "/admin/users", icon: <Group /> },
  {
    title: "Content List",
    path: "/admin/contents",
    icon: <Book />,
  },
];

export { navClientConfig, navEditorConfig, navAdminConfig };
