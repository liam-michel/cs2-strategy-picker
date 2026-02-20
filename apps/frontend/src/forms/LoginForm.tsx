import { createForm } from '@/lib/FormContext'
import { z } from 'zod'

const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
})

const { Form, TextField, PasswordField } = createForm(LoginFormSchema)

export const LoginForm = ({ onSubmit }: { onSubmit: (data: z.output<typeof LoginFormSchema>) => Promise<void> }) => (
  <Form onSubmit={onSubmit}>
    <TextField name="email" label="Email" placeholder="Enter your email" />
    <PasswordField name="password" label="Password" placeholder="Enter your password" />
  </Form>
)
