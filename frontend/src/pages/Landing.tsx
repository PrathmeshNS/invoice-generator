import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { FileText, Terminal, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Landing() {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      
      <div className="container max-w-5xl mx-auto px-6 py-24 flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border text-sm font-medium mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          Local PDF Engine Powered
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          Create beautiful <br className="hidden md:block"/> LaTeX-powered invoices instantly.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-2xl mb-10"
        >
          A modern visual interface for generating beautifully typeset LaTeX invoices locally. No cloud sync, no tracking, just you and a polished PDF.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Button size="lg" className="h-12 px-8 text-base group" onClick={() => navigate('/app')}>
            Generate Invoice
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="h-12 px-8 text-base"
            onClick={() => window.open('https://github.com/PrathmeshNS/invoice-generator.git', '_blank')}
          >
            <Terminal className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
