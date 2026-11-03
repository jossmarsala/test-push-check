import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Wallet, ArrowDownRight, ArrowUpRight, Plus, Receipt } from 'lucide-react'

interface Expense {
  id: string
  category: string
  description: string
  amount: number
  date: string
  registeredBy: string
}

const mockExpenses: Expense[] = [
  { id: '1', category: 'Workshop Supplies', description: 'Polishing paste & jewelers saw blades', amount: 35.5, date: '2026-11-03', registeredBy: 'Goldsmith Lead' },
  { id: '2', category: 'Packaging', description: 'Velvet gift boxes (pack of 50)', amount: 65.0, date: '2026-11-02', registeredBy: 'Admin' },
  { id: '3', category: 'Store Utilities', description: 'Internet fiber optic monthly invoice', amount: 45.0, date: '2026-11-01', registeredBy: 'Admin' },
]

export const CashExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newDesc, setNewDesc] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [newCategory, setNewCategory] = useState('Workshop Supplies')

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDesc || !newAmount) return

    const item: Expense = {
      id: Date.now().toString(),
      description: newDesc,
      amount: parseFloat(newAmount),
      category: newCategory,
      date: new Date().toISOString().split('T')[0],
      registeredBy: 'Admin',
    }

    setExpenses([item, ...expenses])
    setNewDesc('')
    setNewAmount('')
    setIsDialogOpen(false)
  }

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cash & Expenses (Caja y Gastos)</h2>
          <p className="text-sm text-muted-foreground">
            Control the daily physical cash drawer and record operational store expenses.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Register Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Record Operational Expense</DialogTitle>
              <DialogDescription>
                Deduct petty cash or register an outgoing invoice payment.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddExpense} className="space-y-3 py-2">
              <div>
                <label className="text-xs font-medium">Description</label>
                <Input
                  placeholder="e.g. Workshop torch gas refill"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium">Category</label>
                <Input
                  placeholder="Workshop Supplies, Store, Logistics"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium">Amount ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="25.00"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  required
                />
              </div>
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Record Expense</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cash Register State */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>Current Cash in Drawer</span>
              <Wallet className="h-4 w-4 text-emerald-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$380.50</div>
            <p className="text-xs text-muted-foreground mt-1">
              Started shift with $150.00
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>Cash Intake Today</span>
              <ArrowDownRight className="h-4 w-4 text-emerald-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">+$266.00</div>
            <p className="text-xs text-muted-foreground mt-1">From cash sales tickets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>Total Outgoing Expenses</span>
              <ArrowUpRight className="h-4 w-4 text-destructive" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">-${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">{expenses.length} records this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Expenses Ledger
          </CardTitle>
          <CardDescription>All disbursements deducted from store funds</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Registered By</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">{item.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.description}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.registeredBy}</TableCell>
                  <TableCell className="font-mono font-semibold text-right text-destructive">
                    -${item.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
