import { useEffect, useState } from 'react'; import { useForm } from 'react-hook-form'; import { z } from 'zod'; import { zodResolver } from '@hookform/resolvers/zod'; import { Link } from 'react-router-dom'
import { useAccount, DEMO_CUSTOMER, type R } from '../store/account'; import { useOrders } from '../store/orders'; import { isDemoMode } from '../services/supabase'; import * as db from '../services/db'
import type { Order } from '../types'; import { inr } from '../lib/format'; import { toast } from '../store/toast'
const inS=z.object({email:z.string().email('Enter a valid email'),password:z.string().min(6,'At least 6 characters')})
const upS=inS.extend({name:z.string().min(2,'Enter your name'),phone:z.string().regex(/^[6-9]\d{9}$/,'Enter a valid 10-digit mobile number')})
const Err=({m}:{m?:string})=>m?<span className="text-xs text-red-700">{m}</span>:null
function SignIn(){const {signIn}=useAccount(),[msg,setMsg]=useState('')
 const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm<z.infer<typeof inS>>({resolver:zodResolver(inS),defaultValues:isDemoMode?DEMO_CUSTOMER:{}})
 return <form onSubmit={handleSubmit(async v=>{const r=await signIn(v.email,v.password);if(!r.ok)setMsg(r.msg??'Sign-in failed')})} className="mt-6 grid gap-3 text-sm">
  <label>Email<input className="input mt-1" type="email" {...register('email')}/><Err m={errors.email?.message}/></label><label>Password<input className="input mt-1" type="password" {...register('password')}/><Err m={errors.password?.message}/></label>
  {msg&&<p className="text-red-700">{msg}</p>}{isDemoMode&&<p className="text-xs text-char/70">Demo customer account is prefilled.</p>}<button disabled={isSubmitting} className="btn btn-dark">{isSubmitting?'Signing in…':'Sign in'}</button></form>}
function SignUp(){const {signUp}=useAccount(),[msg,setMsg]=useState<R|null>(null)
 const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm<z.infer<typeof upS>>({resolver:zodResolver(upS)})
 return <form onSubmit={handleSubmit(async v=>setMsg(await signUp(v.name,v.email,v.phone,v.password)))} className="mt-6 grid gap-3 text-sm">
  <label>Full name<input className="input mt-1" {...register('name')}/><Err m={errors.name?.message}/></label><label>Email<input className="input mt-1" type="email" {...register('email')}/><Err m={errors.email?.message}/></label>
  <label>Mobile number<input className="input mt-1" type="tel" {...register('phone')}/><Err m={errors.phone?.message}/></label><label>Password<input className="input mt-1" type="password" {...register('password')}/><Err m={errors.password?.message}/></label>
  {msg&&<p className={msg.ok?'text-green-800':'text-red-700'}>{msg.msg??'Account created.'}</p>}<button disabled={isSubmitting} className="btn btn-dark">{isSubmitting?'Creating…':'Create account'}</button></form>}
export default function Account(){
 const {me,signOut}=useAccount(),orders=useOrders(s=>s.orders),[mode,setMode]=useState<'in'|'up'>('in'),[mine,setMine]=useState<Order[]>([]),[loading,setLoading]=useState(false)
 useEffect(()=>{if(!me){setMine([]);return}
  if(isDemoMode){setMine(orders.filter(o=>o.customer.email.toLowerCase()===me.email.toLowerCase()));return}
  setLoading(true);db.fetchMyOrders().then(setMine).catch(e=>toast(e.message,'error')).finally(()=>setLoading(false))},[me?.id,orders])
 if(!me)return <div className="mx-auto max-w-sm px-4 py-16"><h1 className="h-serif text-5xl">Account</h1>
  <div className="mt-6 flex gap-2">{(['in','up'] as const).map(m=><button key={m} onClick={()=>setMode(m)} className={`flex-1 border px-3 py-2 text-xs uppercase tracking-widest ${mode===m?'bg-ink text-cream':'border-ink/20'}`}>{m==='in'?'Sign in':'Register'}</button>)}</div>{mode==='in'?<SignIn/>:<SignUp/>}</div>
 return <div className="mx-auto max-w-3xl px-4 py-12"><div className="flex items-start justify-between"><div><h1 className="h-serif text-5xl">Hello, {me.name.split(' ')[0]}</h1><p className="mt-1 text-sm text-char/70">{me.email}</p></div><button className="btn btn-line" onClick={()=>signOut()}>Sign out</button></div>
  <h2 className="h-serif mt-10 text-3xl">Your orders</h2>
  {loading?<p className="mt-4 text-sm">Loading orders…</p>:mine.length===0?<div className="py-12 text-center text-sm"><p>No orders yet.</p><Link to="/shop" className="btn btn-dark mt-4">Start shopping</Link></div>:
  <div className="mt-4 space-y-2">{mine.map(o=><details key={o.id} className="border border-ink/10 p-4 text-sm"><summary className="flex cursor-pointer justify-between gap-3"><span><b>{o.id}</b> · {new Date(o.date).toLocaleDateString('en-IN')}</span><span>{o.status} · {inr(o.total)}</span></summary>
   <ul className="mt-3 space-y-1">{o.lines.map((l,i)=><li key={i}>{l.name}{l.size?` (${l.size})`:''} × {l.qty} — {inr(l.price*l.qty)}</li>)}</ul></details>)}</div>}</div>}
