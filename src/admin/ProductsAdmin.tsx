import { useEffect, useState } from 'react'; import { useProducts } from '../store/products'; import type { Product } from '../types'; import { inr, pct } from '../lib/format'
import { isDemoMode } from '../services/supabase'; import * as db from '../services/db'; import { run } from '../lib/action'; import { toast } from '../store/toast'; import { resizeImage, blobToDataUrl } from '../lib/image'
const slugify=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
const blank=(cat:string):Product=>({id:crypto.randomUUID(),slug:'',name:'',description:'',price:0,originalPrice:0,images:[],category:cat,tags:[],sizes:['One size'],stock:10,featured:false,bestseller:false,isNew:true,rating:5,reviews:0,createdAt:Date.now()})
function StockInput({p}:{p:Product}){const save=useProducts(s=>s.save),[v,setV]=useState(String(p.stock))
 useEffect(()=>{setV(String(p.stock))},[p.stock])
 const commit=async()=>{const n=Math.max(0,Math.floor(Number(v))||0);if(n===p.stock){setV(String(n));return}
  if(await run(()=>db.setStock(p.id,n),'Stock updated'))save({...p,stock:n});else setV(String(p.stock))}
 return <input aria-label={`Stock for ${p.name}`} type="number" min={0} className="input w-20" value={v} onChange={x=>setV(x.target.value)} onBlur={commit}/>}
export default function ProductsAdmin(){const {products,categories,save,remove,addCategory,removeCategory}=useProducts()
 const [e,setE]=useState<Product|null>(null),[err,setErr]=useState(''),[nc,setNc]=useState(''),[url,setUrl]=useState(''),[busy,setBusy]=useState(false)
 const up=async(f?:File)=>{if(!f)return;setBusy(true);try{const b=await resizeImage(f),u=isDemoMode?await blobToDataUrl(b):await db.uploadImage(b);setE(x=>x&&{...x,images:[...x.images,u]})}catch(x){toast(x instanceof Error?x.message:'Upload failed','error')};setBusy(false)}
 const addUrl=()=>{if(!/^https?:\/\//.test(url)){toast('Enter a full image URL starting with https://','error');return};setE(x=>x&&{...x,images:[...x.images,url]});setUrl('')}
 const submit=async(ev:React.FormEvent)=>{ev.preventDefault();if(!e)return
  if(!e.name.trim()||e.price<=0){setErr('Name and a price above 0 are required.');return}
  const p:Product={...e,images:e.images.length?e.images:['/placeholder.svg'],slug:e.slug||slugify(e.name),originalPrice:Math.max(e.originalPrice,e.price),sizes:e.sizes.length?e.sizes:['One size']}
  setBusy(true);const ok=await run(()=>db.saveProduct(p),'Product saved');setBusy(false);if(ok){save(p);setE(null);setErr('')}}
 const addCat=async(x:React.FormEvent)=>{x.preventDefault();const n=nc.trim();if(!n)return;if(await run(()=>db.addCategory(n),'Category added'))addCategory(n);setNc('')}
 const num=(k:'price'|'originalPrice'|'stock')=><input type="number" min={0} className="input mt-1" value={e![k]} onChange={x=>setE({...e!,[k]:Number(x.target.value)})}/>
 if(e)return <form onSubmit={submit} className="grid max-w-2xl gap-4 text-sm"><h2 className="h-serif text-3xl">{products.some(p=>p.id===e.id)?'Edit product':'Add product'}</h2>
  <label>Name<input className="input mt-1" value={e.name} onChange={x=>setE({...e,name:x.target.value})}/></label><label>Description<textarea className="input mt-1" value={e.description} onChange={x=>setE({...e,description:x.target.value})}/></label>
  <div className="grid grid-cols-3 gap-3"><label>Price (₹){num('price')}</label><label>Original price (₹){num('originalPrice')}</label><label>Stock{num('stock')}</label></div>
  <p className="text-char/70">Discount shown: {pct(e.price,e.originalPrice)}%</p>
  <label>Category<select className="input mt-1" value={e.category} onChange={x=>setE({...e,category:x.target.value})}>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
  <label>Sizes / variants (comma separated)<input className="input mt-1" value={e.sizes.join(', ')} onChange={x=>setE({...e,sizes:x.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}/></label>
  <label>Tags (comma separated)<input className="input mt-1" value={e.tags.join(', ')} onChange={x=>setE({...e,tags:x.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}/></label>
  <div className="flex gap-6">{(['featured','bestseller','isNew'] as const).map(k=><label key={k}><input type="checkbox" checked={e[k]} onChange={x=>setE({...e,[k]:x.target.checked})}/> {k==='isNew'?'New':k}</label>)}</div>
  <div><p>Images {isDemoMode?'(stored in this browser)':'(uploaded to Supabase Storage)'}</p><input type="file" accept="image/*" disabled={busy} className="mt-1 block" onChange={x=>{up(x.target.files?.[0]);x.target.value=''}}/>
   <div className="mt-2 flex gap-2"><input className="input" placeholder="…or paste an image URL" value={url} onChange={x=>setUrl(x.target.value)}/><button type="button" className="btn btn-line" onClick={addUrl}>Add</button></div></div>
  <div className="flex flex-wrap gap-2">{e.images.map((s,i)=><div key={i} className="relative"><img src={s} alt="" className="h-20 w-16 object-cover"/><button type="button" aria-label="Remove image" className="absolute right-0 top-0 bg-cream px-1" onClick={()=>setE({...e,images:e.images.filter((_,j)=>j!==i)})}>×</button></div>)}</div>
  {err&&<p className="text-red-700">{err}</p>}<div className="flex gap-3"><button disabled={busy} className="btn btn-dark">{busy?'Working…':'Save product'}</button><button type="button" className="btn btn-line" onClick={()=>{setE(null);setErr('')}}>Cancel</button></div></form>
 return <div><div className="flex flex-wrap items-center justify-between gap-3"><button className="btn btn-dark" onClick={()=>setE(blank(categories[0]??''))}>Add product</button>
  <form className="flex gap-2" onSubmit={addCat}><input className="input" placeholder="New category" value={nc} onChange={x=>setNc(x.target.value)}/><button className="btn btn-line">Add</button></form></div>
  <div className="mt-3 flex flex-wrap gap-2 text-xs">{categories.map(c=>{const used=products.some(p=>p.category===c);return <span key={c} className="bg-sand/50 px-2 py-1">{c} <button aria-label={`Remove ${c}`} disabled={used} title={used?'Category still has products':''} onClick={async()=>{if(await run(()=>db.removeCategory(c),'Category removed'))removeCategory(c)}}>×</button></span>})}</div>
  {products.length===0?<p className="py-16 text-center text-sm">No products yet. Add your first one.</p>:<div className="mt-6 overflow-x-auto"><table className="w-full text-left text-sm"><tbody>{products.map(p=><tr key={p.id} className="border-b border-ink/10"><td className="py-2"><img src={p.images[0]} alt="" className="h-12 w-10 object-cover"/></td><td>{p.name}</td><td>{p.category}</td><td>{inr(p.price)}</td><td><StockInput p={p}/></td>
   <td className="space-x-3 text-right"><button className="underline" onClick={()=>setE(p)}>Edit</button><button className="underline" onClick={async()=>{if(confirm(`Delete ${p.name}?`)&&await run(()=>db.deleteProduct(p.id),'Product deleted'))remove(p.id)}}>Delete</button></td></tr>)}</tbody></table></div>}</div>}
