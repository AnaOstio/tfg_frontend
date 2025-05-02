import { createBrowserRouter } from "react-router-dom";
import React from "react";
import ProtectedRoute from "./ProtectedRouter";

const NotFoundPage = React.lazy(() => import("../components/NotFoundPage"));
const LoginPage = React.lazy(() => import("../pages/users/LoginPage"));
const SignUpPage = React.lazy(() => import("../pages/users/SignUpPage"));
const Dashboard = React.lazy(() => import("../pages/dashboard/DashboardPage"));

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <LoginPage />
        ),
    },
    {
        path: "/signup",
        element: (
            <SignUpPage />
        ),
    },
    {
        path: "*",
        element: (
            <NotFoundPage />
        ),
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    }

]);

export default router;