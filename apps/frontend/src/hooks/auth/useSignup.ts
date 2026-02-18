import { authClient } from '@/lib/auth-client'
import { useMutation } from '@tanstack/react-query'

export interface SignUpParams {
  email: string
  password: string
  username: string
}

export function useSignup() {
  return useMutation({
    mutationFn: async (params: SignUpParams) => {
      try {
        console.log(params)
        const { data, error } = await authClient.signUp.email({
          email: params.email,
          password: params.password,
          name: params.username,
        })
        console.log(data, error)
        if (error) throw new Error(error.message ?? 'Signup failed')
        return data
      } catch (e) {
        throw new Error(e instanceof Error ? e.message : 'Signup failed')
      }
    },
  })
}
