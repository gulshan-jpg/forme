import { Link } from 'react-router-dom'; import { X } from 'lucide-react'
import { useCart } from '../store/cart'; import CartLines, { useCartDetail } from './CartLines'; import { inr } from '../lib/format'; import WhatsAppButton from './WhatsAppButton'; import { cartMessage } from '../lib/messages'
export default function CartDrawer(){
 const {open,setOpen}=useCart(), {items,subtotal}=useCartDetail(), close=()=>setOpen(false)
 return <div className={`fixed inset-0 z-50 ${open?'':'pointer-events-none'}`}>
  <div onClick={close} className={`absolute inset-0 bg-ink/40 transition ${open?'opacity-100':'opacity-0'}`}/>
  <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream p-6 transition-transform duration-300 ${open?'translate-x-0':'translate-x-full'}`}>
   <div className="flex items-center justify-between"><h2 className="h-serif text-3xl">Cart</h2><button aria-label="Close cart" onClick={close}><X/></button></div>
   <div className="mt-4 flex-1 overflow-y-auto"><CartLines onNavigate={close}/></div>
   {items.length>0&&<div className="space-y-3 border-t border-ink/10 pt-4"><p className="flex justify-between text-sm"><span>Subtotal</span><span>{inr(subtotal)}</span></p>
    <Link onClick={close} to="/checkout" className="btn btn-dark w-full">Checkout</Link><Link onClick={close} to="/cart" className="btn btn-line w-full">View cart</Link>
    <WhatsAppButton className="btn btn-line w-full" text={cartMessage(items)}>Enquire on WhatsApp</WhatsAppButton></div>}
  </aside></div>}
