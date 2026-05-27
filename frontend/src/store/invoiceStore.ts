import { create } from 'zustand'

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  total: number
}

export interface InvoiceData {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  senderCompany: string
  senderAddress: string
  senderEmail: string
  senderPhone: string
  senderTaxId: string
  clientName: string
  clientAddress: string
  clientEmail: string
  items: InvoiceItem[]
  notes: string
  paymentTerms: string
  currency: string
  taxRate: number
  subtotal: number
  taxAmount: number
  total: number
  template: string
}

const defaultInvoice: InvoiceData = {
  invoiceNumber: 'INV-001',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  senderCompany: '',
  senderAddress: '',
  senderEmail: '',
  senderPhone: '',
  senderTaxId: '',
  clientName: '',
  clientAddress: '',
  clientEmail: '',
  items: [
    { id: '1', description: 'Web Development Services', quantity: 1, rate: 1000, total: 1000 }
  ],
  notes: 'Thank you for your business!',
  paymentTerms: 'Please pay within 14 days.',
  currency: 'USD',
  taxRate: 0,
  subtotal: 1000,
  taxAmount: 0,
  total: 1000,
  template: 'minimal'
}

interface InvoiceStore {
  data: InvoiceData
  theme: 'light' | 'dark'
  updateData: (updates: Partial<InvoiceData>) => void
  addItem: () => void
  removeItem: (id: string) => void
  updateItem: (id: string, updates: Partial<InvoiceItem>) => void
  calculateTotals: () => void
  toggleTheme: () => void
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  data: defaultInvoice,
  theme: 'light',

  updateData: (updates) => set((state) => {
    const newData = { ...state.data, ...updates }
    return { data: newData }
  }),

  addItem: () => set((state) => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      rate: 0,
      total: 0
    }
    return { data: { ...state.data, items: [...state.data.items, newItem] } }
  }),

  removeItem: (id) => set((state) => {
    const items = state.data.items.filter(item => item.id !== id)
    return { data: { ...state.data, items } }
  }),

  updateItem: (id, updates) => set((state) => {
    const items = state.data.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, ...updates }
        updatedItem.total = updatedItem.quantity * updatedItem.rate
        return updatedItem
      }
      return item
    })
    return { data: { ...state.data, items } }
  }),

  calculateTotals: () => set((state) => {
    const items = state.data.items
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const taxAmount = subtotal * (state.data.taxRate / 100)
    const total = subtotal + taxAmount
    return {
      data: {
        ...state.data,
        subtotal,
        taxAmount,
        total
      }
    }
  }),

  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }))
}))
