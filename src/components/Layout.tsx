import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Lock, MessageCircle, ArrowRight, Mail, Heart } from 'lucide-react'
import { useSettings } from '../store/settings'
import { useCart } from '../store/cart'
import { useProducts } from '../store/products'
import CartDrawer from './CartDrawer'
import WhatsAppButton from './WhatsAppButton'
import CatalogGate from './CatalogGate'
import { waUrl } from '../lib/whatsapp'
import { inr } from '../lib/format'

export default function Layout() {
 const s = useSettings()
 const { lines, setOpen, wishlist } = useCart()
 const { categories: cats, products } = useProducts()
 const nav = useNavigate()
 const loc = useLocation()

 const [menu, setMenu] = useState(false)
 const [q, setQ] = useState('')
 const [topBanner, setTopBanner] = useState(true)
 const [showAutocomplete, setShowAutocomplete] = useState(false)
 const [showMobileSearch, setShowMobileSearch] = useState(false)
 const searchRef = useRef<HTMLDivElement>(null)

 const [newsEmail, setNewsEmail] = useState('')
 const [newsSubscribed, setNewsSubscribed] = useState(false)
 const [newsErr, setNewsErr] = useState('')

 const handleNewsletter = (e: React.FormEvent) => {
  e.preventDefault()
  if (!/^\S+@\S+\.\S+$/.test(newsEmail)) {
   setNewsErr('Please enter a valid email address.')
   return
  }
  setNewsErr('')
  setNewsSubscribed(true)
 }

 useEffect(() => {
  window.scrollTo(0, 0)
  setMenu(false)
  setShowAutocomplete(false)
  setShowMobileSearch(false)
 }, [loc.pathname])

 useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
   if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
    setShowAutocomplete(false)
   }
  }
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
 }, [])

 const count = lines.reduce((a, l) => a + l.qty, 0)

 const matchingProducts = q.trim().length >= 1
  ? products.filter(p => (p.name + p.category + p.tags.join(' ')).toLowerCase().includes(q.toLowerCase())).slice(0, 5)
  : []

 const submit = (e: React.FormEvent) => {
  e.preventDefault()
  if (!q.trim()) return
  setShowAutocomplete(false)
  nav(`/shop?q=${encodeURIComponent(q)}`)
 }

 const wa = () => {
  if (!s.whatsapp) {
   alert('WhatsApp number not set yet. Add VITE_WHATSAPP_NUMBER or set it in Admin → Settings.')
  } else {
   window.open(waUrl(s.whatsapp, `Hi FORME®! I have an enquiry.`), '_blank', 'noopener')
  }
 }

 return (
  <div className="min-h-screen bg-white text-black font-sans flex flex-col justify-between">
   {/* =========================================================================
       1. TOP ANNOUNCEMENT BANNER
       ========================================================================= */}
   {topBanner && (
    <div className="relative bg-black px-4 py-2.5 text-center text-xs text-white">
     <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
      <p className="font-normal text-[11px] sm:text-xs">
       Sign up and get 20% off your first order.{' '}
       <Link to="/account" className="font-medium underline hover:text-white/80 ml-1">
        Sign Up Now
       </Link>
      </p>
     </div>
     <button
      onClick={() => setTopBanner(false)}
      aria-label="Dismiss banner"
      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
     >
      <X size={14} />
     </button>
    </div>
   )}

   {/* =========================================================================
       2. NAVBAR (FORME® D2C BRANDING)
       ========================================================================= */}
   <header className="sticky top-0 z-40 bg-white border-b border-black/10">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4 lg:px-8">
     
     {/* Mobile Menu & Brand Logo */}
     <div className="flex items-center gap-4">
      <button
       aria-label="Menu"
       className="md:hidden text-black p-1"
       onClick={() => setMenu(!menu)}
      >
       {menu ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Brand Name: FORME in Luxury Didone Serif (Biggest Visual Anchor) */}
      <Link
       to="/"
       className="font-brand text-3xl sm:text-4xl md:text-[46px] lg:text-[52px] font-black tracking-tight text-black uppercase leading-none select-none hover:opacity-85 transition inline-block pt-1"
      >
       FORME
      </Link>
     </div>

     {/* Desktop Navigation Links (Proportional Clean Subheadings) */}
     <nav className="hidden md:flex items-center gap-6 text-xs sm:text-[13px] uppercase tracking-wider text-black/75 font-semibold">
      <div className="relative group">
       <NavLink
        to="/shop"
        className="flex items-center gap-1 hover:text-black transition"
       >
        <span>Shop</span>
        <ChevronDown size={13} className="text-black/50 group-hover:rotate-180 transition duration-200" />
       </NavLink>
       {/* Dropdown Menu */}
       <div className="absolute left-0 top-full hidden group-hover:block pt-2 z-50">
        <div className="bg-white border border-black/10 shadow-lg rounded-2xl py-2 w-52 normal-case font-medium">
         <Link to="/shop" className="block px-4 py-2 text-xs font-semibold hover:bg-black/5">All Collections</Link>
         {cats.map(c => (
          <Link key={c} to={`/shop?cat=${encodeURIComponent(c)}`} className="block px-4 py-2 text-xs text-black/70 hover:bg-black/5 hover:text-black">
           {c}
          </Link>
         ))}
        </div>
       </div>
      </div>

      <Link to="/shop?price=under1000" className="hover:text-black transition">
       On Sale
      </Link>
      <Link to="/shop?sort=new" className="hover:text-black transition">
       New Arrivals
      </Link>
      <Link to="/about" className="hover:text-black transition">
       About
      </Link>
     </nav>

     {/* Search Input Bar with Live Autocomplete */}
     <div ref={searchRef} className="hidden md:flex flex-1 max-w-md mx-6 relative">
      <form onSubmit={submit} className="w-full">
       <div className="relative w-full">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" />
        <input
         value={q}
         onChange={e => {
          setQ(e.target.value)
          setShowAutocomplete(true)
         }}
         onFocus={() => setShowAutocomplete(true)}
         placeholder="Search products by name, style, category..."
         className="w-full rounded-full bg-[#F0F0F0] pl-11 pr-4 py-2.5 text-xs text-black placeholder-black/40 outline-none focus:ring-1 focus:ring-black transition"
        />
        {q && (
         <button
          type="button"
          onClick={() => { setQ(''); setShowAutocomplete(false) }}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
         >
          <X size={14} />
         </button>
        )}
       </div>
      </form>

      {/* Autocomplete Dropdown */}
      {showAutocomplete && q.trim().length > 0 && (
       <div className="absolute left-0 right-0 top-full mt-2 rounded-[20px] border border-black/10 bg-white p-3 shadow-2xl z-50 animate-fade-in">
        <p className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-black/40">
         {matchingProducts.length ? 'Matching Products' : 'No exact matches found'}
        </p>

        {matchingProducts.length > 0 ? (
         <div className="divide-y divide-black/5">
          {matchingProducts.map(p => (
           <Link
            key={p.id}
            to={`/product/${p.slug}`}
            onClick={() => setShowAutocomplete(false)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F0EEED]/60 transition"
           >
            <img
             src={p.images[0]}
             alt={p.name}
             className="h-11 w-11 rounded-lg bg-[#F0EEED] object-contain mix-blend-multiply shrink-0"
            />
            <div className="min-w-0 flex-1">
             <p className="text-xs font-bold text-black truncate">{p.name}</p>
             <p className="text-[11px] text-black/50">{p.category}</p>
            </div>
            <span className="text-xs font-bold font-sans text-black">{inr(p.price)}</span>
           </Link>
          ))}

          <button
           onClick={submit}
           className="w-full mt-2 py-2 text-center text-xs font-bold text-black hover:underline flex items-center justify-center gap-1.5"
          >
           <span>View all results for "{q}"</span>
           <ArrowRight size={13} />
          </button>
         </div>
        ) : (
         <div className="p-4 text-center text-xs text-black/60">
          Press Enter to browse catalogue archive for "{q}"
         </div>
        )}
       </div>
      )}
     </div>

     {/* Right Action Icons: Search (mobile), Wishlist, Cart & Account */}
     <div className="flex items-center gap-3 sm:gap-4 text-black">
      {/* Mobile Search Toggle */}
      <button
       aria-label="Search"
       onClick={() => setShowMobileSearch(!showMobileSearch)}
       className="md:hidden p-1 text-black hover:opacity-75 transition"
      >
       {showMobileSearch ? <X size={22} /> : <Search size={22} />}
      </button>

      {/* Wishlist Icon with Live Counter */}
      <Link
       aria-label="Wishlist"
       to="/wishlist"
       className="relative p-1 text-black hover:opacity-75 transition"
      >
       <Heart size={22} />
       {wishlist.length > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
         {wishlist.length}
        </span>
       )}
      </Link>

      {/* Cart Icon with Counter Pill */}
      <button
       aria-label="Cart"
       onClick={() => setOpen(true)}
       className="relative p-1 text-black hover:opacity-75 transition"
      >
       <ShoppingCart size={22} />
       {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
         {count}
        </span>
       )}
      </button>

      {/* Account Icon */}
      <Link aria-label="Account" to="/account" className="p-1 text-black hover:opacity-75 transition">
       <User size={22} />
      </Link>
     </div>
    </div>

    {/* Mobile Quick Search Bar (Toggled by Search Icon) */}
    {showMobileSearch && (
     <div className="border-t border-black/10 bg-white px-4 py-3 md:hidden animate-fade-in">
      <form onSubmit={submit} className="relative">
       <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40" />
       <input
        autoFocus
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search products by style, name, category..."
        className="w-full rounded-full bg-[#F0F0F0] pl-10 pr-4 py-2.5 text-xs text-black outline-none focus:ring-1 focus:ring-black transition"
       />
      </form>
     </div>
    )}

    {/* Mobile Navigation Drawer */}
    {menu && (
     <div className="border-t border-black/10 bg-white px-6 py-6 md:hidden animate-fade-in">
      <form onSubmit={submit} className="mb-4">
       <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40" />
        <input
         value={q}
         onChange={e => setQ(e.target.value)}
         placeholder="Search for products..."
         className="w-full rounded-full bg-[#F0F0F0] pl-10 pr-4 py-2.5 text-xs text-black outline-none"
        />
       </div>
      </form>
      <nav className="flex flex-col gap-3 text-sm font-semibold text-black">
       <Link to="/" onClick={() => setMenu(false)} className="font-brand text-3xl font-black text-black tracking-tight uppercase mb-1 inline-block">
        FORME
       </Link>
       <Link to="/shop" onClick={() => setMenu(false)}>Shop All</Link>
       {cats.map(c => (
        <Link key={c} to={`/shop?cat=${encodeURIComponent(c)}`} onClick={() => setMenu(false)} className="text-black/70">
         {c}
        </Link>
       ))}
       <Link to="/shop?sort=new" onClick={() => setMenu(false)}>New Arrivals</Link>
       <Link to="/shop?price=under1000" onClick={() => setMenu(false)}>On Sale</Link>
       <Link to="/wishlist" onClick={() => setMenu(false)} className="flex items-center justify-between">
        <span>Wishlist</span>
        {wishlist.length > 0 && (
         <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-bold text-white">
          {wishlist.length}
         </span>
        )}
       </Link>
       <Link to="/track" onClick={() => setMenu(false)}>Track Order</Link>
       <Link to="/account" onClick={() => setMenu(false)}>My Account</Link>
       <Link to="/contact" onClick={() => setMenu(false)}>Contact Us</Link>
      </nav>
     </div>
    )}
   </header>

   {/* Main View Area */}
   <main className="flex-1">
    <CatalogGate>
     <Outlet />
    </CatalogGate>
   </main>

   {/* =========================================================================
       3. FOOTER (FORME® 5-COLUMN ARCHITECTURE WITH FLOATING NEWSLETTER)
       ========================================================================= */}
   <footer className="relative mt-32 bg-[#F0F0F0] text-black">
    {/* Floating Newsletter Banner (Shopify/SHOP.CO Standard) */}
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
     <div className="relative -top-20 z-20 rounded-[20px] bg-black px-6 py-9 sm:px-10 sm:py-10 md:px-16 md:py-11 text-white shadow-xl -mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
       {/* Left Headline */}
       <div className="lg:col-span-7">
        <h2 className="font-integral text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-black uppercase tracking-tight text-white leading-[1.08]">
         STAY UP TO DATE ABOUT OUR LATEST OFFERS
        </h2>
       </div>

       {/* Right Input & Subscribe Button */}
       <div className="lg:col-span-5 flex flex-col gap-3">
        {newsSubscribed ? (
         <div className="rounded-full bg-white text-black py-3.5 px-4 text-center text-xs font-bold uppercase tracking-wider">
          ✓ Thank you for subscribing!
         </div>
        ) : (
         <form onSubmit={handleNewsletter} className="flex flex-col gap-3">
          <div className="relative">
           <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
           <input
            type="email"
            value={newsEmail}
            onChange={e => setNewsEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full rounded-full bg-white text-black pl-11 pr-4 py-3 text-sm outline-none placeholder-black/40 font-normal"
           />
          </div>
          <button
           type="submit"
           className="w-full rounded-full bg-white text-black hover:bg-white/90 py-3 text-sm font-semibold transition duration-200"
          >
           Subscribe to Newsletter
          </button>
          {newsErr && <p className="text-xs text-red-400 mt-0.5">{newsErr}</p>}
         </form>
        )}
       </div>
      </div>
     </div>
    </div>

    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-12">
     <div className="grid grid-cols-2 gap-8 md:grid-cols-5 lg:gap-12">
      
      {/* Column 1: Brand & Socials */}
      <div className="col-span-2 md:col-span-1 space-y-5">
       <Link to="/" className="font-brand text-3xl sm:text-4xl font-black text-black tracking-tight uppercase leading-none inline-block">
        FORME
       </Link>
       <p className="text-xs text-black/60 leading-relaxed max-w-xs">
        Meticulously crafted garments and sensory essentials designed to bring out your individuality and sense of style.
       </p>
       
       {/* Round Social Buttons */}
       <div className="flex items-center gap-3 pt-2">
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-black/10 text-black hover:bg-black hover:text-white transition">
         <span className="text-xs font-bold font-mono">ig</span>
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-black/10 text-black hover:bg-black hover:text-white transition">
         <span className="text-xs font-bold font-mono">𝕏</span>
        </a>
        <button onClick={wa} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white hover:opacity-90 transition">
         <MessageCircle size={15} />
        </button>
       </div>
      </div>

      {/* Column 2: COMPANY */}
      <div className="space-y-4">
       <p className="text-xs font-bold uppercase tracking-widest text-black">COMPANY</p>
       <ul className="space-y-3 text-xs text-black/60">
        <li><Link to="/about" className="hover:text-black transition">About Us</Link></li>
        <li><Link to="/shop" className="hover:text-black transition">Collections</Link></li>
        <li><Link to="/about" className="hover:text-black transition">Sustainability</Link></li>
        <li><Link to="/contact" className="hover:text-black transition">Contact Us</Link></li>
       </ul>
      </div>

      {/* Column 3: HELP */}
      <div className="space-y-4">
       <p className="text-xs font-bold uppercase tracking-widest text-black">HELP</p>
       <ul className="space-y-3 text-xs text-black/60">
        <li><Link to="/contact" className="hover:text-black transition">Customer Support</Link></li>
        <li><Link to="/shipping" className="hover:text-black transition">Shipping & Delivery</Link></li>
        <li><Link to="/returns" className="hover:text-black transition">Returns & Refunds</Link></li>
        <li><Link to="/terms" className="hover:text-black transition">Terms of Service</Link></li>
        <li><Link to="/privacy" className="hover:text-black transition">Privacy Policy</Link></li>
       </ul>
      </div>

      {/* Column 4: FAQ */}
      <div className="space-y-4">
       <p className="text-xs font-bold uppercase tracking-widest text-black">ACCOUNT</p>
       <ul className="space-y-3 text-xs text-black/60">
        <li><Link to="/account" className="hover:text-black transition">My Account</Link></li>
        <li><Link to="/account" className="hover:text-black transition">Order History</Link></li>
        <li><Link to="/wishlist" className="hover:text-black transition">Wishlist</Link></li>
        <li><Link to="/checkout" className="hover:text-black transition">Payment Options</Link></li>
       </ul>
      </div>

      {/* Column 5: RESOURCES */}
      <div className="space-y-4">
       <p className="text-xs font-bold uppercase tracking-widest text-black">EXPERIENCE</p>
       <ul className="space-y-3 text-xs text-black/60">
        <li><Link to="/shop" className="hover:text-black transition">Latest Lookbook</Link></li>
        <li><Link to="/about" className="hover:text-black transition">Fabric & Sourcing</Link></li>
        <li><Link to="/track" className="hover:text-black transition">Track Order</Link></li>
        <li><Link to="/contact" className="hover:text-black transition">WhatsApp Concierge</Link></li>
       </ul>
      </div>
     </div>

     {/* Bottom Copyright & Payment Method Badges Row */}
     <div className="mt-14 border-t border-black/10 pt-6 pb-20 md:pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-black/60">
      <p>FORME® © {new Date().getFullYear()}, All Rights Reserved</p>

      {/* Payment Badges (Razorpay, UPI, Cards, NetBanking) */}
      <div className="flex items-center gap-2">
       <span className="rounded bg-white px-2.5 py-1 text-[10px] font-bold border border-black/10 shadow-xs font-mono">UPI</span>
       <span className="rounded bg-white px-2.5 py-1 text-[10px] font-bold border border-black/10 shadow-xs font-mono">VISA</span>
       <span className="rounded bg-white px-2.5 py-1 text-[10px] font-bold border border-black/10 shadow-xs font-mono">Mastercard</span>
       <span className="rounded bg-white px-2.5 py-1 text-[10px] font-bold border border-black/10 shadow-xs font-mono">Razorpay</span>
       <span className="rounded bg-white px-2.5 py-1 text-[10px] font-bold border border-black/10 shadow-xs font-mono">NetBanking</span>
      </div>
     </div>
    </div>
   </footer>

   {/* Discreet Admin Lock Link (Bottom Left Corner) */}
   <div className="fixed bottom-3 left-3 z-30">
    <Link
     to="/admin/login"
     aria-label="Admin portal"
     title="Admin portal"
     className="flex h-7 w-7 items-center justify-center rounded-full bg-black/5 text-black/30 backdrop-blur-sm transition-all hover:bg-black/90 hover:text-white shadow-xs"
    >
     <Lock size={12} />
    </Link>
   </div>

   {/* Floating WhatsApp Concierge Button */}
   <div className="fixed bottom-6 right-6 z-40">
    <WhatsAppButton
     className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:scale-110 transition duration-300"
     text="Hi FORME®! I have a question about an order or product."
    >
     <MessageCircle size={28} />
    </WhatsAppButton>
   </div>

   {/* Cart Flyout Drawer */}
   <CartDrawer />
  </div>
 )
}
