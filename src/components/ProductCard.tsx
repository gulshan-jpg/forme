import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, ShoppingBag } from 'lucide-react'
import type { Product } from '../types'
import { inr, pct } from '../lib/format'
import { useCart } from '../store/cart'
import { toast } from '../store/toast'

export default function ProductCard({ p }: { p: Product }) {
 const { wishlist, toggleWish, add, setOpen } = useCart()
 const [showSizes, setShowSizes] = useState(false)
 const liked = wishlist.includes(p.id)
 const d = pct(p.price, p.originalPrice)

 const handleQuickAdd = (e: React.MouseEvent, size?: string) => {
  e.preventDefault()
  e.stopPropagation()
  if (p.stock === 0) return
  if (p.sizes.length === 1) {
   add(p.id, 1, p.sizes[0])
   toast(`Added ${p.name} to your cart!`, 'info')
   setOpen(true)
   return
  }
  if (size) {
   add(p.id, 1, size)
   toast(`Added ${p.name} (${size}) to your cart!`, 'info')
   setOpen(true)
   setShowSizes(false)
   return
  }
  setShowSizes(!showSizes)
 }

 return (
  <div
   className="group relative flex flex-col"
   onMouseLeave={() => setShowSizes(false)}
  >
   {/* Image container: SHOP.CO style rounded-[20px] bg-[#F0EEED] */}
   <div className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-[#F0EEED] transition-transform duration-300">
    <Link to={`/product/${p.slug}`} className="flex h-full w-full items-center justify-center p-3">
     <img
      src={p.images[0]}
      alt={p.name}
      loading="lazy"
      className={`h-full w-full object-contain mix-blend-multiply transition-all duration-500 ${
       p.images[1] ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'
      }`}
     />
     {p.images[1] && (
      <img
       src={p.images[1]}
       alt={`${p.name} alternate view`}
       loading="lazy"
       className="absolute inset-0 h-full w-full object-contain mix-blend-multiply p-3 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
      />
     )}
    </Link>

    {/* Discount badge - Monochrome Black & White */}
    {d > 0 && (
     <span className="absolute left-3 top-3 rounded-full bg-black px-2.5 py-0.5 text-[11px] font-bold text-white z-10 shadow-xs">
      -{d}%
     </span>
    )}

    {/* Stock status - Monochrome Black & White */}
    {p.stock === 0 ? (
     <span className="absolute bottom-3 left-3 rounded-full bg-black/90 px-2.5 py-1 text-[10px] uppercase font-bold text-white z-10">
      Sold out
     </span>
    ) : p.stock <= 5 ? (
     <span className="absolute bottom-3 left-3 rounded-full bg-black/85 backdrop-blur px-2.5 py-0.5 text-[10px] font-semibold text-white z-10">
      Only {p.stock} left
     </span>
    ) : null}

    {/* Wishlist button */}
    <button
     aria-label="Toggle wishlist"
     onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      toggleWish(p.id)
     }}
     className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-110 hover:bg-white z-10"
    >
     <Heart
      size={16}
      fill={liked ? '#000000' : 'none'}
      className={liked ? 'text-black' : 'text-black/60'}
     />
    </button>

    {/* Quick Add Bar / Size Selector */}
    {p.stock > 0 && (
     <div
      className="absolute inset-x-2.5 bottom-2.5 z-20"
      onClick={e => { e.preventDefault(); e.stopPropagation() }}
     >
      {showSizes ? (
       <div className="rounded-xl bg-white/95 p-2 shadow-xl backdrop-blur border border-black/10 animate-fade-in">
        <p className="text-[10px] font-bold uppercase tracking-wider text-black/60 text-center mb-1.5">
         Select Size:
        </p>
        <div className="flex flex-wrap justify-center gap-1">
         {p.sizes.map(s => (
          <button
           key={s}
           onClick={e => handleQuickAdd(e, s)}
           className="rounded-md border border-black/15 bg-white px-2.5 py-1 text-[11px] font-bold text-black hover:bg-black hover:text-white transition"
          >
           {s}
          </button>
         ))}
        </div>
       </div>
      ) : (
       <button
        onClick={handleQuickAdd}
        className="w-full rounded-full bg-black/90 hover:bg-black text-white py-2 text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 flex items-center justify-center gap-1.5"
       >
        <ShoppingBag size={13} />
        <span>Quick Add</span>
       </button>
      )}
     </div>
    )}
   </div>

   {/* Product Details */}
   <Link to={`/product/${p.slug}`} className="mt-3 block flex-1">
    <h3 className="font-bold text-base sm:text-lg text-black transition group-hover:text-black/70 truncate">
     {p.name}
    </h3>

    {/* Rating row: Monochrome Black & White stars + score */}
    <div className="mt-1.5 flex items-center gap-1.5">
     <div className="flex text-black">
      {[1, 2, 3, 4, 5].map((star) => (
       <Star
        key={star}
        size={13}
        fill={star <= Math.round(p.rating || 4.5) ? '#000000' : '#E5E5E5'}
        strokeWidth={0}
       />
      ))}
     </div>
     <span className="text-xs font-semibold text-black">
      {p.rating ? p.rating.toFixed(1) : '4.5'}/<span className="text-black/40">5</span>
     </span>
    </div>

    {/* Price row */}
    <div className="mt-2 flex items-center gap-2.5 flex-wrap">
     <span className="text-lg sm:text-xl font-bold text-black font-sans">
      {inr(p.price)}
     </span>
     {d > 0 && (
      <>
       <span className="text-base sm:text-lg text-black/40 line-through font-bold font-sans">
        {inr(p.originalPrice)}
       </span>
       <span className="rounded-full bg-black/5 text-black border border-black/10 px-2 py-0.5 text-[11px] font-semibold">
        -{d}%
       </span>
      </>
     )}
    </div>
   </Link>
  </div>
 )
}

