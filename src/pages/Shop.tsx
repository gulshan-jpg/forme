import { useSearchParams } from 'react-router-dom'; import { useProducts } from '../store/products'; import ProductCard from '../components/ProductCard'
export default function Shop(){
 const [sp,setSp]=useSearchParams(), {products,categories}=useProducts(), q=sp.get('q')??'', cat=sp.get('cat')??'', sort=sp.get('sort')??'new'
 const set=(k:string,v:string)=>{const n=new URLSearchParams(sp);v?n.set(k,v):n.delete(k);setSp(n)}
 let list=products.filter(p=>(!cat||p.category===cat)&&(!q||(p.name+p.description+p.tags.join(' ')).toLowerCase().includes(q.toLowerCase())))
 list=[...list].sort((a,b)=>sort==='low'?a.price-b.price:sort==='high'?b.price-a.price:sort==='best'?Number(b.bestseller)-Number(a.bestseller)||b.reviews-a.reviews:b.createdAt-a.createdAt)
 return <div className="mx-auto max-w-7xl px-4 py-10">
  <h1 className="h-serif text-5xl">{cat||'All products'}</h1>{q&&<p className="mt-2 text-sm">Results for “{q}”</p>}
  <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2">{['',...categories].map(c=><button key={c||'all'} onClick={()=>set('cat',c)} className={`border px-3 py-1.5 text-xs uppercase tracking-widest ${cat===c?'bg-ink text-cream':'border-ink/20'}`}>{c||'All'}</button>)}</div>
   <select aria-label="Sort" className="input w-auto" value={sort} onChange={e=>set('sort',e.target.value)}><option value="new">Newest</option><option value="best">Best sellers</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div>
  {list.length?<div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">{list.map(p=><ProductCard key={p.id} p={p}/>)}</div>:<p className="py-24 text-center text-char/70">No products match your search.</p>}</div>}
