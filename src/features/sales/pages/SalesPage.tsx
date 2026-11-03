import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, CreditCard, Banknote, ArrowRight, Trash2, Plus, Search } from 'lucide-react'

interface CartItem {
  id: string
  name: string
  sku: string
  price: number
  quantity: number
}

const mockQuickCatalog = [
  { id: 'p1', name: 'Solitaire Gold Ring 18k', sku: 'RNG-18K-01', price: 340.0, stock: 5 },
  { id: 'p2', name: 'Silver Huggie Earrings 925', sku: 'EAR-925-08', price: 55.0, stock: 12 },
  { id: 'p3', name: 'Gold Rope Chain 45cm 18k', sku: 'CHN-18K-14', price: 420.0, stock: 3 },
  { id: 'p4', name: 'Diamond Tennis Bracelet', sku: 'BRC-DIA-02', price: 980.0, stock: 2 },
]

export const SalesPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([
    { id: 'p1', name: 'Solitaire Gold Ring 18k', sku: 'RNG-18K-01', price: 340.0, quantity: 1 },
  ])
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash')

  const addToCart = (product: typeof mockQuickCatalog[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1 // 10% VAT/Tax
  const total = subtotal + tax

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Point of Sale (Ventas)</h2>
        <p className="text-sm text-muted-foreground">
          Register in-store sales, produce receipts, and handle payments.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Catalog Selection */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Fast Product Lookup</CardTitle>
                  <CardDescription>Click to add directly to current sale ticket</CardDescription>
                </div>
                <div className="relative w-48 sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Scan barcode or type SKU..." className="pl-8" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {mockQuickCatalog.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => addToCart(item)}
                    className="flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:border-primary hover:bg-muted/50"
                  >
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">{item.sku}</p>
                      <p className="text-xs text-muted-foreground mt-1">Stock: {item.stock}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">${item.price.toFixed(2)}</p>
                      <Button size="icon" variant="ghost" className="h-7 w-7 mt-1">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Checkout Ticket */}
        <div>
          <Card className="sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShoppingCart className="h-4 w-4" />
                Current Ticket
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Name */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">Customer (Optional)</label>
                <Input
                  placeholder="e.g. John Doe / Walk-in"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Separator />

              {/* Items List */}
              <div className="max-h-60 space-y-2 overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">Ticket is empty</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="max-w-[170px]">
                        <p className="truncate font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Separator />

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <Banknote className="mr-1 h-3 w-3" /> Cash
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard className="mr-1 h-3 w-3" /> Card
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === 'transfer' ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                    onClick={() => setPaymentMethod('transfer')}
                  >
                    Transfer
                  </Button>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1 rounded-lg bg-muted/50 p-3 text-sm">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Complete Sale Button */}
              <Button className="w-full" size="lg" disabled={cart.length === 0}>
                Charge ${total.toFixed(2)}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
