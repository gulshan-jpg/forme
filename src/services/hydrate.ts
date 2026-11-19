import * as db from './db'; import { isDemoMode } from './supabase'
import { useProducts } from '../store/products'; import { useSettings } from '../store/settings'; import { useAccount } from '../store/account'; import { useCart } from '../store/cart'
import { DEMO_PRODUCTS, CATEGORIES } from '../data/products'

export async function loadCatalog(){
  if(isDemoMode) return
  useProducts.setState({status:'loading',error:''})
  try{
    const c=await db.fetchCatalog()
    // If backend connected but has no products yet, gracefully fallback to catalogue
    if(!c.products || c.products.length === 0){
      useProducts.setState({products: DEMO_PRODUCTS, categories: CATEGORIES, status:'ready'})
    } else {
      useProducts.setState({products:c.products,categories:c.categories,status:'ready'})
    }
    useSettings.getState().set(c.settings)
  }
  catch(e){
    console.warn('Backend catalog sync notice, loading demo fallback:', e)
    // Fallback so store NEVER breaks for visitors
    useProducts.setState({products: DEMO_PRODUCTS, categories: CATEGORIES, status:'ready'})
  }
}
export async function syncWishlist(){const me=useAccount.getState().me;if(isDemoMode||!me)return
  try{const ids=await db.fetchWishlist(me.id);useCart.setState(s=>({wishlist:[...new Set([...s.wishlist,...ids])]}))}catch{/* wishlist stays local */}}

