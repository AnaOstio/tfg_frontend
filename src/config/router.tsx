import { createBrowserRouter } from "react-router-dom";
import React from "react";
import RootLayout from "../RootLayout";
import ProtectedRoute from "./ProtectedRouter";
import SuccessPage from "../components/SuccesPage";
import ErrorPage from "../components/ErrorPage";
import TitleMemoryForm from "../pages/titleMemory/TitleMemoryForm";

const NotFoundPage = React.lazy(() => import("../components/NotFoundPage"));
const LoginPage = React.lazy(() => import("../pages/users/LoginPage"));
const SignUpPage = React.lazy(() => import("../pages/users/SignUpPage"));
const Dashboard = React.lazy(() => import("../pages/dashboard/DashboardPage"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
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
                path: '/title-memory',
                element: <TitleMemoryForm />,
            },
            {
                path: "/success",
                element: <SuccessPage
                    title="Asignatura añadida con éxito"
                    description="Si desea añadir más asignaturas, pulse el siguiente botón"
                    addMoreButtonText="Añadir Asignaturas"
                    backToListButtonText="Volver al listado de Asignaturas"
                />,
            },
            {
                path: "/error",
                element: <ErrorPage />,
            },
            {
                path: "/dashboard",
                element: (
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                )
            },
            {
                path: "/my-title-memory",
                element: (
                    <ProtectedRoute>
                        <Dashboard fromUser />
                    </ProtectedRoute>
                )

            },
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
]);

export default router;