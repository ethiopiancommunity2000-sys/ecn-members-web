import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '../../clinet-app/src/app/layout/style.css';
import './app/layout/style.css'



import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { store, StoreContext } from './app/stores/store.ts';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Routes.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>

       <StoreContext.Provider value={store}>
         <RouterProvider router={router} />
     </StoreContext.Provider>
  </StrictMode>,
)
