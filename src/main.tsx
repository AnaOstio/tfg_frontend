import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import ReactQuery from './config/ReactQuery.tsx'
import { RouterProvider } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner.tsx'
import router from './config/router.tsx'
import 'antd/dist/reset.css'
import './styles/antd-custom.css';
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ReactQuery>
        <Suspense fallback={<LoadingSpinner />}>
          <RouterProvider router={router} />
        </Suspense>
      </ReactQuery>
    </Provider>
  </StrictMode>,
)
