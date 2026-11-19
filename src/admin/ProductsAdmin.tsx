import { useEffect, useState } from 'react'; import { useProducts } from '../store/products'; import type { Product } from '../types'; import { inr, pct } from '../lib/format'
import { isDemoMode } from '../services/supabase'; import * as db from '../services/db'; import { run } from '../lib/action'; import { toast } from '../store/toast'; import { resizeImage, blobToDataUrl } from '../lib/image'
import { Plus, Trash2, X } from 'lucide-react'
import LoadingScreen, { BouncingDots } from '../components/LoadingScreen'

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const blank = (cat: string): Product => ({
 id: crypto.randomUUID(),
 slug: '',
 name: '',
 sku: 'FRM-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
 brand: 'FORME®',
 description: '',
 price: 0,
 originalPrice: 0,
 images: [],
 category: cat,
 color: '',
 tags: [],
 sizes: ['One size'],
 stock: 10,
 featured: false,
 bestseller: false,
 isNew: true,
 rating: 5,
 reviews: 0,
 createdAt: Date.now(),
 specifications: {},
 careInstructions: '',
 modelInfo: '',
 weightGrams: 350,
 published: true
})

function StockInput({ p }: { p: Product }) {
 const save = useProducts(s => s.save)
 const [v, setV] = useState(String(p.stock))

 useEffect(() => { setV(String(p.stock)) }, [p.stock])

 const commit = async (targetVal?: number) => {
  const n = Math.max(0, Math.floor(targetVal !== undefined ? targetVal : Number(v)) || 0)
  if (n === p.stock && targetVal === undefined) { setV(String(n)); return }
  setV(String(n))
  if (await run(() => db.setStock(p.id, n), 'Stock updated')) save({ ...p, stock: n })
  else setV(String(p.stock))
 }

 return (
  <div className="flex items-center gap-1.5">
   <input
    aria-label={`Stock for ${p.name}`}
    type="number"
    min={0}
    className="input w-16 text-xs text-center py-1"
    value={v}
    onChange={x => setV(x.target.value)}
    onBlur={() => commit()}
   />
   <div className="flex flex-col gap-0.5">
    <button
     type="button"
     title="Add 5 units"
     onClick={() => commit(p.stock + 5)}
     className="px-1 text-[9px] bg-sand/80 hover:bg-sand rounded font-semibold text-char"
    >
     +5
    </button>
    <button
     type="button"
     title="Decrease 1 unit"
     onClick={() => commit(Math.max(0, p.stock - 1))}
     className="px-1 text-[9px] bg-sand/80 hover:bg-sand rounded font-semibold text-char"
    >
     -1
    </button>
   </div>
  </div>
 )
}

