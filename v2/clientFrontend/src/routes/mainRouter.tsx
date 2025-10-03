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

const ClientContentPage = Loadable(
  lazy(() => import("../pages/content/ClientContentPage"))
);
const ContentDetailPage = Loadable(
  lazy(() => import("../pages/content/ContentDetailPage"))
);
const UserProfilePage = Loadable(
  lazy(() => import("../pages/user/UserProfilePage"))
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

    // Client Routes (view-only)
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
          element: <Navigate to="/client/contents" replace />,
        },
        {
          path: "contents",
          element: <ClientContentPage />,
        },
        {
          path: "content/:id",
          element: <ContentDetailPage />,
        },
        {
          path: "profile",
          element: <UserProfilePage />,
        },
      ],
    },

    // Root redirect
    {
      path: "/",
      element: <Navigate to="/client/contents" replace />,
    },

    // 404
    {
      path: "*",
      element: <Navigate to="/client/contents" replace />,
    },
  ]);
}
