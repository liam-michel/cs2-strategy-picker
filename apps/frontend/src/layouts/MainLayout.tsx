// ProtectedLayout.tsx
import { Outlet, Link } from '@tanstack/react-router'
import { SignOutButton } from '../components/signout'
import { ModeToggle } from '../components/mode-toggle'
import { protectedLayoutRoute } from '@/router'
import { AuthProvider } from '@/lib/providers/AuthContext'
export const MainLayout = () => {
  const { user } = protectedLayoutRoute.useRouteContext()
  const sidebarLinks = [
    { name: 'Dashboard', to: '/dashboard' },
    { name: 'My Strategies', to: '/me' },
  ]

  return (
    <AuthProvider user={user}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col p-6">
          <h2 className="text-2xl font-extrabold mb-8 tracking-wide">CS2 Strategies</h2>

          <nav className="flex-1">
            <ul className="space-y-3">
              {sidebarLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="block px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-6">
            <SignOutButton className="w-full" />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 overflow-auto relative">
          {/* Floating Mode Toggle */}
          <div className="fixed top-4 right-4 z-50">
            <ModeToggle />
          </div>

          <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
            <Outlet />
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}
