import { Hono } from 'hono'
import { z } from 'zod' 
import { zValidator } from '@hono/zod-validator'



const expenseSchema = z.object({
    id: z.number().int().positive().min(1),
    title: z.string().min(3).max(50),
    amount: z.number().int().positive(),
})

// validation schema for runtime
const createExpenseSchema = expenseSchema.omit({ id: true })

// set type as infered by zod
type Expense = z.infer<typeof expenseSchema>

const fakeExpenses: Expense[] = [
    { id: 1, title: 'Groceries', amount: 50 },
    { id: 2, title: 'Rent', amount: 1200 },
    { id: 3, title: 'Utilities', amount: 200 },
    { id: 4, title: 'Transportation', amount: 100 },
]


export const expensesRoute = new Hono()
    // return expenses from endpoint
    .get('/', async (c) => {
        return c.json({ expenses: fakeExpenses })
    })
    // post expenses to endpoint
    .post('/', zValidator('json', createExpenseSchema), async (c) => {
        // await expenses posted
        const expense = await c.req.valid('json')
        fakeExpenses.push({...expense, id: fakeExpenses.length + 1})
        c.status(201)
        return c.json(expense)
    })
    // get total spent set to endpoint
    .get('/total-spent', (c) => {
        const total = fakeExpenses.reduce((acc, expense) => acc + expense.amount, 0)
        return c.json({ total })
    })
    // dynamic path param, use regex to check if id is a number
    .get("/:id{[0-9]+}", (c) => {
        const id = Number.parseInt(c.req.param('id'))
        const expense = fakeExpenses.find((e) => e.id === id)
        if (!expense) return c.notFound()
            return c.json({expense})
        
    })
    // .delete
    .delete("/:id{[0-9]+}", (c) => {
        const id = Number.parseInt(c.req.param('id'))
        const index = fakeExpenses.findIndex((e) => e.id === id)
        if (!index) return c.notFound()
        
        const deletedExpense = fakeExpenses.splice(index, 1)[0]
        return c.json({expense: deletedExpense})
    })
    // .put