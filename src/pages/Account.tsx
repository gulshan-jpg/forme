import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import {
 Package,
 MapPin,
 User as UserIcon,
 Shield,
 LogOut,
 Printer,
 ArrowRight,
 RotateCcw,
 Ban,
 CheckCircle2,
 Truck,
 Clock,
 Plus,
 Trash2,
 Check,
 AlertCircle,
 X,
 ChevronDown,
 ChevronUp,
 Heart,
 ShoppingBag,
 Award,
 Gift,
 Star,
 MessageSquare
} from 'lucide-react'
import { useAccount, DEMO_CUSTOMER, type R } from '../store/account'
import { useOrders } from '../store/orders'
import { useCart } from '../store/cart'
import { useProducts } from '../store/products'
import { isDemoMode } from '../services/supabase'
import * as db from '../services/db'
import type { Order, SavedAddress, OrderReturn, ReturnType, Review } from '../types'
import { inr } from '../lib/format'
import { toast } from '../store/toast'
import { openPrintableInvoice } from '../lib/invoice'

const inS = z.object({
 email: z.string().email('Enter a valid email'),
 password: z.string().min(6, 'At least 6 characters')
})

const upS = inS.extend({
 name: z.string().min(2, 'Enter your name'),
 phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number')
})

const addrS = z.object({
 label: z.enum(['Home', 'Office', 'Other']),
 name: z.string().min(2, 'Recipient name is required'),
 phone: z.string().regex(/^[6-9]\d{9}$/, '10-digit phone number is required'),
 address: z.string().min(6, 'Full address line is required'),
 apartment: z.string().optional(),
 city: z.string().min(2, 'City is required'),
 state: z.string().min(2, 'State is required'),
 pin: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
 isDefault: z.boolean().default(false)
})

const Err = ({ m }: { m?: string }) => m ? <span className="text-xs text-red-600 block mt-1">{m}</span> : null

function SignIn() {
 const { signIn } = useAccount()
 const [msg, setMsg] = useState('')
 const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof inS>>({
  resolver: zodResolver(inS),
  defaultValues: isDemoMode ? DEMO_CUSTOMER : {}
 })

 return (
  <form
   onSubmit={handleSubmit(async v => {
    const r = await signIn(v.email, v.password)
    if (!r.ok) setMsg(r.msg ?? 'Sign-in failed')
   })}
   className="mt-6 space-y-4 text-sm"
  >
   <div>
    <label className="block text-xs font-semibold text-black/70 mb-1">
     Email
     <input
      className="input mt-1 placeholder:text-black/40 text-sm"
      type="email"
      placeholder="Enter email here"
      {...register('email')}
     />
    </label>
    <Err m={errors.email?.message} />
   </div>

   <div>
    <label className="block text-xs font-semibold text-black/70 mb-1">
     Password
     <input
      className="input mt-1 placeholder:text-black/40 text-sm"
      type="password"
      placeholder="Enter password here"
      {...register('password')}
     />
    </label>
    <Err m={errors.password?.message} />
   </div>

   {msg && <p className="text-xs font-medium text-red-600">{msg}</p>}

   {isDemoMode && (
    <p className="text-[11px] text-black/50 bg-[#F0EEED] p-2.5 rounded-lg">
     💡 Demo credentials prefilled: <b>{DEMO_CUSTOMER.email}</b> / <b>{DEMO_CUSTOMER.password}</b>
    </p>
   )}

   <button disabled={isSubmitting} className="w-full rounded-full bg-black py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-black/80 transition">
    {isSubmitting ? 'Signing in…' : 'Sign in'}
   </button>
  </form>
 )
}

function SignUp() {
 const { signUp } = useAccount()
 const [msg, setMsg] = useState<R | null>(null)
 const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof upS>>({
  resolver: zodResolver(upS)
 })

 return (
  <form
   onSubmit={handleSubmit(async v => {
    const res = await signUp(v.name, v.email, v.phone, v.password)
    setMsg(res)
    if (res.ok) {
     toast('Account created successfully! Welcome to FORME®.', 'ok')
    }
   })}
   className="mt-6 space-y-4 text-sm"
  >
   <div>
    <label className="block text-xs font-semibold text-black/70 mb-1">
     Full name
     <input
      className="input mt-1 placeholder:text-black/40 text-sm"
      placeholder="Enter full name here"
      {...register('name')}
     />
    </label>
    <Err m={errors.name?.message} />
   </div>

   <div>
    <label className="block text-xs font-semibold text-black/70 mb-1">
     Email
     <input
      className="input mt-1 placeholder:text-black/40 text-sm"
      type="email"
      placeholder="Enter email here"
      {...register('email')}
     />
    </label>
    <Err m={errors.email?.message} />
   </div>

   <div>
    <label className="block text-xs font-semibold text-black/70 mb-1">
     Mobile number
     <input
      className="input mt-1 placeholder:text-black/40 text-sm"
      type="tel"
      placeholder="Enter 10-digit mobile number"
      {...register('phone')}
     />
    </label>
    <Err m={errors.phone?.message} />
   </div>

   <div>
    <label className="block text-xs font-semibold text-black/70 mb-1">
     Password
     <input
      className="input mt-1 placeholder:text-black/40 text-sm"
      type="password"
      placeholder="Enter password here"
      {...register('password')}
     />
    </label>
    <Err m={errors.password?.message} />
   </div>

   {msg && (
    <p className={`text-xs font-medium ${msg.ok ? 'text-emerald-700' : 'text-red-600'}`}>
     {msg.msg ?? 'Account created successfully.'}
    </p>
   )}

   <button disabled={isSubmitting} className="w-full rounded-full bg-black py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-black/80 transition">
    {isSubmitting ? 'Creating…' : 'Create account'}
   </button>
  </form>
 )
}

