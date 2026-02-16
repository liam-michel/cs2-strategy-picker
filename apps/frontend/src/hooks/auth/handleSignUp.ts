import { authClient } from '@/lib/auth-client'
import { useMutation } from '@tanstack/react-query'
export interface SignUpParams {
  email: string
  password: string
  username: string
}

export async function handleSignup(params: SignUpParams) {
  return useMutation({
    mutationFn: async () => {
      return await authClient.signUp.email({
        email: params.email,
        password: params.password,
        name: params.username,
      })
    },
  })
}