export default function ProductsAdmin() {
 const { products, categories, save, remove, addCategory, removeCategory } = useProducts()
 const [e, setE] = useState<Product | null>(null)
 const [err, setErr] = useState('')
 const [nc, setNc] = useState('')
 const [url, setUrl] = useState('')
 const [busy, setBusy] = useState(false)
 const [specKey, setSpecKey] = useState('')
 const [specVal, setSpecVal] = useState('')
 const [searchQuery, setSearchQuery] = useState('')
 const [lowStockFilter, setLowStockFilter] = useState(false)
 const [catFilter, setCatFilter] = useState<string | null>(null)

 const up = async (f?: File) => {
  if (!f) return
  setBusy(true)
  try {
   const b = await resizeImage(f)
   let u: string
   try {
    u = isDemoMode ? await blobToDataUrl(b) : await db.uploadImage(b)
   } catch (uploadErr) {
    console.warn('Storage upload notice, using local preview:', uploadErr)
    u = await blobToDataUrl(b)
   }
   setE(x => x && { ...x, images: [...x.images, u] })
   toast('Image added successfully', 'ok')
  } catch (x) {
   toast(x instanceof Error ? x.message : 'Upload failed', 'error')
  }
  setBusy(false)
 }

 const addUrl = () => {
  if (!/^https?:\/\//.test(url)) {
   toast('Enter a full image URL starting with https://', 'error')
   return
  }
  setE(x => x && { ...x, images: [...x.images, url] })
  setUrl('')
 }

 const submit = async (ev: React.FormEvent) => {
  ev.preventDefault()
  if (!e) return
  if (!e.name.trim() || e.price <= 0) {
   setErr('Name and a price above 0 are required.')
   return
  }
  const p: Product = {
   ...e,
   images: e.images.length ? e.images : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'],
   slug: e.slug || slugify(e.name),
   originalPrice: Math.max(e.originalPrice, e.price),
   sizes: e.sizes.length ? e.sizes : ['One size']
  }
  setBusy(true)
  const ok = await run(() => db.saveProduct(p), 'Product saved')
  setBusy(false)
  if (ok) {
   save(p)
   setE(null)
   setErr('')
  }
 }

 const addCat = async (x: React.FormEvent) => {
  x.preventDefault()
  const n = nc.trim()
  if (!n) return
  if (await run(() => db.addCategory(n), 'Category added')) addCategory(n)
  setNc('')
 }

 const addSpec = () => {
  if (!e || !specKey.trim() || !specVal.trim()) return
  setE({
   ...e,
   specifications: {
    ...(e.specifications || {}),
    [specKey.trim()]: specVal.trim()
   }
  })
  setSpecKey('')
  setSpecVal('')
 }

 const removeSpec = (k: string) => {
  if (!e || !e.specifications) return
  const next = { ...e.specifications }
  delete next[k]
  setE({ ...e, specifications: next })
 }

 const num = (k: 'price' | 'originalPrice' | 'stock') => (
  <input type="number" min={0} className="input mt-1" value={e![k]} onChange={x => setE({ ...e!, [k]: Number(x.target.value) })} />
 )

 if (e) {
  return (
   <form onSubmit={submit} className="grid max-w-3xl gap-5 text-sm">
    <div className="border-b border-ink/10 pb-3">
     <h2 className="h-serif text-3xl">{products.some(p => p.id === e.id) ? 'Edit product' : 'Add product'}</h2>
     <p className="mt-1 text-xs text-char/70">Configure product specifications, images, variants and stock levels.</p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
     <label>Name
      <input className="input mt-1" value={e.name} onChange={x => setE({ ...e, name: x.target.value })} />
     </label>
     <label>SKU / Product Code
      <input className="input mt-1" value={e.sku || ''} onChange={x => setE({ ...e, sku: x.target.value })} />
     </label>
    </div>

    <label>Description
     <textarea rows={3} className="input mt-1" value={e.description} onChange={x => setE({ ...e, description: x.target.value })} />
    </label>

    <div className="grid grid-cols-3 gap-3">
     <label>Price (₹){num('price')}</label>
     <label>Original Price (₹){num('originalPrice')}</label>
     <label>Stock Quantity{num('stock')}</label>
    </div>
    <p className="text-xs text-char/70">Discount shown to customers: {pct(e.price, e.originalPrice)}%</p>

    <div className="grid gap-4 sm:grid-cols-2">
     <label>Category
      <select className="input mt-1" value={e.category} onChange={x => setE({ ...e, category: x.target.value })}>
       {categories.map(c => <option key={c}>{c}</option>)}
      </select>
     </label>
     <label>Color / Shade
      <input className="input mt-1" placeholder="e.g. Vintage Black, Sand, 18K Gold" value={e.color || ''} onChange={x => setE({ ...e, color: x.target.value })} />
     </label>
    </div>

    <label>Sizes / Variants (comma separated)
     <input className="input mt-1" value={e.sizes.join(', ')} onChange={x => setE({ ...e, sizes: x.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
    </label>

    <label>Search Tags (comma separated)
     <input className="input mt-1" value={e.tags.join(', ')} onChange={x => setE({ ...e, tags: x.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
    </label>

    {/* Specifications Section */}
    <div className="border border-ink/10 bg-sand/20 p-4">
     <h3 className="h-serif text-lg font-medium">Category Specifications</h3>
     <p className="mt-0.5 text-xs text-char/70">Add specific technical details (Fabric, GSM, Net Quantity, Metal, Weight, etc.)</p>
     
     {e.specifications && Object.keys(e.specifications).length > 0 && (
      <div className="mt-3 space-y-2 border-b border-ink/10 pb-3">
       {Object.entries(e.specifications).map(([k, v]) => (
        <div key={k} className="flex items-center justify-between bg-cream px-3 py-1.5 text-xs">
         <span><strong className="text-ink">{k}:</strong> {v}</span>
         <button type="button" onClick={() => removeSpec(k)} className="text-red-700 hover:text-red-900"><Trash2 size={13}/></button>
        </div>
       ))}
      </div>
     )}

     <div className="mt-3 flex flex-wrap gap-2">
      <input className="input flex-1 min-w-[140px] text-xs" placeholder="Spec name (e.g. Fabric Weight)" value={specKey} onChange={x => setSpecKey(x.target.value)} />
      <input className="input flex-1 min-w-[140px] text-xs" placeholder="Spec value (e.g. 240 GSM)" value={specVal} onChange={x => setSpecVal(x.target.value)} />
      <button type="button" onClick={addSpec} className="btn btn-line text-xs flex items-center gap-1">
       <Plus size={13}/> Add Spec
      </button>
     </div>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
     <label>Care Instructions
      <input className="input mt-1 text-xs" placeholder="e.g. Machine wash cold, dry flat" value={e.careInstructions || ''} onChange={x => setE({ ...e, careInstructions: x.target.value })} />
     </label>
     <label>Model Information
      <input className="input mt-1 text-xs" placeholder="e.g. Model is 6'1 wearing size L" value={e.modelInfo || ''} onChange={x => setE({ ...e, modelInfo: x.target.value })} />
     </label>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
     <label>Shipping Weight (grams)
      <input type="number" min={0} className="input mt-1 text-xs" placeholder="350" value={e.weightGrams ?? 350} onChange={x => setE({ ...e, weightGrams: Number(x.target.value) })} />
     </label>
     <label className="flex items-center gap-2 cursor-pointer pt-6 text-xs font-semibold">
      <input type="checkbox" checked={e.published ?? true} onChange={x => setE({ ...e, published: x.target.checked })} />
      <span>Published (active on customer storefront)</span>
     </label>
    </div>

    <div className="flex flex-wrap gap-6 border-y border-ink/10 py-3">
     {(['featured', 'bestseller', 'isNew'] as const).map(k => (
      <label key={k} className="flex items-center gap-2 cursor-pointer text-xs">
       <input type="checkbox" checked={e[k]} onChange={x => setE({ ...e, [k]: x.target.checked })} />
       {k === 'isNew' ? 'New Arrival' : k === 'featured' ? 'Featured Edit' : 'Best Seller'}
      </label>
     ))}
    </div>

    <div>
     <p className="font-medium text-xs">Product Images {isDemoMode ? '(stored in browser state)' : '(uploaded to Supabase Storage)'}</p>
     <input type="file" accept="image/*" disabled={busy} className="mt-1 block text-xs" onChange={x => { up(x.target.files?.[0]); x.target.value = '' }} />
     <div className="mt-2 flex gap-2">
      <input className="input text-xs" placeholder="…or paste an image URL (Unsplash, HTTPS)" value={url} onChange={x => setUrl(x.target.value)} />
      <button type="button" className="btn btn-line text-xs" onClick={addUrl}>Add URL</button>
     </div>
    </div>

    <div className="flex flex-wrap gap-2">
     {e.images.map((s, i) => (
      <div key={i} className="relative group">
       <img src={s} alt="" className="h-24 w-20 object-cover border border-ink/10" />
       <button type="button" aria-label="Remove image" className="absolute right-1 top-1 bg-ink text-cream h-5 w-5 flex items-center justify-center text-xs rounded-full opacity-80 hover:opacity-100" onClick={() => setE({ ...e, images: e.images.filter((_, j) => j !== i) })}>
        ×
       </button>
      </div>
     ))}
    </div>

    {err && <p className="text-red-700 text-xs">{err}</p>}

    <div className="flex gap-3 pt-4 border-t border-ink/10">
     <button disabled={busy} className="btn btn-dark">{busy ? 'Working…' : 'Save product'}</button>
     <button type="button" className="btn btn-line" onClick={() => { setE(null); setErr('') }}>Cancel</button>
    </div>
   </form>
  )
 }

 return (
  <div>
   <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
     <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black font-sans">Products Catalogue</h2>
     <p className="mt-1 text-xs text-char/70">Manage inventory, prices, specifications and imagery.</p>
    </div>
    <div className="flex flex-wrap items-center gap-2">
     <button className="btn btn-dark" onClick={() => setE(blank(categories[0] ?? 'Clothing'))}>Add product</button>
     <form className="flex gap-2" onSubmit={addCat}>
      <input className="input text-xs w-36" placeholder="New category" value={nc} onChange={x => setNc(x.target.value)} />
      <button className="btn btn-line text-xs">Add</button>
     </form>
    </div>
   </div>

   <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-ink/10 py-3">
    <div className="flex flex-wrap items-center gap-2">
     <input
      type="text"
      placeholder="Search product, SKU, or category…"
      className="input text-xs w-64 py-1.5"
      value={searchQuery}
      onChange={x => setSearchQuery(x.target.value)}
     />
     <button
      type="button"
      onClick={() => setLowStockFilter(!lowStockFilter)}
      className={`btn py-1.5 px-3 text-xs transition ${
       lowStockFilter ? 'bg-amber-800 text-white border-amber-800' : 'btn-line'
      }`}
     >
      ⚠️ Low stock ({products.filter(p => p.stock <= 5).length})
     </button>
     {(searchQuery || lowStockFilter || catFilter) && (
      <button
       type="button"
       onClick={() => { setSearchQuery(''); setLowStockFilter(false); setCatFilter(null) }}
       className="text-xs text-char/60 underline hover:text-ink font-semibold"
      >
       Reset filter
      </button>
     )}
    </div>
    <span className="text-xs text-char/60 font-medium">
     Showing {products.filter(p => {
      const matchesSearch = !searchQuery || (p.name + (p.sku || '') + p.category).toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLow = !lowStockFilter || p.stock <= 5
      const matchesCat = !catFilter || p.category === catFilter
      return matchesSearch && matchesLow && matchesCat
     }).length} of {products.length} products
    </span>
   </div>

   {/* Accessible Category Filter Chips & Management */}
   <div className="mt-3 flex flex-wrap items-center gap-2 text-xs" role="region" aria-label="Category management and filters">
    {/* 'All' Category Reset Pill */}
    <button
     type="button"
     onClick={() => setCatFilter(null)}
     aria-pressed={catFilter === null}
     className={`px-3 py-1.5 rounded-full text-xs font-bold transition border flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-black ${
      catFilter === null
       ? 'bg-black text-white border-black shadow-xs'
       : 'bg-white text-black border-black/15 hover:bg-black/5'
     }`}
    >
     <span>All</span>
     <span className={`text-[10px] rounded-full px-1.5 py-0.2 ${catFilter === null ? 'bg-white/20 text-white' : 'bg-black/5 text-black/60'}`}>
      {products.length}
     </span>
    </button>

    {categories.map(c => {
     const count = products.filter(p => p.category === c).length
     const used = count > 0
     const isSelected = catFilter === c

     return (
      <div
       key={c}
       className={`group px-3 py-1.5 rounded-full text-xs font-semibold transition border flex items-center gap-2 ${
        isSelected
         ? 'bg-black text-white border-black shadow-xs'
         : 'bg-white text-black border-black/15 hover:border-black/40 hover:bg-black/5'
       }`}
      >
       {/* Category Name & Product Count Pill (Click to Filter) */}
       <button
        type="button"
        onClick={() => setCatFilter(isSelected ? null : c)}
        aria-pressed={isSelected}
        aria-label={`Filter by ${c} (${count} products)`}
        className="flex items-center gap-1.5 focus:outline-none"
       >
        <span className="font-bold">{c}</span>
        <span
         className={`text-[10px] rounded-full px-1.5 py-0.2 font-medium ${
          isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-black/60'
         }`}
        >
         {count}
        </span>
       </button>

       {/* Accessible Delete Action */}
       <button
        type="button"
        disabled={used}
        aria-label={used ? `Cannot remove ${c}, it has ${count} product(s)` : `Remove empty category ${c}`}
        title={used ? `Cannot remove: ${count} product(s) assigned to this category` : `Delete empty category ${c}`}
        onClick={async (ev) => {
         ev.stopPropagation()
         if (await run(() => db.removeCategory(c), 'Category removed')) {
          removeCategory(c)
          if (catFilter === c) setCatFilter(null)
         }
        }}
        className={`rounded-full p-0.5 transition ${
         used
          ? 'cursor-not-allowed text-black/30 opacity-40'
          : isSelected
          ? 'text-white/70 hover:bg-red-600 hover:text-white'
          : 'text-black/40 hover:bg-red-600 hover:text-white'
        }`}
       >
        <X size={12} strokeWidth={2.5} />
       </button>
      </div>
     )
    })}
   </div>

   {products.length === 0 ? (
    <p className="py-16 text-center text-sm">No products found. Add your first item.</p>
   ) : (
    <div className="mt-6 overflow-x-auto">
     <table className="w-full text-left text-sm">
      <thead className="text-xs uppercase tracking-widest text-char/60 border-b border-ink/10 pb-2">
       <tr>
        <th className="py-2">Image</th>
        <th>Product & SKU</th>
        <th>Category</th>
        <th>Price</th>
        <th>Stock Level</th>
        <th>Status</th>
        <th className="text-right">Actions</th>
       </tr>
      </thead>
      <tbody>
       {products
        .filter(p => {
         const matchesSearch = !searchQuery || (p.name + (p.sku || '') + p.category).toLowerCase().includes(searchQuery.toLowerCase())
         const matchesLow = !lowStockFilter || p.stock <= 5
         const matchesCat = !catFilter || p.category === catFilter
         return matchesSearch && matchesLow && matchesCat
        })
        .map(p => (
        <tr key={p.id} className="border-b border-ink/10">
         <td className="py-3">
          <img src={p.images[0]} alt="" className="h-12 w-10 object-cover bg-sand/30" />
         </td>
         <td>
          <p className="font-medium text-xs sm:text-sm">{p.name}</p>
          <span className="text-[11px] text-char/60">{p.sku || 'FRM-SKU'}</span>
         </td>
         <td className="text-xs">{p.category}</td>
         <td className="text-xs sm:text-sm font-medium">{inr(p.price)}</td>
         <td><StockInput p={p} /></td>
         <td>
          {p.stock === 0 ? (
           <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-red-100 text-red-800">Out of Stock</span>
          ) : p.stock <= 5 ? (
           <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-100 text-amber-800">Low ({p.stock})</span>
          ) : (
           <span className="px-2 py-0.5 text-[10px] font-medium uppercase rounded bg-emerald-100 text-emerald-800">In Stock</span>
          )}
         </td>
         <td className="space-x-3 text-right text-xs">
          <button className="underline" onClick={() => setE(p)}>Edit</button>
          <button className="underline text-red-700" onClick={async () => {
           if (confirm(`Delete ${p.name}?`) && await run(() => db.deleteProduct(p.id), 'Product deleted')) remove(p.id)
          }}>
           Delete
          </button>
         </td>
        </tr>
       ))}
      </tbody>
     </table>
    </div>
   )}
  </div>
 )
}
