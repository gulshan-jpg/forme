import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle, Printer, MessageCircle, ArrowRight, ChevronRight, ShieldCheck } from 'lucide-react'
import { useOrders } from '../store/orders'
import * as db from '../services/db'
import type { Order, OrderStatus } from '../types'
import { inr } from '../lib/format'
import { openPrintableInvoice } from '../lib/invoice'
import WhatsAppButton from '../components/WhatsAppButton'
import { orderMessage } from '../lib/messages'

const ORDER_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
 { status: 'Placed', label: 'Order Placed', desc: 'Order received and payment verified.' },
 { status: 'Packed', label: 'Processing & Packed', desc: 'Garments quality-checked and packaged in custom dust bag.' },
 { status: 'Shipped', label: 'In Transit (Air Express)', desc: 'Dispatched via premium express courier (BlueDart / Delhivery).' },
 { status: 'Delivered', label: 'Delivered', desc: 'Package successfully handed over to recipient.' }
]

export default function TrackOrder() {
 const [sp, setSp] = useSearchParams()
 const initialQuery = sp.get('order') || ''
 const [query, setQuery] = useState(initialQuery)
 const [searchedOrder, setSearchedOrder] = useState<Order | null>(null)
 const [loading, setLoading] = useState(false)
 const [searched, setSearched] = useState(false)
 const [err, setErr] = useState('')

 const allOrders = useOrders(s => s.orders)

 const handleSearch = async (codeToSearch: string) => {
  const clean = codeToSearch.trim().toUpperCase()
  if (!clean) return
  setLoading(true)
  setErr('')
  setSearched(true)

  // 1. Check local in-memory store
  const localMatch = allOrders.find(o => o.id.toUpperCase() === clean)
  if (localMatch) {
   setSearchedOrder(localMatch)
   setLoading(false)
   return
  }

  // 2. Fetch from database
  try {
   const remote = await db.fetchOrderByCode(clean)
   if (remote) {
    setSearchedOrder(remote)
   } else {
    setSearchedOrder(null)
    setErr(`No order found matching "${clean}". Please verify your order ID.`)
   }
  } catch (e: any) {
   setSearchedOrder(null)
   setErr(e.message || 'Could not retrieve tracking details.')
  } finally {
   setLoading(false)
  }
 }

 useEffect(() => {
  if (initialQuery) {
   handleSearch(initialQuery)
  }
 }, [initialQuery])

 const onSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  if (!query.trim()) return
  setSp({ order: query.trim().toUpperCase() })
  handleSearch(query.trim().toUpperCase())
 }

 const currentStepIndex = searchedOrder
  ? searchedOrder.status === 'Cancelled'
    ? -1
    : ORDER_STEPS.findIndex(s => s.status === searchedOrder.status) !== -1
      ? ORDER_STEPS.findIndex(s => s.status === searchedOrder.status)
      : 1
  : 0

 return (
  <div className="mx-auto max-w-4xl px-4 py-8 pb-24 sm:px-6 lg:px-8">
   {/* Breadcrumbs */}
   <nav className="mb-6 flex items-center gap-2 text-sm text-black/60">
    <Link to="/" className="hover:text-black transition">Home</Link>
    <ChevronRight size={14} />
    <span className="text-black font-medium">Track Order</span>
   </nav>

   {/* Header */}
   <div className="border-b border-black/10 pb-6 mb-8">
    <h1 className="font-integral text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-black">
     TRACK YOUR ORDER
    </h1>
    <p className="mt-1 text-xs sm:text-sm text-black/60">
     Enter your Order ID (e.g. FRM-89104) to view live courier status, tracking notes, and estimated delivery.
    </p>
   </div>

   {/* Search Form Card */}
   <div className="rounded-[24px] border border-black/10 bg-[#F0EEED]/40 p-6 sm:p-8 shadow-xs">
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
     <div className="relative flex-1">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
      <input
       value={query}
       onChange={e => setQuery(e.target.value.toUpperCase())}
       placeholder="Enter Order ID (e.g. FRM-89104)"
       className="w-full rounded-full border border-black/15 bg-white pl-11 pr-4 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-black outline-none focus:border-black transition"
      />
     </div>
     <button
      type="submit"
      disabled={loading || !query.trim()}
      className="btn btn-dark rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-wider"
     >
      {loading ? 'Searching…' : 'Track Order'}
     </button>
    </form>

    {err && (
     <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
      <AlertCircle size={16} />
      <span>{err}</span>
     </div>
    )}
   </div>

   {/* Order Results */}
   {searchedOrder && (
    <div className="mt-8 space-y-8 animate-fade-in">
     {/* Status Summary Banner */}
     <div className="rounded-[20px] border border-black/10 bg-white p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-4">
       <div>
        <p className="text-xs uppercase tracking-wider font-bold text-black/50">Order Reference</p>
        <p className="font-mono text-xl sm:text-2xl font-bold text-black">{searchedOrder.id}</p>
        <p className="text-xs text-black/60 mt-0.5">
         Placed on {new Date(searchedOrder.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
       </div>

       <div className="flex items-center gap-2">
        <span className={`rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider ${
         searchedOrder.status === 'Delivered'
          ? 'bg-emerald-100 text-emerald-800'
          : searchedOrder.status === 'Cancelled'
            ? 'bg-red-100 text-red-700'
            : 'bg-black text-white'
        }`}>
         {searchedOrder.status}
        </span>
       </div>
      </div>

      {/* Visual Tracking Stepper */}
      {searchedOrder.status !== 'Cancelled' ? (
       <div className="mt-8">
        <div className="relative">
         {/* Connecting Line */}
         <div className="absolute top-4 left-4 right-4 h-0.5 bg-black/10 -z-0 hidden md:block" />

         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {ORDER_STEPS.map((step, idx) => {
           const isDone = currentStepIndex >= idx
           const isCurrent = currentStepIndex === idx

           return (
            <div key={step.status} className="flex md:flex-col items-start gap-3">
             <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold z-10 transition ${
              isDone
               ? 'bg-black text-white ring-4 ring-black/10'
               : 'bg-[#F0EEED] text-black/40 border border-black/10'
             }`}>
              {isDone ? <CheckCircle2 size={16} /> : idx + 1}
             </div>
             <div>
              <p className={`text-xs sm:text-sm font-bold ${isCurrent ? 'text-black' : isDone ? 'text-black/80' : 'text-black/40'}`}>
               {step.label}
              </p>
              <p className="text-[11px] text-black/50 leading-relaxed mt-0.5">
               {step.desc}
              </p>
             </div>
            </div>
           )
          })}
         </div>
        </div>
       </div>
      ) : (
       <div className="mt-6 rounded-xl bg-red-50 p-4 text-xs text-red-700 border border-red-200">
        <p className="font-bold">This order was cancelled.</p>
        <p className="mt-0.5">If a payment was captured, the refund was initiated to your original payment method.</p>
       </div>
      )}
     </div>

     {/* Courier & Destination Info */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="rounded-[20px] border border-black/10 bg-white p-6 shadow-xs space-y-3">
       <h3 className="font-bold text-sm uppercase tracking-wider text-black/70 flex items-center gap-2">
        <Truck size={16} /> Courier & Dispatch Details
       </h3>
       <div className="text-xs space-y-1.5 text-black/70">
        <p><strong>Carrier:</strong> BlueDart Express / Delhivery Air</p>
        <p><strong>AWB Number:</strong> <span className="font-mono font-bold text-black">{searchedOrder.trackingNumber || `BLUEDART-${searchedOrder.id.replace(/\D/g, '') || '902184'}`}</span></p>
        <p><strong>Estimated Delivery:</strong> 2 to 4 Business Days</p>
        <p><strong>Payment Status:</strong> {searchedOrder.payment || 'Razorpay Verified'}</p>
       </div>
      </div>

      <div className="rounded-[20px] border border-black/10 bg-white p-6 shadow-xs space-y-3">
       <h3 className="font-bold text-sm uppercase tracking-wider text-black/70 flex items-center gap-2">
        <Package size={16} /> Delivery Address
       </h3>
       <div className="text-xs space-y-1 text-black/70">
        <p className="font-bold text-black">{searchedOrder.customer.name}</p>
        <p>{searchedOrder.customer.phone}</p>
        <p>{searchedOrder.customer.address}</p>
        <p>{searchedOrder.customer.city}, {searchedOrder.customer.state} {searchedOrder.customer.pin}</p>
       </div>
      </div>
     </div>

     {/* Ordered Items Summary */}
     <div className="rounded-[20px] border border-black/10 bg-white p-6 shadow-xs">
      <h3 className="font-bold text-sm uppercase tracking-wider text-black/70 border-b border-black/10 pb-3">
       Package Items ({searchedOrder.lines.length})
      </h3>
      <ul className="divide-y divide-black/10 text-sm">
       {searchedOrder.lines.map((l, i) => (
        <li key={i} className="flex justify-between py-3">
         <div>
          <p className="font-semibold text-black">{l.name}</p>
          <p className="text-xs text-black/50">{l.size ? `Size: ${l.size} · ` : ''}Qty: {l.qty}</p>
         </div>
         <span className="font-bold font-sans text-black">{inr(l.price * l.qty)}</span>
        </li>
       ))}
      </ul>
      <div className="border-t border-black/10 pt-3 flex justify-between font-bold text-base text-black">
       <span>Total Paid</span>
       <span className="font-sans">{inr(searchedOrder.total)}</span>
      </div>
     </div>

     {/* Action Buttons */}
     <div className="flex flex-col sm:flex-row gap-3">
      <button
       type="button"
       onClick={() => openPrintableInvoice(searchedOrder, 'FORME®')}
       className="btn btn-line rounded-full flex-1 py-3.5 text-xs font-bold flex items-center justify-center gap-2"
      >
       <Printer size={15} />
       <span>Download Tax Invoice</span>
      </button>

      <WhatsAppButton
       text={orderMessage(searchedOrder)}
       className="btn btn-line rounded-full flex-1 py-3.5 text-xs font-bold"
      >
       Enquire via WhatsApp
      </WhatsAppButton>
     </div>
    </div>
   )}
  </div>
 )
}
