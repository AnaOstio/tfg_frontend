import './i18n';
import Navbar from './components/common/NavBar';
import { RouterProvider } from 'react-router-dom';
import router from './config/router';

function App() {

  return (
    <div>
      <Navbar />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
