import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInvoiceStore } from '@/store/invoiceStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export default function InvoiceBuilder() {
  const { data, updateData, addItem, removeItem, updateItem, calculateTotals } = useInvoiceStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const navigate = useNavigate()

  const handleGeneratePdf = async () => {
    setIsGenerating(true)
    const toastId = toast.loading('Generating PDF...', { duration: 10000 })
    
    try {
      const response = await fetch('http://localhost:3001/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      // Download the PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Invoice-${data.invoiceNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)

      toast.success('PDF generated successfully!', { id: toastId })
    } catch (error) {
      console.error(error)
      toast.error('Failed to generate PDF. Make sure XeLaTeX is installed.', { id: toastId })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateData({ [e.target.name]: e.target.value })
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Editor Panel */}
      <div className="w-1/2 h-full overflow-y-auto border-r border-border p-8 pb-24">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-semibold tracking-tight">Invoice Details</h2>
        </div>

        <div className="space-y-8">
          {/* Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Template</Label>
              <Select value={data.template} onValueChange={(v) => updateData({ template: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={data.currency} onValueChange={(v) => updateData({ currency: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Dates & Numbers */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Invoice Number</Label>
              <Input name="invoiceNumber" value={data.invoiceNumber} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Issue Date</Label>
              <Input type="date" name="issueDate" value={data.issueDate} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input type="date" name="dueDate" value={data.dueDate} onChange={handleChange} />
            </div>
          </div>

          <Separator />

          {/* Parties */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">From (Your Details)</h3>
              <Input placeholder="Company Name" name="senderCompany" value={data.senderCompany} onChange={handleChange} />
              <Input placeholder="Address" name="senderAddress" value={data.senderAddress} onChange={handleChange} />
              <Input placeholder="Email" name="senderEmail" value={data.senderEmail} onChange={handleChange} />
              <Input placeholder="Phone" name="senderPhone" value={data.senderPhone} onChange={handleChange} />
              <Input placeholder="Tax ID (Optional)" name="senderTaxId" value={data.senderTaxId} onChange={handleChange} />
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">To (Client Details)</h3>
              <Input placeholder="Client Name" name="clientName" value={data.clientName} onChange={handleChange} />
              <Input placeholder="Address" name="clientAddress" value={data.clientAddress} onChange={handleChange} />
              <Input placeholder="Email" name="clientEmail" value={data.clientEmail} onChange={handleChange} />
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground mb-4">Invoice Items</h3>
            {data.items.map((item, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={item.id} 
                className="flex items-end gap-2 group"
              >
                <div className="flex-1 space-y-2">
                  <Label className={index !== 0 ? 'sr-only' : ''}>Description</Label>
                  <Input 
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    placeholder="Item description"
                  />
                </div>
                <div className="w-24 space-y-2">
                  <Label className={index !== 0 ? 'sr-only' : ''}>Qty</Label>
                  <Input 
                    type="number" 
                    value={item.quantity}
                    onChange={(e) => {
                      updateItem(item.id, { quantity: Number(e.target.value) })
                      calculateTotals()
                    }}
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label className={index !== 0 ? 'sr-only' : ''}>Rate</Label>
                  <Input 
                    type="number" 
                    value={item.rate}
                    onChange={(e) => {
                      updateItem(item.id, { rate: Number(e.target.value) })
                      calculateTotals()
                    }}
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label className={index !== 0 ? 'sr-only' : ''}>Amount</Label>
                  <Input readOnly value={item.total.toFixed(2)} className="bg-muted" />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    removeItem(item.id)
                    calculateTotals()
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
            
            <Button variant="outline" className="w-full mt-4 border-dashed" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          <Separator />

          {/* Notes & Terms */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea 
                name="notes" 
                value={data.notes} 
                onChange={handleChange} 
                placeholder="Thank you for your business!" 
                className="resize-none h-24"
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Terms</Label>
              <Textarea 
                name="paymentTerms" 
                value={data.paymentTerms} 
                onChange={handleChange} 
                placeholder="Please pay within 14 days." 
                className="resize-none h-24"
              />
            </div>
          </div>

          <Separator />

          {/* Totals & Tax */}
          <div className="flex justify-end">
            <div className="w-64 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-medium">{data.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-4">
                <Label className="flex-1 whitespace-nowrap">Tax Slab (%)</Label>
                <Input 
                  type="number" 
                  className="w-24 text-right" 
                  value={data.taxRate}
                  onChange={(e) => {
                    updateData({ taxRate: Number(e.target.value) })
                    calculateTotals()
                  }}
                />
              </div>
              {data.taxAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tax</span>
                  <span>{data.taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="font-medium">Total</span>
                <span className="text-xl font-bold">{data.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="w-1/2 h-full bg-muted/30 p-8 flex flex-col relative overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-background/80 backdrop-blur p-4 rounded-lg border border-border z-10 shadow-sm">
          <span className="text-sm font-medium text-muted-foreground">Live HTML Preview</span>
          <Button onClick={handleGeneratePdf} disabled={isGenerating}>
            {isGenerating ? (
              <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin mr-2" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Generate PDF
          </Button>
        </div>

        {/* Paper visual */}
        <div className="mx-auto w-full max-w-[800px] bg-white text-black min-h-[1000px] shadow-lg p-12 transition-all duration-300">
          <div className="flex justify-between items-start mb-16">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.senderCompany || 'Company Name'}</h1>
              <div className="text-gray-500 text-sm space-y-1">
                <p>{data.senderAddress || 'Company Address'}</p>
                <p>{data.senderEmail || 'company@email.com'}</p>
                <p>{data.senderPhone}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-4xl font-bold text-gray-200 uppercase tracking-widest mb-4">Invoice</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                <span className="font-medium text-gray-900">Invoice No:</span>
                <span>{data.invoiceNumber}</span>
                <span className="font-medium text-gray-900">Date:</span>
                <span>{data.issueDate}</span>
                <span className="font-medium text-gray-900">Due Date:</span>
                <span>{data.dueDate}</span>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="font-semibold text-gray-900 mb-2">Billed To:</h3>
            <div className="text-gray-600 text-sm space-y-1">
              <p className="font-medium text-gray-900">{data.clientName || 'Client Name'}</p>
              <p>{data.clientAddress || 'Client Address'}</p>
              <p>{data.clientEmail || 'client@email.com'}</p>
            </div>
          </div>

          <table className="w-full text-left border-collapse mb-8">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th className="py-3 font-semibold text-gray-900">Description</th>
                <th className="py-3 font-semibold text-gray-900 text-right">Qty</th>
                <th className="py-3 font-semibold text-gray-900 text-right">Rate</th>
                <th className="py-3 font-semibold text-gray-900 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-4 text-gray-600">{item.description || '...'}</td>
                  <td className="py-4 text-gray-600 text-right">{item.quantity}</td>
                  <td className="py-4 text-gray-600 text-right">{item.rate.toFixed(2)}</td>
                  <td className="py-4 text-gray-900 font-medium text-right">{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-16">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>{data.currency} {data.subtotal.toFixed(2)}</span>
              </div>
              {data.taxRate > 0 && (
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Tax ({data.taxRate}%)</span>
                  <span>{data.currency} {data.taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-900 font-bold text-lg pt-3 border-t-2 border-gray-900">
                <span>Total Due</span>
                <span>{data.currency} {data.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {(data.notes || data.paymentTerms) && (
            <div className="text-sm text-gray-500 border-t border-gray-200 pt-8 mt-auto space-y-4">
              {data.notes && (
                <div>
                  <span className="font-semibold text-gray-900">Notes: </span>
                  {data.notes}
                </div>
              )}
              {data.paymentTerms && (
                <div>
                  <span className="font-semibold text-gray-900">Payment Terms: </span>
                  {data.paymentTerms}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
