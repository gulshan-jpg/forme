import { useState } from 'react'; import { useNavigate, Link } from 'react-router-dom'; import { useForm } from 'react-hook-form'; import { z } from 'zod'; import { zodResolver } from '@hookform/resolvers/zod'
import { useCartDetail } from '../components/CartLines'; import { useCart } from '../store/cart'; import { useOrders } from '../store/orders'; import { useProducts } from '../store/products'; import { useAccount } from '../store/account'; import { useSettings } from '../store/settings'
import { totals, type Coupon } from '../lib/pricing'; import { inr, orderId } from '../lib/format'; import { providers } from '../services/payment'; import { isDemoMode } from '../services/supabase'; import * as db from '../services/db'
import { loadCatalog } from '../services/hydrate'; import { toast } from '../store/toast'; import type { Order } from '../types'
const schema=z.object({name:z.string().min(2,'Enter your full name'),email:z.string().email('Enter a valid email'),phone:z.string().regex(/^[6-9]\d{9}$/,'Enter a valid 10-digit mobile number'),address:z.string().min(8,'Enter your full address'),city:z.string().min(2,'Required'),state:z.string().min(2,'Required'),pin:z.string().regex(/^\d{6}$/,'Enter a 6-digit PIN code')})
type F=z.infer<typeof schema>
export default function Checkout(){
 const {items,subtotal}=useCartDetail(),nav=useNavigate(),clear=useCart(s=>s.clear),add=useOrders(s=>s.add),save=useProducts(s=>s.save),me=useAccount(s=>s.me),isDemo=useSettings(s=>s.isDemo)
 const [code,setCode]=useState(''),[coupon,setCoupon]=useState<Coupon|null>(null),[cmsg,setCmsg]=useState(''),[pay,setPay]=useState(providers[0].id),[busy,setBusy]=useState(false)
 const {register,handleSubmit,formState:{errors}}=useForm<F>({resolver:zodResolver(schema),defaultValues:{name:me?.name??'',email:me?.email??'',phone:me?.phone??''}}),t=totals(subtotal,coupon)
 if(!items.length&&!busy)return <div className="py-32 text-center"><h1 className="h-serif text-4xl">Nothing to check out</h1><Link to="/shop" className="btn btn-dark mt-6">Shop now</Link></div>
 const apply=async()=>{if(!code.trim())return;try{const c=await db.fetchCoupon(code);setCoupon(c);setCmsg(c?`Applied: ${c.label}`:'Invalid coupon code.')}catch(e){setCmsg(e instanceof Error?e.message:'Could not check coupon')}}
 const submit=async(f:F)=>{setBusy(true)
  try{const prov=providers.find(p=>p.id===pay)!,r=await prov.pay(t.total);if(!r.ok)throw new Error('Payment was not completed')
   const lines=items.map(i=>({name:i.p.name,size:i.size,qty:i.qty,price:i.p.price})),base={date:new Date().toISOString(),customer:f,lines,status:'Placed' as const,payment:r.label}
   let order:Order
   if(isDemoMode){order={...base,id:orderId(),subtotal,discount:t.discount,shipping:t.shipping,total:t.total,demo:true};items.forEach(i=>save({...i.p,stock:Math.max(0,i.p.stock-i.qty)}))}
   else{const res=await db.placeOrder({code:orderId(),coupon:coupon?.code,ship:f,items:items.map(i=>({product_id:i.p.id,variant:i.size,qty:i.qty})),payment:r.label,customerId:me?.id})
    order={...base,id:res.order_code,dbId:res.id,subtotal:res.subtotal,discount:res.discount,shipping:res.shipping,total:res.total,demo:isDemo};loadCatalog()}
   add(order);clear();nav(`/order/${order.id}`)}
  catch(e){toast(e instanceof Error?e.message:'Could not place your order','error');setBusy(false)}}
 const Fld=({n,l,k,type='text'}:{n:keyof F;l:string;k?:string;type?:string})=><label className={`block text-sm ${k??''}`}>{l}<input type={type} className="input mt-1" {...register(n)}/>{errors[n]&&<span className="text-xs text-red-700">{errors[n]?.message}</span>}</label>
 return <form onSubmit={handleSubmit(submit)} className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-5"><div className="md:col-span-3"><h1 className="h-serif text-5xl">Checkout</h1>
  {!me&&<p className="mt-2 text-sm text-char/70">Checking out as a guest. <Link to="/account" className="underline">Sign in</Link> to track orders.</p>}
  <div className="mt-6 grid gap-4 md:grid-cols-2"><Fld n="name" l="Full name"/><Fld n="email" l="Email" type="email"/><Fld n="phone" l="Phone number" type="tel" k="md:col-span-2"/><Fld n="address" l="Address" k="md:col-span-2"/><Fld n="city" l="City"/><Fld n="state" l="State"/><Fld n="pin" l="PIN code"/></div>
  <h2 className="h-serif mt-8 text-2xl">Payment</h2><p className="mt-1 text-xs text-char/70">Payments are simulated: no money is charged and no card details are collected.</p>
  <div className="mt-3 space-y-2">{providers.map(p=><label key={p.id} className="flex items-center gap-3 border border-ink/20 p-3 text-sm"><input type="radio" name="pay" checked={pay===p.id} onChange={()=>setPay(p.id)}/>{p.label} <span className="text-char/50">(simulated)</span></label>)}</div></div>
  <aside className="h-fit bg-sand/30 p-6 md:col-span-2"><h2 className="h-serif text-2xl">Order summary</h2>
   <ul className="mt-4 space-y-3 text-sm">{items.map(i=><li key={i.key} className="flex justify-between gap-2"><span>{i.p.name}{i.size?` (${i.size})`:''} × {i.qty}</span><span>{inr(i.p.price*i.qty)}</span></li>)}</ul>
   <div className="mt-4 flex gap-2"><input aria-label="Coupon code" className="input" placeholder="Coupon code" value={code} onChange={e=>setCode(e.target.value)}/><button type="button" className="btn btn-line" onClick={apply}>Apply</button></div>{cmsg&&<p className="mt-1 text-xs">{cmsg}</p>}
   <div className="mt-4 space-y-1 border-t border-ink/10 pt-4 text-sm"><p className="flex justify-between"><span>Subtotal</span><span>{inr(subtotal)}</span></p>{t.discount>0&&<p className="flex justify-between"><span>Discount</span><span>−{inr(t.discount)}</span></p>}<p className="flex justify-between"><span>Shipping</span><span>{t.shipping?inr(t.shipping):'Free'}</span></p><p className="flex justify-between text-base font-medium"><span>Total</span><span>{inr(t.total)}</span></p></div>
   <p className="mt-3 text-xs text-char/70">Free shipping above ₹1,999. Standard delivery in 3–6 business days.</p>
   <button disabled={busy} className="btn btn-dark mt-4 w-full">{busy?'Processing…':`${isDemo?'Place demo order':'Place order'} · ${inr(t.total)}`}</button></aside></form>}
