import type { ReactNode } from 'react'; import { useProducts } from '../store/products'; import { loadCatalog } from '../services/hydrate'
import LoadingScreen from './LoadingScreen'
export default function CatalogGate({children}:{children:ReactNode}){
 const products = useProducts(s => s.products)
 const status = useProducts(s => s.status)
 const error = useProducts(s => s.error)
 // Only block if we have zero products AND are actively loading
 if(products.length === 0 && status === 'loading') return <LoadingScreen message="Loading FORME® Catalogue…" />
 if(products.length === 0 && status === 'error') return <div className="py-32 text-center"><h1 className="h-serif text-4xl">We couldn't load the store</h1><p className="mx-auto mt-3 max-w-md text-sm text-char/70">{error}</p><button className="btn btn-dark mt-6" onClick={()=>loadCatalog()}>Try again</button></div>
 return <>{children}</>
}
