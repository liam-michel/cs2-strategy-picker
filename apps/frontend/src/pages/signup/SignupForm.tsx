import { createForm } from '@/lib/FormContext'
import { z } from 'zod'

const SignUpFormSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(20),
})

const { Form, TextField, PasswordField } = createForm(SignUpFormSchema)

export const SignUpForm = ({ onSubmit }: { onSubmit: (data: z.output<typeof SignUpFormSchema>) => Promise<void> }) => (
  <Form onSubmit={onSubmit}>
    <TextField name="email" label="Email" placeholder="Enter your email" />
    <TextField name="username" label="Username" placeholder="Choose a username" />
    <PasswordField name="password" label="Password" placeholder="Create a password" />
  </Form>
)
