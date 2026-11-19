import { useState } from 'react'
import { useOrders } from '../store/orders'
import { inr } from '../lib/format'
import type { OrderStatus, ShipmentStatus } from '../types'
import * as db from '../services/db'
import { run } from '../lib/action'
import { Download, Printer, Truck, RotateCcw, AlertCircle, CheckCircle, Ban, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { openPrintableInvoice } from '../lib/invoice'
import { initiateRazorpayRefund } from '../services/payment'
import { toast } from '../store/toast'

const ST: OrderStatus[] = ['Placed', 'Packed', 'Shipped', 'Delivered', 'Cancelled']
const COURIERS = ['BlueDart Express', 'Delhivery Air', 'Shiprocket Express', 'DTDC Prime']

export default function OrdersAdmin() {
 const { orders, setStatus, updateReturnStatus, updateShipment, recordRefund } = useOrders()
 const [q, setQ] = useState('')
 const [statusFilter, setStatusFilter] = useState<string>('All')
 const [open, setOpen] = useState('')

 // Shipment Modal State
 const [shipModalOrder, setShipModalOrder] = useState<string | null>(null)
 const [courier, setCourier] = useState('BlueDart Express')
 const [awb, setAwb] = useState('')

 // Refund Modal State
 const [refundModalOrder, setRefundModalOrder] = useState<string | null>(null)
 const [refundAmount, setRefundAmount] = useState<number>(0)
 const [refundReason, setRefundReason] = useState('Customer return approved')
 const [refunding, setRefunding] = useState(false)

 const list = orders.filter(o => {
  const matchesSearch = (o.id + o.customer.name + o.customer.email + o.customer.phone).toLowerCase().includes(q.toLowerCase())
  const matchesStatus = statusFilter === 'All' || o.status === statusFilter
  return matchesSearch && matchesStatus
 })

 const change = async (id: string, dbId: string | undefined, s: OrderStatus) => {
  if (dbId) {
   if (await run(() => db.updateOrderStatus(dbId, s), 'Status updated')) {
    setStatus(id, s)
   }
  } else {
   setStatus(id, s)
   toast('Status updated (local demo)')
  }
 }

 const handleSaveShipment = (orderId: string) => {
  if (!awb.trim()) {
   toast('Please enter a valid tracking / AWB code', 'error')
   return
  }
  updateShipment(orderId, {
   courierPartner: courier,
   trackingNumber: awb.trim(),
   awbCode: awb.trim(),
   status: 'In_Transit',
   shippedAt: new Date().toISOString()
  })
  setStatus(orderId, 'Shipped')
  toast(`Shipment generated for order ${orderId} via ${courier}!`, 'info')
  setShipModalOrder(null)
  setAwb('')
 }

 const handleProcessRefund = async (orderId: string, paymentId?: string, maxAmount?: number) => {
  setRefunding(true)
  try {
   const res = await initiateRazorpayRefund({
    paymentId: paymentId || `pay_${orderId}`,
    amount: refundAmount || maxAmount,
    reason: refundReason
   })

   if (res.ok) {
    recordRefund(orderId, {
     orderId,
     amount: refundAmount || maxAmount || 0,
     gateway: 'razorpay',
     gatewayRefundId: res.refundId,
     gatewayPaymentId: paymentId,
     status: 'processed',
     reason: refundReason,
     processedAt: new Date().toISOString()
    })
    toast(`Razorpay refund of ${inr(refundAmount || maxAmount || 0)} processed successfully!`, 'info')
    setRefundModalOrder(null)
   } else {
    toast(res.error || 'Failed to process refund with gateway', 'error')
   }
  } catch (err: any) {
   toast(err.message || 'Refund processing error', 'error')
  } finally {
   setRefunding(false)
  }
 }

 const exportCSV = () => {
  const headers = [
   'Order ID',
   'Date',
   'Customer Name',
   'Email',
   'Phone',
   'Address',
   'City',
   'State',
   'PIN',
   'Items',
   'Subtotal',
   'Discount',
   'Shipping',
   'Total',
   'Status',
   'Payment',
   'Payment Status',
   'Courier',
   'AWB Code'
  ]
  const rows = list.map(o => [
   `"${o.id}"`,
   `"${new Date(o.date).toLocaleDateString('en-IN')}"`,
   `"${o.customer.name.replace(/"/g, '""')}"`,
   `"${o.customer.email}"`,
   `"${o.customer.phone}"`,
   `"${o.customer.address.replace(/"/g, '""')}"`,
   `"${o.customer.city}"`,
   `"${o.customer.state}"`,
   `"${o.customer.pin}"`,
   `"${o.lines.map(l => `${l.name}${l.size ? ` (${l.size})` : ''} x ${l.qty}`).join('; ')}"`,
   o.subtotal,
   o.discount,
   o.shipping,
   o.total,
   o.status,
   `"${o.payment}"`,
   `"${o.paymentStatus || 'Paid'}"`,
   `"${o.shipment?.courierPartner || 'N/A'}"`,
   `"${o.shipment?.trackingNumber || 'N/A'}"`
  ])
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `forme_orders_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
 }

 const counts = {
  All: orders.length,
  Placed: orders.filter(o => o.status === 'Placed').length,
  Packed: orders.filter(o => o.status === 'Packed').length,
  Shipped: orders.filter(o => o.status === 'Shipped').length,
  Delivered: orders.filter(o => o.status === 'Delivered').length,
  Cancelled: orders.filter(o => o.status === 'Cancelled').length
 }

 return (
  <div className="space-y-6">
   <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-4">
    <div>
     <h2 className="font-integral font-bold text-2xl uppercase tracking-normal text-black">
      Order Management
     </h2>
     <p className="mt-1 text-xs text-black/60">
      Track customer purchases, fulfillment, logistics, returns, and Razorpay refunds.
     </p>
    </div>
    <button
     onClick={exportCSV}
     disabled={list.length === 0}
     className="flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white transition shadow-xs"
    >
     <Download size={14} />
     <span>Export CSV</span>
    </button>
   </div>

   {/* Status Filter Pills */}
   <div className="flex flex-wrap gap-2 text-xs">
    {['All', ...ST].map(s => (
     <button
      key={s}
      onClick={() => setStatusFilter(s)}
      className={`rounded-full px-4 py-1.5 uppercase font-bold tracking-wider text-xs transition ${
       statusFilter === s ? 'bg-black text-white' : 'bg-[#F0EEED] text-black/70 hover:bg-black/10'
      }`}
     >
      {s} {counts[s as keyof typeof counts] !== undefined ? `(${counts[s as keyof typeof counts]})` : ''}
     </button>
    ))}
   </div>

   {/* Search bar */}
   <div>
    <input
     className="input max-w-md"
     placeholder="Search by order ID, customer name, email, phone..."
     value={q}
     onChange={e => setQ(e.target.value)}
    />
   </div>

   {/* Orders List */}
   <div className="space-y-3">
    {list.length === 0 ? (
     <div className="rounded-[20px] border border-dashed border-black/20 p-12 text-center text-sm text-black/60">
      No orders found matching your filters.
     </div>
    ) : (
     list.map(o => {
      const isExpanded = open === o.id
      const hasReturns = o.returns && o.returns.length > 0
      const hasRefunds = o.refunds && o.refunds.length > 0

      return (
       <div
        key={o.id}
        className="rounded-[18px] border border-black/10 bg-white p-5 shadow-xs transition hover:border-black/30"
       >
        {/* Order Header Summary Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
         <button
          className="text-left flex-1 min-w-[240px]"
          onClick={() => setOpen(isExpanded ? '' : o.id)}
         >
          <div className="flex items-center gap-3">
           <span className="font-bold text-base text-black font-mono">{o.id}</span>
           <span className="font-bold text-black">{o.customer.name}</span>
           <span className="font-bold font-sans text-black">{inr(o.total)}</span>
           {o.demo && (
            <span className="rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black/60">
             demo
            </span>
           )}
           {hasReturns && (
            <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold">
             Return Req
            </span>
           )}
          </div>
          <p className="text-xs text-black/50 mt-1">
           {new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {o.payment}
          </p>
         </button>

         {/* Status Picker & Quick Actions */}
         <div className="flex items-center gap-3">
          <select
           aria-label="Order status"
           className="input w-auto text-xs py-1.5 px-3 rounded-full font-bold uppercase"
           value={o.status}
           onChange={e => change(o.id, o.dbId, e.target.value as OrderStatus)}
          >
           {ST.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Print Tax Invoice */}
          <button
           onClick={() => openPrintableInvoice(o, 'FORME®')}
           className="flex items-center gap-1 rounded-full border border-black/15 bg-white px-3 py-1.5 text-xs font-bold text-black hover:bg-black hover:text-white transition"
           title="Print / Download Tax Invoice"
          >
           <Printer size={13} />
           <span className="hidden sm:inline">Invoice</span>
          </button>

          {/* Expand Toggle */}
          <button
           onClick={() => setOpen(isExpanded ? '' : o.id)}
           className="p-1 text-black/60 hover:text-black"
          >
           {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
         </div>
        </div>

        {/* Expanded View */}
        {isExpanded && (
         <div className="mt-5 border-t border-black/10 pt-4 space-y-4 text-xs animate-fade-in">
          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl bg-[#F0EEED]/40 p-4">
           <div>
            <p className="font-bold text-black mb-1">Customer Info</p>
            <p className="text-black/80">{o.customer.name}</p>
            <p className="text-black/60">{o.customer.email}</p>
            <p className="text-black/60 font-mono">{o.customer.phone}</p>
           </div>
           <div>
            <p className="font-bold text-black mb-1">Shipping Destination</p>
            <p className="text-black/80">{o.customer.address}</p>
            <p className="text-black/60">{o.customer.city}, {o.customer.state} — <b>{o.customer.pin}</b></p>
           </div>
           <div>
            <p className="font-bold text-black mb-1">Fulfillment & Payment</p>
            <p className="text-black/80">Method: {o.payment}</p>
            <p className="text-black/60">Status: <span className="font-bold text-black">{o.paymentStatus || 'Paid'}</span></p>
            {o.shipment?.trackingNumber && (
             <p className="text-black/60 font-mono mt-1">
              Courier: {o.shipment.courierPartner} ({o.shipment.trackingNumber})
             </p>
            )}
           </div>
          </div>

          {/* Items Table */}
          <div>
           <p className="font-bold text-black mb-2">Purchased Items ({o.lines.length})</p>
           <div className="divide-y divide-black/10 rounded-xl border border-black/10 bg-white">
            {o.lines.map((l, i) => (
             <div key={i} className="flex items-center justify-between p-3">
              <div>
               <p className="font-bold text-black">{l.name}</p>
               <p className="text-black/50 text-[11px]">Variant: {l.size || 'One size'} {l.sku ? `· SKU: ${l.sku}` : ''}</p>
              </div>
              <div className="text-right">
               <span className="font-bold text-black font-sans">{inr(l.price * l.qty)}</span>
               <span className="text-black/50 text-[11px] block">{l.qty} × {inr(l.price)}</span>
              </div>
             </div>
            ))}
           </div>
          </div>

          {/* Logistics & Courier Controls */}
          <div className="rounded-xl border border-black/10 bg-white p-4 flex flex-wrap items-center justify-between gap-3">
           <div>
            <p className="font-bold text-black flex items-center gap-1.5">
             <Truck size={14} /> Shipping & Courier Fulfillment
            </p>
            <p className="text-black/60 text-[11px] mt-0.5">
             {o.shipment?.trackingNumber
              ? `Assigned to ${o.shipment.courierPartner} (AWB: ${o.shipment.trackingNumber})`
              : 'No shipment manifested yet.'}
            </p>
           </div>
           <button
            onClick={() => {
             setShipModalOrder(o.id)
             setCourier(o.shipment?.courierPartner || 'BlueDart Express')
             setAwb(o.shipment?.trackingNumber || '')
            }}
            className="rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-black/80 transition"
           >
            {o.shipment?.trackingNumber ? 'Update AWB' : 'Dispatch / Assign Courier'}
           </button>
          </div>

          {/* Return & Exchange Requests Section */}
          {hasReturns && (
           <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 space-y-3">
            <p className="font-bold text-amber-950 flex items-center gap-1.5">
             <AlertCircle size={15} /> Customer Return / Cancellation Requests
            </p>
            {o.returns?.map(r => (
             <div key={r.id} className="rounded-lg bg-white p-3 border border-amber-200 flex flex-wrap items-center justify-between gap-3">
              <div>
               <p className="font-bold text-black">
                {r.type.toUpperCase()} REQUEST · <span className="text-amber-800">{r.status.toUpperCase()}</span>
               </p>
               <p className="text-black/70 mt-0.5">Reason: <b>{r.reason}</b> {r.exchangeVariant ? `(Exchange for ${r.exchangeVariant})` : ''}</p>
               {r.details && <p className="text-black/50 italic mt-0.5">"{r.details}"</p>}
              </div>

              {r.status === 'pending' && (
               <div className="flex items-center gap-2">
                <button
                 onClick={() => {
                  updateReturnStatus(o.id, r.id, 'approved', 'Approved by store team.')
                  toast(`Return request for order ${o.id} approved!`, 'info')
                 }}
                 className="rounded-full bg-emerald-700 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-800"
                >
                 Approve
                </button>
                <button
                 onClick={() => {
                  updateReturnStatus(o.id, r.id, 'rejected', 'Does not meet 7-day return policy criteria.')
                  toast(`Return request for order ${o.id} rejected.`, 'error')
                 }}
                 className="rounded-full border border-red-300 bg-red-100 px-3 py-1 text-xs font-bold text-red-800 hover:bg-red-200"
                >
                 Reject
                </button>
               </div>
              )}
             </div>
            ))}
           </div>
          )}

          {/* Refund Initiation Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
           <div className="text-[11px] text-black/50">
            {hasRefunds ? (
             <span className="text-emerald-700 font-bold">
              ✓ Refund recorded: {inr(o.refunds![0].amount)} ({o.refunds![0].gatewayRefundId || 'Direct Gateway'})
             </span>
            ) : (
             <span>Payment verified via {o.payment}. Full or partial refunds can be processed securely.</span>
            )}
           </div>

           {!hasRefunds && o.status !== 'Cancelled' && (
            <button
             onClick={() => {
              setRefundModalOrder(o.id)
              setRefundAmount(o.total)
             }}
             className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-700 hover:text-white transition"
            >
             Initiate Gateway Refund
            </button>
           )}
          </div>
         </div>
        )}
       </div>
      )
     })
    )}
   </div>

   {/* =========================================================================
       MODAL: ASSIGN COURIER & AWB
       ========================================================================= */}
   {shipModalOrder && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
     <div className="w-full max-w-md rounded-[24px] border border-black/10 bg-white p-6 sm:p-8 shadow-2xl">
      <h3 className="font-bold text-base text-black mb-1">Fulfillment & Courier Logistics</h3>
      <p className="text-xs text-black/60 mb-4">Assign AWB tracking number for Order {shipModalOrder}</p>

      <div className="space-y-3 text-xs">
       <div>
        <label className="block font-bold text-black mb-1">Courier Partner</label>
        <select
         value={courier}
         onChange={e => setCourier(e.target.value)}
         className="input"
        >
         {COURIERS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
       </div>

       <div>
        <label className="block font-bold text-black mb-1">AWB / Airway Bill Tracking Number</label>
        <input
         value={awb}
         onChange={e => setAwb(e.target.value)}
         placeholder="e.g. BD-892019482 or DEL-902184"
         className="input font-mono"
        />
       </div>

       <div className="flex gap-2 pt-3">
        <button
         onClick={() => setShipModalOrder(null)}
         className="flex-1 rounded-full border border-black/15 py-2.5 font-bold text-black hover:bg-[#F0EEED]"
        >
         Cancel
        </button>
        <button
         onClick={() => handleSaveShipment(shipModalOrder)}
         className="flex-1 rounded-full bg-black py-2.5 font-bold text-white hover:bg-black/80"
        >
         Save & Mark Shipped
        </button>
       </div>
      </div>
     </div>
    </div>
   )}

   {/* =========================================================================
       MODAL: INITIATE RAZORPAY REFUND
       ========================================================================= */}
   {refundModalOrder && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
     <div className="w-full max-w-md rounded-[24px] border border-black/10 bg-white p-6 sm:p-8 shadow-2xl">
      <h3 className="font-bold text-base text-black mb-1">Process Gateway Refund</h3>
      <p className="text-xs text-black/60 mb-4">
       Order {refundModalOrder} · Razorpay Payment Gateway
      </p>

      <div className="space-y-3 text-xs">
       <div>
        <label className="block font-bold text-black mb-1">Refund Amount (₹)</label>
        <input
         type="number"
         value={refundAmount}
         onChange={e => setRefundAmount(Number(e.target.value))}
         className="input font-mono"
        />
        <span className="text-[10px] text-black/50 mt-1 block">
         Full refund or partial refund amount.
        </span>
       </div>

       <div>
        <label className="block font-bold text-black mb-1">Refund Note / Reason</label>
        <input
         value={refundReason}
         onChange={e => setRefundReason(e.target.value)}
         className="input"
         placeholder="Customer return approved / cancellation"
        />
       </div>

       <div className="flex gap-2 pt-3">
        <button
         disabled={refunding}
         onClick={() => setRefundModalOrder(null)}
         className="flex-1 rounded-full border border-black/15 py-2.5 font-bold text-black hover:bg-[#F0EEED]"
        >
         Cancel
        </button>
        <button
         disabled={refunding}
         onClick={() => {
          const ord = orders.find(o => o.id === refundModalOrder)
          handleProcessRefund(refundModalOrder, ord?.razorpayPaymentId, refundAmount)
         }}
         className="flex-1 rounded-full bg-red-600 py-2.5 font-bold text-white hover:bg-red-700 disabled:opacity-50"
        >
         {refunding ? 'Processing Gateway Refund…' : `Refund ${inr(refundAmount)}`}
        </button>
       </div>
      </div>
     </div>
    </div>
   )}
  </div>
 )
}
