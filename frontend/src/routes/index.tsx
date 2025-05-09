import { createFileRoute } from '@tanstack/react-router'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export const Route = createFileRoute('/')({
    component: Index,
})
  
async function getTotalSpent() {
    const result = await api.expenses['total-spent'].$get()

    console.log(result)
    if (!result.ok) throw new Error('server error')
    const data = await result.json()
    return data
}

function Index() {
    const {isPending, error, data} = useQuery({ queryKey: ['get-total-spent'], queryFn: getTotalSpent })
    if (error) return 'Error: ' + error.message

    return (
        <>
        <Card className="w-[350px] m-auto">
            <CardHeader>
            <CardTitle>Total Spent</CardTitle>
            <CardDescription>Total amount</CardDescription>
            </CardHeader>
            <CardContent>{isPending ? "..." : data.total}</CardContent>
        </Card>
        </>
    )
}
  

  