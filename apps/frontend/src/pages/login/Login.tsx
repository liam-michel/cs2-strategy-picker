import { useLogin } from '@/hooks/auth/useLogin'
import { LoginForm } from '../../forms/LoginForm'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Login() {
  const { mutate, isError, error } = useLogin()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm
            onSubmit={async (data) => {
              mutate(data, {
                onSuccess: () => navigate({ to: '/dashboard' }),
              })
            }}
          />
          {isError && (
            <div className="mt-4 text-sm text-red-500">
              {error instanceof Error ? error.message : 'An error occurred'}
            </div>
          )}
          <div className="mt-4 text-sm text-center">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
