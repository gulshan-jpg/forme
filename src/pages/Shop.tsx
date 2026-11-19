import { useSearchParams, Link } from 'react-router-dom'
import { useProducts } from '../store/products'
import ProductCard from '../components/ProductCard'
import { ArrowUpDown, X, Check, SlidersHorizontal, ChevronRight, RotateCcw, ChevronLeft } from 'lucide-react'
import { useState, useEffect } from 'react'

const SORT_OPTIONS = [
 { id: 'new', label: 'Most Popular' },
 { id: 'best', label: 'Best Sellers' },
 { id: 'low', label: 'Price: Low to High' },
 { id: 'high', label: 'Price: High to Low' }
]

const COLOR_PALETTE = [
 { name: 'Green', hex: '#00C12B' },
 { name: 'Red', hex: '#F50606' },
 { name: 'Yellow', hex: '#F5DD06' },
 { name: 'Orange', hex: '#F57906' },
 { name: 'Cyan', hex: '#06CAF5' },
 { name: 'Blue', hex: '#063AF5' },
 { name: 'Purple', hex: '#7D06F5' },
 { name: 'Pink', hex: '#F506A4' },
 { name: 'White', hex: '#FFFFFF', border: true },
 { name: 'Black', hex: '#000000' }
]

const DRESS_STYLES = ['Casual', 'Formal', 'Party', 'Gym']
const DRESS_STYLE_MAP: Record<string, string[]> = {
 Casual: ['casual', 't-shirt', 'hoodie', 'sweatshirt', 'cotton', 'oversized', 'streetwear', 'tee', 'denim', 'fleece', 'candle'],
 Formal: ['formal', 'tailored', 'blazer', 'trousers', 'wool', 'pleated', 'linen', 'loafers', 'evening', 'silk', 'merino', 'watch'],
 Party: ['party', 'dress', 'evening', 'gold', 'perfume', 'silk', 'blush', 'jewellery', 'chain', 'earrings', 'pearls'],
 Gym: ['gym', 'active', 'recovery', 'slides', 'tee', 'heavyweight', 'cotton', 'wellness', 'soak']
}

