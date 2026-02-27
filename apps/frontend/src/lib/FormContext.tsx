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
import { Slider } from '@/components/ui/slider'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MultiSelectField<TSchema extends z.ZodObject<Record<string, any>>>({
  name,
  label,
  description,
  disabled,
  form,
  className,
  options,
  placeholder = 'Select options...',
}: BaseFieldProps & {
  name: keyof z.input<TSchema>
  form?: UseFormReturn<z.input<TSchema>>
  options: Array<{ value: string; label: string }>
}) {
  const contextForm = useFormContext<z.input<TSchema>>()
  const actualForm = form || contextForm

  return (
    <FormField
      control={actualForm.control}
      name={name as any}
      render={({ field }) => {
        const selected: string[] = Array.isArray(field.value) ? field.value : []

        const toggle = (val: string) => {
          const next = selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]
          field.onChange(next)
        }

        return (
          <FormItem className={className}>
            <div className="flex items-center justify-between">
              <FormLabel>{label}</FormLabel>
              <Button type="button" variant="ghost" size="sm" onClick={() => actualForm.resetField(name as any)}>
                Reset
              </Button>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    className={cn('w-full justify-between h-auto min-h-9', !selected.length && 'text-muted-foreground')}
                  >
                    <div className="flex flex-wrap gap-1">
                      {selected.length
                        ? selected.map((val) => (
                            <Badge key={val} variant="secondary" className="text-xs">
                              {options.find((o) => o.value === val)?.label ?? val}
                              <span
                                className="ml-1 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggle(val)
                                }}
                              >
                                <X className="h-3 w-3" />
                              </span>
                            </Badge>
                          ))
                        : placeholder}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search..." />
                  <CommandList>
                    <CommandEmpty>No options found.</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem key={option.value} value={option.value} onSelect={() => toggle(option.value)}>
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selected.includes(option.value) ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

export function SliderField<TSchema extends z.ZodObject<Record<string, any>>>({
  name,
  label,
  description,
  disabled,
  form,
  className,
  min = 0,
  max = 100,
  step = 1,
}: BaseFieldProps & {
  name: NumberFieldsOf<TSchema>
  form?: UseFormReturn<z.input<TSchema>>
  min?: number
  max?: number
  step?: number
}) {
  const contextForm = useFormContext<z.input<TSchema>>()
  const actualForm = form || contextForm

  return (
    <FormField
      control={actualForm.control}
      name={name as any}
      render={({ field }) => {
        const value = (field.value as number) ?? min

        // Sync the default value into the form on first render
        React.useEffect(() => {
          if (field.value === undefined) {
            field.onChange(min)
          }
        }, [])

        return (
          <FormItem className={className}>
            <div className="flex items-center justify-between">
              <FormLabel>{label}</FormLabel>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{value}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => actualForm.resetField(name as any)}>
                  Reset
                </Button>
              </div>
            </div>
            <FormControl>
              <Slider
                value={[value]}
                onValueChange={([val]) => field.onChange(val)}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
              />
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
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
  TInput extends FieldValues,
  TOutput extends FieldValues,
  TSchema extends z.ZodType<TOutput, any, any>,
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
  const form = useForm<TInput, any, TOutput>({
    resolver: zodResolver(schema as any),
    defaultValues,
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data)
    } catch (err: any) {
      console.log(err)
      const fieldErrors = err?.data?.fieldErrors
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          form.setError(field as any, { message: message as string })
        })
      } else {
        form.setError('root', { message: err?.data?.message ?? err?.message ?? 'Something went wrong' })
      }
    }
  })
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}
        {form.formState.errors.root && (
          <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
        )}
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
      <SimpleForm schema={schema as any} onSubmit={onSubmit} defaultValues={defaultValues}>
        {children}
      </SimpleForm>
    ),
    MultiSelectField: (props: Omit<Parameters<typeof MultiSelectField<TSchema>>[0], 'form'>) =>
      MultiSelectField<TSchema>(props),

    SliderField: (props: Omit<Parameters<typeof SliderField<TSchema>>[0], 'form'>) => SliderField<TSchema>(props),

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
