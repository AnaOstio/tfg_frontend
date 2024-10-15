import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/users/LoginPage";
import SignUpPage from "../pages/users/SignUpPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />,
    },
    {
        path: "/signup",
        element: <SignUpPage />,
    }
]);

export default router;
