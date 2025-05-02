import { createBrowserRouter } from "react-router-dom";
import React from "react";

const NotFoundPage = React.lazy(() => import("../components/NotFoundPage"));
const LoginPage = React.lazy(() => import("../pages/users/LoginPage"));
const SignUpPage = React.lazy(() => import("../pages/users/SignUpPage"));

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
    }

]);

export default router;