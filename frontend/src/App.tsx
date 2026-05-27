import { Routes, Route } from "react-router-dom"
import Landing from "./pages/Landing"
import InvoiceBuilder from "./pages/InvoiceBuilder"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<InvoiceBuilder />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
