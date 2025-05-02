import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import ReactQuery from './config/ReactQuery.tsx'
import { RouterProvider } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner.tsx'
import router from './config/Router.tsx'
import 'antd/dist/reset.css'
import './styles/antd-custom.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQuery>
      <Suspense fallback={<LoadingSpinner />}>
        <RouterProvider router={router} />
      </Suspense>
    </ReactQuery>
  </StrictMode>,
)
