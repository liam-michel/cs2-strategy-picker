import { AddStrategySchema, EconomySchema, MapSchema, SideSchema, type AddStrategyInput } from '@cs2monorepo/shared'
import { createForm } from '@/lib/FormContext'

type StrategyFormProps = {
  initialData?: AddStrategyInput
  onSubmit: (data: AddStrategyInput) => Promise<void>
}

const { Form, TextField, TextAreaField, SelectField, SliderField } = createForm(AddStrategySchema)
export const StrategyForm = ({ initialData, onSubmit }: StrategyFormProps) => (
  <Form defaultValues={initialData} onSubmit={onSubmit}>
    <TextField name="name" label="Title" placeholder="Enter strategy title" />
    <SelectField name="map" label="Map" options={MapSchema.options.map((opt) => ({ value: opt, label: opt }))} />
    <SelectField name="side" label="Side" options={SideSchema.options.map((opt) => ({ value: opt, label: opt }))} />
    <SelectField
      name="economy"
      label="Economy"
      options={EconomySchema.options.map((opt) => ({ value: opt, label: opt }))}
    />
    <SliderField name="difficulty" label="Difficulty" min={1} max={5} step={1} />
    <TextAreaField name="description" label="Description" placeholder="Describe your strategy in detail" />
  </Form>
)
