import { Hono } from 'hono'
import { z } from 'zod' 
import { zValidator } from '@hono/zod-validator'


// type for type safety
type Expense = {
    id: number
    title: string
    amount: number
}

const fakeExpenses: Expense[] = [
    { id: 1, title: 'Groceries', amount: 50 },
    { id: 2, title: 'Rent', amount: 1200 },
    { id: 3, title: 'Utilities', amount: 200 },
    { id: 4, title: 'Transportation', amount: 100 },
]

// validation schema for runtime
const createExpenseSchema = z.object({
    title: z.string().min(3).max(50),
    amount: z.number().int().positive(),
})

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
        return c.json(expense)
    })
    // .delete
    // .put