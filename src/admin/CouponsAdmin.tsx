import { useEffect, useState } from 'react'
import * as db from '../services/db'
import type { DbCoupon } from '../services/db'
import { run } from '../lib/action'
import { toast } from '../store/toast'
import LoadingScreen from '../components/LoadingScreen'

export default function CouponsAdmin(){
 const [coupons,setCoupons]=useState<DbCoupon[]>([])
 const [loading,setLoading]=useState(true)
 const [busy,setBusy]=useState(false)
 const [showAdd,setShowAdd]=useState(false)
 const [code,setCode]=useState('')
 const [kind,setKind]=useState<'pct'|'flat'>('pct')
 const [value,setValue]=useState(10)
 const [active,setActive]=useState(true)
 const [minOrder,setMinOrder]=useState('')
 const [maxDiscount,setMaxDiscount]=useState('')
 const [expiryDate,setExpiryDate]=useState('')
 const [freeShipping,setFreeShipping]=useState(false)

 const load=async()=>{
  setLoading(true)
  try{
   const list=await db.fetchAdminCoupons()
   setCoupons(list)
  }catch(e){
   toast(e instanceof Error?e.message:'Failed to load coupons','error')
  }finally{
   setLoading(false)
  }
 }

 useEffect(()=>{load()},[])

 const submit=async(e:React.FormEvent)=>{
  e.preventDefault()
  const cleanCode=code.trim().toUpperCase()
  if(!cleanCode){toast('Enter a coupon code','error');return}
  if(value<=0){toast('Coupon value must be greater than 0','error');return}
  if(kind==='pct'&&value>100){toast('Percentage discount cannot exceed 100%','error');return}
  
  setBusy(true)
  try{
   await db.saveAdminCoupon({
    code:cleanCode,
    kind,
    value,
    active,
    minOrderValue: minOrder ? Number(minOrder) : undefined,
    maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
    expiryDate: expiryDate || undefined,
    freeShipping
   })
   toast('Coupon saved')
   setCode('')
   setValue(10)
   setMinOrder('')
   setMaxDiscount('')
   setExpiryDate('')
   setFreeShipping(false)
   setShowAdd(false)
   await load()
  }catch(err){
   toast(err instanceof Error?err.message:'Failed to save coupon','error')
  }finally{
   setBusy(false)
  }
 }

 const toggle=async(c:DbCoupon)=>{
  try{
   await db.toggleAdminCoupon(c.id,!c.active)
   toast(`Coupon ${!c.active?'activated':'deactivated'}`)
   setCoupons(coupons.map(x=>x.id===c.id?{...x,active:!c.active}:x))
  }catch(err){
   toast(err instanceof Error?err.message:'Action failed','error')
  }
 }

 const remove=async(c:DbCoupon)=>{
  if(!confirm(`Delete coupon "${c.code}"?`))return
  try{
   await db.deleteAdminCoupon(c.id)
   toast('Coupon deleted')
   setCoupons(coupons.filter(x=>x.id!==c.id))
  }catch(err){
   toast(err instanceof Error?err.message:'Delete failed','error')
  }
 }

 return <div>
  <div className="flex flex-wrap items-center justify-between gap-3">
   <div>
    <h2 className="h-serif text-3xl">Coupons & Discounts</h2>
    <p className="mt-1 text-xs text-char/70">Create and manage promo codes for checkout.</p>
   </div>
   <button className="btn btn-dark" onClick={()=>setShowAdd(!showAdd)}>
    {showAdd?'Cancel':'Add coupon'}
   </button>
  </div>

  {showAdd&&<form onSubmit={submit} className="mt-6 grid max-w-lg gap-4 border border-ink/10 bg-sand/20 p-5 text-sm">
   <h3 className="h-serif text-xl font-medium">New coupon</h3>
   <label>Coupon code
    <input className="input mt-1 uppercase" placeholder="e.g. FLASH20" value={code} onChange={e=>setCode(e.target.value.toUpperCase())}/>
   </label>
   <div className="grid grid-cols-2 gap-3">
    <label>Discount type
     <select className="input mt-1" value={kind} onChange={e=>setKind(e.target.value as 'pct'|'flat')}>
      <option value="pct">Percentage (%)</option>
      <option value="flat">Flat amount (₹)</option>
     </select>
    </label>
    <label>Value ({kind==='pct'?'%':'₹'})
     <input type="number" min={1} max={kind==='pct'?100:undefined} className="input mt-1" value={value} onChange={e=>setValue(Number(e.target.value))}/>
    </label>
   </div>

   <div className="grid grid-cols-2 gap-3">
    <label>Cart Minimum (₹ optional)
     <input type="number" min={0} placeholder="e.g. 999" className="input mt-1 text-xs" value={minOrder} onChange={e=>setMinOrder(e.target.value)}/>
    </label>
    <label>Max Discount Cap (₹ optional)
     <input type="number" min={0} placeholder="e.g. 500" className="input mt-1 text-xs" value={maxDiscount} onChange={e=>setMaxDiscount(e.target.value)}/>
    </label>
   </div>

   <div className="grid grid-cols-2 gap-3">
    <label>Expiry Date (optional)
     <input type="date" className="input mt-1 text-xs" value={expiryDate} onChange={e=>setExpiryDate(e.target.value)}/>
    </label>
    <label className="flex items-center gap-2 pt-6 cursor-pointer text-xs font-semibold">
     <input type="checkbox" checked={freeShipping} onChange={e=>setFreeShipping(e.target.checked)}/>
     <span>Free Shipping Coupon</span>
    </label>
   </div>

   <label className="flex items-center gap-2">
    <input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)}/> Active immediately
   </label>
   <div className="flex gap-2">
    <button disabled={busy} className="btn btn-dark">{busy?'Saving…':'Save coupon'}</button>
    <button type="button" className="btn btn-line" onClick={()=>setShowAdd(false)}>Cancel</button>
   </div>
  </form>}

  {loading ? <LoadingScreen message="Loading active coupons…" /> : coupons.length === 0 ? <div className="py-16 text-center text-sm">
   <p>No coupons found.</p>
   <button className="btn btn-dark mt-4" onClick={()=>setShowAdd(true)}>Create your first coupon</button>
  </div>:(
   <div className="mt-6 overflow-x-auto">
    <table className="w-full text-left text-sm">
     <thead className="text-xs uppercase tracking-widest text-char/60">
      <tr>
       <th className="py-2">Code</th>
       <th>Discount</th>
       <th>Type</th>
       <th>Conditions</th>
       <th>Status</th>
       <th className="text-right">Actions</th>
      </tr>
     </thead>
     <tbody>
      {coupons.map(c=><tr key={c.id} className="border-b border-ink/10">
       <td className="py-3 font-semibold">{c.code}</td>
       <td>{c.kind==='pct'?`${c.value}% off`:`₹${c.value} off`}</td>
       <td className="text-xs uppercase tracking-wider text-char/70">{c.kind==='pct'?'Percentage':'Flat'}</td>
       <td className="text-xs text-char/70">
        {c.freeShipping ? (
         <span className="font-semibold text-emerald-800">Free Shipping</span>
        ) : c.minOrderValue ? (
         <span>Min: ₹{c.minOrderValue}</span>
        ) : (
         <span>No min</span>
        )}
        {c.maxDiscount ? ` · Cap: ₹${c.maxDiscount}` : ''}
        {c.expiryDate ? ` · Exp: ${c.expiryDate}` : ''}
       </td>
       <td>
        <span className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider ${c.active?'bg-green-100 text-green-900':'bg-stone-200 text-stone-600'}`}>
         {c.active?'Active':'Disabled'}
        </span>
       </td>
       <td className="space-x-3 text-right">
        <button className="underline text-xs" onClick={()=>toggle(c)}>
         {c.active?'Deactivate':'Activate'}
        </button>
        <button className="underline text-xs text-red-700" onClick={()=>remove(c)}>
         Delete
        </button>
       </td>
      </tr>)}
     </tbody>
    </table>
   </div>
  )}
 </div>
}