export default function Shop() {
 const [sp, setSp] = useSearchParams()
 const { products, categories } = useProducts()
 
 // Pop-out modal states
 const [showFilterDrawer, setShowFilterDrawer] = useState(false)
 const [showSortModal, setShowSortModal] = useState(false)
 const [page, setPage] = useState(1)
 const ITEMS_PER_PAGE = 12 // 4 rows on desktop (3 cols x 4 rows = 12)

 const q = sp.get('q') ?? ''
 const cat = sp.get('cat') ?? ''
 const sort = sp.get('sort') ?? 'new'
 const price = sp.get('price') ?? 'all'
 const inStockOnly = sp.get('stock') === '1'
 const size = sp.get('size') ?? ''
 const style = sp.get('style') ?? ''
 const color = sp.get('color') ?? ''

 const set = (k: string, v: string) => {
  const n = new URLSearchParams(sp)
  v ? n.set(k, v) : n.delete(k)
  setSp(n)
 }

 const clearAll = () => {
  setSp(new URLSearchParams())
 }

 // Collect unique sizes across products
 const allSizes = Array.from(new Set(products.flatMap(p => p.sizes).filter(s => s && s !== 'One size'))).sort()

 let list = products.filter(p => {
  const normCat = cat.toLowerCase()
  const matchesCat = !cat 
   || p.category.toLowerCase() === normCat
   || (normCat === 'clothing' && p.category === 'Fashion')
   || (normCat === 'streetwear' && (p.category === 'Fashion' || p.tags.includes('streetwear')))
   || (Boolean(DRESS_STYLE_MAP[cat]) && DRESS_STYLE_MAP[cat].some(t => p.tags.includes(t) || p.name.toLowerCase().includes(t)))

  const matchesStyle = !style
   || (Boolean(DRESS_STYLE_MAP[style]) && DRESS_STYLE_MAP[style].some(t => 
       p.tags.includes(t) || 
       p.name.toLowerCase().includes(t) || 
       p.description.toLowerCase().includes(t)
      ))

  const matchesQ = !q || (p.name + p.description + p.tags.join(' ')).toLowerCase().includes(q.toLowerCase())
  const matchesStock = !inStockOnly || p.stock > 0
  const matchesSize = !size || p.sizes.includes(size)
  const matchesPrice = price === 'under1000' ? p.price < 1000
   : price === '1000-2500' ? p.price >= 1000 && p.price <= 2500
   : price === 'above2500' ? p.price > 2500
   : true
  const matchesColor = !color || (p.color && p.color.toLowerCase().includes(color.toLowerCase()))
  return matchesCat && matchesStyle && matchesQ && matchesStock && matchesSize && matchesPrice && matchesColor
 })

 list = [...list].sort((a, b) => 
  sort === 'low' ? a.price - b.price
  : sort === 'high' ? b.price - a.price
  : sort === 'best' ? Number(b.bestseller) - Number(a.bestseller) || b.reviews - a.reviews
  : b.createdAt - a.createdAt
 )

 const activeFilterCount = (cat ? 1 : 0) + (style ? 1 : 0) + (price !== 'all' ? 1 : 0) + (size ? 1 : 0) + (inStockOnly ? 1 : 0) + (color ? 1 : 0)
 const currentSortLabel = SORT_OPTIONS.find(o => o.id === sort)?.label ?? 'Most Popular'

 useEffect(() => {
  setPage(1)
 }, [cat, q, sort, price, inStockOnly, size, style, color])

 const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE) || 1
 const paginatedList = list.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

 return (
  <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
   {/* Breadcrumbs (Figma SHOP.CO style) */}
   <nav className="mb-6 flex items-center gap-2 text-sm text-black/60">
    <Link to="/" className="hover:text-black transition">Home</Link>
    <ChevronRight size={14} />
    <Link to="/shop" className="hover:text-black transition">Shop</Link>
    {cat && (
     <>
      <ChevronRight size={14} />
      <span className="text-black font-medium">{cat}</span>
     </>
    )}
    {style && (
     <>
      <ChevronRight size={14} />
      <span className="text-black font-medium">Style: {style}</span>
     </>
    )}
   </nav>

   <div className="flex flex-col lg:flex-row gap-8 items-start">
    {/* ============================================================ */}
    {/* DESKTOP SIDEBAR FILTER (SHOP.CO Figma 20px card)               */}
    {/* ============================================================ */}
    <aside className="hidden lg:block w-72 flex-shrink-0 rounded-[20px] border border-black/10 p-6 bg-white shadow-sm space-y-6">
     {/* Filters title */}
     <div className="flex items-center justify-between border-b border-black/10 pb-4">
      <h2 className="text-xl font-bold text-black flex items-center gap-2">
       Filters
      </h2>
      <SlidersHorizontal size={18} className="text-black/60" />
     </div>

     {/* Category list */}
     <div className="space-y-3 border-b border-black/10 pb-6">
      <button
       onClick={() => set('cat', '')}
       className={`w-full flex items-center justify-between text-sm transition ${
        !cat ? 'font-bold text-black' : 'text-black/60 hover:text-black'
       }`}
      >
       <span>All Products</span>
       <ChevronRight size={14} className="text-black/40" />
      </button>
      {categories.map(c => (
       <button
        key={c}
        onClick={() => set('cat', cat === c ? '' : c)}
        className={`w-full flex items-center justify-between text-sm transition ${
         cat === c ? 'font-bold text-black' : 'text-black/60 hover:text-black'
        }`}
       >
        <span>{c}</span>
        <ChevronRight size={14} className="text-black/40" />
       </button>
      ))}
     </div>

     {/* Price tiers */}
     <div className="border-b border-black/10 pb-6">
      <h3 className="text-base font-bold text-black mb-3">Price</h3>
      <div className="flex flex-col gap-2">
       {[
        { id: 'all', label: 'All Prices' },
        { id: 'under1000', label: 'Under ₹1,000' },
        { id: '1000-2500', label: '₹1,000 – ₹2,500' },
        { id: 'above2500', label: 'Above ₹2,500' }
       ].map(p => (
        <button
         key={p.id}
         onClick={() => set('price', (price === p.id || (p.id === 'all' && price === 'all')) ? '' : p.id)}
         className={`text-left text-sm py-1.5 px-3 rounded-full transition ${
          price === p.id || (p.id === 'all' && price === 'all')
           ? 'bg-black text-white font-medium'
           : 'text-black/60 hover:bg-[#F0F0F0] hover:text-black'
         }`}
        >
         {p.label}
        </button>
       ))}
      </div>
     </div>

     {/* Colors */}
     <div className="border-b border-black/10 pb-6">
      <h3 className="text-base font-bold text-black mb-3">Colors</h3>
      <div className="grid grid-cols-5 gap-3">
       {COLOR_PALETTE.map(c => {
        const active = color.toLowerCase() === c.name.toLowerCase()
        return (
         <button
          key={c.name}
          title={c.name}
          onClick={() => set('color', active ? '' : c.name)}
          className="relative flex h-9 w-9 items-center justify-center rounded-full transition hover:scale-110"
          style={{
           backgroundColor: c.hex,
           border: c.border ? '1px solid rgba(0,0,0,0.2)' : 'none'
          }}
         >
          {active && (
           <Check
            size={16}
            className={c.name === 'White' || c.name === 'Yellow' ? 'text-black' : 'text-white'}
           />
          )}
         </button>
        )
       })}
      </div>
     </div>

     {/* Size */}
     <div className="border-b border-black/10 pb-6">
      <h3 className="text-base font-bold text-black mb-3">Size</h3>
      <div className="flex flex-wrap gap-2">
       {allSizes.map(s => {
        const active = size === s
        return (
         <button
          key={s}
          onClick={() => set('size', active ? '' : s)}
          className={`rounded-full px-4 py-2 text-xs font-medium transition ${
           active
            ? 'bg-black text-white'
            : 'bg-[#F0F0F0] text-black/60 hover:bg-black/10 hover:text-black'
          }`}
         >
          {s}
         </button>
        )
       })}
      </div>
     </div>

     {/* Dress Style */}
     <div className="pb-2">
      <div className="flex items-center justify-between mb-3">
       <h3 className="text-base font-bold text-black">Dress Style</h3>
       {style && (
        <button onClick={() => set('style', '')} className="text-xs text-black/60 underline hover:text-black">
         Clear
        </button>
       )}
      </div>
      <div className="space-y-2">
       {DRESS_STYLES.map(ds => (
        <button
         key={ds}
         onClick={() => set('style', style === ds ? '' : ds)}
         className={`w-full flex items-center justify-between text-sm transition py-1 px-1.5 rounded-lg ${
          style === ds ? 'font-bold text-black bg-black/5' : 'text-black/60 hover:text-black'
         }`}
        >
         <span>{ds}</span>
         <ChevronRight size={14} className={style === ds ? 'text-black' : 'text-black/40'} />
        </button>
       ))}
      </div>
     </div>

     {/* Action Buttons: Apply / Clear */}
     <div className="space-y-2 pt-2">
      <button
       type="button"
       onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
       }}
       className="w-full rounded-full bg-black py-3 text-center text-sm font-semibold text-white transition hover:bg-black/85 shadow-xs"
      >
       Apply Filters
      </button>
      {activeFilterCount > 0 && (
       <button
        type="button"
        onClick={clearAll}
        className="w-full rounded-full border border-black/20 bg-white py-2.5 text-center text-xs font-semibold text-black transition hover:bg-black/5"
       >
        Clear Filters ({activeFilterCount})
       </button>
      )}
     </div>
    </aside>

    {/* ============================================================ */}
    {/* MAIN PRODUCTS AREA                                           */}
    {/* ============================================================ */}
    <div className="flex-1 w-full">
     {/* Page Header (Integral CF uppercase + Sort + Mobile filter button) */}
     <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-5">
      <div>
       <h1 className="font-integral font-black text-3xl sm:text-4xl md:text-5xl text-black uppercase tracking-tight">
        {cat ? cat : style ? `Style: ${style}` : 'All products'}
       </h1>
       <p className="mt-1 text-xs sm:text-sm text-black/60">
        Showing {list.length} of {products.length} products
       </p>
      </div>

      <div className="flex items-center gap-3">
       {/* POP-OUT FILTER TRIGGER (For mobile, or any device) */}
       <button
        onClick={() => setShowFilterDrawer(true)}
        aria-label="Filter"
        className="flex items-center gap-2 rounded-full bg-[#F0F0F0] px-4 py-2.5 text-xs font-semibold text-black hover:bg-black hover:text-white transition"
       >
        <SlidersHorizontal size={15} />
        <span>Filter</span>
        {activeFilterCount > 0 && (
         <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
          {activeFilterCount}
         </span>
        )}
       </button>

       {/* POP-OUT SORT TRIGGER */}
       <div className="relative">
        <button
         onClick={() => setShowSortModal(!showSortModal)}
         aria-label="Sort"
         className="flex items-center gap-2 rounded-full bg-[#F0F0F0] px-4 py-2.5 text-xs font-semibold text-black hover:bg-black/10 transition"
        >
         <ArrowUpDown size={14} />
         <span>Sort: {currentSortLabel}</span>
        </button>

        {showSortModal && (
         <div className="absolute right-0 top-full mt-2 w-48 rounded-[16px] border border-black/10 bg-white p-2 shadow-xl z-30">
          {SORT_OPTIONS.map(o => (
           <button
            key={o.id}
            onClick={() => {
             set('sort', o.id)
             setShowSortModal(false)
            }}
            className={`w-full rounded-lg px-3 py-2 text-left text-xs transition ${
             sort === o.id ? 'bg-black text-white font-medium' : 'text-black/70 hover:bg-[#F0F0F0]'
            }`}
           >
            {o.label}
           </button>
          ))}
         </div>
        )}
       </div>
      </div>
     </div>

     {/* Active Filter Pills Bar */}
     <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
       {price !== 'all' && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0F0F0] px-3 py-1 text-xs text-black font-medium">
         Price: {price === 'under1000' ? 'Under ₹1,000' : price === '1000-2500' ? '₹1,000 – ₹2,500' : 'Above ₹2,500'}
         <button onClick={() => set('price', '')} className="hover:text-red-600 font-bold">×</button>
        </span>
       )}

       {cat && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0F0F0] px-3 py-1 text-xs text-black font-medium">
         {cat}
         <button onClick={() => set('cat', '')} className="hover:text-red-600 font-bold">×</button>
        </span>
       )}
       {style && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0F0F0] px-3 py-1 text-xs text-black font-medium">
         Style: {style}
         <button onClick={() => set('style', '')} className="hover:text-red-600 font-bold">×</button>
        </span>
       )}
       {color && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0F0F0] px-3 py-1 text-xs text-black font-medium">
         Color: {color}
         <button onClick={() => set('color', '')} className="hover:text-red-600 font-bold">×</button>
        </span>
       )}
       {size && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0F0F0] px-3 py-1 text-xs text-black font-medium">
         Size: {size}
         <button onClick={() => set('size', '')} className="hover:text-red-600 font-bold">×</button>
        </span>
       )}
      </div>

      {activeFilterCount > 0 && (
       <button
        onClick={clearAll}
        className="flex items-center gap-1.5 text-xs text-black/60 underline hover:text-black font-medium"
       >
        <RotateCcw size={12} /> Clear all filters
       </button>
      )}
     </div>

     {/* Product Grid (Figma SHOP.CO 3-column rounded-20px cards - 4-5 rows max per page) */}
     {paginatedList.length ? (
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3" id="shop-products-grid">
       {paginatedList.map(p => (
        <ProductCard key={p.id} p={p} />
       ))}
      </div>
     ) : (
      <div className="mt-12 rounded-[20px] border border-dashed border-black/20 p-12 text-center">
       <p className="text-black/60 text-base">No products match your active filter criteria.</p>
       <button
        onClick={clearAll}
        className="mt-4 rounded-full bg-black px-6 py-2.5 text-xs font-semibold text-white hover:bg-black/80 transition"
       >
        Clear all filters
       </button>
      </div>
     )}

     {/* Working Dynamic Pagination Bar (4-5 rows / 12 items per page) */}
     {totalPages > 1 && (
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/10 pt-6">
       <div className="text-xs text-black/60 font-medium">
        Showing <span className="font-bold text-black">{(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, list.length)}</span> of <span className="font-bold text-black">{list.length}</span> Products
       </div>

       <div className="flex items-center gap-2">
        <button
         onClick={() => {
          if (page > 1) {
           setPage(p => p - 1)
           window.scrollTo({ top: 160, behavior: 'smooth' })
          }
         }}
         disabled={page === 1}
         className="flex items-center gap-1.5 rounded-lg border border-black/10 px-3.5 py-2 text-xs font-semibold text-black hover:bg-[#F0F0F0] disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
         <ChevronLeft size={16} />
         <span>Previous</span>
        </button>

        <div className="flex items-center gap-1">
         {Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => (
          <button
           key={pNum}
           onClick={() => {
            setPage(pNum)
            window.scrollTo({ top: 160, behavior: 'smooth' })
           }}
           className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg text-xs font-bold transition ${
            pNum === page
             ? 'bg-black text-white shadow-sm'
             : 'text-black/60 hover:bg-[#F0F0F0]'
           }`}
          >
           {pNum}
          </button>
         ))}
        </div>

        <button
         onClick={() => {
          if (page < totalPages) {
           setPage(p => p + 1)
           window.scrollTo({ top: 160, behavior: 'smooth' })
          }
         }}
         disabled={page === totalPages}
         className="flex items-center gap-1.5 rounded-lg border border-black/10 px-3.5 py-2 text-xs font-semibold text-black hover:bg-[#F0F0F0] disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
         <span>Next</span>
         <ChevronRight size={16} />
        </button>
       </div>
      </div>
     )}
    </div>
   </div>

   {/* ============================================================ */}
   {/* POP-OUT FILTER DRAWER (SLIDE-OVER FOR MOBILE & TRIGGER)      */}
   {/* ============================================================ */}
   {showFilterDrawer && (
    <div className="fixed inset-0 z-50 overflow-hidden">
     {/* Backdrop */}
     <div
      onClick={() => setShowFilterDrawer(false)}
      className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
     />

     <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
      <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-black/10 animate-fade-in">
       {/* Drawer Header */}
       <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
        <div>
         <h2 className="font-integral font-bold text-xl uppercase tracking-tight text-black">
          Filter Catalogue
         </h2>
         <p className="text-xs text-black/60 mt-0.5">Showing {list.length} matching pieces</p>
        </div>
        <div className="flex items-center gap-3">
         {activeFilterCount > 0 && (
          <button
           onClick={clearAll}
           className="text-xs text-black/70 underline hover:text-black font-medium"
          >
           Reset
          </button>
         )}
         <button
          onClick={() => setShowFilterDrawer(false)}
          aria-label="Close filters"
          className="p-2 text-black/60 hover:text-black transition rounded-full hover:bg-[#F0F0F0]"
         >
          <X size={20} />
         </button>
        </div>
       </div>

       {/* Drawer Scrollable Content */}
       <div className="overflow-y-auto px-6 py-6 space-y-6 flex-1 text-xs">
        {/* Categories */}
        <div className="border-b border-black/10 pb-6">
         <div className="flex items-center justify-between mb-3">
          <p className="font-bold uppercase tracking-wider text-black text-sm">Categories</p>
          {cat && (
           <button onClick={() => set('cat', '')} className="text-black/60 underline">
            Clear
           </button>
          )}
         </div>
         <div className="flex flex-wrap gap-2">
          {categories.map(c => {
           const cCount = products.filter(p => p.category === c).length
           return (
            <button
             key={c}
             onClick={() => set('cat', cat === c ? '' : c)}
             className={`rounded-full px-3.5 py-1.5 text-xs transition ${
              cat === c
               ? 'bg-black text-white font-medium'
               : 'bg-[#F0F0F0] text-black/70 hover:bg-black/10'
             }`}
            >
             {c} <span className="opacity-60 text-[10px]">({cCount})</span>
            </button>
           )
          })}
         </div>
        </div>

        {/* Price Range */}
        <div className="border-b border-black/10 pb-6">
         <div className="flex items-center justify-between mb-3">
          <p className="font-bold uppercase tracking-wider text-black text-sm">Price Range</p>
          {price !== 'all' && (
           <button onClick={() => set('price', '')} className="text-black/60 underline">
            Clear
           </button>
          )}
         </div>
         <div className="grid grid-cols-2 gap-2">
          {[
           { id: 'all', label: 'All prices' },
           { id: 'under1000', label: 'Under ₹1,000' },
           { id: '1000-2500', label: '₹1,000 – ₹2,500' },
           { id: 'above2500', label: 'Above ₹2,500' }
          ].map(p => (
           <button
            key={p.id}
            onClick={() => set('price', p.id === 'all' ? '' : p.id)}
            className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
             price === p.id
              ? 'border-black bg-black text-white font-medium'
              : 'border-black/10 hover:border-black/30 bg-[#F0F0F0]/50'
            }`}
           >
            {p.label}
           </button>
          ))}
         </div>
        </div>

        {/* Colors */}
        <div className="border-b border-black/10 pb-6">
         <div className="flex items-center justify-between mb-3">
          <p className="font-bold uppercase tracking-wider text-black text-sm">Colors</p>
          {color && (
           <button onClick={() => set('color', '')} className="text-black/60 underline">
            Clear
           </button>
          )}
         </div>
         <div className="grid grid-cols-5 gap-3">
          {COLOR_PALETTE.map(c => {
           const active = color.toLowerCase() === c.name.toLowerCase()
           return (
            <button
             key={c.name}
             title={c.name}
             onClick={() => set('color', active ? '' : c.name)}
             className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-110"
             style={{
              backgroundColor: c.hex,
              border: c.border ? '1px solid rgba(0,0,0,0.2)' : 'none'
             }}
            >
             {active && (
              <Check
               size={16}
               className={c.name === 'White' || c.name === 'Yellow' ? 'text-black' : 'text-white'}
              />
             )}
            </button>
           )
          })}
         </div>
        </div>

        {/* Sizes */}
        <div>
         <div className="flex items-center justify-between mb-3">
          <p className="font-bold uppercase tracking-wider text-black text-sm">Size</p>
          {size && (
           <button onClick={() => set('size', '')} className="text-black/60 underline">
            Clear
           </button>
          )}
         </div>
         <div className="flex flex-wrap gap-2">
          {allSizes.map(s => (
           <button
            key={s}
            onClick={() => set('size', size === s ? '' : s)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition ${
             size === s
              ? 'bg-black text-white'
              : 'bg-[#F0F0F0] text-black/70 hover:bg-black/10'
            }`}
           >
            {s}
           </button>
          ))}
         </div>
        </div>

        {/* Dress Style */}
        <div className="border-t border-black/10 pt-6">
         <div className="flex items-center justify-between mb-3">
          <p className="font-bold uppercase tracking-wider text-black text-sm">Dress Style</p>
          {style && (
           <button onClick={() => set('style', '')} className="text-black/60 underline">
            Clear
           </button>
          )}
         </div>
         <div className="grid grid-cols-2 gap-2">
          {DRESS_STYLES.map(ds => (
           <button
            key={ds}
            onClick={() => set('style', style === ds ? '' : ds)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition ${
             style === ds
              ? 'bg-black text-white'
              : 'bg-[#F0F0F0] text-black/70 hover:bg-black/10'
            }`}
           >
            {ds}
           </button>
          ))}
         </div>
        </div>
       </div>

       {/* Drawer Footer */}
       <div className="border-t border-black/10 p-6">
        <button
         onClick={() => setShowFilterDrawer(false)}
         className="w-full rounded-full bg-black py-3.5 text-center text-sm font-bold text-white transition hover:bg-black/80"
        >
         Apply Filter
        </button>
       </div>
      </div>
     </div>
    </div>
   )}
  </div>
 )
}