export default function Account() {
 const { me, signOut, addresses, addAddress, deleteAddress, setDefaultAddress, updateProfile, changePassword } = useAccount()
 const { orders, cancelOrder, requestReturn } = useOrders()
 const { wishlist, toggleWish, add: addToCart } = useCart()
 const products = useProducts(s => s.products)
 const wishProducts = wishlist
  .map(id => products.find(p => p.id === id))
  .filter((p): p is (typeof products)[0] => Boolean(p))
 
 const [mode, setMode] = useState<'in' | 'up'>('in')
 const [tab, setTab] = useState<'orders' | 'addresses' | 'wishlist' | 'reviews' | 'loyalty' | 'profile' | 'security'>('orders')
 const [mine, setMine] = useState<Order[]>([])
 const [myReviews, setMyReviews] = useState<Review[]>([])
 const [loading, setLoading] = useState(false)
 
 const loyaltyPoints = mine.reduce((a, o) => a + Math.floor(o.total / 100), 0) + 150
 
 // Expanded Order details accordion
 const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
 
 // Modal states
 const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null)
 const [cancelReason, setCancelReason] = useState('Changed mind / found alternate product')
 
 const [returnModalOrder, setReturnModalOrder] = useState<Order | null>(null)
 const [returnType, setReturnType] = useState<ReturnType>('return')
 const [returnReason, setReturnReason] = useState('Size did not fit comfortably')
 const [returnDetails, setReturnDetails] = useState('')
 const [exchangeSize, setExchangeSize] = useState('Large')

 // Address Form Modal
 const [showAddAddr, setShowAddAddr] = useState(false)

 // Profile Form
 const [profName, setProfName] = useState('')
 const [profPhone, setProfPhone] = useState('')

 // Password Form
 const [oldPass, setOldPass] = useState('')
 const [newPass, setNewPass] = useState('')

 useEffect(() => {
  if (me) {
   setProfName(me.name)
   setProfPhone(me.phone)
   db.fetchLatestReviews(30).then(revs => {
    const userFirst = me.name.split(' ')[0].toLowerCase()
    const matching = revs.filter(r => r.name.toLowerCase().includes(userFirst) || !r.sample)
    setMyReviews(matching.length ? matching : revs.slice(0, 2))
   }).catch(() => {})
  }
 }, [me])

 useEffect(() => {
  if (!me) {
   setMine([])
   return
  }
  if (isDemoMode) {
   // Filter orders matching logged in user or show seeded store orders
   const userOrders = orders.filter(o => 
    o.customer.email.toLowerCase() === me.email.toLowerCase() ||
    o.customer.email.toLowerCase() === 'customer@forme.demo'
   )
   setMine(userOrders.length ? userOrders : orders.slice(0, 4))
   return
  }
  setLoading(true)
  db.fetchMyOrders()
   .then(setMine)
   .catch(e => toast(e.message, 'error'))
   .finally(() => setLoading(false))
 }, [me?.id, orders])

 const handleCancelSubmit = () => {
  if (!cancelModalOrder) return
  cancelOrder(cancelModalOrder.id, cancelReason)
  toast(`Order ${cancelModalOrder.id} has been cancelled successfully. Refund initiated.`, 'info')
  setCancelModalOrder(null)
 }

 const handleReturnSubmit = () => {
  if (!returnModalOrder) return
  requestReturn(returnModalOrder.id, {
   orderId: returnModalOrder.id,
   customerEmail: me?.email,
   type: returnType,
   status: 'pending',
   reason: returnReason,
   details: returnDetails,
   exchangeVariant: returnType === 'exchange' ? exchangeSize : undefined
  })
  toast(`Your ${returnType} request for order ${returnModalOrder.id} was submitted for inspection!`, 'info')
  setReturnModalOrder(null)
 }

 const handleAddressSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  const addr = {
   customerId: me?.id || 'demo-customer',
   label: formData.get('label') as 'Home' | 'Office' | 'Other',
   name: formData.get('name') as string,
   phone: formData.get('phone') as string,
   address: formData.get('address') as string,
   apartment: formData.get('apartment') as string,
   city: formData.get('city') as string,
   state: formData.get('state') as string,
   pin: formData.get('pin') as string,
   isDefault: formData.get('isDefault') === 'on'
  }
  addAddress(addr)
  toast('New delivery address saved!', 'info')
  setShowAddAddr(false)
 }

 const handleProfileSave = async (e: React.FormEvent) => {
  e.preventDefault()
  const res = await updateProfile(profName, profPhone)
  if (res.ok) toast('Profile updated successfully!', 'info')
  else toast(res.msg || 'Update failed', 'error')
 }

 const handlePasswordChange = async (e: React.FormEvent) => {
  e.preventDefault()
  const res = await changePassword(oldPass, newPass)
  if (res.ok) {
   toast('Password changed successfully!', 'info')
   setOldPass('')
   setNewPass('')
  } else {
   toast(res.msg || 'Failed to change password', 'error')
  }
 }

 // =========================================================================
 // 1. AUTH SCREEN (NOT LOGGED IN)
 // =========================================================================
 if (!me) {
  return (
   <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
    <div className="rounded-[24px] border border-black/10 bg-white p-8 shadow-sm">
     <h1 className="font-integral font-bold text-3xl text-center uppercase tracking-normal text-black">
      Customer Portal
     </h1>
     <p className="mt-1 text-center text-xs text-black/60">
      Access order history, live tracking, returns and saved addresses
     </p>

     <div className="mt-6 flex rounded-full bg-[#F0F0F0] p-1">
      {(['in', 'up'] as const).map(m => (
       <button
        key={m}
        onClick={() => setMode(m)}
        className={`flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-wider transition ${
         mode === m ? 'bg-black text-white shadow-xs' : 'text-black/60 hover:text-black'
        }`}
       >
        {m === 'in' ? 'Sign in' : 'Register'}
       </button>
      ))}
     </div>

     {mode === 'in' ? <SignIn /> : <SignUp />}
    </div>
   </div>
  )
 }

 // =========================================================================
 // 2. CUSTOMER DASHBOARD (AUTHENTICATED)
 // =========================================================================
 return (
  <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
   {/* Welcome Header */}
   <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-6">
    <div>
     <h1 className="font-integral font-bold text-3xl sm:text-4xl uppercase tracking-normal text-black">
      Hello, {me.name.split(' ')[0]}
     </h1>
     <p className="mt-1 text-xs text-black/60">
      {me.email} · {me.phone} · <span className="text-emerald-700 font-bold">FORME® Club Member</span>
     </p>
    </div>

    <button
     onClick={() => signOut()}
     className="flex items-center gap-2 rounded-full border border-black/15 bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white transition"
    >
     <LogOut size={14} />
     <span>Sign out</span>
    </button>
   </div>

   {/* Dashboard Layout: Left Tabs + Right Content */}
   <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    {/* Left Tab Navigation */}
    <aside className="lg:col-span-3 rounded-[20px] border border-black/10 bg-white p-3 shadow-xs space-y-1">
     <button
      onClick={() => setTab('orders')}
      className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition ${
       tab === 'orders' ? 'bg-black text-white' : 'text-black/70 hover:bg-[#F0EEED]'
      }`}
     >
      <div className="flex items-center gap-2.5">
       <Package size={16} />
       <span>Orders & Tracking</span>
      </div>
      <span className="text-[11px] font-normal opacity-70">({mine.length})</span>
     </button>

     <button
      onClick={() => setTab('addresses')}
      className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition ${
       tab === 'addresses' ? 'bg-black text-white' : 'text-black/70 hover:bg-[#F0EEED]'
      }`}
     >
      <div className="flex items-center gap-2.5">
       <MapPin size={16} />
       <span>Saved Addresses</span>
      </div>
      <span className="text-[11px] font-normal opacity-70">({addresses.length})</span>
     </button>

     <button
      onClick={() => setTab('wishlist')}
      className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition ${
       tab === 'wishlist' ? 'bg-black text-white' : 'text-black/70 hover:bg-[#F0EEED]'
      }`}
     >
      <div className="flex items-center gap-2.5">
       <Heart size={16} />
       <span>Saved Wishlist</span>
      </div>
      <span className="text-[11px] font-normal opacity-70">({wishlist.length})</span>
     </button>

     <button
      onClick={() => setTab('reviews')}
      className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition ${
       tab === 'reviews' ? 'bg-black text-white' : 'text-black/70 hover:bg-[#F0EEED]'
      }`}
     >
      <div className="flex items-center gap-2.5">
       <MessageSquare size={16} />
       <span>Product Reviews</span>
      </div>
      <span className="text-[11px] font-normal opacity-70">({myReviews.length})</span>
     </button>

     <button
      onClick={() => setTab('loyalty')}
      className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition ${
       tab === 'loyalty' ? 'bg-black text-white' : 'text-black/70 hover:bg-[#F0EEED]'
      }`}
     >
      <div className="flex items-center gap-2.5">
       <Award size={16} />
       <span>FORME® Rewards</span>
      </div>
      <span className="text-[11px] font-bold text-amber-600">{loyaltyPoints} pts</span>
     </button>

     <button
      onClick={() => setTab('profile')}
      className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition ${
       tab === 'profile' ? 'bg-black text-white' : 'text-black/70 hover:bg-[#F0EEED]'
      }`}
     >
      <div className="flex items-center gap-2.5">
       <UserIcon size={16} />
       <span>Profile Settings</span>
      </div>
     </button>

     <button
      onClick={() => setTab('security')}
      className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition ${
       tab === 'security' ? 'bg-black text-white' : 'text-black/70 hover:bg-[#F0EEED]'
      }`}
     >
      <div className="flex items-center gap-2.5">
       <Shield size={16} />
       <span>Password & Security</span>
      </div>
     </button>
    </aside>

    {/* Right Tab Content */}
    <div className="lg:col-span-9">
     {/* TAB 1: ORDERS & TRACKING */}
     {tab === 'orders' && (
      <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h2 className="font-integral font-bold text-xl uppercase tracking-normal text-black">
         Your Order History
        </h2>
        <span className="text-xs text-black/60">{mine.length} total orders</span>
       </div>

       {loading ? (
        <div className="p-12 text-center text-sm text-black/60">Loading your orders…</div>
       ) : mine.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-black/20 p-12 text-center">
         <p className="font-bold text-lg text-black">No orders found</p>
         <p className="text-xs text-black/60 mt-1">Discover our heavyweight knitwear and sensory essentials.</p>
         <Link to="/shop" className="mt-4 inline-block rounded-full bg-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black/80 transition">
          Browse Catalogue
         </Link>
        </div>
       ) : (
        <div className="space-y-4">
         {mine.map(o => {
          const isExpanded = expandedOrderId === o.id
          const canCancel = o.status === 'Placed'
          const canReturn = o.status === 'Delivered'
          const hasReturns = o.returns && o.returns.length > 0

          return (
           <div
            key={o.id}
            className="rounded-[20px] border border-black/10 bg-white p-5 sm:p-6 shadow-xs transition hover:border-black/30"
           >
            {/* Order Card Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-4">
             <div>
              <div className="flex items-center gap-3">
               <span className="font-bold text-base text-black font-mono">{o.id}</span>
               <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                o.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                o.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                'bg-amber-100 text-amber-800'
               }`}>
                {o.status}
               </span>
               {o.paymentStatus === 'Refunded' && (
                <span className="rounded-full bg-purple-100 text-purple-800 px-2 py-0.5 text-[10px] font-bold">
                 Refunded
                </span>
               )}
              </div>
              <p className="text-xs text-black/50 mt-1">
               Placed on {new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
             </div>

             <div className="flex items-center gap-4">
              <span className="font-bold text-base text-black font-sans">{inr(o.total)}</span>
              <button
               onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
               className="flex items-center gap-1 text-xs font-bold text-black hover:underline"
              >
               <span>{isExpanded ? 'Hide' : 'Details'}</span>
               {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
             </div>
            </div>

            {/* Shipment Live Progress Bar (Placed -> Packed -> Shipped -> Delivered) */}
            {o.status !== 'Cancelled' && (
             <div className="mt-5 bg-[#F0EEED]/60 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs mb-2">
               <span className="font-bold text-black flex items-center gap-1.5">
                <Truck size={14} />
                <span>
                 {o.status === 'Delivered' ? 'Package Delivered' :
                  o.status === 'Shipped' ? `In Transit via ${o.shipment?.courierPartner || 'BlueDart Air'}` :
                  o.status === 'Packed' ? 'Packed at Warehouse' : 'Order Placed & Confirmed'}
                </span>
               </span>
               {o.shipment?.trackingNumber && (
                <span className="font-mono text-[11px] text-black/60">
                 AWB: {o.shipment.trackingNumber}
                </span>
               )}
              </div>

              {/* Progress 4 steps */}
              <div className="grid grid-cols-4 gap-2 pt-1 text-[10px] text-center font-bold">
               {['Placed', 'Packed', 'Shipped', 'Delivered'].map((step, idx) => {
                const stepIdx = ['Placed', 'Packed', 'Shipped', 'Delivered'].indexOf(o.status)
                const isPassed = stepIdx >= idx
                return (
                 <div key={step}>
                  <div className={`h-1.5 w-full rounded-full ${isPassed ? 'bg-black' : 'bg-black/15'}`} />
                  <span className={`mt-1.5 block ${isPassed ? 'text-black' : 'text-black/40'}`}>
                   {step}
                  </span>
                 </div>
                )
               })}
              </div>
             </div>
            )}

            {/* Items Summary Strip */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-black/70">
             <div>
              {o.lines.map((l, i) => (
               <span key={i} className="inline-block mr-2">
                <b>{l.name}</b> {l.size ? `(${l.size})` : ''} × {l.qty}
                {i < o.lines.length - 1 ? ' · ' : ''}
               </span>
              ))}
             </div>

             {/* Action Buttons */}
             <div className="flex flex-wrap items-center gap-2">
              {/* Print / Download Invoice */}
              <button
               onClick={() => openPrintableInvoice(o, 'FORME®')}
               className="flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-3 py-1.5 text-xs font-bold text-black hover:bg-black hover:text-white transition"
              >
               <Printer size={13} />
               <span>Tax Invoice</span>
              </button>

              {/* Cancel button if placed */}
              {canCancel && (
               <button
                onClick={() => setCancelModalOrder(o)}
                className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-700 hover:text-white transition"
               >
                <Ban size={13} />
                <span>Cancel Order</span>
               </button>
              )}

              {/* Return / Exchange button if delivered */}
              {canReturn && (
               <button
                onClick={() => setReturnModalOrder(o)}
                className="flex items-center gap-1.5 rounded-full border border-black/20 bg-black/5 px-3 py-1.5 text-xs font-bold text-black hover:bg-black hover:text-white transition"
               >
                <RotateCcw size={13} />
                <span>Return / Exchange</span>
               </button>
              )}
             </div>
            </div>

            {/* Expanded Order Details Accordion */}
            {isExpanded && (
             <div className="mt-6 border-t border-black/10 pt-5 space-y-4 text-xs animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F0EEED]/40 p-4 rounded-xl">
               <div>
                <p className="font-bold text-black mb-1">Shipping Address</p>
                <p className="text-black/80">{o.customer.name}</p>
                <p className="text-black/60">{o.customer.address}, {o.customer.city}, {o.customer.state} — {o.customer.pin}</p>
                <p className="text-black/60 mt-1">Phone: {o.customer.phone} · Email: {o.customer.email}</p>
               </div>
               <div>
                <p className="font-bold text-black mb-1">Payment & Logistics Details</p>
                <p className="text-black/80">Method: {o.payment}</p>
                {o.razorpayPaymentId && (
                 <p className="font-mono text-black/60">Payment ID: {o.razorpayPaymentId}</p>
                )}
                {o.shipment && (
                 <p className="text-black/60 mt-1">
                  Courier: <b>{o.shipment.courierPartner}</b> ({o.shipment.awbCode || 'Direct Dispatch'})
                 </p>
                )}
               </div>
              </div>

              {/* Return Requests History if present */}
              {hasReturns && (
               <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 space-y-1">
                <p className="font-bold text-amber-900 flex items-center gap-1">
                 <AlertCircle size={14} /> Active Return / Cancellation Request
                </p>
                {o.returns?.map(r => (
                 <div key={r.id} className="text-[11px] text-amber-800">
                  <span>Type: <b>{r.type.toUpperCase()}</b> · Status: <b>{r.status.toUpperCase()}</b> · Reason: {r.reason}</span>
                  {r.exchangeVariant && <span> (Requested: {r.exchangeVariant})</span>}
                  {r.adminNotes && <div className="text-black/70 mt-0.5">Note from warehouse: {r.adminNotes}</div>}
                 </div>
                ))}
               </div>
              )}
             </div>
            )}
           </div>
          )
         })}
        </div>
       )}
      </div>
     )}

     {/* TAB 2: SAVED ADDRESSES */}
     {tab === 'addresses' && (
      <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
         <h2 className="font-integral font-bold text-xl uppercase tracking-normal text-black">
          Saved Delivery Addresses
         </h2>
         <p className="text-xs text-black/60">Speed up your checkout with saved delivery destinations</p>
        </div>

        <button
         onClick={() => setShowAddAddr(true)}
         className="flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-black/80 transition"
        >
         <Plus size={14} />
         <span>Add New Address</span>
        </button>
       </div>

       {addresses.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-black/20 p-12 text-center">
         <p className="font-bold text-base text-black">No saved addresses yet</p>
         <button
          onClick={() => setShowAddAddr(true)}
          className="mt-4 rounded-full bg-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
         >
          Add First Address
         </button>
        </div>
       ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         {addresses.map(a => (
          <div
           key={a.id}
           className={`rounded-[20px] border p-5 bg-white shadow-xs flex flex-col justify-between transition ${
            a.isDefault ? 'border-black ring-1 ring-black' : 'border-black/10 hover:border-black/30'
           }`}
          >
           <div>
            <div className="flex items-center justify-between mb-2">
             <span className="rounded-full bg-[#F0EEED] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
              {a.label}
             </span>
             {a.isDefault && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
               <Check size={11} /> Default
              </span>
             )}
            </div>

            <p className="font-bold text-sm text-black">{a.name}</p>
            <p className="text-xs text-black/60 mt-1 leading-relaxed">
             {a.address}{a.apartment ? `, ${a.apartment}` : ''}<br />
             {a.city}, {a.state} — <b>{a.pin}</b>
            </p>
            <p className="text-xs text-black/50 mt-2 font-mono">Phone: {a.phone}</p>
           </div>

           <div className="mt-5 border-t border-black/10 pt-3 flex items-center justify-between text-xs">
            {!a.isDefault ? (
             <button
              onClick={() => setDefaultAddress(a.id)}
              className="text-black font-bold hover:underline"
             >
              Set as Default
             </button>
            ) : <span className="text-black/40">Primary address</span>}

            <button
             onClick={() => deleteAddress(a.id)}
             className="text-red-600 hover:text-red-800 p-1"
             title="Delete address"
            >
             <Trash2 size={15} />
            </button>
           </div>
          </div>
         ))}
        </div>
       )}
      </div>
     )}

     {/* TAB: SAVED WISHLIST */}
     {tab === 'wishlist' && (
      <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
         <h2 className="font-integral font-bold text-xl uppercase tracking-normal text-black">
          Saved Wishlist
         </h2>
         <p className="text-xs text-black/60">Items you have bookmarked for later purchase</p>
        </div>
        <span className="text-xs text-black/60">{wishProducts.length} items</span>
       </div>

       {wishProducts.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-black/20 p-12 text-center bg-white">
         <Heart size={32} className="mx-auto text-black/30" />
         <p className="font-bold text-lg text-black mt-3">Your wishlist is empty</p>
         <p className="text-xs text-black/60 mt-1">Tap the heart icon on any product in the store to save it here.</p>
         <Link to="/shop" className="mt-5 inline-block rounded-full bg-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black/80 transition">
          Discover Collections
         </Link>
        </div>
       ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
         {wishProducts.map(p => (
          <div key={p.id} className="rounded-[20px] border border-black/10 bg-white p-4 shadow-xs flex flex-col justify-between">
           <div>
            <Link to={`/product/${p.slug}`} className="aspect-square w-full rounded-[14px] bg-[#F0EEED] p-3 flex items-center justify-center overflow-hidden block">
             <img src={p.images[0]} alt={p.name} className="h-full w-full object-contain mix-blend-multiply hover:scale-105 transition" />
            </Link>
            <div className="mt-3">
             <Link to={`/product/${p.slug}`} className="font-bold text-sm text-black hover:text-black/70 truncate block">
              {p.name}
             </Link>
             <p className="text-xs text-black/60 mt-0.5">{p.category} · {inr(p.price)}</p>
            </div>
           </div>

           <div className="mt-4 flex items-center gap-2 pt-3 border-t border-black/10">
            <button
             type="button"
             disabled={p.stock === 0}
             onClick={() => {
              addToCart(p.id, 1, p.sizes[0])
              toast(`Added ${p.name} to cart!`)
             }}
             className="flex-1 rounded-full bg-black py-2 text-xs font-bold text-white hover:bg-black/80 transition disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
             <ShoppingBag size={13} /> Add to Cart
            </button>
            <button
             type="button"
             onClick={() => toggleWish(p.id)}
             title="Remove from wishlist"
             className="p-2 rounded-full border border-black/15 text-black/50 hover:text-red-600 transition"
            >
             <Trash2 size={15} />
            </button>
           </div>
          </div>
         ))}
        </div>
       )}
      </div>
     )}

     {/* TAB: FORME REWARDS & LOYALTY */}
     {tab === 'loyalty' && (
      <div className="max-w-2xl space-y-6">
       <div>
        <h2 className="font-integral font-bold text-xl uppercase tracking-normal text-black">
         FORME® Club Rewards
        </h2>
        <p className="text-xs text-black/60">Earn points on every order and unlock private D2C privileges</p>
       </div>

       {/* Points Card */}
       <div className="rounded-[24px] bg-black text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between">
         <span className="text-xs font-bold uppercase tracking-widest text-white/70">Reward Points Balance</span>
         <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold text-white">Tier: Gold Member</span>
        </div>
        <p className="font-integral text-4xl sm:text-5xl font-bold mt-4">{loyaltyPoints} <span className="text-lg font-normal text-white/70">Points</span></p>
        <p className="mt-2 text-xs text-white/60">Worth ₹{loyaltyPoints} in direct checkout credits. Points never expire.</p>
        <div className="mt-6 flex flex-wrap gap-4 border-t border-white/10 pt-4 text-xs">
         <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>Complimentary Express Shipping</span>
         </div>
         <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>Early Drop Access (24h prior)</span>
         </div>
        </div>
       </div>

       {/* Referral Box */}
       <div className="rounded-[20px] border border-black/10 bg-white p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 font-bold text-sm text-black">
         <Gift size={16} /> Refer a Friend
        </div>
        <p className="text-xs text-black/60">
         Share your invite link with friends. They receive ₹200 off their first purchase with coupon <strong>WELCOME10</strong>, and you earn 200 reward points on their first delivery!
        </p>
        <div className="flex gap-2">
         <input
          readOnly
          value={`https://forme.store?ref=FRM-${me.name.split(' ')[0].toUpperCase()}`}
          className="input text-xs font-mono bg-[#F0EEED] text-black/70 flex-1"
         />
         <button
          type="button"
          onClick={() => {
           navigator.clipboard.writeText(`https://forme.store?ref=FRM-${me.name.split(' ')[0].toUpperCase()}`)
           toast('Referral link copied to clipboard!')
          }}
          className="rounded-full bg-black px-5 py-2 text-xs font-bold text-white hover:bg-black/80 transition"
         >
          Copy Link
         </button>
        </div>
       </div>
      </div>
     )}

     {/* TAB: PRODUCT REVIEWS */}
     {tab === 'reviews' && (
      <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
         <h2 className="font-integral font-bold text-xl uppercase tracking-normal text-black">
          Your Product Reviews
         </h2>
         <p className="text-xs text-black/60">Ratings and feedback you've shared on FORME® pieces</p>
        </div>
        <span className="text-xs text-black/60">{myReviews.length} reviews</span>
       </div>

       {myReviews.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-black/20 p-12 text-center bg-white">
         <MessageSquare size={32} className="mx-auto text-black/30" />
         <p className="font-bold text-lg text-black mt-3">No reviews submitted yet</p>
         <p className="text-xs text-black/60 mt-1">Share your feedback on any product page to help the FORME® community.</p>
         <Link to="/shop" className="mt-5 inline-block rounded-full bg-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black/80 transition">
          Browse Products
         </Link>
        </div>
       ) : (
        <div className="space-y-4">
         {myReviews.map(r => {
          const prod = products.find(p => p.id === r.productId)
          return (
           <div key={r.id} className="rounded-[20px] border border-black/10 bg-white p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-3">
             <div>
              <Link to={prod ? `/product/${prod.slug}` : '/shop'} className="font-bold text-sm text-black hover:text-black/70 flex items-center gap-1.5">
               {prod?.name || 'FORME® Product'} <ArrowRight size={13} />
              </Link>
              <span className="text-[11px] text-black/40">{new Date(r.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
             </div>
             <div className="flex text-black">
              {[1, 2, 3, 4, 5].map(star => (
               <Star key={star} size={15} fill={star <= r.rating ? '#000000' : '#E5E5E5'} strokeWidth={0} />
              ))}
             </div>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-black/70 leading-relaxed font-normal">
             "{r.text}"
            </p>
           </div>
          )
         })}
        </div>
       )}
      </div>
     )}

     {/* TAB 3: PROFILE SETTINGS */}
     {tab === 'profile' && (
      <div className="max-w-xl space-y-6">
       <div>
        <h2 className="font-integral font-bold text-xl uppercase tracking-normal text-black">
         Profile Settings
        </h2>
        <p className="text-xs text-black/60">Update your primary contact information</p>
       </div>

       <form onSubmit={handleProfileSave} className="rounded-[20px] border border-black/10 bg-white p-6 shadow-xs space-y-4 text-xs">
        <div>
         <label className="block font-bold text-black/70 mb-1">Full Name</label>
         <input
          value={profName}
          onChange={e => setProfName(e.target.value)}
          className="input"
          placeholder="Your full name"
         />
        </div>

        <div>
         <label className="block font-bold text-black/70 mb-1">Email Address</label>
         <input
          value={me.email}
          disabled
          className="input bg-[#F0EEED]/60 text-black/60 cursor-not-allowed"
         />
         <span className="text-[10px] text-black/40 mt-1 block">Account email cannot be modified directly.</span>
        </div>

        <div>
         <label className="block font-bold text-black/70 mb-1">Mobile Number (India)</label>
         <input
          value={profPhone}
          onChange={e => setProfPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          className="input"
          placeholder="10-digit mobile number"
         />
        </div>

        <button
         type="submit"
         className="rounded-full bg-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black/80 transition"
        >
         Save Changes
        </button>
       </form>
      </div>
     )}

     {/* TAB 4: PASSWORD & SECURITY */}
     {tab === 'security' && (
      <div className="max-w-xl space-y-6">
       <div>
        <h2 className="font-integral font-bold text-xl uppercase tracking-normal text-black">
         Password & Security
        </h2>
        <p className="text-xs text-black/60">Ensure your account credentials remain protected</p>
       </div>

       <form onSubmit={handlePasswordChange} className="rounded-[20px] border border-black/10 bg-white p-6 shadow-xs space-y-4 text-xs">
        <div>
         <label className="block font-bold text-black/70 mb-1">Current Password</label>
         <input
          type="password"
          value={oldPass}
          onChange={e => setOldPass(e.target.value)}
          className="input"
          placeholder="Enter current password"
         />
        </div>

        <div>
         <label className="block font-bold text-black/70 mb-1">New Password</label>
         <input
          type="password"
          value={newPass}
          onChange={e => setNewPass(e.target.value)}
          className="input"
          placeholder="Minimum 6 characters"
         />
        </div>

        <button
         type="submit"
         className="rounded-full bg-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black/80 transition"
        >
         Update Password
        </button>
       </form>
      </div>
     )}
    </div>
   </div>

   {/* =========================================================================
       MODAL: ORDER CANCELLATION
       ========================================================================= */}
   {cancelModalOrder && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
     <div className="w-full max-w-md rounded-[24px] border border-black/10 bg-white p-6 sm:p-8 shadow-2xl">
      <div className="flex items-center justify-between border-b border-black/10 pb-3">
       <h3 className="font-bold text-base text-black">Cancel Order {cancelModalOrder.id}</h3>
       <button onClick={() => setCancelModalOrder(null)} className="p-1 text-black/40 hover:text-black">
        <X size={18} />
       </button>
      </div>

      <div className="mt-4 space-y-4 text-xs">
       <p className="text-black/70">
        You may cancel this order before dispatch. The total amount of <b>{inr(cancelModalOrder.total)}</b> will be refunded back to your original source of payment within 24-48 hours.
       </p>

       <div>
        <label className="block font-bold text-black mb-1">Select Reason for Cancellation</label>
        <select
         value={cancelReason}
         onChange={e => setCancelReason(e.target.value)}
         className="input"
        >
         <option value="Changed mind / found alternate product">Changed mind / found alternate product</option>
         <option value="Incorrect size or color variant selected">Incorrect size or color variant selected</option>
         <option value="Delivery duration too long">Delivery duration too long</option>
         <option value="Ordered by mistake">Ordered by mistake</option>
         <option value="Other reason">Other reason</option>
        </select>
       </div>

       <div className="flex gap-2 pt-2">
        <button
         onClick={() => setCancelModalOrder(null)}
         className="flex-1 rounded-full border border-black/15 py-2.5 font-bold text-black hover:bg-[#F0EEED]"
        >
         Keep Order
        </button>
        <button
         onClick={handleCancelSubmit}
         className="flex-1 rounded-full bg-red-600 py-2.5 font-bold text-white hover:bg-red-700"
        >
         Confirm Cancel
        </button>
       </div>
      </div>
     </div>
    </div>
   )}

   {/* =========================================================================
       MODAL: RETURN / EXCHANGE REQUEST
       ========================================================================= */}
   {returnModalOrder && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
     <div className="w-full max-w-lg rounded-[24px] border border-black/10 bg-white p-6 sm:p-8 shadow-2xl">
      <div className="flex items-center justify-between border-b border-black/10 pb-3">
       <div>
        <h3 className="font-bold text-base text-black">Request Return or Exchange</h3>
        <p className="text-[11px] text-black/50">Order {returnModalOrder.id}</p>
       </div>
       <button onClick={() => setReturnModalOrder(null)} className="p-1 text-black/40 hover:text-black">
        <X size={18} />
       </button>
      </div>

      <div className="mt-4 space-y-4 text-xs">
       <div>
        <label className="block font-bold text-black mb-1.5">Action Requested</label>
        <div className="grid grid-cols-2 gap-2">
         <button
          type="button"
          onClick={() => setReturnType('return')}
          className={`rounded-xl border py-2.5 font-bold transition ${
           returnType === 'return' ? 'border-black bg-black text-white' : 'border-black/15 text-black hover:bg-[#F0EEED]'
          }`}
         >
          Return for Refund
         </button>
         <button
          type="button"
          onClick={() => setReturnType('exchange')}
          className={`rounded-xl border py-2.5 font-bold transition ${
           returnType === 'exchange' ? 'border-black bg-black text-white' : 'border-black/15 text-black hover:bg-[#F0EEED]'
          }`}
         >
          Exchange for Size
         </button>
        </div>
       </div>

       {returnType === 'exchange' && (
        <div>
         <label className="block font-bold text-black mb-1">Choose Desired Size</label>
         <select
          value={exchangeSize}
          onChange={e => setExchangeSize(e.target.value)}
          className="input"
         >
          <option value="Small">Small (S)</option>
          <option value="Medium">Medium (M)</option>
          <option value="Large">Large (L)</option>
          <option value="X-Large">X-Large (XL)</option>
          <option value="XX-Large">XX-Large (XXL)</option>
         </select>
        </div>
       )}

       <div>
        <label className="block font-bold text-black mb-1">Primary Reason</label>
        <select
         value={returnReason}
         onChange={e => setReturnReason(e.target.value)}
         className="input"
        >
         <option value="Size did not fit comfortably">Size did not fit comfortably</option>
         <option value="Fabric / material quality not as expected">Fabric / material quality not as expected</option>
         <option value="Item arrived damaged or with stitching defect">Item arrived damaged or with stitching defect</option>
         <option value="Color looks different from photos">Color looks different from photos</option>
         <option value="Other / personal reasons">Other / personal reasons</option>
        </select>
       </div>

       <div>
        <label className="block font-bold text-black mb-1">Additional Comments (Optional)</label>
        <textarea
         rows={3}
         value={returnDetails}
         onChange={e => setReturnDetails(e.target.value)}
         placeholder="Describe the issue or specify any instructions for the courier pickup..."
         className="input"
        />
       </div>

       <div className="flex gap-2 pt-2">
        <button
         onClick={() => setReturnModalOrder(null)}
         className="flex-1 rounded-full border border-black/15 py-2.5 font-bold text-black hover:bg-[#F0EEED]"
        >
         Cancel
        </button>
        <button
         onClick={handleReturnSubmit}
         className="flex-1 rounded-full bg-black py-2.5 font-bold text-white hover:bg-black/80"
        >
         Submit Request
        </button>
       </div>
      </div>
     </div>
    </div>
   )}

   {/* =========================================================================
       MODAL: ADD NEW ADDRESS
       ========================================================================= */}
   {showAddAddr && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
     <div className="w-full max-w-md rounded-[24px] border border-black/10 bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between border-b border-black/10 pb-3">
       <h3 className="font-bold text-base text-black">Add Delivery Address</h3>
       <button onClick={() => setShowAddAddr(false)} className="p-1 text-black/40 hover:text-black">
        <X size={18} />
       </button>
      </div>

      <form onSubmit={handleAddressSubmit} className="mt-4 space-y-3 text-xs">
       <div>
        <label className="block font-bold text-black mb-1">Address Label</label>
        <select name="label" className="input">
         <option value="Home">Home</option>
         <option value="Office">Office</option>
         <option value="Other">Other</option>
        </select>
       </div>

       <div>
        <label className="block font-bold text-black mb-1">Recipient Name</label>
        <input name="name" defaultValue={me.name} required className="input" placeholder="Full name" />
       </div>

       <div>
        <label className="block font-bold text-black mb-1">Mobile Number</label>
        <input name="phone" defaultValue={me.phone} required pattern="[6-9][0-9]{9}" className="input" placeholder="10-digit phone" />
       </div>

       <div>
        <label className="block font-bold text-black mb-1">Street Address</label>
        <input name="address" required className="input" placeholder="House/Flat No., Building, Street" />
       </div>

       <div>
        <label className="block font-bold text-black mb-1">Apartment / Landmark (Optional)</label>
        <input name="apartment" className="input" placeholder="Floor, wing, nearby landmark" />
       </div>

       <div className="grid grid-cols-2 gap-2">
        <div>
         <label className="block font-bold text-black mb-1">City</label>
         <input name="city" required className="input" placeholder="City" />
        </div>
        <div>
         <label className="block font-bold text-black mb-1">State</label>
         <input name="state" required className="input" placeholder="State" />
        </div>
       </div>

       <div>
        <label className="block font-bold text-black mb-1">PIN Code</label>
        <input name="pin" required pattern="\d{6}" maxLength={6} className="input" placeholder="6-digit PIN" />
       </div>

       <div className="flex items-center gap-2 pt-1">
        <input type="checkbox" id="isDefault" name="isDefault" className="rounded" />
        <label htmlFor="isDefault" className="text-black/80 font-medium">Set as default delivery address</label>
       </div>

       <div className="flex gap-2 pt-3">
        <button
         type="button"
         onClick={() => setShowAddAddr(false)}
         className="flex-1 rounded-full border border-black/15 py-2.5 font-bold text-black hover:bg-[#F0EEED]"
        >
         Cancel
        </button>
        <button
         type="submit"
         className="flex-1 rounded-full bg-black py-2.5 font-bold text-white hover:bg-black/80"
        >
         Save Address
        </button>
       </div>
      </form>
     </div>
    </div>
   )}
  </div>
 )
}
