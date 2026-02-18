import { createRootRouteWithContext, createRoute, redirect } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import type { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { queryClient } from './lib/providers/queryclient'
import { ModeToggle } from './components/mode-toggle'
import Signup from './pages/signup/SignUp'
import Login from './pages/login/Login'
import { authClient } from './lib/auth-client'
import { SignOutButton } from './components/signout'
export interface RouterContext {
  queryClient: QueryClient
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <div className="fixed top-4 right-4 z-50">
        <ModeToggle />
      </div>

      <Outlet />
    </>
  ),
})
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
  component: Login,
})

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'signup',
  component: Signup,
})

const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected', // ← use id instead of path for pathless layouts
  component: () => (
    <>
      <div className="fixed top-4 left-4 z-50">
        <SignOutButton />
      </div>
      <Outlet />
    </>
  ),
  loader: async () => {
    const authResult = await authClient.getSession()
    if (!authResult.data?.session) {
      throw redirect({ to: '/login' })
    }
  },
})
// Dashboard is now a child of the layout, not root
const dashboardRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute, // ← parent is layout, not root
  path: 'dashboard',
  component: Dashboard,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  loginRoute,
  signUpRoute,
  protectedLayoutRoute.addChildren([
    // ← layout wraps its children
    dashboardRoute,
  ]),
])
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
