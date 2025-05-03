import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import ReactQuery from './config/ReactQuery.tsx'
import LoadingSpinner from './components/LoadingSpinner.tsx'
import 'antd/dist/reset.css'
import './styles/antd-custom.css';
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ReactQuery>
          <Suspense fallback={<LoadingSpinner />}>
            <App />
          </Suspense>
        </ReactQuery>
      </PersistGate>
    </Provider>
  </StrictMode>
)
