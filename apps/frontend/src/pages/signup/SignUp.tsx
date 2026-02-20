import { useSignup } from '@/hooks/auth/useSignup'
import { SignUpForm } from '../../forms/SignupForm'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Signup() {
  const { mutate, isError, error } = useSignup()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm
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
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
