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
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  metalType: string
  weightGrams: number
  costPrice: number
  salePrice: number
  stock: number
  isActive: boolean
}

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Solitaire Ring 18k',
    sku: 'RNG-18K-01',
    category: 'Rings',
    metalType: 'Gold 18k',
    weightGrams: 3.4,
    costPrice: 180.0,
    salePrice: 340.0,
    stock: 5,
    isActive: true,
  },
  {
    id: '2',
    name: 'Silver 925 Huggie Earrings',
    sku: 'EAR-925-08',
    category: 'Earrings',
    metalType: 'Silver 925',
    weightGrams: 2.1,
    costPrice: 20.0,
    salePrice: 55.0,
    stock: 12,
    isActive: true,
  },
  {
    id: '3',
    name: 'Gold Rope Chain 45cm',
    sku: 'CHN-18K-14',
    category: 'Chains',
    metalType: 'Gold 18k',
    weightGrams: 8.5,
    costPrice: 260.0,
    salePrice: 420.0,
    stock: 2,
    isActive: true,
  },
  {
    id: '4',
    name: 'Emerald Cut Diamond Pendant',
    sku: 'PND-DIA-05',
    category: 'Pendants',
    metalType: 'White Gold 18k',
    weightGrams: 1.8,
    costPrice: 450.0,
    salePrice: 790.0,
    stock: 1,
    isActive: true,
  },
]

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // New product form state
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: 'Rings',
    metalType: 'Gold 18k',
    weightGrams: '',
    costPrice: '',
    salePrice: '',
    stock: '',
  })

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.sku) return

    const newProd: Product = {
      id: Date.now().toString(),
      name: form.name,
      sku: form.sku,
      category: form.category,
      metalType: form.metalType,
      weightGrams: parseFloat(form.weightGrams) || 0,
      costPrice: parseFloat(form.costPrice) || 0,
      salePrice: parseFloat(form.salePrice) || 0,
      stock: parseInt(form.stock) || 0,
      isActive: true,
    }

    setProducts([newProd, ...products])
    setIsDialogOpen(false)
    setForm({
      name: '',
      sku: '',
      category: 'Rings',
      metalType: 'Gold 18k',
      weightGrams: '',
      costPrice: '',
      salePrice: '',
      stock: '',
    })
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Product Catalog (CRUD)</h2>
          <p className="text-sm text-muted-foreground">
            Manage jewelry inventory, gold & silver weights, pricing margins, and SKUs.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Add New Jewelry Product</DialogTitle>
              <DialogDescription>
                Record item details, metal specs, and inventory count into the SQL database.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-medium">Product Name</label>
                  <Input
                    placeholder="e.g. 18k Diamond Eternity Ring"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">SKU Code</label>
                  <Input
                    placeholder="e.g. RNG-18K-09"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Category</label>
                  <Input
                    placeholder="Rings, Chains, etc."
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Metal Type</label>
                  <Input
                    placeholder="e.g. Gold 18k / Silver 925"
                    value={form.metalType}
                    onChange={(e) => setForm({ ...form, metalType: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Weight (grams)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="3.5"
                    value={form.weightGrams}
                    onChange={(e) => setForm({ ...form, weightGrams: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Cost Price ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="120.00"
                    value={form.costPrice}
                    onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Retail Price ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="250.00"
                    value={form.salePrice}
                    onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium">Initial Stock Quantity</label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Product</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Catalog Items ({products.length})</CardTitle>
              <CardDescription>All active products stored in Supabase</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Metal / Weight</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Sale Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs font-medium">{p.sku}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{p.category}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.metalType} • {p.weightGrams}g
                  </TableCell>
                  <TableCell className="font-mono text-sm">${p.costPrice.toFixed(2)}</TableCell>
                  <TableCell className="font-mono text-sm font-semibold">${p.salePrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={p.stock <= 2 ? 'destructive' : 'secondary'}>
                      {p.stock} units
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => setProducts(products.filter((item) => item.id !== p.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
