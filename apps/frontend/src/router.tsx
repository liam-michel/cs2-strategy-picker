import { createRootRouteWithContext, createRoute, redirect } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { queryClient } from './lib/providers/queryclient'
import { ModeToggle } from './components/mode-toggle'
import Signup from './pages/signup/SignUp'
import Login from './pages/login/Login'
import { authClient } from './lib/auth-client'
import About from './pages/about/About'
import UserStrategies from './pages/user-strategies/UserStrategies'
import { MainLayout } from './layouts/MainLayout'
export interface User {
  id: string
  name: string
  email: string
}
export interface RouterContext {
  queryClient: QueryClient
}

const redirectIfAuthenticated = async () => {
  const authResult = await authClient.getSession()
  if (authResult.data?.session) {
    throw redirect({ to: '/dashboard' })
  }
}

const redirectIfUnauthenticated = async (): Promise<{ user: User }> => {
  const authResult = await authClient.getSession()
  if (!authResult.data?.session) {
    throw redirect({ to: '/login' })
  }
  const contextUser: User = {
    id: authResult.data.user.id,
    name: authResult.data.user.name || '',
    email: authResult.data.user.email || '',
  }
  return {
    user: contextUser as User,
  }
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
  beforeLoad: redirectIfAuthenticated,
})

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'signup',
  component: Signup,
  beforeLoad: redirectIfAuthenticated,
})

const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: MainLayout,
  beforeLoad: redirectIfUnauthenticated,
})
// Dashboard is now a child of the layout, not root
const dashboardRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute, // ← parent is layout, not root
  path: 'dashboard',
  component: () => <div>Dashboard</div>,
})

const userRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: 'me',
  component: UserStrategies,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  loginRoute,
  signUpRoute,
  protectedLayoutRoute.addChildren([
    // ← layout wraps its children
    dashboardRoute,
    userRoute,
  ]),
])
export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
})

export { rootRoute, protectedLayoutRoute }
declare module '@tanstack/react-router' {
  export interface RegisterRouter {
    router: typeof router
  }
}
