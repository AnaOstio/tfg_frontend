import './i18n';
import Navbar from './components/common/NavBar';
import { RouterProvider } from 'react-router-dom';
import router from './config/router';;
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <Navbar />
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;
