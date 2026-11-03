import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Hammer, Plus, Search, Scale, Sparkles } from 'lucide-react'

interface WorkshopOrder {
  id: string
  orderNumber: string
  customerName: string
  serviceType: string
  itemDescription: string
  metalReceivedGrams: number
  status: 'pending' | 'in_progress' | 'ready' | 'delivered'
  estimatedCost: number
  deliveryDate: string
}

const mockOrders: WorkshopOrder[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'Maria Gonzalez',
    serviceType: 'Resizing',
    itemDescription: '18k Yellow Gold Wedding Band (Size 6 to 7)',
    metalReceivedGrams: 4.2,
    status: 'in_progress',
    estimatedCost: 45.0,
    deliveryDate: '2026-11-06',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Santiago Silva',
    serviceType: 'Custom Fabrication',
    itemDescription: 'Silver 925 Signet Ring with Monogram Hand Engraving',
    metalReceivedGrams: 12.5,
    status: 'pending',
    estimatedCost: 160.0,
    deliveryDate: '2026-11-12',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Carolina Mendez',
    serviceType: 'Stone Setting / Repair',
    itemDescription: 'White Gold Pendant, replace lost prong & set sapphire',
    metalReceivedGrams: 3.8,
    status: 'ready',
    estimatedCost: 95.0,
    deliveryDate: '2026-11-04',
  },
]

export const WorkshopOrdersPage: React.FC = () => {
  const [search, setSearch] = useState('')

  const getStatusBadge = (status: WorkshopOrder['status']) => {
    switch (status) {
      case 'in_progress':
        return <Badge variant="secondary">In Progress (Taller)</Badge>
      case 'ready':
        return <Badge variant="default" className="bg-emerald-600">Ready for Pickup</Badge>
      case 'pending':
        return <Badge variant="outline">Pending Tech</Badge>
      case 'delivered':
        return <Badge variant="outline">Delivered</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Workshop & Orders</h2>
            <Badge variant="outline" className="font-mono text-xs">Taller de Orfebrería</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage custom fabrication, jewelry repairs, metal weights, and technician workflows.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Work Order
        </Button>
      </div>

      {/* Workshop Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>Active in Workshop</span>
              <Hammer className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Orders</div>
            <p className="text-xs text-muted-foreground">Assigned to Goldsmith station</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>Metal in Custody</span>
              <Scale className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84.6 g</div>
            <p className="text-xs text-muted-foreground">Total gold & silver recorded on intake</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>Ready for Customer</span>
              <Sparkles className="h-4 w-4 text-emerald-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">3 Orders</div>
            <p className="text-xs text-muted-foreground">Notification sent to client</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Work Orders Registry</CardTitle>
              <CardDescription>Live tracking from intake to completion</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search order or client..."
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
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Metal (g)</TableHead>
                <TableHead>Est. Cost</TableHead>
                <TableHead>Est. Delivery</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium text-sm block">{order.serviceType}</span>
                      <span className="text-xs text-muted-foreground">{order.itemDescription}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{order.metalReceivedGrams}g</TableCell>
                  <TableCell className="font-mono text-sm">${order.estimatedCost.toFixed(2)}</TableCell>
                  <TableCell className="text-xs">{order.deliveryDate}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Manage</Button>
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
