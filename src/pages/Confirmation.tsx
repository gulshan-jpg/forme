import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Printer, Truck, ArrowRight, Package } from 'lucide-react'
import { useOrders } from '../store/orders'
import { inr } from '../lib/format'
import WhatsAppButton from '../components/WhatsAppButton'
import { orderMessage } from '../lib/messages'
import * as db from '../services/db'
import type { Order } from '../types'
import { openPrintableInvoice } from '../lib/invoice'

export default function Confirmation() {
 const { id } = useParams()
 const cached = useOrders(s => s.orders).find(x => x.id === id)
 const [order, setOrder] = useState<Order | null>(cached ?? null)
 const [loading, setLoading] = useState(!cached)

 useEffect(() => {
  if (order || !id) return
  db.fetchOrderByCode(id).then(res => { if (res) setOrder(res) }).finally(() => setLoading(false))
 }, [id, order])

 if (loading) {
  return <div className="py-32 text-center text-sm text-black/60">Loading order details…</div>
 }

 if (!order) {
  return (
   <div className="py-32 text-center">
    <h1 className="font-integral text-4xl text-black">Order not found</h1>
    <Link to="/" className="btn btn-dark mt-6 rounded-full px-8">Return Home</Link>
   </div>
  )
 }

 const o = order

 return (
  <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
   {/* Success Header Card */}
   <div className="rounded-[24px] border border-black/10 bg-[#F0EEED]/40 p-8 text-center shadow-xs">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-sm mb-4">
     <CheckCircle2 size={32} />
    </div>

    <p className="text-xs uppercase tracking-[0.25em] font-bold text-black/50">
     {o.demo ? 'Demo Order Placed' : 'Order Confirmed'}
    </p>

    <h1 className="font-integral text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight mt-2">
     Thank you, {o.customer.name.split(' ')[0]}
    </h1>

    <p className="mt-2 text-sm text-black/70">
     Your order <span className="font-mono font-bold text-black">{o.id}</span> has been registered and is being prepared for dispatch.
    </p>

    <p className="mt-1 text-xs text-black/50">
     {o.demo ? 'This was placed in demo mode. No real card was charged.' : o.payment}
    </p>
   </div>

   {/* Order Items Breakdown */}
   <div className="mt-8 rounded-[20px] border border-black/10 bg-white p-6 shadow-xs">
    <h2 className="text-base font-bold text-black border-b border-black/10 pb-3 flex items-center gap-2">
     <Package size={18} />
     <span>Ordered Items</span>
    </h2>

    <ul className="divide-y divide-black/10 text-sm">
     {o.lines.map((l, i) => (
      <li key={i} className="flex justify-between py-3.5">
       <div>
        <p className="font-semibold text-black">{l.name}</p>
        <p className="text-xs text-black/50">{l.size ? `Size: ${l.size} · ` : ''}Qty: {l.qty}</p>
       </div>
       <span className="font-bold font-sans text-black">{inr(l.price * l.qty)}</span>
      </li>
     ))}
    </ul>

    <div className="border-t border-black/10 pt-4 space-y-2 text-sm">
     <div className="flex justify-between text-black/60">
      <span>Subtotal</span>
      <span className="font-medium font-sans">{inr(o.subtotal)}</span>
     </div>
     {o.discount > 0 && (
      <div className="flex justify-between text-emerald-800 font-medium">
       <span>Discount</span>
       <span className="font-bold font-sans">-{inr(o.discount)}</span>
      </div>
     )}
     <div className="flex justify-between text-black/60">
      <span>Shipping</span>
      <span className="font-medium font-sans">{o.shipping ? inr(o.shipping) : 'Free'}</span>
     </div>
     <div className="border-t border-black/10 pt-3 flex justify-between text-base font-bold text-black">
      <span>Total Paid</span>
      <span className="font-bold font-sans">{inr(o.total)}</span>
     </div>
    </div>
   </div>

   {/* Delivery Address Details */}
   <div className="mt-6 rounded-[20px] border border-black/10 bg-white p-6 shadow-xs text-sm">
    <h3 className="font-bold text-black flex items-center gap-2 mb-2">
     <Truck size={17} />
     <span>Shipping Destination</span>
    </h3>
    <p className="text-black/80 font-medium">{o.customer.name} · {o.customer.phone}</p>
    <p className="text-black/60 text-xs mt-1">
     {o.customer.address}, {o.customer.city}, {o.customer.state} {o.customer.pin}
    </p>
   </div>

   {/* Action Buttons: Tax Invoice, WhatsApp, Continue Shopping */}
   <div className="mt-8 flex flex-col sm:flex-row gap-3">
    <button
     type="button"
     onClick={() => openPrintableInvoice(o, 'FORME®')}
     className="btn btn-line flex-1 rounded-full py-3.5 text-xs font-bold flex items-center justify-center gap-2"
    >
     <Printer size={15} />
     <span>Download Tax Invoice</span>
    </button>

    <Link
     to={`/track?order=${encodeURIComponent(o.id)}`}
     className="btn btn-line flex-1 rounded-full py-3.5 text-xs font-bold flex items-center justify-center gap-2"
    >
     <Truck size={15} />
     <span>Track Order</span>
    </Link>

    <WhatsAppButton
     text={orderMessage(o)}
     className="btn btn-line rounded-full py-3.5 text-xs font-bold"
    >
     WhatsApp Update
    </WhatsAppButton>
   </div>

   <div className="mt-6 text-center">
    <Link to="/shop" className="btn btn-dark rounded-full px-10 py-3.5 text-xs font-bold">
     Continue Shopping
    </Link>
   </div>
  </div>
 )
}
