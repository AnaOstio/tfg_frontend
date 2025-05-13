import { RouterProvider } from 'react-router-dom';
import router from './config/router';
import { useEffect } from 'react';
import { fetchUniversities } from './redux/slices/universitiesSlice';
import { AppDispatch } from './redux/store';
import { useDispatch } from 'react-redux';

function App() {
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {
        dispatch(fetchUniversities());
    }, [dispatch]);

    return <RouterProvider router={router} />;
}

export default App;