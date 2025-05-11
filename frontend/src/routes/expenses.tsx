import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"


import { Skeleton } from "@/components/ui/skeleton"

  
export const Route = createFileRoute('/expenses')({
  component: Expenses,
})

async function getAllExpenses() {
    const result = await api.expenses.$get()

    if (!result.ok) throw new Error('server error')
    const data = await result.json()
    return data
}

function Expenses() {
    const {isPending, error, data} = useQuery({ queryKey: ['get-all-expenses'], queryFn: getAllExpenses })
    if (error) return 'Error: ' + error.message

  return ( 
    <div className='p-2 max-w-3xl m-auto'>
        <Table>
            <TableCaption>A list of your expenses.</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isPending ? 
                Array(3).fill(0).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell className="font-medium">
                            <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[200px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                    </TableRow>
                ))
                : data?.expenses.map((expense) => (
                    <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.id}</TableCell>
                        <TableCell>{expense.title}</TableCell>
                        <TableCell>{expense.amount}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  )
}
