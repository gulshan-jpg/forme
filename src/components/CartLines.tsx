import { Link } from 'react-router-dom'; import { Minus, Plus, X } from 'lucide-react'
import { useCart } from '../store/cart'; import { useProducts } from '../store/products'; import { inr } from '../lib/format'
export function useCartDetail(){
 const lines=useCart(s=>s.lines), products=useProducts(s=>s.products)
 const items=lines.flatMap(l=>{const p=products.find(x=>x.id===l.productId);return p?[{...l,p}]:[]})
 return {items,subtotal:items.reduce((a,i)=>a+i.p.price*i.qty,0)}}
export default function CartLines({onNavigate}:{onNavigate?:()=>void}){
 const {items}=useCartDetail(), {setQty,remove}=useCart()
 if(!items.length)return <div className="py-16 text-center"><p className="h-serif text-2xl">Your cart is empty</p><p className="mt-2 text-sm text-char/70">Find something worth keeping.</p><Link onClick={onNavigate} to="/shop" className="btn btn-dark mt-6">Shop now</Link></div>
 return <ul className="divide-y divide-ink/10">{items.map(({key,p,size,qty})=><li key={key} className="flex gap-4 py-4">
  <Link onClick={onNavigate} to={`/product/${p.slug}`}><img src={p.images[0]} alt={p.name} className="h-24 w-20 object-cover"/></Link>
  <div className="flex-1 text-sm"><div className="flex justify-between gap-2"><p>{p.name}</p><button aria-label="Remove" onClick={()=>remove(key)}><X size={16}/></button></div>
   {size&&<p className="text-char/60">Size: {size}</p>}<p className="mt-1">{inr(p.price)}</p>
   <div className="mt-2 inline-flex items-center border border-ink/20"><button aria-label="Decrease" className="p-2" onClick={()=>setQty(key,qty-1)}><Minus size={14}/></button><span className="w-8 text-center">{qty}</span>
    <button aria-label="Increase" className="p-2" disabled={qty>=p.stock} onClick={()=>setQty(key,qty+1)}><Plus size={14}/></button></div></div></li>)}</ul>}
