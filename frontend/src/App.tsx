import { useState } from 'react'
import { Button } from "@/components/ui/button"


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="card">
        <Button onClick={() => setCount((count) => count + 1)}>
          Up
        </Button>
        <Button onClick={() => setCount((count) => count - 1)}>
          Down
        </Button>
        <p>
          {count}
        </p>
      </div>
    </>
  )
}

export default App
