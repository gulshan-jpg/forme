import { useState } from 'react'; import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Search, Heart, ShoppingBag, User, Menu, X, MessageCircle } from 'lucide-react'
import { useSettings } from '../store/settings'; import { useCart } from '../store/cart'; import { useProducts } from '../store/products'
import CartDrawer from './CartDrawer'; import WhatsAppButton from './WhatsAppButton'; import { useEffect } from 'react'; import CatalogGate from './CatalogGate'
import { isDemoMode } from '../services/supabase'; import { waUrl } from '../lib/whatsapp'
export default function Layout(){
 const s=useSettings(), {lines,wishlist,setOpen}=useCart(), cats=useProducts(p=>p.categories), nav=useNavigate(), loc=useLocation()
 const [menu,setMenu]=useState(false), [q,setQ]=useState(''), [searching,setSearching]=useState(false)
 useEffect(()=>{document.documentElement.style.setProperty('--accent',s.accent);document.title=`${s.name} — ${s.tagline}`;window.scrollTo(0,0);setMenu(false)},[s.accent,s.name,s.tagline,loc.pathname])
 const count=lines.reduce((a,l)=>a+l.qty,0)
 const submit=(e:React.FormEvent)=>{e.preventDefault();nav(`/shop?q=${encodeURIComponent(q)}`);setSearching(false)}
 const wa=()=>{ if(!s.whatsapp){alert('WhatsApp number not set yet. Add VITE_WHATSAPP_NUMBER or set it in Admin → Settings.');return}; window.open(waUrl(s.whatsapp,`Hi ${s.name}! I have a question.`),'_blank','noopener') }
 return <div className="min-h-screen">
  <div className="bg-ink px-4 py-2 text-center text-[11px] uppercase tracking-widest text-cream">{s.announcement}</div>
  <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur">
   <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
    <button aria-label="Menu" className="md:hidden" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
    <nav className="hidden gap-6 text-xs uppercase tracking-widest md:flex"><NavLink to="/shop">Shop</NavLink>{cats.slice(0,4).map(c=><Link key={c} to={`/shop?cat=${c}`}>{c}</Link>)}</nav>
    <Link to="/" className="h-serif text-3xl">{s.logoUrl?<img src={s.logoUrl} alt={s.name} className="h-8"/>:s.name}</Link>
    <div className="flex items-center gap-4">
     <button aria-label="Search" onClick={()=>setSearching(!searching)}><Search size={20}/></button>
     <Link aria-label="Account" to="/account"><User size={20}/></Link>
     <Link aria-label="Wishlist" to="/wishlist" className="relative"><Heart size={20}/>{wishlist.length>0&&<span className="absolute -right-2 -top-2 text-[10px]">{wishlist.length}</span>}</Link>
     <button aria-label="Cart" onClick={()=>setOpen(true)} className="relative"><ShoppingBag size={20}/>{count>0&&<span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] text-cream">{count}</span>}</button>
    </div></div>
   {searching&&<form onSubmit={submit} className="mx-auto max-w-7xl px-4 pb-4"><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products…" className="input"/></form>}
   {menu&&<nav className="flex flex-col gap-4 border-t border-ink/10 px-4 py-4 text-sm uppercase tracking-widest md:hidden"><Link to="/shop">Shop all</Link>{cats.map(c=><Link key={c} to={`/shop?cat=${c}`}>{c}</Link>)}<Link to="/wishlist">Wishlist</Link><Link to="/account">Account</Link></nav>}
  </header>
  <main><CatalogGate><Outlet/></CatalogGate></main>
  <footer className="mt-24 bg-ink text-cream"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
   <div><p className="h-serif text-3xl">{s.name}</p><p className="mt-3 text-sm text-cream/70">{s.tagline}</p></div>
   <div className="text-sm"><p className="mb-3 text-xs uppercase tracking-widest text-cream/50">Shop</p><div className="flex flex-col gap-2">{cats.map(c=><Link key={c} to={`/shop?cat=${c}`}>{c}</Link>)}</div></div>
   <div className="text-sm"><p className="mb-3 text-xs uppercase tracking-widest text-cream/50">Help</p><div className="flex flex-col gap-2"><Link to="/cart">Cart</Link><Link to="/wishlist">Wishlist</Link><Link to="/account">My account</Link><Link to="/admin/login">Admin</Link><a href={`mailto:${s.email}`}>{s.email}</a></div></div>
   <div className="text-sm"><p className="mb-3 text-xs uppercase tracking-widest text-cream/50">Connect</p><div className="flex flex-col items-start gap-2"><a href={s.instagram} target="_blank" rel="noreferrer">Instagram</a><WhatsAppButton className="inline-flex items-center gap-2" text={`Hi ${s.name}! I'd like to get in touch.`}>Contact on WhatsApp</WhatsAppButton></div></div>
  </div><p className="border-t border-cream/10 py-4 text-center text-[11px] text-cream/50">© {new Date().getFullYear()} {s.name}. {s.isDemo?'Demo store: orders and payments are simulated.':''}</p></footer>
  <button aria-label="Chat on WhatsApp" onClick={wa} className="fixed bottom-5 right-5 z-30 rounded-full bg-[#25D366] p-4 text-white shadow-lg"><MessageCircle/></button>
  <CartDrawer/></div>}
