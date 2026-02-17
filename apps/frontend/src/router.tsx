import { createRootRouteWithContext, createRoute } from '@tanstack/react-router'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import type { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { queryClient } from './lib/queryclient'
export interface RouterContext {
  queryClient: QueryClient
}
const rootRoute = createRootRouteWithContext<RouterContext>()()
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <div>Home</div>,
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'about',
  component: About,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'login',
})

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'signup',
})

export const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'dashboard',
  component: Dashboard,
  loader: async () => {
    //TODO auth check
  },
})

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute, loginRoute, signUpRoute, protectedRoute])

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
})

declare module '@tanstack/react-router' {
  export interface RegisterRouter {
    router: typeof router
  }
}
