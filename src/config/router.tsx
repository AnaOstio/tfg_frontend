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
const AddSubjectPage = React.lazy(() => import("../pages/subjects/SubjectForm"));
const TitleMemoryDetails = React.lazy(() => import("../pages/titleMemory/TitleMemoryDetails"));
const SubjectDetails = React.lazy(() => import("../pages/subjects/SubjectDetails"));
const UploadSubjectsScreen = React.lazy(() => import("../pages/subjects/upload/UploadSubjectsScreen"));

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
                path: "/add-subject/:id",
                element: (
                    <ProtectedRoute>
                        <AddSubjectPage />
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
                path: "/upload-subjects",
                element: (
                    <ProtectedRoute>
                        <UploadSubjectsScreen />
                    </ProtectedRoute>
                )
            },
            {
                path: "/title-memory/details/:id",
                element: (
                    <ProtectedRoute>
                        <TitleMemoryDetails />
                    </ProtectedRoute>
                )
            },
            {
                path: "/title-memory/details/:id/subjects/:subjectId",
                element: (
                    <ProtectedRoute>
                        <SubjectDetails />
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