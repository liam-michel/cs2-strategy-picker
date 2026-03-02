// SignOutButton.tsx
import { authClient } from '@/lib/auth-client'
import { Button } from './ui/button'
import React from 'react'

interface SignOutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SignOutButton = (props: SignOutButtonProps) => {
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          console.log('Signed out successfully')
          window.location.href = '/login'
        },
      },
    })
  }

  return (
    <Button
      onClick={handleSignOut}
      {...props}
      className={`w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                  hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 
                  rounded-lg`}
    >
      Sign Out
    </Button>
  )
}
