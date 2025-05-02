import { Navigate, useRoutes } from "react-router-dom";
import { lazy, Suspense } from "react";
import GuestGuard from "../guards/GuestGuard";
import LoadingScreen from "../components/LoadingScreen";
import AuthGuard from "../guards/Authguard";

// Lazy load components
const Loadable = (Component:any) => {
  const WrappedComponent = (props:any) => {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Component {...props} />
      </Suspense>
    );
  };

  WrappedComponent.displayName = `Loadable(${Component.name || "Component"})`;
  return WrappedComponent;
};

// AUTHENTICATION
const Login = Loadable(lazy(() => import("../pages/authentication/Login")));

// MAINLAYOUT
const MainLayout = Loadable(lazy(() => import("../components/layout/MainLayout")));

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
          element: <Navigate to="/admin/studentList" replace />,
        },
        // {
        //   path: "studentList",
        //   element: <StudentListPage />,
        // },
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
        { path: "", element: <Navigate to="/editor/dashboard" replace /> },
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
    
    // 404 and catch all
    {
      path: "*",
      element: <Navigate to="/auth/login" replace />,
    },
  ]);
}