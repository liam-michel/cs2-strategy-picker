import { z } from 'zod'
import { useFormContext, useForm, DefaultValues, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/datepicker'
import { FormControl, FormItem, FormLabel, FormMessage, FormField, FormDescription, Form } from '@/components/ui/form'
import React from 'react'
import type { FieldValues } from 'react-hook-form'

export type FormProps<TSchema extends z.ZodType> = {
  onSubmit: (data: z.output<TSchema>) => Promise<void>
  defaultValues?: DefaultValues<z.input<TSchema>>
}

export type StringFieldsOf<TSchema extends z.ZodObject<Record<string, any>>> = {
  [K in keyof z.input<TSchema>]: NonNullable<z.input<TSchema>[K]> extends string ? K : never
}[keyof z.input<TSchema>]

export type PasswordFieldsOf<TSchema extends z.ZodObject<Record<string, any>>> = {
  [K in keyof z.input<TSchema>]: NonNullable<z.input<TSchema>[K]> extends string ? K : never
}[keyof z.input<TSchema>]

export type NumberFieldsOf<TSchema extends z.ZodObject<Record<string, any>>> = {
  [K in keyof z.input<TSchema>]: NonNullable<z.input<TSchema>[K]> extends number ? K : never
}[keyof z.input<TSchema>]

export type BooleanFieldsOf<TSchema extends z.ZodObject<Record<string, any>>> = {
  [K in keyof z.input<TSchema>]: NonNullable<z.input<TSchema>[K]> extends boolean ? K : never
}[keyof z.input<TSchema>]

export type DateFieldsOf<TSchema extends z.ZodObject<Record<string, any>>> = {
  [K in keyof z.input<TSchema>]: NonNullable<z.input<TSchema>[K]> extends Date | string ? K : never
}[keyof z.input<TSchema>]

export type SelectFieldsOf<TSchema extends z.ZodObject<Record<string, any>>> = {
  [K in keyof TSchema['shape']]: TSchema['shape'][K] extends
    | z.ZodOptional<z.ZodEnum<any>>
    | z.ZodNullable<z.ZodEnum<any>>
    | z.ZodEnum<any>
    | z.ZodOptional<z.ZodEnum<any>>
    | z.ZodUnion<readonly [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]>
    | z.ZodOptional<z.ZodUnion<readonly [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]>>
    ? K
    : never
}[keyof TSchema['shape']]

export type BaseFieldProps = {
  label: string
  description?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

// ---------------------------------------------------------------------------
// Field Components
// ---------------------------------------------------------------------------

export function TextField<TSchema extends z.ZodObject<Record<string, any>>>({
  name,
  label,
  placeholder,
  disabled,
  description,
  className,
  form,
  type = 'text',
}: BaseFieldProps & {
  name: StringFieldsOf<TSchema>
  type?: React.HTMLInputTypeAttribute
  form?: UseFormReturn<z.input<TSchema>>
}) {
  const contextForm = useFormContext<z.input<TSchema>>()
  const actualForm = form || contextForm

  return (
    <FormField
      control={actualForm.control}
      name={name as any}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex items-center justify-between">
            <FormLabel>{label}</FormLabel>
            <Button type="button" variant="ghost" size="sm" onClick={() => actualForm.resetField(name as any)}>
              Reset
            </Button>
          </div>
          <FormControl>
            <Input
              {...field}
              value={(field.value as string) ?? ''}
              placeholder={placeholder}
              disabled={disabled}
              type={type}
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function PasswordField<TSchema extends z.ZodObject<Record<string, any>>>({
  name,
  label,
  placeholder,
  disabled,
  description,
  className,
  form,
}: BaseFieldProps & {
  name: PasswordFieldsOf<TSchema>
  form?: UseFormReturn<z.input<TSchema>>
}) {
  const contextForm = useFormContext<z.input<TSchema>>()
  const actualForm = form || contextForm

  return (
    <FormField
      control={actualForm.control}
      name={name as any}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex items-center justify-between">
            <FormLabel>{label}</FormLabel>
            <Button type="button" variant="ghost" size="sm" onClick={() => actualForm.resetField(name as any)}>
              Reset
            </Button>
          </div>
          <FormControl>
            <Input
              {...field}
              value={(field.value as string) ?? ''}
              placeholder={placeholder}
              disabled={disabled}
              type="password"
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function TextAreaField<TSchema extends z.ZodObject<Record<string, any>>>({
  name,
  description,
  label,
  placeholder,
  disabled,
  form,
  className,
}: BaseFieldProps & {
  name: StringFieldsOf<TSchema>
  form?: UseFormReturn<z.input<TSchema>>
}) {
  const contextForm = useFormContext<z.input<TSchema>>()
  const actualForm = form || contextForm

  return (
    <FormField
      control={actualForm.control}
      name={name as any}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex items-center justify-between">
            <FormLabel>{label}</FormLabel>
            <Button type="button" variant="ghost" size="sm" onClick={() => actualForm.resetField(name as any)}>
              Reset
            </Button>
          </div>
          <FormControl>
            <Textarea
              {...field}
              value={(field.value as string) ?? ''}
              placeholder={placeholder}
              disabled={disabled}
              className="min-h-[75px]"
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function NumberField<TSchema extends z.ZodObject<Record<string, any>>>({
  name,
  label,
  placeholder,
  description,
  disabled,
  form,
  className,
}: BaseFieldProps & {
  name: NumberFieldsOf<TSchema>
  form?: UseFormReturn<z.input<TSchema>>
}) {
  const contextForm = useFormContext<z.input<TSchema>>()
  const actualForm = form || contextForm

  return (
    <FormField
      control={actualForm.control}
      name={name as any}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex items-center justify-between">
            <FormLabel>{label}</FormLabel>
            <Button type="button" variant="ghost" size="sm" onClick={() => actualForm.resetField(name as any)}>
              Reset
            </Button>
          </div>
          <FormControl>
            <Input
              {...field}
              value={(field.value as number) ?? ''}
              placeholder={placeholder}
              disabled={disabled}
              type="number"
              onChange={(e) => {
                const value = e.target.value
                field.onChange(value === '' ? undefined : Number(value))
              }}
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function SelectField<TSchema extends z.ZodObject<Record<string, any>>, TField extends SelectFieldsOf<TSchema>>({
  name,
  label,
  placeholder,
  disabled,
  description,
  className,
  form,
  options,
}: BaseFieldProps & {
  name: TField
  form?: UseFormReturn<z.input<TSchema>>
  options: Array<{
    value: z.input<TSchema>[TField]
    label: string
  }>
}) {
  const contextForm = useFormContext<z.input<TSchema>>()
  const actualForm = form || contextForm

  return (
    <FormField
      control={actualForm.control}
      name={name as any}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex items-center justify-between">
            <FormLabel>{label}</FormLabel>
            <Button type="button" variant="ghost" size="sm" onClick={() => actualForm.resetField(name as any)}>
              Reset
            </Button>
          </div>
          <FormControl>
            <Select onValueChange={field.onChange} value={String(field.value || '')} disabled={disabled}>
              <SelectTrigger>
                <SelectValue placeholder={placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={String(option.value)} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function CheckboxField<TSchema extends z.ZodObject<Record<string, any>>>({
  name,
  label,
  disabled,
  description,
  form,
  className,
}: BaseFieldProps & {
  name: BooleanFieldsOf<TSchema>
  form?: UseFormReturn<z.input<TSchema>>
}) {
  const contextForm = useFormContext<z.input<TSchema>>()
  const actualForm = form || contextForm

  return (
    <FormField
      control={actualForm.control}
      name={name as any}
      render={({ field }) => (
        <FormItem className={className} key={name as string}>
          <FormControl>
            <Checkbox
              checked={!!field.value}
              onCheckedChange={(checked) => field.onChange(checked)}
              disabled={disabled}
            />
          </FormControl>
          <FormLabel className="ml-3">{label}</FormLabel>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function DateField<TSchema extends z.ZodObject<Record<string, any>>>({
  name,
  label,
  description,
  className,
  form,
}: BaseFieldProps & {
  name: DateFieldsOf<TSchema>
  form?: UseFormReturn<z.input<TSchema>>
}) {
  const contextForm = useFormContext<z.input<TSchema>>()
  const actualForm = form || contextForm

  return (
    <FormField
      control={actualForm.control}
      name={name as any}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex items-center justify-between">
            <FormLabel>{label}</FormLabel>
            <Button type="button" variant="ghost" size="sm" onClick={() => actualForm.resetField(name as any)}>
              Reset
            </Button>
          </div>
          <FormControl>
            <DatePicker
              date={field.value ? new Date(field.value as any) : undefined}
              setDate={(date) => field.onChange(date)}
              className="w-full"
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// ---------------------------------------------------------------------------
// SimpleForm
// ---------------------------------------------------------------------------

export function SimpleForm<
  TSchema extends z.ZodType,
  TInput extends FieldValues = z.input<TSchema> & FieldValues,
  TOutput extends FieldValues = z.output<TSchema> & FieldValues,
>({
  children,
  schema,
  onSubmit,
  defaultValues,
}: {
  children: React.ReactNode
  schema: TSchema
  onSubmit: (data: TOutput) => Promise<void>
  defaultValues?: DefaultValues<TInput>
}) {
  const form = useForm<TInput, unknown, TOutput>({
    resolver: zodResolver(schema as any) as any,
    defaultValues,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {children}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}

// ---------------------------------------------------------------------------
// createForm factory
// ---------------------------------------------------------------------------

export function createForm<TSchema extends z.ZodObject<Record<string, any>>>(schema: TSchema) {
  return {
    Form: ({
      children,
      onSubmit,
      defaultValues,
    }: {
      children: React.ReactNode
      onSubmit: (data: z.output<TSchema>) => Promise<void>
      defaultValues?: DefaultValues<z.input<TSchema>>
    }) => (
      <SimpleForm schema={schema} onSubmit={onSubmit} defaultValues={defaultValues}>
        {children}
      </SimpleForm>
    ),

    TextField: (props: Omit<Parameters<typeof TextField<TSchema>>[0], 'form'>) => TextField<TSchema>(props),

    PasswordField: (props: Omit<Parameters<typeof PasswordField<TSchema>>[0], 'form'>) => PasswordField<TSchema>(props),

    TextAreaField: (props: Omit<Parameters<typeof TextAreaField<TSchema>>[0], 'form'>) => TextAreaField<TSchema>(props),

    NumberField: (props: Omit<Parameters<typeof NumberField<TSchema>>[0], 'form'>) => NumberField<TSchema>(props),

    SelectField: <TField extends SelectFieldsOf<TSchema>>(
      props: Omit<Parameters<typeof SelectField<TSchema, TField>>[0], 'form'>,
    ) => SelectField<TSchema, TField>(props),

    CheckboxField: (props: Omit<Parameters<typeof CheckboxField<TSchema>>[0], 'form'>) => CheckboxField<TSchema>(props),

    DateField: (props: Omit<Parameters<typeof DateField<TSchema>>[0], 'form'>) => DateField<TSchema>(props),
  }
}
