import { Link } from 'react-router-dom'
import { Heart, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../store/cart'
import { useProducts } from '../store/products'
import ProductCard from '../components/ProductCard'
import { toast } from '../store/toast'

export default function Wishlist() {
 const { wishlist, add, setOpen } = useCart()
 const products = useProducts(s => s.products)
 const list = products.filter(p => wishlist.includes(p.id))

 const moveAllToCart = () => {
  const inStock = list.filter(p => p.stock > 0)
  if (!inStock.length) {
   toast('No in-stock items available in your wishlist.', 'error')
   return
  }
  inStock.forEach(p => {
   const size = p.sizes[0] || 'One size'
   add(p.id, 1, size)
  })
  toast(`Added ${inStock.length} wishlist item(s) to your cart!`, 'info')
  setOpen(true)
 }

 return (
  <div className="mx-auto max-w-7xl px-4 py-8 pb-20 sm:px-6 lg:px-8">
   {/* Breadcrumbs */}
   <nav className="mb-6 flex items-center gap-2 text-sm text-black/60">
    <Link to="/" className="hover:text-black transition">Home</Link>
    <ChevronRight size={14} />
    <span className="text-black font-medium">Wishlist</span>
   </nav>

   {/* Header Row */}
   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-6 mb-8">
    <div>
     <h1 className="font-integral text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-black">
      MY WISHLIST
     </h1>
     <p className="mt-1 text-xs sm:text-sm text-black/60">
      {list.length} {list.length === 1 ? 'saved piece' : 'saved pieces'} in your personal wardrobe wishlist
     </p>
    </div>

    {list.length > 0 && (
     <button
      onClick={moveAllToCart}
      className="btn btn-dark rounded-full px-6 py-3 text-xs font-bold flex items-center gap-2 self-start sm:self-auto"
     >
      <ShoppingBag size={14} />
      <span>Move All to Cart</span>
     </button>
    )}
   </div>

   {/* Content */}
   {list.length > 0 ? (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
     {list.map(p => (
      <ProductCard key={p.id} p={p} />
     ))}
    </div>
   ) : (
    <div className="rounded-[24px] border border-dashed border-black/20 bg-[#F0EEED]/40 py-20 px-4 text-center max-w-lg mx-auto my-8">
     <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white border border-black/10 shadow-xs mb-4">
      <Heart size={28} className="text-black/40" />
     </div>
     <h2 className="font-integral font-bold text-xl sm:text-2xl text-black">
      Your Wishlist is Empty
     </h2>
     <p className="mt-2 text-xs sm:text-sm text-black/60 max-w-sm mx-auto">
      Explore our collections and tap the heart icon on any piece to save your favorite silhouettes for later.
     </p>
     <div className="mt-6">
      <Link
       to="/shop"
       className="btn btn-dark rounded-full px-8 py-3 text-xs font-bold inline-flex items-center gap-2"
      >
       <span>Explore Catalogue</span>
       <ArrowRight size={14} />
      </Link>
     </div>
    </div>
   )}
  </div>
 )
}
