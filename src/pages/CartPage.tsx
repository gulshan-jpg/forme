import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, ShieldCheck, Tag, Check, Truck, ChevronRight, Bookmark, ShoppingBag, Trash2 } from 'lucide-react'
import CartLines, { useCartDetail } from '../components/CartLines'
import { inr } from '../lib/format'
import { totals, FREE_SHIP_ABOVE, type Coupon } from '../lib/pricing'
import WhatsAppButton from '../components/WhatsAppButton'
import { cartMessage } from '../lib/messages'
import { useCart } from '../store/cart'
import { useProducts } from '../store/products'
import * as db from '../services/db'

export default function CartPage() {
 const { items, subtotal } = useCartDetail()
 const { savedForLater, moveToCart, removeSaved } = useCart()
 const products = useProducts(s => s.products)
 const savedItems = savedForLater.flatMap(l => {
  const p = products.find(x => x.id === l.productId)
  return p ? [{ ...l, p }] : []
 })

 const [couponInput, setCouponInput] = useState('')
 const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
 const [couponErr, setCouponErr] = useState('')

 const discountAmount = appliedCoupon
  ? appliedCoupon.type === 'pct'
    ? Math.min(appliedCoupon.maxDiscount || Infinity, Math.round(subtotal * (appliedCoupon.value / 100)))
    : Math.min(subtotal, appliedCoupon.value)
  : 0
 const discountedSubtotal = Math.max(0, subtotal - discountAmount)
 const t = totals(discountedSubtotal, appliedCoupon)

 const diff = FREE_SHIP_ABOVE - subtotal
 const pct = Math.min(100, Math.round((subtotal / FREE_SHIP_ABOVE) * 100))

 const handleApplyCoupon = async (e: React.FormEvent) => {
  e.preventDefault()
  const c = couponInput.trim().toUpperCase()
  if (!c) return
  try {
   const found = await db.fetchCoupon(c)
   if (!found) {
    setAppliedCoupon(null)
    setCouponErr('Invalid promotional code.')
    return
   }
   if (found.minOrderValue && subtotal < found.minOrderValue) {
    setAppliedCoupon(null)
    setCouponErr(`Minimum order value of ${inr(found.minOrderValue)} required for this code.`)
    return
   }
   if (found.expiryDate && new Date(found.expiryDate).getTime() < Date.now()) {
    setAppliedCoupon(null)
    setCouponErr('This promotional code has expired.')
    return
   }
   setAppliedCoupon(found)
   setCouponErr('')
  } catch (err: any) {
   setCouponErr(err.message || 'Could not validate promotional code.')
  }
 }

 return (
  <div className="mx-auto max-w-7xl px-4 py-6 pb-20 sm:px-6 lg:px-8">
   {/* Breadcrumbs (Figma SHOP.CO style) */}
   <nav className="mb-6 flex items-center gap-2 text-sm text-black/60">
    <Link to="/" className="hover:text-black">Home</Link>
    <ChevronRight size={14} />
    <span className="text-black font-medium">Cart</span>
   </nav>

   <h1 className="font-integral font-black text-3xl sm:text-4xl md:text-5xl text-black uppercase tracking-tight">
    YOUR CART
   </h1>

   {items.length > 0 ? (
    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
     
     {/* Left Column: Cart Items & Free Shipping Progress */}
     <div className="lg:col-span-7 space-y-6">
      {/* Free Shipping Tier */}
      <div className="rounded-[20px] border border-black/10 bg-[#F0EEED]/60 p-5 text-xs">
       <div className="flex items-center justify-between">
        {diff > 0 ? (
         <p className="text-black/80 font-medium">
          Add <span className="font-bold text-black">{inr(diff)}</span> more to unlock <b className="text-black">Complimentary Express Shipping</b>
         </p>
        ) : (
         <p className="flex items-center gap-1.5 font-bold text-emerald-800">
          <Sparkles size={15} /> You've unlocked Complimentary Express Shipping!
         </p>
        )}
        <span className="font-bold text-black">{pct}%</span>
       </div>
       <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-black/10">
        <div
         className="h-full bg-black transition-all duration-500 rounded-full"
         style={{ width: `${pct}%` }}
        />
       </div>
      </div>

      {/* Cart Items Container (SHOP.CO 20px rounded card) */}
      <div className="rounded-[20px] border border-black/10 bg-white p-5 sm:p-6 shadow-sm">
       <CartLines />
      </div>

      {/* Saved for Later Section */}
      {savedItems.length > 0 && (
       <div className="rounded-[20px] border border-black/10 bg-white p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
         <h3 className="font-integral font-bold text-lg uppercase tracking-normal flex items-center gap-2 text-black">
          <Bookmark size={18} /> Saved for Later ({savedItems.length})
         </h3>
        </div>
        <ul className="divide-y divide-black/10">
         {savedItems.map(({ key, p, size, qty }) => (
          <li key={key} className="py-4 flex items-center justify-between gap-4">
           <div className="flex items-center gap-3 min-w-0">
            <Link to={`/product/${p.slug}`} className="h-16 w-14 shrink-0 rounded-xl bg-[#F0EEED] p-1 flex items-center justify-center">
             <img src={p.images[0]} alt={p.name} className="h-full w-full object-contain mix-blend-multiply" />
            </Link>
            <div className="min-w-0">
             <Link to={`/product/${p.slug}`} className="font-bold text-sm text-black hover:text-black/70 truncate block">
              {p.name}
             </Link>
             <p className="text-xs text-black/60">
              {size ? `Size: ${size} · ` : ''}{inr(p.price)}
             </p>
             <span className={`text-[10px] font-semibold ${p.stock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
              {p.stock > 0 ? 'In stock' : 'Out of stock'}
             </span>
            </div>
           </div>
           <div className="flex items-center gap-2 shrink-0">
            <button
             type="button"
             disabled={p.stock === 0}
             onClick={() => moveToCart(key)}
             className="rounded-full bg-black px-4 py-2 text-xs font-bold text-white hover:bg-black/80 transition disabled:opacity-40 flex items-center gap-1.5"
            >
             <ShoppingBag size={13} /> Move to Cart
            </button>
            <button
             type="button"
             aria-label="Remove saved item"
             onClick={() => removeSaved(key)}
             className="p-1.5 text-black/40 hover:text-red-600 transition"
            >
             <Trash2 size={16} />
            </button>
           </div>
          </li>
         ))}
        </ul>
       </div>
      )}
     </div>

     {/* Right Column: Order Summary Card (Figma SHOP.CO style) */}
     <div className="lg:col-span-5 sticky top-24 space-y-6">
      <div className="rounded-[20px] border border-black/10 bg-white p-6 shadow-sm space-y-5">
       <h2 className="text-xl sm:text-2xl font-bold text-black border-b border-black/10 pb-4">
        Order Summary
       </h2>

       <div className="space-y-4 text-sm sm:text-base">
        <div className="flex justify-between text-black/60">
         <span>Subtotal</span>
         <span className="font-bold text-black font-sans">{inr(subtotal)}</span>
        </div>

        {appliedCoupon && (
         <div className="flex justify-between text-black font-medium">
          <div className="flex items-center gap-1.5">
           <span>Discount ({appliedCoupon.code})</span>
           <button
            type="button"
            onClick={() => setAppliedCoupon(null)}
            className="text-[11px] text-red-600 hover:underline"
           >
            Remove
           </button>
          </div>
          <span className="font-bold font-sans">-{inr(discountAmount)}</span>
         </div>
        )}

        <div className="flex justify-between text-black/60">
         <span>Delivery Fee</span>
         <span className="font-bold text-black font-sans">
          {t.shipping ? inr(t.shipping) : <span className="text-emerald-700 font-semibold">Free</span>}
         </span>
        </div>

        <div className="border-t border-black/10 pt-4 flex justify-between text-lg sm:text-xl font-bold text-black">
         <span>Total</span>
         <span className="font-bold font-sans">{inr(t.total)}</span>
        </div>
       </div>

       {/* Coupon Input Form */}
       <form onSubmit={handleApplyCoupon} className="flex gap-2">
        <div className="relative flex-1">
         <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40" />
         <input
          value={couponInput}
          onChange={e => setCouponInput(e.target.value)}
          placeholder="Add promo code"
          className="w-full rounded-full border border-black/10 bg-[#F0F0F0] pl-10 pr-4 py-3 text-xs uppercase tracking-wider placeholder-black/40 outline-none focus:border-black transition"
         />
        </div>
        <button
         type="submit"
         className="rounded-full bg-black px-6 py-3 text-xs font-bold text-white hover:bg-black/80 transition"
        >
         Apply
        </button>
       </form>

       {appliedCoupon && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
         <Check size={14} />
         <span>Coupon {appliedCoupon.code} ({appliedCoupon.label}) applied!</span>
        </div>
       )}
       {couponErr && (
        <p className="text-xs text-red-600 font-medium">{couponErr}</p>
       )}

       {/* Go to Checkout Button (Carries applied coupon code to Checkout) */}
       <Link
        to={appliedCoupon ? `/checkout?coupon=${encodeURIComponent(appliedCoupon.code)}` : '/checkout'}
        className="w-full rounded-full bg-black py-4 text-sm font-bold text-white hover:bg-black/80 transition flex items-center justify-center gap-2 shadow-sm"
       >
        <span>Go to Checkout</span>
        <ArrowRight size={16} />
       </Link>

       {/* WhatsApp Direct Enquiry */}
       <WhatsAppButton
        className="btn btn-line w-full rounded-full py-3 text-xs"
        text={cartMessage(items)}
       >
        Enquire on WhatsApp
       </WhatsAppButton>

       {/* Trust assurances */}
       <div className="border-t border-black/10 pt-4 grid grid-cols-2 gap-3 text-xs text-black/50">
        <div className="flex items-center gap-1.5">
         <ShieldCheck size={15} className="text-black" />
         <span>Razorpay Verified</span>
        </div>
        <div className="flex items-center gap-1.5">
         <Truck size={15} className="text-black" />
         <span>Air Express Dispatch</span>
        </div>
       </div>
      </div>
     </div>
    </div>
   ) : (
    <div className="space-y-8 mt-8">
     <div className="rounded-[20px] border border-dashed border-black/20 bg-[#F0EEED]/30 py-20 text-center">
      <p className="font-integral font-bold text-2xl text-black">Your cart is currently empty</p>
      <p className="mt-2 text-sm text-black/60">Explore our curated collections of streetwear, casuals, and lifestyle.</p>
      <Link to="/shop" className="mt-6 inline-block rounded-full bg-black px-8 py-3.5 text-xs font-bold text-white hover:bg-black/80 transition">
       Discover Catalogue
      </Link>
     </div>

     {savedItems.length > 0 && (
      <div className="max-w-2xl mx-auto rounded-[20px] border border-black/10 bg-white p-6 shadow-sm space-y-4">
       <h3 className="font-integral font-bold text-lg uppercase tracking-normal flex items-center gap-2 text-black border-b border-black/10 pb-3">
        <Bookmark size={18} /> Saved for Later ({savedItems.length})
       </h3>
       <ul className="divide-y divide-black/10">
        {savedItems.map(({ key, p, size }) => (
         <li key={key} className="py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
           <Link to={`/product/${p.slug}`} className="h-16 w-14 shrink-0 rounded-xl bg-[#F0EEED] p-1 flex items-center justify-center">
            <img src={p.images[0]} alt={p.name} className="h-full w-full object-contain mix-blend-multiply" />
           </Link>
           <div className="min-w-0">
            <Link to={`/product/${p.slug}`} className="font-bold text-sm text-black hover:text-black/70 truncate block">
             {p.name}
            </Link>
            <p className="text-xs text-black/60">
             {size ? `Size: ${size} · ` : ''}{inr(p.price)}
            </p>
            <span className={`text-[10px] font-semibold ${p.stock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
             {p.stock > 0 ? 'In stock' : 'Out of stock'}
            </span>
           </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
           <button
            type="button"
            disabled={p.stock === 0}
            onClick={() => moveToCart(key)}
            className="rounded-full bg-black px-4 py-2 text-xs font-bold text-white hover:bg-black/80 transition disabled:opacity-40 flex items-center gap-1.5"
           >
            <ShoppingBag size={13} /> Move to Cart
           </button>
           <button
            type="button"
            aria-label="Remove saved item"
            onClick={() => removeSaved(key)}
            className="p-1.5 text-black/40 hover:text-red-600 transition"
           >
            <Trash2 size={16} />
           </button>
          </div>
         </li>
        ))}
       </ul>
      </div>
     )}
    </div>
   )}
  </div>
 )
}
