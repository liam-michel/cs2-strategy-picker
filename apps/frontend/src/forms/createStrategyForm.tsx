import { AddStrategySchema, type AddStrategyInput } from '@cs2monorepo/shared'
import { createForm } from '@/lib/FormContext'

const { Form, TextField, TextAreaField } = createForm(AddStrategySchema as any)

export const CreateStrategyForm = ({ onSubmit }: { onSubmit: (data: AddStrategyInput) => Promise<void> }) => (
  <Form onSubmit={onSubmit}>
    <TextField name="title" label="Title" placeholder="Enter strategy title" />
    <TextAreaField name="description" label="Description" placeholder="Describe your strategy in detail" />
  </Form>
)
