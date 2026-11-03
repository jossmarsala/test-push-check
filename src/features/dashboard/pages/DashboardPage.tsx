import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DollarSign,
  Hammer,
  Package,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Plus,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Executive Dashboard</h2>
          <p className="text-muted-foreground text-sm">
            Real-time overview of retail store and goldsmith workshop operations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link to="/ventas">
              <Plus className="mr-2 h-4 w-4" />
              New Sale (POS)
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/workshop">
              <Hammer className="mr-2 h-4 w-4" />
              New Work Order
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,420.00</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-0.5" /> +14.2% vs yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Workshop Jobs</CardTitle>
            <Hammer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8 Active</div>
            <p className="text-xs text-muted-foreground mt-1">
              3 ready for customer pickup
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142 Items</div>
            <p className="text-xs text-amber-600 mt-1">
              4 items low on stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cash Drawer</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$380.50</div>
            <p className="text-xs text-emerald-600 mt-1">
              Shift open • Started at $150.00
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Urgent Workshop Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Workshop Queue (Orfebrería)</CardTitle>
              <CardDescription>Orders requiring technician attention</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/workshop">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { id: 'WO-104', customer: 'Lucia Alvarez', item: '18k Gold Ring Resizing', status: 'In Progress', badge: 'secondary' },
              { id: 'WO-103', customer: 'Carlos Mendoza', item: 'Diamond Pendant Custom Cast', status: 'Ready', badge: 'default' },
              { id: 'WO-102', customer: 'Elena Rossi', item: 'Silver Chain Clasp Repair', status: 'Pending', badge: 'outline' },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{order.id}</span>
                    <span className="text-sm text-muted-foreground">• {order.customer}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{order.item}</p>
                </div>
                <Badge variant={order.badge as any}>{order.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Operations Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Architecture Status</CardTitle>
            <CardDescription>Role-based modular foundation ready for scaling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="rounded-md bg-muted p-3">
              <div className="flex items-center gap-2 font-semibold">
                <Clock className="h-4 w-4 text-primary" />
                <span>MVP Active Role: Admin</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Full administrative scope over all 6 modules. Seller and Goldsmith layouts are pre-wired in the architecture.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="border rounded p-2">
                <span className="font-semibold block">Supabase Client</span>
                <span className="text-muted-foreground">Initialized with typed DB schema</span>
              </div>
              <div className="border rounded p-2">
                <span className="font-semibold block">Role Guards</span>
                <span className="text-muted-foreground">Admin, Seller, Goldsmith ready</span>
              </div>
              <div className="border rounded p-2">
                <span className="font-semibold block">Tailwind CSS v4</span>
                <span className="text-muted-foreground">shadcn UI tokens active</span>
              </div>
              <div className="border rounded p-2">
                <span className="font-semibold block">Decoupled Modules</span>
                <span className="text-muted-foreground">Independent feature directories</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
