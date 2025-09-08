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

const TestPage = Loadable(lazy(() => import("../pages/TestPage")));
const ContentPage = Loadable(
  lazy(() => import("../pages/content/ContentPage"))
);
const ContentDetailPage = Loadable(
  lazy(() => import("../pages/content/ContentDetailPage"))
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

    // client route
    {
      path: "client",
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
          path: "contents",
          element: <ContentPage />,
        },
        {
          path: "content/:id",
          element: <ContentDetailPage />,
        },
      ],
    },
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
          path: "contents",
          element: <ContentPage />,
        },
        {
          path: "content/:id",
          element: <ContentDetailPage />,
        },
      ],
    },
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
        {
          path: "contents",
          element: <ContentPage />,
        },
        {
          path: "content/:id",
          element: <ContentDetailPage />,
        },
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
