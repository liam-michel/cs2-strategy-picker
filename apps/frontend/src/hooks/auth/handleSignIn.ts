import { authClient } from '@/lib/auth-client'
import { useMutation } from '@tanstack/react-query'
export interface SignInParams {
  email: string
  password: string
}

export async function handleSignIn(params: SignInParams) {
  return useMutation({
    mutationFn: async () => {
      return await authClient.signIn.email({
        email: params.email,
        password: params.password,
      })
    },
  })
}
