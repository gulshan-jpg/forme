import { useEffect, useState } from 'react'; import { useForm } from 'react-hook-form'; import { z } from 'zod'; import { zodResolver } from '@hookform/resolvers/zod'
import type { Product, Review } from '../types'; import { SAMPLE_REVIEWS } from '../data/products'; import { useReviews } from '../store/reviews'; import { useProducts } from '../store/products'; import { useAccount } from '../store/account'
import { isDemoMode } from '../services/supabase'; import * as db from '../services/db'; import { run } from '../lib/action'
const schema=z.object({name:z.string().min(2,'Enter your name'),rating:z.number().min(1).max(5),text:z.string().min(10,'Write at least 10 characters')})
type F=z.infer<typeof schema>
export default function Reviews({p}:{p:Product}){
 const local=useReviews(s=>s.reviews),add=useReviews(s=>s.add),save=useProducts(s=>s.save),me=useAccount(s=>s.me)
 const [remote,setRemote]=useState<Review[]>([]),[loading,setLoading]=useState(!isDemoMode)
 const {register,handleSubmit,reset,formState:{errors,isSubmitting}}=useForm<F>({resolver:zodResolver(schema),defaultValues:{name:me?.name??'',rating:5,text:''}})
 useEffect(()=>{if(isDemoMode)return;setLoading(true);db.fetchReviews(p.id).then(setRemote).catch(()=>setRemote([])).finally(()=>setLoading(false))},[p.id])
 const list:Review[]=isDemoMode?[...local.filter(r=>r.productId===p.id),...SAMPLE_REVIEWS.map((r,i)=>({id:'s'+i,productId:p.id,name:r.name,rating:r.rating,text:r.text,date:'',sample:true}))]:remote
 const submit=async(f:F)=>{
  const ok=await run(async()=>{const r=await db.addReview(p.id,f.name,f.rating,f.text);setRemote(x=>[r,...x])},'Thanks for your review!')
  if(!ok)return
  if(isDemoMode)add({id:'r'+Date.now(),productId:p.id,name:f.name,rating:f.rating,text:f.text,date:new Date().toISOString()})
  save({...p,rating:Math.round(((p.rating*p.reviews+f.rating)/(p.reviews+1))*10)/10,reviews:p.reviews+1})
  reset({name:f.name,rating:5,text:''})}
 return <section className="mt-16"><h2 className="h-serif text-3xl">Reviews</h2>
  {loading?<p className="mt-4 text-sm">Loading reviews…</p>:list.length===0?<p className="mt-4 text-sm text-char/70">No reviews yet. Be the first to write one.</p>:
  <div className="mt-4 grid gap-4 md:grid-cols-3">{list.map(r=><div key={r.id} className="border border-ink/10 p-5 text-sm"><p aria-label={`${r.rating} out of 5`}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</p><p className="mt-2">{r.text}</p><p className="mt-3 text-xs text-char/60">{r.name}{r.sample?' · Sample review':''}</p></div>)}</div>}
  <form onSubmit={handleSubmit(submit)} className="mt-8 grid max-w-xl gap-3 border border-ink/10 p-5 text-sm"><h3 className="h-serif text-2xl">Write a review</h3>
   <label>Your name<input className="input mt-1" {...register('name')}/>{errors.name&&<span className="text-xs text-red-700">{errors.name.message}</span>}</label>
   <label>Rating<select className="input mt-1" {...register('rating',{valueAsNumber:true})}>{[5,4,3,2,1].map(n=><option key={n} value={n}>{n} star{n>1?'s':''}</option>)}</select></label>
   <label>Review<textarea rows={3} className="input mt-1" {...register('text')}/>{errors.text&&<span className="text-xs text-red-700">{errors.text.message}</span>}</label>
   <button disabled={isSubmitting} className="btn btn-dark w-fit">{isSubmitting?'Submitting…':'Submit review'}</button></form></section>}
