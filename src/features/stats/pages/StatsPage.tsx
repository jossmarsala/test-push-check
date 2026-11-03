import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, DollarSign, Hammer, Award } from 'lucide-react'

export const StatsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Business Stats & Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Financial performance, category metrics, and workshop labor margins.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-medium text-muted-foreground">
              Monthly Gross Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,850.00</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> +18.5% MoM
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-medium text-muted-foreground">
              Retail Gross Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48.2%</div>
            <p className="text-xs text-muted-foreground mt-1">Average markup 1.93x</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-medium text-muted-foreground">
              Workshop Labor Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,420.00</div>
            <p className="text-xs text-muted-foreground mt-1">72 repairs & custom orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-medium text-muted-foreground">
              Average Ticket Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$186.00</div>
            <p className="text-xs text-muted-foreground mt-1">Per retail customer</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Revenue Breakdown by Department
            </CardTitle>
            <CardDescription>Comparison between Ready-to-wear Retail and Workshop</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Retail Jewelry (Rings, Chains, Earrings)</span>
                <span className="font-semibold">$19,430.00 (78%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '78%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Workshop Custom Orders (Fabrication)</span>
                <span className="font-semibold">$3,650.00 (15%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-emerald-600" style={{ width: '15%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Repairs & Resizing Services</span>
                <span className="font-semibold">$1,770.00 (7%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: '7%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Top Revenue Categories
            </CardTitle>
            <CardDescription>Highest velocity product categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { category: '18k Gold Rings', units: 48, revenue: '$11,200', share: '45%' },
              { category: '18k Chains & Necklaces', units: 22, revenue: '$6,450', share: '26%' },
              { category: 'Silver 925 Earrings', units: 64, revenue: '$2,880', share: '12%' },
              { category: 'Custom Engagement Bands', units: 6, revenue: '$2,500', share: '10%' },
            ].map((cat) => (
              <div key={cat.category} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="font-medium text-sm">{cat.category}</p>
                  <p className="text-xs text-muted-foreground">{cat.units} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{cat.revenue}</p>
                  <Badge variant="outline" className="text-[10px]">{cat.share}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
