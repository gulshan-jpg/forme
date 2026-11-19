import { useState } from 'react'; import { Link, useParams } from 'react-router-dom'; import { Heart, Minus, Plus, Star } from 'lucide-react'
import { useProducts } from '../store/products'; import { useCart } from '../store/cart'; import { inr, pct } from '../lib/format'; import ProductCard from '../components/ProductCard'
import WhatsAppButton from '../components/WhatsAppButton'; import { productMessage } from '../lib/messages'; import Reviews from '../components/Reviews'
export default function ProductPage(){
 const {slug}=useParams(), products=useProducts(s=>s.products), p=products.find(x=>x.slug===slug), {add,wishlist,toggleWish}=useCart()
 const [img,setImg]=useState(0), [size,setSize]=useState(''), [qty,setQty]=useState(1), [err,setErr]=useState('')
 if(!p)return <div className="py-32 text-center"><h1 className="h-serif text-4xl">Product not found</h1><Link to="/shop" className="btn btn-dark mt-6">Back to shop</Link></div>
 const d=pct(p.price,p.originalPrice), single=p.sizes.length===1, chosen=single?p.sizes[0]:size
 const related=products.filter(x=>x.category===p.category&&x.id!==p.id).slice(0,4)
 const addIt=()=>{if(!chosen){setErr('Please select an option.');return};setErr('');add(p.id,qty,chosen)}
 return <div className="mx-auto max-w-7xl px-4 py-8">
  <div className="grid gap-10 md:grid-cols-2">
   <div><img src={p.images[img]} alt={p.name} className="aspect-[4/5] w-full object-cover"/><div className="mt-3 grid grid-cols-4 gap-2">{p.images.map((s,i)=><button key={s} onClick={()=>setImg(i)} aria-label={`Image ${i+1}`} className={`border ${i===img?'border-ink':'border-transparent'}`}><img src={s} alt="" className="aspect-square w-full object-cover"/></button>)}</div></div>
   <div><p className="text-xs uppercase tracking-widest text-char/60">{p.category}</p><h1 className="h-serif mt-2 text-4xl md:text-5xl">{p.name}</h1>
    <p className="mt-3 flex items-center gap-1 text-sm"><Star size={14} fill="#1a1a1a"/>{p.rating} · {p.reviews} reviews</p>
    <p className="mt-4 text-2xl">{inr(p.price)} {d>0&&<><span className="ml-2 text-base text-char/50 line-through">{inr(p.originalPrice)}</span><span className="ml-2 text-sm">{d}% off</span></>}</p>
    <p className="mt-4 text-char/80">{p.description}</p>
    <p className={`mt-4 text-sm ${p.stock===0?'text-red-700':p.stock<=5?'text-amber-700':'text-green-800'}`}>{p.stock===0?'Out of stock':p.stock<=5?`Only ${p.stock} left`:'In stock'}</p>
    {!single&&<div className="mt-6"><p className="mb-2 text-xs uppercase tracking-widest">Size / variant</p><div className="flex flex-wrap gap-2">{p.sizes.map(s=><button key={s} onClick={()=>setSize(s)} className={`min-w-12 border px-3 py-2 text-sm ${size===s?'bg-ink text-cream':'border-ink/20'}`}>{s}</button>)}</div></div>}
    {err&&<p className="mt-2 text-sm text-red-700">{err}</p>}
    <div className="mt-6 flex gap-3"><div className="inline-flex items-center border border-ink/20"><button aria-label="Decrease" className="p-3" onClick={()=>setQty(Math.max(1,qty-1))}><Minus size={14}/></button><span className="w-8 text-center">{qty}</span><button aria-label="Increase" className="p-3" onClick={()=>setQty(Math.min(p.stock||1,qty+1))}><Plus size={14}/></button></div>
     <button className="btn btn-dark flex-1" disabled={p.stock===0} onClick={addIt}>{p.stock===0?'Sold out':'Add to cart'}</button>
     <button aria-label="Toggle wishlist" className="border border-ink/20 p-3" onClick={()=>toggleWish(p.id)}><Heart size={18} fill={wishlist.includes(p.id)?'#1a1a1a':'none'}/></button></div>
    <WhatsAppButton className="btn btn-line mt-3 w-full" text={productMessage(p,chosen)}>Enquire on WhatsApp</WhatsAppButton>
    <div className="mt-6 flex flex-wrap gap-2">{p.tags.map(t=><span key={t} className="bg-sand/50 px-2 py-1 text-[11px] uppercase tracking-widest">{t}</span>)}</div></div></div>
  <Reviews p={p}/>
  {related.length>0&&<section className="mt-16"><h2 className="h-serif text-3xl">You may also like</h2><div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">{related.map(r=><ProductCard key={r.id} p={r}/>)}</div></section>}</div>}
