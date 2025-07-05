import { RouterProvider } from 'react-router-dom';
import router from './config/router';
import { useEffect, useRef } from 'react';
import { fetchUniversities } from './redux/slices/universitiesSlice';
import { AppDispatch } from './redux/store';
import { useDispatch } from 'react-redux';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const dispatch = useDispatch<AppDispatch>();
    const didRun = useRef(false);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;
        dispatch(fetchUniversities());
    }, [dispatch]);

    return (
        <>
            <RouterProvider router={router} />

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
            />
        </>
    );
}

export default App;
