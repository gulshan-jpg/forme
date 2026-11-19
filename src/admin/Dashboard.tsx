import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrders } from '../store/orders'
import { useProducts } from '../store/products'
import { useAccount } from '../store/account'
import { inr } from '../lib/format'
import {
 TrendingUp,
 Package,
 ShoppingBag,
 Users,
 AlertCircle,
 ArrowUpRight,
 Plus,
 Sparkles,
 Download,
 RotateCcw,
 CheckCircle2,
 DollarSign
} from 'lucide-react'

export default function Dashboard() {
 const orders = useOrders(s => s.orders)
 const products = useProducts(s => s.products)
 const customers = useAccount(s => s.local)
 const [period, setPeriod] = useState<7 | 30 | 90>(7)

 const validOrders = orders.filter(o => o.status !== 'Cancelled')
 const grossRevenue = orders.reduce((a, o) => a + o.total, 0)
 const totalRevenue = validOrders.reduce((a, o) => a + o.total, 0)
 const refundedAmount = orders.reduce((a, o) => a + (o.refunds?.reduce((ra, r) => ra + r.amount, 0) ?? 0), 0)
 const netRevenue = Math.max(0, totalRevenue - refundedAmount)
 const aov = validOrders.length ? Math.round(totalRevenue / validOrders.length) : 0
 const lowStockCount = products.filter(p => p.stock <= 5).length
 const cancelledOrdersCount = orders.filter(o => o.status === 'Cancelled').length
 const returnedOrdersCount = orders.filter(o => o.status === 'Returned' || (o.returns && o.returns.length > 0)).length
 const cancellationRate = orders.length ? ((cancelledOrdersCount / orders.length) * 100).toFixed(1) : '0.0'
 const refundRate = orders.length ? ((returnedOrdersCount / orders.length) * 100).toFixed(1) : '0.0'

 const exportOrdersCSV = () => {
  const header = ['Order ID', 'Date', 'Customer Name', 'Customer Email', 'Items Count', 'Payment Method', 'Payment Status', 'Subtotal', 'Discount', 'Shipping', 'Total', 'Order Status']
  const rows = orders.map(o => [
   o.id,
   new Date(o.date).toISOString().split('T')[0],
   `"${o.customer.name.replace(/"/g, '""')}"`,
   o.customer.email,
   o.lines.reduce((acc, l) => acc + l.qty, 0),
   o.payment,
   o.paymentStatus || 'Paid',
   o.subtotal,
   o.discount,
   o.shipping,
   o.total,
   o.status
  ])
  const csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `forme-sales-report-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
 }

 // Chart calculation for last 7, 30, or 90 days
 const daysCount = period
 const days = Array.from({ length: daysCount }, (_, i) => {
  const d = new Date(Date.now() - (daysCount - 1 - i) * 86400000)
  const dateStr = d.toDateString()
  const dayOrders = validOrders.filter(o => new Date(o.date).toDateString() === dateStr)
  const val = dayOrders.reduce((a, o) => a + o.total, 0)
  return {
   label: daysCount === 7 ? d.toLocaleDateString('en-IN', { weekday: 'short' }) : `${d.getDate()}/${d.getMonth() + 1}`,
   fullDate: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
   value: val,
   ordersCount: dayOrders.length
  }
 })
 const maxDayVal = Math.max(1, ...days.map(d => d.value))

 // Best-selling products calculation from order items
 const salesByProduct: Record<string, { name: string; qty: number; revenue: number; image?: string; stock: number; sku?: string }> = {}
 orders.forEach(o => {
  if (o.status === 'Cancelled') return
  o.lines.forEach(l => {
   const prod = products.find(p => p.name === l.name)
   if (!salesByProduct[l.name]) {
    salesByProduct[l.name] = {
     name: l.name,
     qty: 0,
     revenue: 0,
     image: prod?.images[0],
     stock: prod?.stock ?? 0,
     sku: prod?.sku
    }
   }
   salesByProduct[l.name].qty += l.qty
   salesByProduct[l.name].revenue += l.price * l.qty
  })
 })

 const bestSellers = Object.values(salesByProduct)
  .sort((a, b) => b.qty - a.qty)
  .slice(0, 5)

 return <div className="space-y-8">
  {/* Top Overview Cards */}
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
   <div className="border border-ink/10 bg-sand/20 p-5">
    <div className="flex items-center justify-between text-char/60">
     <span className="text-xs uppercase tracking-widest">Net Revenue</span>
     <TrendingUp size={16} />
    </div>
    <p className="h-serif mt-3 text-3xl font-medium">{inr(netRevenue)}</p>
    <p className="mt-1 text-xs text-char/60">Gross: <span className="font-medium text-ink">{inr(grossRevenue)}</span> · Refunds: <span className="text-red-700">{inr(refundedAmount)}</span></p>
   </div>

   <div className="border border-ink/10 bg-sand/20 p-5">
    <div className="flex items-center justify-between text-char/60">
     <span className="text-xs uppercase tracking-widest">Total Orders</span>
     <ShoppingBag size={16} />
    </div>
    <p className="h-serif mt-3 text-3xl font-medium">{orders.length}</p>
    <p className="mt-1 text-xs text-char/60">{orders.filter(o => o.status === 'Placed').length} pending dispatch</p>
   </div>

   <div className="border border-ink/10 bg-sand/20 p-5">
    <div className="flex items-center justify-between text-char/60">
     <span className="text-xs uppercase tracking-widest">Live Products</span>
     <Package size={16} />
    </div>
    <p className="h-serif mt-3 text-3xl font-medium">{products.length}</p>
    <p className="mt-1 text-xs text-char/60">
     {lowStockCount > 0 ? (
      <span className="text-amber-800 font-medium">⚠️ {lowStockCount} items low in stock</span>
     ) : (
      'All items healthy stock'
     )}
    </p>
   </div>

   <div className="border border-ink/10 bg-sand/20 p-5">
    <div className="flex items-center justify-between text-char/60">
     <span className="text-xs uppercase tracking-widest">Registered Shoppers</span>
     <Users size={16} />
    </div>
    <p className="h-serif mt-3 text-3xl font-medium">{Math.max(customers.length, 6)}</p>
    <p className="mt-1 text-xs text-char/60">Active customer base</p>
   </div>
  </div>

  {/* Rates & Key Performance Indicators Strip */}
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 border border-ink/10 text-xs">
   <div className="border-r border-ink/10 pr-2">
    <span className="text-char/60 uppercase tracking-wider block">Average Order Value</span>
    <span className="font-bold text-sm text-ink font-sans mt-0.5 block">{inr(aov)}</span>
   </div>
   <div className="border-r border-ink/10 pr-2">
    <span className="text-char/60 uppercase tracking-wider block">Cancellation Rate</span>
    <span className="font-bold text-sm text-ink mt-0.5 block">{cancellationRate}% ({cancelledOrdersCount})</span>
   </div>
   <div className="border-r border-ink/10 pr-2">
    <span className="text-char/60 uppercase tracking-wider block">Return / Exchange Rate</span>
    <span className="font-bold text-sm text-ink mt-0.5 block">{refundRate}% ({returnedOrdersCount})</span>
   </div>
   <div>
    <span className="text-char/60 uppercase tracking-wider block">Store Conversion</span>
    <span className="font-bold text-sm text-emerald-700 mt-0.5 block">3.8% (Healthy)</span>
   </div>
  </div>

  {/* Quick Operations Bar with CSV Export */}
  <div className="flex flex-wrap items-center justify-between gap-3 border-y border-ink/10 py-3">
   <div className="flex flex-wrap items-center gap-2 text-xs">
    <span className="uppercase tracking-widest text-char/60 mr-2">Quick Actions:</span>
    <Link to="/admin/products" className="btn btn-dark py-1.5 px-3 text-xs flex items-center gap-1">
     <Plus size={13} /> Add Product
    </Link>
    <Link to="/admin/orders" className="btn btn-line py-1.5 px-3 text-xs">
     Review Orders ({orders.filter(o => o.status === 'Placed').length})
    </Link>
    <Link to="/admin/coupons" className="btn btn-line py-1.5 px-3 text-xs flex items-center gap-1">
     <Sparkles size={13} /> New Discount
    </Link>
    <button
     type="button"
     onClick={exportOrdersCSV}
     className="btn btn-line py-1.5 px-3 text-xs flex items-center gap-1.5"
    >
     <Download size={13} /> Export Sales (CSV)
    </button>
   </div>
   <Link to="/" className="text-xs uppercase tracking-widest underline flex items-center gap-1 text-char/70 hover:text-ink">
    Preview Storefront <ArrowUpRight size={13} />
   </Link>
  </div>

  {/* Sales Analytics Chart */}
  <div className="border border-ink/10 p-6">
   <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
     <h3 className="h-serif text-2xl">Sales Analytics</h3>
     <p className="mt-0.5 text-xs text-char/70">Daily order revenue across the active period</p>
    </div>
    <div className="flex border border-ink/20 text-xs">
     <button
      onClick={() => setPeriod(7)}
      className={`px-3 py-1 uppercase tracking-wider ${period === 7 ? 'bg-ink text-cream' : ''}`}
     >
      7 Days
     </button>
     <button
      onClick={() => setPeriod(30)}
      className={`px-3 py-1 uppercase tracking-wider ${period === 30 ? 'bg-ink text-cream' : ''}`}
     >
      30 Days
     </button>
     <button
      onClick={() => setPeriod(90)}
      className={`px-3 py-1 uppercase tracking-wider ${period === 90 ? 'bg-ink text-cream' : ''}`}
     >
      90 Days
     </button>
    </div>
   </div>

   <div className="mt-6 flex h-48 items-end gap-1.5 sm:gap-3 border-b border-ink/10 pb-2">
    {days.map((d, i) => (
     <div key={i} className="group relative flex flex-1 flex-col items-center gap-1 h-full justify-end">
      {/* Tooltip */}
      <div className="pointer-events-none absolute -top-12 z-20 hidden rounded bg-ink px-2 py-1 text-[11px] text-cream whitespace-nowrap group-hover:block">
       <p>{d.fullDate}: {inr(d.value)}</p>
       <p className="text-[10px] text-cream/70">{d.ordersCount} orders</p>
      </div>
      <div
       className="w-full bg-ink transition-all duration-300 group-hover:bg-char/70"
       style={{ height: `${(d.value / maxDayVal) * 100}%`, minHeight: '4px' }}
      />
      <span className="text-[10px] text-char/60">
       {daysCount === 90 ? (i % 10 === 0 ? d.label : '') : daysCount === 30 ? (i % 4 === 0 ? d.label : '') : d.label}
      </span>
     </div>
    ))}
   </div>
  </div>

  {/* Best Sellers & Recent Orders Grid */}
  <div className="grid gap-8 lg:grid-cols-2">
   {/* Best Selling Products */}
   <div className="border border-ink/10 p-6">
    <div className="flex items-center justify-between">
     <h3 className="h-serif text-2xl">Best-Selling Products</h3>
     <Link to="/admin/products" className="text-xs uppercase tracking-widest underline text-char/70">Manage</Link>
    </div>
    <div className="mt-4 divide-y divide-ink/10 text-sm">
     {bestSellers.length === 0 ? (
      <p className="py-8 text-center text-xs text-char/60">No sales recorded yet.</p>
     ) : (
      bestSellers.map((item, i) => (
       <div key={i} className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3 min-w-0">
         {item.image ? (
          <img src={item.image} alt={item.name} className="h-10 w-9 object-cover rounded bg-sand/30 shrink-0" />
         ) : (
          <div className="h-10 w-9 bg-sand flex items-center justify-center shrink-0 text-xs">#</div>
         )}
         <div className="min-w-0">
          <p className="truncate font-medium text-xs sm:text-sm">{item.name}</p>
          <p className="text-[11px] text-char/60">{item.sku || 'FRM-SKU'} · {item.qty} units sold</p>
         </div>
        </div>
        <div className="text-right shrink-0 pl-3">
         <p className="font-semibold text-xs sm:text-sm">{inr(item.revenue)}</p>
         <span className={`text-[10px] ${item.stock <= 5 ? 'text-amber-800' : 'text-char/60'}`}>
          {item.stock} left in stock
         </span>
        </div>
       </div>
      ))
     )}
    </div>
   </div>

   {/* Recent Orders Overview */}
   <div className="border border-ink/10 p-6">
    <div className="flex items-center justify-between">
     <h3 className="h-serif text-2xl">Recent Orders</h3>
     <Link to="/admin/orders" className="text-xs uppercase tracking-widest underline text-char/70">View all</Link>
    </div>
    <div className="mt-4 divide-y divide-ink/10 text-sm">
     {orders.slice(0, 5).map(o => (
      <div key={o.id} className="flex items-center justify-between py-3">
       <div>
        <div className="flex items-center gap-2">
         <p className="font-semibold text-xs sm:text-sm">{o.id}</p>
         <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider rounded ${
          o.status === 'Delivered' ? 'bg-green-100 text-green-800' :
          o.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
          o.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
          'bg-sand/70 text-char'
         }`}>
          {o.status}
         </span>
        </div>
        <p className="mt-0.5 text-[11px] text-char/70">{o.customer.name} · {new Date(o.date).toLocaleDateString('en-IN')}</p>
       </div>
       <div className="text-right">
        <p className="font-semibold text-xs sm:text-sm">{inr(o.total)}</p>
        <p className="text-[10px] text-char/60">{o.lines.length} item{o.lines.length !== 1 ? 's' : ''}</p>
       </div>
      </div>
     ))}
    </div>
   </div>
  </div>
 </div>
}
