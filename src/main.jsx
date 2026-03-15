
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {

  RouterProvider,
} from "react-router-dom";
import { router } from './Routes/Routes';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
 <div className="">
   <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
 </div>
   
   </StrictMode>
)
