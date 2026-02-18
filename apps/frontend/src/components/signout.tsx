import { authClient } from '@/lib/auth-client'
import { Button } from './ui/button'
export const SignOutButton = () => {
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
    <>
      <Button onClick={handleSignOut}>Sign Out</Button>
    </>
  )
}
