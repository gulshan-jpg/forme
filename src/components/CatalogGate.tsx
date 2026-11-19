import type { ReactNode } from 'react'; import { useProducts } from '../store/products'; import { loadCatalog } from '../services/hydrate'
export default function CatalogGate({children}:{children:ReactNode}){
 const status=useProducts(s=>s.status),error=useProducts(s=>s.error)
 if(status==='loading')return <div className="mx-auto max-w-7xl px-4 py-16" aria-busy="true"><div className="h-10 w-64 animate-pulse bg-sand/50"/><div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">{Array.from({length:8}).map((_,i)=><div key={i} className="aspect-[4/5] animate-pulse bg-sand/40"/>)}</div></div>
 if(status==='error')return <div className="py-32 text-center"><h1 className="h-serif text-4xl">We couldn't load the store</h1><p className="mx-auto mt-3 max-w-md text-sm text-char/70">{error}</p><button className="btn btn-dark mt-6" onClick={()=>loadCatalog()}>Try again</button></div>
 return <>{children}</>}
