import { authClient } from '@/lib/auth-client'
import { useMutation } from '@tanstack/react-query'
export interface LoginParams {
  email: string
  password: string
}

export function useLogin() {
  return useMutation({
    mutationFn: async (params: LoginParams) => {
      console.log(params)
      try {
        const { data, error } = await authClient.signIn.email({
          email: params.email,
          password: params.password,
        })
        if (error) {
          throw new Error(error.message ?? 'Login failed')
        }
        return data
      } catch (e) {
        throw new Error(e instanceof Error ? e.message : 'Login failed')
      }
    },
  })
}
