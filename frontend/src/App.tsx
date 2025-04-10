import { useEffect, useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { api } from "@/lib/api"

function App() {
  const [totalSpent, setTotalSpent] = useState(0)

  // grab the total spent from the backend
  useEffect(() => {
    async function fetchTotalSpent() {
      // using hono rpc client to fetch the total spent completely type safe from backend to frontend
      const response = await api.expenses['total-spent'].$get()
      const data = await response.json()
      setTotalSpent(data.total)
    }
    fetchTotalSpent()
  },[])

  return (
    <>
      <Card className="w-[350px] m-auto">
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>Total amount</CardDescription>
        </CardHeader>
        <CardContent>{totalSpent}</CardContent>
      </Card>
    </>
  )
}

export default App
