import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../store/cart'
import { useProducts } from '../store/products'
import { inr } from '../lib/format'

export function useCartDetail() {
 const lines = useCart(s => s.lines)
 const products = useProducts(s => s.products)
 const items = lines.flatMap(l => {
  const p = products.find(x => x.id === l.productId)
  return p ? [{ ...l, p }] : []
 })
 return { items, subtotal: items.reduce((a, i) => a + i.p.price * i.qty, 0) }
}

export default function CartLines({ onNavigate }: { onNavigate?: () => void }) {
 const { items } = useCartDetail()
 const { setQty, remove, saveForLater } = useCart()

 if (!items.length) {
  return (
   <div className="py-16 text-center">
    <p className="font-integral font-bold text-2xl text-black">Your cart is empty</p>
    <p className="mt-2 text-sm text-black/60">Find something worth wearing from our latest collection.</p>
    <Link
     onClick={onNavigate}
     to="/shop"
     className="mt-6 inline-block rounded-full bg-black px-8 py-3 text-xs font-bold text-white hover:bg-black/80 transition"
    >
     Shop now
    </Link>
   </div>
  )
 }

 return (
  <ul className="divide-y divide-black/10">
   {items.map(({ key, p, size, qty }) => (
    <li key={key} className="flex gap-4 py-6 items-center">
     {/* Product image in Figma SHOP.CO style */}
     <Link
      onClick={onNavigate}
      to={`/product/${p.slug}`}
      className="h-28 w-24 shrink-0 overflow-hidden rounded-[16px] bg-[#F0EEED] p-2 flex items-center justify-center"
     >
      <img
       src={p.images[0]}
       alt={p.name}
       className="h-full w-full object-contain mix-blend-multiply"
      />
     </Link>

     {/* Details */}
     <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
       <div>
        <Link
         onClick={onNavigate}
         to={`/product/${p.slug}`}
         className="font-bold text-base sm:text-lg text-black hover:text-black/70 transition line-clamp-1"
        >
         {p.name}
        </Link>
        {size && (
         <p className="mt-1 text-xs text-black/60">
          <span className="font-medium text-black">Size:</span> {size}
         </p>
        )}
        {p.color && (
         <p className="text-xs text-black/60">
          <span className="font-medium text-black">Color:</span> {p.color}
         </p>
        )}
       </div>

       {/* Actions: Save for later & Delete button */}
       <div className="flex items-center gap-2">
        <button
         type="button"
         onClick={() => saveForLater(key)}
         className="text-[11px] text-black/50 hover:text-black underline font-medium"
        >
         Save for later
        </button>
        <button
         aria-label="Remove"
         onClick={() => remove(key)}
         className="text-black/40 hover:text-black p-1 transition"
        >
         <Trash2 size={18} />
        </button>
       </div>
      </div>

      {/* Price & Quantity Row */}
      <div className="mt-4 flex items-center justify-between">
       <span className="font-bold text-lg sm:text-xl text-black font-sans">
        {inr(p.price)}
       </span>

       {/* Quantity pill */}
       <div className="inline-flex items-center rounded-full bg-[#F0F0F0] px-4 py-2 gap-4">
        <button
         aria-label="Decrease"
         className="text-black/70 hover:text-black font-bold p-0.5"
         onClick={() => setQty(key, qty - 1)}
        >
         <Minus size={14} />
        </button>
        <span className="w-5 text-center text-xs font-bold text-black">{qty}</span>
        <button
         aria-label="Increase"
         className="text-black/70 hover:text-black font-bold p-0.5"
         disabled={qty >= p.stock}
         onClick={() => setQty(key, qty + 1)}
        >
         <Plus size={14} />
        </button>
       </div>
      </div>
     </div>
    </li>
   ))}
  </ul>
 )
}
