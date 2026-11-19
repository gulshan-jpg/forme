import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Star, CheckCircle } from 'lucide-react'
import type { Product, Review } from '../types'
import { SAMPLE_REVIEWS } from '../data/products'
import { useReviews } from '../store/reviews'
import { useProducts } from '../store/products'
import { useAccount } from '../store/account'
import { isDemoMode } from '../services/supabase'
import * as db from '../services/db'
import { run } from '../lib/action'

const schema = z.object({
 name: z.string().min(2, 'Enter your name'),
 rating: z.number().min(1).max(5),
 text: z.string().min(10, 'Write at least 10 characters')
})
type F = z.infer<typeof schema>

export default function Reviews({ p }: { p: Product }) {
 const local = useReviews(s => s.reviews)
 const add = useReviews(s => s.add)
 const save = useProducts(s => s.save)
 const me = useAccount(s => s.me)
 
 const [remote, setRemote] = useState<Review[]>([])
 const [loading, setLoading] = useState(!isDemoMode)

 const {
  register,
  handleSubmit,
  reset,
  formState: { errors, isSubmitting }
 } = useForm<F>({
  resolver: zodResolver(schema),
  defaultValues: { name: me?.name ?? '', rating: 5, text: '' }
 })

 useEffect(() => {
  if (isDemoMode) return
  setLoading(true)
  db.fetchReviews(p.id)
   .then(setRemote)
   .catch(() => setRemote([]))
   .finally(() => setLoading(false))
 }, [p.id])

 const list: Review[] = isDemoMode
  ? [
     ...local.filter(r => r.productId === p.id),
     ...SAMPLE_REVIEWS.map((r, i) => ({
      id: 's' + i,
      productId: p.id,
      name: r.name,
      rating: r.rating,
      text: r.text,
      date: 'August 14, 2023',
      sample: true
     }))
    ]
  : remote

 const submit = async (f: F) => {
  const ok = await run(async () => {
   const r = await db.addReview(p.id, f.name, f.rating, f.text)
   setRemote(x => [r, ...x])
  }, 'Thanks for your review!')
  if (!ok) return

  if (isDemoMode) {
   add({
    id: 'r' + Date.now(),
    productId: p.id,
    name: f.name,
    rating: f.rating,
    text: f.text,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
   })
  }

  save({
   ...p,
   rating: Math.round(((p.rating * p.reviews + f.rating) / (p.reviews + 1)) * 10) / 10,
   reviews: p.reviews + 1
  })
  reset({ name: f.name, rating: 5, text: '' })
 }

 return (
  <section className="mt-16">
   {/* Header with All Reviews count */}
   <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-6">
    <div className="flex items-center gap-2">
     <h2 className="text-xl sm:text-2xl font-bold text-black">
      All Reviews
     </h2>
     <span className="text-sm text-black/60 font-normal">
      ({list.length})
     </span>
    </div>
   </div>

   {/* Reviews 2-column Grid (Figma SHOP.CO style) */}
   {loading ? (
    <p className="py-12 text-center text-sm text-black/60">Loading reviews…</p>
   ) : list.length === 0 ? (
    <p className="py-12 text-center text-sm text-black/60">
     No reviews yet. Be the first to write one!
    </p>
   ) : (
    <div className="mt-8 grid gap-5 sm:grid-cols-2">
     {list.map(r => (
      <div
       key={r.id}
       className="rounded-[20px] border border-black/10 p-6 bg-white shadow-sm flex flex-col justify-between"
      >
       <div>
        {/* Monochrome Black & White Star rating */}
        <div className="flex text-black mb-3">
         {[1, 2, 3, 4, 5].map(star => (
          <Star
           key={star}
           size={16}
           fill={star <= r.rating ? '#000000' : '#E5E5E5'}
           strokeWidth={0}
          />
         ))}
        </div>

        {/* Reviewer Name with green verified checkmark */}
        <div className="flex items-center gap-1.5 font-bold text-base text-black">
         <span>{r.name}</span>
         <CheckCircle size={15} className="text-[#01AB31]" fill="#01AB31" stroke="white" strokeWidth={2} />
        </div>

        {/* Review text */}
        <p className="mt-3 text-sm leading-relaxed text-black/60">
         {r.text}
        </p>
       </div>

       {/* Date */}
       <p className="mt-4 text-xs font-medium text-black/40">
        Posted on {r.date || 'August 14, 2023'}
       </p>
      </div>
     ))}
    </div>
   )}

   {/* Write a review form (Always available) */}
   <form
    onSubmit={handleSubmit(submit)}
    className="mt-12 rounded-[20px] border border-black/10 bg-[#F0EEED]/50 p-6 sm:p-8 text-sm space-y-4 max-w-2xl"
   >
    <h3 className="font-bold text-lg text-black">Write a review</h3>
    
    <div>
     <label className="block text-xs font-semibold text-black/70 mb-1">
      Your name
      <input
       className="w-full mt-1 rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
       {...register('name')}
      />
     </label>
     {errors.name && <span className="text-xs text-red-600 mt-1 block">{errors.name.message}</span>}
    </div>

    <div>
     <label className="block text-xs font-semibold text-black/70 mb-1">
      Rating
      <select
       className="w-full mt-1 rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
       {...register('rating', { valueAsNumber: true })}
      >
       {[5, 4, 3, 2, 1].map(n => (
        <option key={n} value={n}>
         {n} star{n > 1 ? 's' : ''}
        </option>
       ))}
      </select>
     </label>
    </div>

    <div>
     <label className="block text-xs font-semibold text-black/70 mb-1">
      Review
      <textarea
       rows={4}
       className="w-full mt-1 rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
       placeholder="Share details about the fit, fabric quality, and your overall experience..."
       {...register('text')}
      />
     </label>
     {errors.text && <span className="text-xs text-red-600 mt-1 block">{errors.text.message}</span>}
    </div>

    <button
     disabled={isSubmitting}
     className="rounded-full bg-black px-8 py-3 text-xs font-bold text-white hover:bg-black/80 transition"
    >
     {isSubmitting ? 'Submitting…' : 'Submit review'}
    </button>
   </form>
  </section>
 )
}
