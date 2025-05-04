import { Navigate, useRoutes } from "react-router";
import { lazy, Suspense } from "react";
import GuestGuard from "../guards/GuestGuard";
import LoadingScreen from "../components/LoadingScreen";
import AuthGuard from "../guards/Authguard";

// Lazy load components
const Loadable = (Component: any) => {
  const WrappedComponent = (props: any) => {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Component {...props} />
      </Suspense>
    );
  };
  //debugging
  WrappedComponent.displayName = `Loadable(${Component.name || "Component"})`;
  return WrappedComponent;
};

// AUTHENTICATION
const Login = Loadable(lazy(() => import("../pages/authentication/Login")));

// MAINLAYOUT
const MainLayout = Loadable(
  lazy(() => import("../components/layout/MainLayout"))
);

const TestPage = Loadable(lazy(() => import("../pages/user/TestPage")));
const UserListPage = Loadable(lazy(() => import("../pages/user/UserListPage")));
const AdminContentPage = Loadable(
  lazy(() => import("../pages/content/AdminContentPage"))
);
const CreateNewUserPage = Loadable(
  lazy(() => import("../pages/user/CreateNewUserPage"))
);
const ContentDetailPage = Loadable(
  lazy(() => import("../pages/content/ContainDetailPage"))
);

export default function Router() {
  return useRoutes([
    // Auth Routes
    {
      path: "auth",
      children: [
        {
          path: "login",
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        { path: "", element: <Navigate to="/auth/login" replace /> },
      ],
    },

    // Admin Routes
    {
      path: "admin",
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: "",
          // element: <Navigate to="/admin/studentList" replace />,
          element: <TestPage />,
        },
        {
          path: "users",
          element: <UserListPage />,
        },
        {
          path: "contents",
          element: <AdminContentPage />,
        },
        {
          path: "content/:id", 
          element: <ContentDetailPage />,
        },
        {
          path: "createUser",
          element: <CreateNewUserPage />,
        },
      ],
    },

    // Editor Routes
    {
      path: "editor",
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: "",
          // element: <Navigate to="/admin/studentList" replace />,
          element: <TestPage />,
        },
        // {
        //   path: "course",
        //   element: <TeacherCoursePage />,
        // },
      ],
    },

    // Root redirect
    {
      path: "/",
      element: <Navigate to="/auth/login" replace />,
    },

    // 404
    {
      path: "*",
      element: <Navigate to="/auth/login" replace />,
    },
  ]);
}
