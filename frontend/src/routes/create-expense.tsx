import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { useForm } from '@tanstack/react-form'
import { api } from "@/lib/api"

export const Route = createFileRoute('/create-expense')({
  component: CreateExpense,
})

function CreateExpense() {
    const navigate = useNavigate()

    const form = useForm({
        defaultValues: {
          title: '',
          amount: 0,
        },
        onSubmit: async ({ value }) => {
          // Do something with form data
          const result = await api.expenses.$post({json: value})
          if (!result.ok) throw new Error('server error')
          navigate({to: '/expenses'})
        },
      })


  return <div>
    <h2>Create Expense</h2>
    <form
        className="max-w-xl m-auto"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()              
        }}
      >

        <form.Field
            name="title"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? 'A title is required'
                  : value.length < 3
                    ? 'title must be at least 3 characters'
                    : undefined,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                await new Promise((resolve) => setTimeout(resolve, 1000))
                return (
                  value.includes('error') && 'No "error" allowed in title'
                )
              },
            }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                    <Label htmlFor={field.name}>Title</Label>
                    <Input 
                        type="text" 
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)} 
                        placeholder="Title" 
                        />
                    {field.state.meta.isTouched && !field.state.meta.isValid ? (
                        <em>{field.state.meta.errors.join(', ')}</em> ) : null}
                </>
              )
            }}
          />

        <form.Field
            name="amount"
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                    <Label htmlFor={field.name}>Amount</Label>
                    <Input 
                        type="number" 
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(Number(e.target.value))} 
                        placeholder="0"
                        />
                    {field.state.meta.isTouched && !field.state.meta.isValid ? (
                        <em>{field.state.meta.errors.join(', ')}</em> ) : null}
                </>
              )
            }}
          />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button className="mt-4" type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Submit'}
            </Button>
          )}
        />
    </form>
  </div>
}
