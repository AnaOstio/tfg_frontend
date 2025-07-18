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
const UploadTitleMemories = React.lazy(() => import("../pages/titleMemory/upload/UploadTitleMemories"));
const SimilarityReview = React.lazy(() => import("../pages/similarities/SimilarityReview"));

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
                element: <TitleMemoryForm mode="add" />,
            },
            {
                path: '/edit-title-memory/:id',
                element: <TitleMemoryForm mode="edit" />,
            },
            {
                path: '/clone-title-memory/:id',
                element: <TitleMemoryForm mode="clone" />,
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
                        <AddSubjectPage mode="add" />
                    </ProtectedRoute>
                )
            },
            {
                path: "/edit-subject/:id/:subjectId",
                element: (
                    <ProtectedRoute>
                        <AddSubjectPage mode="edit" />
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
                path: "/upload-title-memories",
                element: (
                    <ProtectedRoute>
                        <UploadTitleMemories />
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
                path: "/check-similiraties",
                element: (
                    <ProtectedRoute>
                        <SimilarityReview type="skills" />
                    </ProtectedRoute>
                )
            },
            {
                path: "/check-similiraties-los",
                element: (
                    <ProtectedRoute>
                        <SimilarityReview type="los" />
                    </ProtectedRoute>
                )
            },
            {
                path: "/not-found",
                element: <NotFoundPage />,
            },
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
]);

export default router;