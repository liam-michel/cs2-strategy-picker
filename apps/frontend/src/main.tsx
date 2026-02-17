import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Providers from './lib/providers'
import { router } from './router'
import { RouterProvider } from '@tanstack/react-router'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
)
