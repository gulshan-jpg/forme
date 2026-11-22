import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { useProducts } from '../store/products'
import { useRecentlyViewed } from '../store/recentlyViewed'
import { inr } from '../lib/format'
import ProductCard from '../components/ProductCard'

const FORME_REVIEWS = [
 {
  name: 'Sarah M.',
  text: "I'm blown away by the quality and drape of the heavyweight knitwear I received from FORME®. Every piece has exceeded my expectations in fabric density and stitching precision.",
  rating: 5
 },
 {
  name: 'Alex K.',
  text: "Finding clothes that fit this clean and relaxed used to be a struggle until I found FORME®. The 240 GSM organic cotton tees hold their boxy silhouette perfectly even after washing.",
  rating: 5
 },
 {
  name: 'James L.',
  text: "As someone who appreciates minimalist design and architectural cuts, I'm thrilled with FORME®. The textures, colors, and discreet hardware feel truly elevated.",
  rating: 5
 },
 {
  name: 'Priya R.',
  text: "The fabric weight and drape are exceptional. Arrived in beautiful eco-friendly packaging within 48 hours. Will definitely be a returning patron.",
  rating: 5
 }
]

export default function Home() {
 const { products } = useProducts()
 const [activeReview, setActiveReview] = useState(0)

 const newArrivals = products.slice(0, 4)
 const topSelling = products.filter(p => p.bestseller || p.rating >= 4.8).slice(0, 4)
 const heroProducts = products.filter(p => p.bestseller || p.rating >= 4.8).slice(0, 8)
 const displayHeroProducts = heroProducts.length > 0 ? heroProducts : products.slice(0, 6)

 const [heroIndex, setHeroIndex] = useState(0)
 const [isHeroHovered, setIsHeroHovered] = useState(false)

 useEffect(() => {
  if (displayHeroProducts.length <= 1 || isHeroHovered) return
  const interval = setInterval(() => {
   setHeroIndex(prev => (prev + 1) % displayHeroProducts.length)
  }, 3500)
  return () => clearInterval(interval)
 }, [displayHeroProducts.length, isHeroHovered])

 const currentHeroProduct = displayHeroProducts[heroIndex % (displayHeroProducts.length || 1)]

 const recentIds = useRecentlyViewed(s => s.recentIds)
 const recentlyViewed = recentIds
  .map(id => products.find(p => p.id === id))
  .filter((x): x is (typeof products)[0] => Boolean(x))
  .slice(0, 4)

 return (
  <div className="bg-white text-black font-sans pb-16">
   {/* =========================================================================
       1. HERO SECTION (READABLE, SPACIOUS, MODERN EDITORIAL)
       ========================================================================= */}
   <section className="bg-[#F2F0F1] w-full overflow-hidden">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 md:pt-20">
     <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
      
      {/* Left Column: Typography, Copy & Stats */}
      <div className="lg:col-span-7 space-y-6 sm:space-y-8">
       {/* Big, Bold Geometric Headline (UI Kit Style - Refined Scale) */}
       <h1 className="font-integral text-4xl sm:text-5xl md:text-6xl lg:text-[58px] xl:text-[64px] font-black leading-[1.08] tracking-tight text-black">
        FIND CLOTHES THAT MATCH YOUR STYLE
       </h1>

       {/* Subtitle */}
       <p className="text-black/65 text-sm sm:text-base leading-relaxed max-w-lg font-normal">
        Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
       </p>

       {/* Shop Now CTA Button */}
       <div>
        <Link
         to="/shop"
         className="inline-block w-full sm:w-auto text-center rounded-full bg-black text-white hover:bg-black/85 px-14 py-4 text-sm font-semibold transition duration-200 shadow-sm"
        >
         Shop Now
        </Link>
       </div>

       {/* Stats Grid (3 Columns with Dividers) */}
       <div className="pt-4 grid grid-cols-3 gap-4 border-t border-black/10 sm:border-0 sm:pt-2">
        <div className="sm:border-r border-black/10 pr-4">
         <p className="font-bold text-2xl sm:text-3xl md:text-4xl text-black">200+</p>
         <p className="text-xs sm:text-sm text-black/60 font-normal mt-0.5">Original Silhouettes</p>
        </div>
        <div className="sm:border-r border-black/10 pr-4 pl-2">
         <p className="font-bold text-2xl sm:text-3xl md:text-4xl text-black">2,000+</p>
         <p className="text-xs sm:text-sm text-black/60 font-normal mt-0.5">Orders Delivered</p>
        </div>
        <div className="pl-2">
         <p className="font-bold text-2xl sm:text-3xl md:text-4xl text-black">30,000+</p>
         <p className="text-xs sm:text-sm text-black/60 font-normal mt-0.5">Satisfied Patrons</p>
        </div>
       </div>
      </div>

      {/* Right Column: Hero Fashion Imagery with Rotating Top Selling Showcase */}
      <div className="lg:col-span-5 relative flex items-center justify-center py-4 lg:py-0">
       {/* Luxury Rotating Top Selling Product Card */}
       {currentHeroProduct && (
        <div
         className="relative z-10 w-full max-w-md sm:max-w-lg overflow-hidden rounded-[28px] shadow-2xl border border-black/5 bg-white group"
         onMouseEnter={() => setIsHeroHovered(true)}
         onMouseLeave={() => setIsHeroHovered(false)}
        >
         <Link
          to={`/product/${currentHeroProduct.slug}`}
          className="block relative aspect-[4/4.8] sm:aspect-[4/4.5] w-full overflow-hidden bg-[#F6F6F6]"
         >
          {/* Studio Product Image - Clean & Centered */}
          <img
           key={currentHeroProduct.id}
           src={currentHeroProduct.images[0]}
           alt={currentHeroProduct.name}
           loading="eager"
           decoding="async"
           className="w-full h-full object-cover object-center animate-fade-in group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
           <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white text-[11px] font-bold tracking-wider uppercase shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Top Selling · #{((heroIndex % displayHeroProducts.length) + 1)}
           </span>

           <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-black text-xs font-bold shadow-md">
            <Star className="w-3.5 h-3.5 fill-black text-black" />
            {currentHeroProduct.rating}
            <span className="text-black/50 text-[10px] font-normal">({currentHeroProduct.reviews})</span>
           </span>
          </div>

          {/* Bottom Overlay Info Banner */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-5 sm:p-6 text-white pt-16 z-10">
           <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
             <p className="text-[11px] uppercase tracking-widest text-white/70 font-semibold mb-1">
              {currentHeroProduct.category} · Premium Quality
             </p>
             <h3 className="font-bold text-lg sm:text-xl text-white truncate group-hover:underline">
              {currentHeroProduct.name}
             </h3>
             <div className="flex items-center gap-2 mt-1.5">
              <span className="font-extrabold text-xl sm:text-2xl text-white">
               {inr(currentHeroProduct.price)}
              </span>
              {currentHeroProduct.originalPrice > currentHeroProduct.price && (
               <span className="text-xs text-white/60 line-through">
                {inr(currentHeroProduct.originalPrice)}
               </span>
              )}
             </div>
            </div>

            <div className="shrink-0 bg-white text-black text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full shadow-md group-hover:bg-white/90 transition flex items-center gap-1">
             Shop Now <ChevronRight className="w-3.5 h-3.5" />
            </div>
           </div>

           {/* Carousel Slide Indicators */}
           <div className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-white/10">
            {displayHeroProducts.map((_, i) => (
             <button
              key={i}
              type="button"
              onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               setHeroIndex(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 pointer-events-auto ${
               i === (heroIndex % displayHeroProducts.length)
                ? 'w-7 bg-white'
                : 'w-1.5 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Slide ${i + 1}`}
             />
            ))}
           </div>
          </div>
         </Link>

         {/* Prev / Next Buttons */}
         {displayHeroProducts.length > 1 && (
          <>
           <button
            type="button"
            onClick={(e) => {
             e.preventDefault();
             e.stopPropagation();
             setHeroIndex(prev => (prev - 1 + displayHeroProducts.length) % displayHeroProducts.length);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-20 shadow-md"
            aria-label="Previous product"
           >
            <ChevronLeft className="w-5 h-5" />
           </button>
           <button
            type="button"
            onClick={(e) => {
             e.preventDefault();
             e.stopPropagation();
             setHeroIndex(prev => (prev + 1) % displayHeroProducts.length);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-20 shadow-md"
            aria-label="Next product"
           >
            <ChevronRight className="w-5 h-5" />
           </button>
          </>
         )}
        </div>
       )}
      </div>

     </div>
    </div>
   </section>

   {/* =========================================================================
       2. FORME® VALUES SIGNATURE STRIP (REPLACED COMPETITOR BRANDS)
       ========================================================================= */}
   <div className="bg-black py-7 border-y border-white/10 overflow-hidden">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-around gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8 text-white text-center">
     <div className="flex items-center gap-2">
      <span className="font-integral text-lg sm:text-xl md:text-2xl tracking-wider font-bold">100% ORGANIC COTTON</span>
      <span className="text-white/40 text-xs">· 240+ GSM</span>
     </div>
     <div className="flex items-center gap-2">
      <span className="font-integral text-lg sm:text-xl md:text-2xl tracking-wider font-bold">ETHICALLY CRAFTED</span>
      <span className="text-white/40 text-xs">· ZERO-WASTE</span>
     </div>
     <div className="flex items-center gap-2">
      <span className="font-integral text-lg sm:text-xl md:text-2xl tracking-wider font-bold">HANDCRAFTED IN INDIA</span>
      <span className="text-white/40 text-xs">· LUXURY FINISH</span>
     </div>
     <div className="flex items-center gap-2">
      <span className="font-integral text-lg sm:text-xl md:text-2xl tracking-wider font-bold">EXPRESS COURIER</span>
      <span className="text-white/40 text-xs">· 48H DISPATCH</span>
     </div>
    </div>
   </div>

   {/* =========================================================================
       3. "NEW ARRIVALS" SECTION
       ========================================================================= */}
   <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
    <h2 className="font-integral text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-black uppercase tracking-tight text-center text-black mb-10 sm:mb-14">
     NEW ARRIVALS
    </h2>

    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
     {newArrivals.map(p => (
      <ProductCard key={p.id} p={p} />
     ))}
    </div>

    {/* Centered View All Pill Button */}
    <div className="mt-10 sm:mt-12 text-center">
     <Link
      to="/shop?sort=new"
      className="inline-block rounded-full border border-black/15 bg-white hover:bg-black hover:text-white px-16 py-3.5 text-sm font-semibold transition duration-200"
     >
      View All
     </Link>
    </div>
   </section>

   {/* Section Divider */}
   <div className="mx-auto my-16 max-w-7xl border-t border-black/10 px-4" />

   {/* =========================================================================
       4. "TOP SELLING" SECTION
       ========================================================================= */}
   <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <h2 className="font-integral text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-black uppercase tracking-tight text-center text-black mb-10 sm:mb-14">
     TOP SELLING
    </h2>

    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
     {topSelling.map(p => (
      <ProductCard key={p.id} p={p} />
     ))}
    </div>

    {/* Centered View All Pill Button */}
    <div className="mt-10 sm:mt-12 text-center">
     <Link
      to="/shop?sort=best"
      className="inline-block rounded-full border border-black/15 bg-white hover:bg-black hover:text-white px-16 py-3.5 text-sm font-semibold transition duration-200"
     >
      View All
     </Link>
    </div>
   </section>

   {/* =========================================================================
       4B. RECENTLY VIEWED (FOR RETURNING SHOPPERS)
       ========================================================================= */}
   {recentlyViewed.length > 0 && (
    <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-black/10 pt-16">
     <div className="flex items-center justify-between mb-8 sm:mb-12">
      <h2 className="font-integral text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-black uppercase tracking-tight text-black">
       RECENTLY VIEWED
      </h2>
      <Link to="/shop" className="text-xs uppercase tracking-wider text-black/60 hover:text-black underline">
       Browse Catalogue
      </Link>
     </div>
     <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
      {recentlyViewed.map(p => (
       <ProductCard key={p.id} p={p} />
      ))}
     </div>
    </section>
   )}

   {/* =========================================================================
       5. "BROWSE BY DRESS STYLE" BENTO GRID
       ========================================================================= */}
   <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="rounded-[40px] bg-[#F0F0F0] p-6 sm:p-12 md:p-16">
     <h2 className="font-integral text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-black uppercase tracking-tight text-center text-black mb-10 sm:mb-14">
      BROWSE BY DRESS STYLE
     </h2>

     <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
      {/* 1. Casual */}
      <Link
       to="/shop?style=Casual"
       className="group relative md:col-span-5 h-64 sm:h-72 overflow-hidden rounded-[24px] bg-[#1a1a1a] transition hover:shadow-xl"
      >
       <img
        src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80"
        alt="Casual Still Life"
        className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105 opacity-90"
       />
       {/* High-contrast gradient scrim for 100% crystal clear readability */}
       <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 transition duration-300 group-hover:from-black/90" />
       
       <div className="absolute top-5 left-5 z-10">
        <span className="inline-flex items-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/90 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/25">
         Collection
        </span>
       </div>

       <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between">
        <div>
         <h3 className="font-integral text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-sm">Casual</h3>
         <p className="text-white/80 text-xs sm:text-sm font-medium mt-0.5">Everyday Heavyweight Staples</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-1 shadow-md shrink-0">
         <ChevronRight size={18} />
        </div>
       </div>
      </Link>

      {/* 2. Formal */}
      <Link
       to="/shop?style=Formal"
       className="group relative md:col-span-7 h-64 sm:h-72 overflow-hidden rounded-[24px] bg-[#1a1a1a] transition hover:shadow-xl"
      >
       <img
        src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1200&q=80"
        alt="Formal Still Life"
        className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105 opacity-90"
       />
       <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 transition duration-300 group-hover:from-black/90" />
       
       <div className="absolute top-5 left-5 z-10">
        <span className="inline-flex items-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/90 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/25">
         Collection
        </span>
       </div>

       <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between">
        <div>
         <h3 className="font-integral text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-sm">Formal</h3>
         <p className="text-white/80 text-xs sm:text-sm font-medium mt-0.5">Tailored Architecture & Suiting</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-1 shadow-md shrink-0">
         <ChevronRight size={18} />
        </div>
       </div>
      </Link>

      {/* 3. Party */}
      <Link
       to="/shop?style=Party"
       className="group relative md:col-span-7 h-64 sm:h-72 overflow-hidden rounded-[24px] bg-[#1a1a1a] transition hover:shadow-xl"
      >
       <img
        src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=80"
        alt="Party Still Life"
        className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105 opacity-90"
       />
       <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 transition duration-300 group-hover:from-black/90" />
       
       <div className="absolute top-5 left-5 z-10">
        <span className="inline-flex items-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/90 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/25">
         Collection
        </span>
       </div>

       <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between">
        <div>
         <h3 className="font-integral text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-sm">Party</h3>
         <p className="text-white/80 text-xs sm:text-sm font-medium mt-0.5">Elevated Evening & Statement Pieces</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-1 shadow-md shrink-0">
         <ChevronRight size={18} />
        </div>
       </div>
      </Link>

      {/* 4. Gym */}
      <Link
       to="/shop?style=Gym"
       className="group relative md:col-span-5 h-64 sm:h-72 overflow-hidden rounded-[24px] bg-[#1a1a1a] transition hover:shadow-xl"
      >
       <img
        src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80"
        alt="Gym Still Life"
        className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105 opacity-90"
       />
       <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 transition duration-300 group-hover:from-black/90" />
       
       <div className="absolute top-5 left-5 z-10">
        <span className="inline-flex items-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/90 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/25">
         Collection
        </span>
       </div>

       <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between">
        <div>
         <h3 className="font-integral text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-sm">Gym</h3>
         <p className="text-white/80 text-xs sm:text-sm font-medium mt-0.5">High-Performance Minimal Activewear</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-1 shadow-md shrink-0">
         <ChevronRight size={18} />
        </div>
       </div>
      </Link>
     </div>
    </div>
   </section>

   {/* =========================================================================
       6. "OUR HAPPY CUSTOMERS" TESTIMONIALS
       ========================================================================= */}
   <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between mb-8 sm:mb-12">
     <h2 className="font-integral text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-black uppercase tracking-tight text-black">
      OUR HAPPY CUSTOMERS
     </h2>

     <div className="flex items-center gap-3">
      <button
       onClick={() => setActiveReview(c => (c - 1 + FORME_REVIEWS.length) % FORME_REVIEWS.length)}
       aria-label="Previous review"
       className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 hover:bg-black hover:text-white transition"
      >
       <ChevronLeft size={18} />
      </button>
      <button
       onClick={() => setActiveReview(c => (c + 1) % FORME_REVIEWS.length)}
       aria-label="Next review"
       className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 hover:bg-black hover:text-white transition"
      >
       <ChevronRight size={18} />
      </button>
     </div>
    </div>

    {/* Review Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
     {FORME_REVIEWS.slice(0, 3).map((r, i) => (
      <div
       key={i}
       className="rounded-[20px] border border-black/10 bg-white p-7 sm:p-8 flex flex-col justify-between shadow-xs"
      >
       <div>
        {/* 5 Monochrome Stars */}
        <div className="flex text-black">
         {Array.from({ length: 5 }).map((_, j) => (
          <Star key={j} size={16} fill="#000000" stroke="#000000" />
         ))}
        </div>

        {/* Customer Name with Verified Green Badge */}
        <div className="mt-4 flex items-center gap-1.5">
         <span className="font-bold text-base text-black">{r.name}</span>
         <span className="flex items-center justify-center rounded-full bg-emerald-500 text-white p-0.5">
          <CheckCircle2 size={12} className="text-white" />
         </span>
        </div>

        {/* Review Paragraph */}
        <p className="mt-3 text-sm text-black/60 leading-relaxed font-normal">
         "{r.text}"
        </p>
       </div>
      </div>
     ))}
    </div>
   </section>
  </div>
 )
}
