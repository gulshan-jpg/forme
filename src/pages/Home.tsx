import { useEffect, useState } from 'react'; import { isDemoMode } from '../services/supabase'; import * as db from '../services/db'; import { Link } from 'react-router-dom'; import { Star } from 'lucide-react'
import { useSettings } from '../store/settings'; import { useProducts } from '../store/products'; import ProductCard from '../components/ProductCard'; import { SAMPLE_REVIEWS } from '../data/products'
const Row=({title,items,to}:{title:string;items:React.ComponentProps<typeof ProductCard>['p'][];to:string})=><section className="mx-auto mt-20 max-w-7xl px-4">
 <div className="mb-6 flex items-end justify-between"><h2 className="h-serif text-4xl">{title}</h2><Link to={to} className="text-xs uppercase tracking-widest underline">View all</Link></div>
 <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">{items.slice(0,4).map(p=><ProductCard key={p.id} p={p}/>)}</div></section>
export default function Home(){
 const s=useSettings(), {products,categories}=useProducts(), [rev,setRev]=useState<{name:string;text:string;rating:number;sample?:boolean}[]>(isDemoMode?SAMPLE_REVIEWS.map(r=>({...r,sample:true})):[]),[email,setEmail]=useState(''), [done,setDone]=useState(false), [err,setErr]=useState('')
 useEffect(()=>{if(!isDemoMode)db.fetchLatestReviews(3).then(r=>setRev(r.map(x=>({name:x.name,text:x.text,rating:x.rating,sample:x.sample})))).catch(()=>setRev([]))},[])
 const sub=(e:React.FormEvent)=>{e.preventDefault();if(!/^\S+@\S+\.\S+$/.test(email)){setErr('Enter a valid email address.');return};setErr('');setDone(true)}
 return <>
  <section className="mx-auto grid max-w-7xl md:grid-cols-2">
   <div className="flex flex-col justify-center px-4 py-16 md:px-10"><p className="text-xs uppercase tracking-[0.3em] text-char/60">New season</p>
    <h1 className="h-serif mt-4 text-5xl leading-[1.05] md:text-7xl">{s.heroTitle}</h1><p className="mt-5 max-w-md text-char/80">{s.heroSub}</p>
    <div className="mt-8 flex gap-3"><Link to="/shop" className="btn btn-dark">Shop the edit</Link><Link to="/shop?sort=new" className="btn btn-line">New arrivals</Link></div></div>
   <img src="https://picsum.photos/seed/forme-hero/1000/1200" alt="Editorial campaign" className="h-[60vh] w-full object-cover md:h-[80vh]"/></section>
  <section className="mx-auto mt-20 max-w-7xl px-4"><h2 className="h-serif mb-6 text-4xl">Shop by category</h2>
   <div className="grid grid-cols-2 gap-3 md:grid-cols-5">{categories.map(c=><Link key={c} to={`/shop?cat=${c}`} className="group relative aspect-[3/4] overflow-hidden">
    <img src={`https://picsum.photos/seed/cat-${c}/600/800`} alt={c} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/>
    <span className="absolute bottom-3 left-3 bg-cream px-3 py-1 text-xs uppercase tracking-widest">{c}</span></Link>)}</div></section>
  <Row title="Featured" items={products.filter(p=>p.featured)} to="/shop"/>
  <Row title="New arrivals" items={products.filter(p=>p.isNew)} to="/shop?sort=new"/>
  <Row title="Best sellers" items={products.filter(p=>p.bestseller)} to="/shop?sort=best"/>
  <section className="mx-auto mt-20 max-w-7xl px-4"><div className="bg-sand px-6 py-16 text-center"><p className="text-xs uppercase tracking-[0.3em]">Welcome offer</p><h2 className="h-serif mt-3 text-5xl">10% off your first order</h2><p className="mt-3">Use code <b>FORME10</b> at checkout.</p><Link to="/shop" className="btn btn-dark mt-6">Start shopping</Link></div></section>
  <section className="mx-auto mt-20 grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2"><img src="https://picsum.photos/seed/forme-story/900/700" alt="Our story" loading="lazy" className="w-full object-cover"/>
   <div><p className="text-xs uppercase tracking-[0.3em] text-char/60">Our story</p><h2 className="h-serif mt-3 text-4xl">Made for people who notice.</h2><p className="mt-4 text-char/80">{s.name} began on Instagram with a simple idea: fewer, better things. Every piece is chosen for materials, craft and longevity, and sent to your door with the care of a small studio.</p></div></section>
  {rev.length>0&&<section className="mx-auto mt-20 max-w-7xl px-4"><h2 className="h-serif mb-6 text-4xl">Loved by customers</h2><div className="grid gap-4 md:grid-cols-3">{rev.map((r,i)=><div key={i} className="border border-ink/10 p-6"><div className="flex">{Array.from({length:r.rating}).map((_,j)=><Star key={j} size={14} fill="#1a1a1a"/>)}</div><p className="mt-3 text-sm">{r.text}</p><p className="mt-4 text-xs uppercase tracking-widest text-char/60">{r.name}{r.sample?' · Sample review':''}</p></div>)}</div></section>}
  <section className="mx-auto mt-20 max-w-7xl px-4"><h2 className="h-serif mb-6 text-4xl">On Instagram</h2><div className="grid grid-cols-3 gap-1 md:grid-cols-6">{[1,2,3,4,5,6].map(i=><a key={i} href={s.instagram} target="_blank" rel="noreferrer"><img src={`https://picsum.photos/seed/insta-${i}/400/400`} alt={`Social post ${i}`} loading="lazy" className="aspect-square w-full object-cover"/></a>)}</div></section>
  <section className="mx-auto mt-20 max-w-xl px-4 text-center"><h2 className="h-serif text-4xl">Join the list</h2><p className="mt-2 text-sm text-char/70">New drops and private offers. No spam.</p>
   {done?<p className="mt-6 text-sm">Thanks. You're on the list (demo: nothing was stored).</p>:<form onSubmit={sub} className="mt-6 flex gap-2"><input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" aria-label="Email"/><button className="btn btn-dark">Subscribe</button></form>}
   {err&&<p className="mt-2 text-sm text-red-700">{err}</p>}</section></>}
