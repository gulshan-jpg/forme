import { Link } from 'react-router-dom'; import { Heart } from 'lucide-react'
import type { Product } from '../types'; import { inr, pct } from '../lib/format'; import { useCart } from '../store/cart'
export default function ProductCard({p}:{p:Product}){
 const {wishlist,toggleWish}=useCart(), liked=wishlist.includes(p.id), d=pct(p.price,p.originalPrice)
 return <div className="group">
  <div className="relative aspect-[4/5] overflow-hidden bg-sand/40">
   <Link to={`/product/${p.slug}`}><img src={p.images[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/></Link>
   {d>0&&<span className="absolute left-3 top-3 bg-ink px-2 py-1 text-[10px] uppercase tracking-widest text-cream">{d}% off</span>}
   {p.stock===0&&<span className="absolute bottom-3 left-3 bg-cream px-2 py-1 text-[10px] uppercase tracking-widest">Sold out</span>}
   <button aria-label="Toggle wishlist" onClick={()=>toggleWish(p.id)} className="absolute right-3 top-3 bg-cream/90 p-2"><Heart size={16} fill={liked?'#1a1a1a':'none'}/></button>
  </div>
  <Link to={`/product/${p.slug}`} className="mt-3 block"><p className="text-[11px] uppercase tracking-widest text-char/60">{p.category}</p>
   <p className="mt-1 text-sm">{p.name}</p>
   <p className="mt-1 text-sm"><span className="font-medium">{inr(p.price)}</span> {d>0&&<span className="ml-1 text-char/50 line-through">{inr(p.originalPrice)}</span>}</p></Link>
 </div>}
