import { useState } from 'react'; import { useOrders } from '../store/orders'; import { inr } from '../lib/format'; import type { OrderStatus } from '../types'; import * as db from '../services/db'; import { run } from '../lib/action'
const ST:OrderStatus[]=['Placed','Packed','Shipped','Delivered','Cancelled']
export default function OrdersAdmin(){const {orders,setStatus}=useOrders(),[q,setQ]=useState(''),[open,setOpen]=useState('')
 const list=orders.filter(o=>(o.id+o.customer.name+o.customer.email+o.customer.phone).toLowerCase().includes(q.toLowerCase()))
 const change=async(id:string,dbId:string|undefined,s:OrderStatus)=>{if(await run(()=>db.updateOrderStatus(dbId!,s),'Status updated'))setStatus(id,s)}
 return <div><input className="input max-w-sm" placeholder="Search by order ID, name, email, phone" value={q} onChange={e=>setQ(e.target.value)}/>
 <div className="mt-4 space-y-2">{list.length===0&&<p className="py-10 text-center text-sm">No orders found.</p>}{list.map(o=><div key={o.id} className="border border-ink/10 p-4 text-sm">
  <div className="flex flex-wrap items-center justify-between gap-3"><button className="text-left" onClick={()=>setOpen(open===o.id?'':o.id)}><b>{o.id}</b> · {o.customer.name} · {inr(o.total)}{o.demo&&<span className="ml-2 text-[10px] uppercase tracking-widest text-char/60">demo</span>}</button>
   <select aria-label="Order status" className="input w-auto" value={o.status} onChange={e=>change(o.id,o.dbId,e.target.value as OrderStatus)}>{ST.map(s=><option key={s}>{s}</option>)}</select></div>
  {open===o.id&&<div className="mt-3 border-t border-ink/10 pt-3"><p>{o.customer.email} · {o.customer.phone}</p><p>{o.customer.address}, {o.customer.city}, {o.customer.state} {o.customer.pin}</p><p className="text-char/70">{o.payment}</p><ul className="mt-2">{o.lines.map((l,i)=><li key={i}>{l.name}{l.size?` (${l.size})`:''} × {l.qty} — {inr(l.price*l.qty)}</li>)}</ul></div>}</div>)}</div></div>}
