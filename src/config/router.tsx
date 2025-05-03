import { createBrowserRouter } from "react-router-dom";
import React from "react";
import RootLayout from "../RootLayout";
import ProtectedRoute from "./ProtectedRouter";

const NotFoundPage = React.lazy(() => import("../components/NotFoundPage"));
const LoginPage = React.lazy(() => import("../pages/users/LoginPage"));
const SignUpPage = React.lazy(() => import("../pages/users/SignUpPage"));
const Dashboard = React.lazy(() => import("../pages/dashboard/DashboardPage"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />, // NavBar incluido aquí
        children: [
            {
                index: true,
                element: <LoginPage />,
            },
            {
                path: "/signup",
                element: <SignUpPage />,
            },
            {
                path: "/dashboard",
                element: (
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
]);

export default router;