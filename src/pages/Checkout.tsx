import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCartDetail } from '../components/CartLines'
import { useCart } from '../store/cart'
import { useOrders } from '../store/orders'
import { useProducts } from '../store/products'
import { useAccount } from '../store/account'
import { useSettings } from '../store/settings'
import { totals, type Coupon } from '../lib/pricing'
import { inr, orderId } from '../lib/format'
import { providers } from '../services/payment'
import { isDemoMode } from '../services/supabase'
import * as db from '../services/db'
import { loadCatalog } from '../services/hydrate'
import { toast } from '../store/toast'
import type { Order } from '../types'
import { ShieldCheck, Search, HelpCircle, Check, Lock, ChevronDown, MapPin } from 'lucide-react'

const INDIAN_STATES = [
 'Delhi',
 'Maharashtra',
 'Karnataka',
 'Tamil Nadu',
 'Telangana',
 'Gujarat',
 'Uttar Pradesh',
 'Haryana',
 'West Bengal',
 'Rajasthan',
 'Kerala',
 'Punjab',
 'Andhra Pradesh',
 'Madhya Pradesh',
 'Bihar',
 'Odisha',
 'Assam',
 'Goa',
 'Other Indian State / UT'
]

const schema = z.object({
 name: z.string().min(2, 'Enter your full name'),
 email: z.string().email('Enter a valid email'),
 phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
 address: z.string().min(8, 'Enter your full address'),
 city: z.string().min(2, 'Required'),
 state: z.string().min(2, 'Required'),
 pin: z.string().regex(/^\d{6}$/, 'Enter a 6-digit PIN code')
})

type F = z.infer<typeof schema>

