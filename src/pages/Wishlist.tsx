import { Link } from 'react-router-dom'; import { useCart } from '../store/cart'; import { useProducts } from '../store/products'; import ProductCard from '../components/ProductCard'
export default function Wishlist(){const w=useCart(s=>s.wishlist),list=useProducts(s=>s.products).filter(p=>w.includes(p.id))
 return <div className="mx-auto max-w-7xl px-4 py-10"><h1 className="h-serif text-5xl">Wishlist</h1>
 {list.length?<div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">{list.map(p=><ProductCard key={p.id} p={p}/>)}</div>:<div className="py-24 text-center"><p>Nothing saved yet.</p><Link to="/shop" className="btn btn-dark mt-6">Browse products</Link></div>}</div>}