export default function Checkout() {
 const { items, subtotal } = useCartDetail()
 const nav = useNavigate()
 const clear = useCart(s => s.clear)
 const add = useOrders(s => s.add)
 const save = useProducts(s => s.save)
 const me = useAccount(s => s.me)
 const addresses = useAccount(s => s.addresses)
 const isDemo = useSettings(s => s.isDemo)

 const [code, setCode] = useState('')
 const [coupon, setCoupon] = useState<Coupon | null>(null)
 const [cmsg, setCmsg] = useState('')
 const [pay, setPay] = useState(providers[0].id)
 const [billingMode, setBillingMode] = useState<'same' | 'diff'>('same')
 const [busy, setBusy] = useState(false)
 const [pinSearching, setPinSearching] = useState(false)

 useEffect(() => {
  const queryCoupon = new URLSearchParams(window.location.search).get('coupon')
  if (queryCoupon && !coupon) {
   const qCode = queryCoupon.trim().toUpperCase()
   setCode(qCode)
   db.fetchCoupon(qCode).then(c => {
    if (c) {
     if (c.minOrderValue && subtotal < c.minOrderValue) {
      setCmsg(`Minimum order value of ${inr(c.minOrderValue)} required for ${qCode}.`)
     } else if (c.expiryDate && new Date(c.expiryDate).getTime() < Date.now()) {
      setCmsg(`Coupon ${qCode} has expired.`)
     } else {
      setCoupon(c)
      setCmsg(`Applied: ${c.label}`)
     }
    }
   }).catch(() => {})
  }
 }, [subtotal])

 const { register, handleSubmit, setValue, formState: { errors } } = useForm<F>({
  resolver: zodResolver(schema),
  defaultValues: {
   name: me?.name ?? '',
   email: me?.email ?? '',
   phone: me?.phone ?? '',
   state: 'Delhi'
  }
 })

 const t = totals(subtotal, coupon)

 if (!items.length && !busy) {
  return (
   <div className="py-32 text-center">
    <h1 className="h-serif text-4xl">Nothing to check out</h1>
    <Link to="/shop" className="btn btn-dark mt-6 rounded-full px-8">
     Shop now
    </Link>
   </div>
  )
 }

 const apply = async () => {
  if (!code.trim()) return
  try {
   const c = await db.fetchCoupon(code.trim().toUpperCase())
   if (!c) {
    setCoupon(null)
    setCmsg('Invalid coupon code.')
    return
   }
   if (c.minOrderValue && subtotal < c.minOrderValue) {
    setCoupon(null)
    setCmsg(`Minimum order value of ${inr(c.minOrderValue)} required for this coupon.`)
    return
   }
   if (c.expiryDate && new Date(c.expiryDate).getTime() < Date.now()) {
    setCoupon(null)
    setCmsg('This coupon code has expired.')
    return
   }
   setCoupon(c)
   setCmsg(`Applied: ${c.label}`)
  } catch (e) {
   setCmsg(e instanceof Error ? e.message : 'Could not check coupon')
  }
 }

 const submit = async (f: F) => {
  const outOfStock = items.find(i => i.qty > i.p.stock)
  if (outOfStock) {
   toast(`"${outOfStock.p.name}" only has ${outOfStock.p.stock} item(s) left. Please update your cart.`, 'error')
   return
  }
  setBusy(true)
  try {
   const codeId = orderId()
   const prov = providers.find(p => p.id === pay) || providers[0]
   const r = await prov.pay(t.total, { name: f.name, email: f.email, phone: f.phone }, codeId)
   if (!r.ok) throw new Error('Payment was not completed')

   const lines = items.map(i => ({
    name: i.p.name,
    size: i.size,
    qty: i.qty,
    price: i.p.price,
    sku: i.p.sku
   }))

   const base = {
    date: new Date().toISOString(),
    customer: f,
    lines,
    status: 'Placed' as const,
    payment: r.label,
    paymentStatus: (r.method === 'cod' ? 'Pending' : 'Paid') as 'Pending' | 'Paid',
    razorpayOrderId: r.orderId,
    razorpayPaymentId: r.paymentId
   }

   let order: Order
   if (isDemoMode) {
    order = {
     ...base,
     id: codeId,
     subtotal,
     discount: t.discount,
     shipping: t.shipping,
     total: t.total,
     demo: true
    }
    items.forEach(i => save({ ...i.p, stock: Math.max(0, i.p.stock - i.qty) }))
   } else {
    const res = await db.placeOrder({
     code: codeId,
     coupon: coupon?.code,
     ship: f,
     items: items.map(i => ({ product_id: i.p.id, variant: i.size, qty: i.qty })),
     payment: r.label,
     customerId: me?.id
    })
    order = {
     ...base,
     id: res.order_code,
     dbId: res.id,
     subtotal: res.subtotal,
     discount: res.discount,
     shipping: res.shipping,
     total: res.total,
     demo: isDemo
    }
    loadCatalog()
   }

   add(order)
   clear()
   nav(`/order/${order.id}`)
  } catch (e) {
   toast(e instanceof Error ? e.message : 'Could not place your order', 'error')
   setBusy(false)
  }
 }

 const onPinBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
  const digits = e.target.value.replace(/\D/g, '').slice(0, 6)
  if (digits.length === 6 && typeof window !== 'undefined' && window.location.hostname !== 'localhost' && !navigator.userAgent.includes('jsdom')) {
   setPinSearching(true)
   try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${digits}`)
    const data = await res.json()
    if (data?.[0]?.Status === 'Success' && data[0]?.PostOffice?.[0]) {
     const po = data[0].PostOffice[0]
     setValue('city', po.District || po.Division || po.Block || '', { shouldValidate: true })
     if (po.State) {
      setValue('state', po.State, { shouldValidate: true })
     }
    }
   } catch {
   } finally {
    setPinSearching(false)
   }
  }
 }

 return (
  <div className="min-h-screen bg-white text-ink">
   <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <form onSubmit={handleSubmit(submit)} className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
     
     {/* =========================================================================
         LEFT COLUMN: DELIVERY & PAYMENT CONTROLS (MATCHING SCREENSHOT)
         ========================================================================= */}
     <div className="lg:col-span-7 space-y-8 lg:pr-8">
      
      {/* User Account / Identity Bar */}
      <div className="flex items-center justify-between border-b border-ink/10 pb-5">
       <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sand/60 text-ink font-bold text-sm shadow-sm">
         {me?.name ? me.name[0].toUpperCase() : 'G'}
        </div>
        <div>
         <p className="text-xs font-semibold text-ink">
          {me?.email || 'gulshanbinary@gmail.com'}
         </p>
         <p className="text-[11px] text-char/60">
          {me ? 'Signed in' : 'Checking out as registered guest'}
         </p>
        </div>
       </div>

       <Link to="/account" className="text-xs text-char/70 underline hover:text-ink">
        {me ? 'Switch' : 'Sign in'}
       </Link>
      </div>

      {/* 1. DELIVERY SECTION */}
      <div>
       <h2 className="text-xl font-bold tracking-tight text-ink">
        Delivery
       </h2>

       {/* Quick Saved Address Picker */}
       {addresses.length > 0 && (
        <div className="mt-3 rounded-xl border border-black/10 bg-[#F0EEED]/60 p-3">
         <p className="text-[11px] font-bold text-black uppercase tracking-wider mb-2">
          Deliver to Saved Address:
         </p>
         <div className="flex flex-wrap gap-2">
          {addresses.map(a => (
           <button
            key={a.id}
            type="button"
            onClick={() => {
             setValue('name', a.name)
             setValue('phone', a.phone)
             setValue('address', a.address + (a.apartment ? `, ${a.apartment}` : ''))
             setValue('city', a.city)
             setValue('state', a.state)
             setValue('pin', a.pin)
             toast(`Delivery address loaded: ${a.label} (${a.city})`, 'info')
            }}
            className="rounded-full border border-black/20 bg-white px-3 py-1 text-xs font-semibold hover:bg-black hover:text-white transition flex items-center gap-1.5"
           >
            <MapPin size={12} />
            <span>{a.label} ({a.city})</span>
           </button>
          ))}
         </div>
        </div>
       )}

       <div className="mt-4 space-y-3">
        {/* Country Selector */}
        <div>
         <label className="block text-[11px] font-medium text-char/70 mb-1">
          Country/Region
         </label>
         <div className="relative">
          <select
           disabled
           className="w-full appearance-none rounded-lg border border-ink/20 bg-sand/10 px-3.5 py-2.5 text-sm text-ink outline-none cursor-default font-medium"
          >
           <option value="India">India</option>
          </select>
          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-char/60 pointer-events-none" />
         </div>
        </div>

        {/* Name Fields (2 Columns) */}
        <div>
         <label htmlFor="checkout-fullname" className="block text-[11px] font-medium text-char/70 mb-1">
          Full name
         </label>
         <input
          id="checkout-fullname"
          placeholder="First and last name"
          className="w-full rounded-lg border border-ink/20 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-ink focus:ring-1 focus:ring-ink transition"
          {...register('name')}
         />
         {errors.name && <p className="mt-1 text-[11px] text-red-600">{errors.name.message}</p>}
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
         <div>
          <label htmlFor="checkout-email" className="block text-[11px] font-medium text-char/70 mb-1">
           Email
          </label>
          <input
           id="checkout-email"
           type="email"
           placeholder="you@example.com"
           className="w-full rounded-lg border border-ink/20 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-ink focus:ring-1 focus:ring-ink transition"
           {...register('email')}
          />
          {errors.email && <p className="mt-1 text-[11px] text-red-600">{errors.email.message}</p>}
         </div>

         <div>
          <div className="flex items-center justify-between mb-1">
           <label htmlFor="checkout-phone" className="text-[11px] font-medium text-char/70">
            Phone number
           </label>
           <span title="Used for courier delivery updates">
            <HelpCircle size={12} className="text-char/40" />
           </span>
          </div>
          <input
           id="checkout-phone"
           type="tel"
           placeholder="10-digit mobile number"
           className="w-full rounded-lg border border-ink/20 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-ink focus:ring-1 focus:ring-ink transition"
           {...register('phone')}
          />
          {errors.phone && <p className="mt-1 text-[11px] text-red-600">{errors.phone.message}</p>}
         </div>
        </div>

        {/* Address */}
        <div>
         <label htmlFor="checkout-address" className="block text-[11px] font-medium text-char/70 mb-1">
          Address
         </label>
         <div className="relative">
          <input
           id="checkout-address"
           placeholder="Street address, house number"
           className="w-full rounded-lg border border-ink/20 bg-white pl-3.5 pr-10 py-2.5 text-sm outline-none focus:border-ink focus:ring-1 focus:ring-ink transition"
           {...register('address')}
          />
          <Search size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-char/40 pointer-events-none" />
         </div>
         {errors.address && <p className="mt-1 text-[11px] text-red-600">{errors.address.message}</p>}
        </div>

        {/* Apartment / Suite (Optional) */}
        <div>
         <input
          placeholder="Apartment, suite, unit (optional)"
          className="w-full rounded-lg border border-ink/20 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-ink focus:ring-1 focus:ring-ink transition"
         />
        </div>

        {/* City, State, PIN code (3 Columns Matching Screenshot) */}
        <div className="grid grid-cols-3 gap-3">
         <div>
          <label htmlFor="checkout-city" className="block text-[11px] font-medium text-char/70 mb-1">
           City
          </label>
          <input
           id="checkout-city"
           placeholder="City"
           className="w-full rounded-lg border border-ink/20 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-ink focus:ring-1 focus:ring-ink transition"
           {...register('city')}
          />
          {errors.city && <p className="mt-1 text-[11px] text-red-600">{errors.city.message}</p>}
         </div>

         <div>
          <label htmlFor="checkout-state" className="block text-[11px] font-medium text-char/70 mb-1">
           State
          </label>
          <div className="relative">
           <select
            id="checkout-state"
            className="w-full appearance-none rounded-lg border border-ink/20 bg-white pl-3 pr-7 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-1 focus:ring-ink transition"
            {...register('state')}
           >
            {INDIAN_STATES.map(st => (
             <option key={st} value={st}>{st}</option>
            ))}
           </select>
           <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-char/60 pointer-events-none" />
          </div>
          {errors.state && <p className="mt-1 text-[11px] text-red-600">{errors.state.message}</p>}
         </div>

         <div>
          <div className="flex items-center justify-between mb-1">
           <label htmlFor="checkout-pin" className="text-[11px] font-medium text-char/70">
            PIN code
           </label>
           {pinSearching && <span className="text-[10px] text-char/50 animate-pulse">Detecting…</span>}
          </div>
          <input
           id="checkout-pin"
           placeholder="6 digits"
           maxLength={6}
           className="w-full rounded-lg border border-ink/20 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-ink focus:ring-1 focus:ring-ink transition font-mono"
           {...register('pin', { onBlur: onPinBlur })}
          />
          {errors.pin && <p className="mt-1 text-[11px] text-red-600">{errors.pin.message}</p>}
         </div>
        </div>
       </div>
      </div>

      {/* 2. SHIPPING METHOD */}
      <div>
       <h2 className="text-xl font-bold tracking-tight text-ink">
        Shipping method
       </h2>
       <div className="mt-3 rounded-lg border border-ink/15 bg-sand/15 p-4 text-xs text-char/80 flex items-center justify-between">
        <div>
         <p className="font-semibold text-ink">Insured Express Air Logistics</p>
         <p className="text-[11px] text-char/60">Standard doorstep delivery within 24 to 48 hours.</p>
        </div>
        <span className="font-bold text-ink font-mono">
         {t.shipping ? inr(t.shipping) : <span className="text-emerald-700">Free</span>}
        </span>
       </div>
      </div>

      {/* 3. PAYMENT SECTION (MATCHING SCREENSHOT) */}
      <div>
       <div className="flex items-center justify-between">
        <div>
         <h2 className="text-xl font-bold tracking-tight text-ink">Payment</h2>
         <p className="text-xs text-char/60 mt-0.5">All transactions are secure and encrypted.</p>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-medium">
         <ShieldCheck size={14} /> 256-Bit SSL
        </div>
       </div>

       {/* Razorpay Secure Container */}
       <div className="mt-4 rounded-xl border-2 border-black overflow-hidden shadow-sm">
        <label className="flex items-center justify-between p-4 bg-white cursor-pointer">
         <div className="flex items-center gap-3">
          <input
           type="radio"
           name="pay"
           checked={pay === 'razorpay'}
           onChange={() => setPay('razorpay')}
           className="h-4 w-4 text-black accent-black"
          />
          <div>
           <span className="text-xs sm:text-sm font-semibold text-black">
            Razorpay Secure (UPI, Cards, NetBanking, Wallets)
           </span>
          </div>
         </div>

         {/* Badges - Pure Monochrome */}
         <div className="flex items-center gap-1.5 shrink-0">
          <span className="rounded bg-black/5 border border-black/10 px-2 py-0.5 text-[10px] font-bold text-black font-mono">UPI</span>
          <span className="rounded bg-black text-white px-2 py-0.5 text-[10px] font-bold font-mono">VISA</span>
          <span className="rounded bg-black text-white px-2 py-0.5 text-[10px] font-bold font-mono">Mastercard</span>
          <span className="rounded bg-black/5 border border-black/10 px-1.5 py-0.5 text-[10px] font-bold text-black font-mono">+18</span>
         </div>
        </label>

        {/* Redirect Notice Sub-Box */}
        <div className="border-t border-black/10 bg-[#F0EEED]/40 p-6 text-center text-xs text-black/70">
         <div className="mx-auto flex max-w-sm flex-col items-center">
          <Lock size={20} className="text-black/40 mb-2" />
          <p>
           You'll be securely prompted by Razorpay to complete your payment via UPI, Credit/Debit Card, NetBanking, or Wallets.
          </p>
         </div>
        </div>
       </div>

       {/* Optional COD option */}
       <div className="mt-2.5 rounded-lg border border-ink/20 p-3.5 bg-white">
        <label className="flex items-center gap-3 cursor-pointer">
         <input
          type="radio"
          name="pay"
          checked={pay === 'cod'}
          onChange={() => setPay('cod')}
          className="h-4 w-4 accent-ink"
         />
         <div>
          <span className="text-xs sm:text-sm font-semibold text-ink">Cash on Delivery (COD)</span>
          <span className="ml-2 text-[11px] text-char/60">Pay cash upon verified doorstep delivery</span>
         </div>
        </label>
       </div>
      </div>

      {/* 4. BILLING ADDRESS SECTION (MATCHING SCREENSHOT) */}
      <div>
       <h2 className="text-xl font-bold tracking-tight text-ink">
        Billing address
       </h2>

       <div className="mt-3 rounded-xl border border-ink/20 bg-white overflow-hidden divide-y divide-ink/10">
        <label className={`flex items-center gap-3 p-3.5 cursor-pointer transition ${billingMode === 'same' ? 'bg-blue-50/30' : ''}`}>
         <input
          type="radio"
          name="billing"
          checked={billingMode === 'same'}
          onChange={() => setBillingMode('same')}
          className="h-4 w-4 text-blue-600 accent-blue-600"
         />
         <span className="text-xs sm:text-sm font-medium text-ink">
          Same as shipping address
         </span>
        </label>

        <label className={`flex items-center gap-3 p-3.5 cursor-pointer transition ${billingMode === 'diff' ? 'bg-blue-50/30' : ''}`}>
         <input
          type="radio"
          name="billing"
          checked={billingMode === 'diff'}
          onChange={() => setBillingMode('diff')}
          className="h-4 w-4 text-blue-600 accent-blue-600"
         />
         <span className="text-xs sm:text-sm font-medium text-ink">
          Use a different billing address
         </span>
        </label>
       </div>
      </div>

      {/* 5. SUBMIT BUTTON (MATCHING SCREENSHOT) */}
      <div>
       <button
        disabled={busy}
        className="w-full rounded-lg bg-[#005bd3] hover:bg-[#004bb5] text-white py-4 text-sm font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition disabled:opacity-50"
       >
        {busy ? 'Processing payment…' : isDemo ? 'Place demo order' : `Pay now · ${inr(t.total)}`}
       </button>
      </div>

      {/* Footer Policy Links (Matching Screenshot) */}
      <div className="pt-2 text-xs text-char/70 flex items-center gap-4 border-t border-ink/10">
       <Link to="/terms" className="underline hover:text-ink">Terms and policies</Link>
       <span>·</span>
       <Link to="/privacy" className="underline hover:text-ink">Privacy</Link>
       <span>·</span>
       <Link to="/returns" className="underline hover:text-ink">Return & Cancellation</Link>
      </div>
     </div>

     {/* =========================================================================
         RIGHT COLUMN: ORDER SUMMARY SIDEBAR (MATCHING SCREENSHOT)
         ========================================================================= */}
     <div className="lg:col-span-5 sticky top-24 rounded-2xl border border-ink/10 bg-[#faf9f6] p-6 sm:p-8 space-y-6">
      
      {/* Product List with Floating Quantity Badge (Matching Screenshot) */}
      <ul className="divide-y divide-ink/10">
       {items.map(i => (
        <li key={i.key} className="flex items-center justify-between gap-4 py-4 first:pt-0">
         <div className="flex items-center gap-4 min-w-0">
          {/* Thumbnail with Quantity Badge at Top-Right Corner */}
          <div className="relative shrink-0">
           <img
            src={i.p.images[0]}
            alt={i.p.name}
            className="h-16 w-14 rounded-lg object-cover border border-ink/10 bg-white"
           />
           <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-cream shadow">
            {i.qty}
           </span>
          </div>

          <div className="min-w-0">
           <p className="text-xs sm:text-sm font-bold text-ink truncate">
            {i.p.name}
           </p>
           {i.size && (
            <p className="text-[11px] text-char/60 mt-0.5">
             Variant: {i.size}
            </p>
           )}
          </div>
         </div>

         <span className="shrink-0 text-xs sm:text-sm font-bold text-ink font-mono">
          {inr(i.p.price * i.qty)}
         </span>
        </li>
       ))}
      </ul>

      {/* Discount Code Input Form (Matching Screenshot) */}
      <div className="border-t border-ink/10 pt-5">
       <div className="flex gap-2">
        <input
         aria-label="Coupon code"
         placeholder="Discount code"
         value={code}
         onChange={e => setCode(e.target.value.toUpperCase())}
         className="w-full rounded-lg border border-ink/20 bg-white px-3.5 py-2.5 text-xs uppercase tracking-wider outline-none focus:border-ink focus:ring-1 focus:ring-ink transition"
        />
        <button
         type="button"
         onClick={apply}
         className="rounded-lg border border-ink/20 bg-sand/30 hover:bg-sand/60 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-ink transition"
        >
         Apply
        </button>
       </div>
       {cmsg && (
        <p className={`mt-2 text-xs font-medium flex items-center gap-1 ${coupon ? 'text-emerald-800' : 'text-red-600'}`}>
         {coupon && <Check size={12} />}
         <span>{cmsg}</span>
        </p>
       )}
      </div>

      {/* Price Calculations (Matching Screenshot) */}
      <div className="border-t border-ink/10 pt-5 space-y-3 text-xs sm:text-sm">
       <div className="flex justify-between text-char/70">
        <span>Subtotal</span>
        <span className="font-semibold text-ink font-mono">{inr(subtotal)}</span>
       </div>

       {t.discount > 0 && (
        <div className="flex justify-between text-emerald-800 font-semibold">
         <span>Discount</span>
         <span className="font-mono">−{inr(t.discount)}</span>
        </div>
       )}

       <div className="flex justify-between text-char/70">
        <span className="flex items-center gap-1">
         Shipping <HelpCircle size={12} className="text-char/40" />
        </span>
        <span className="font-medium text-ink font-mono">
         {t.shipping ? inr(t.shipping) : <span className="text-emerald-700 font-semibold">Free</span>}
        </span>
       </div>

       {/* Grand Total */}
       <div className="border-t border-ink/10 pt-4 flex items-baseline justify-between text-ink">
        <span className="text-base font-bold">Total</span>
        <div className="flex items-baseline gap-1.5 font-mono">
         <span className="text-xs text-char/60 font-sans">INR</span>
         <span className="text-2xl font-black">{inr(t.total)}</span>
        </div>
       </div>
      </div>
     </div>
    </form>
   </div>
  </div>
 )
}
