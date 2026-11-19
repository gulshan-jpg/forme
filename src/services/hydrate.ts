import * as db from './db'; import { isDemoMode } from './supabase'
import { useProducts } from '../store/products'; import { useSettings } from '../store/settings'; import { useAccount } from '../store/account'; import { useCart } from '../store/cart'
export async function loadCatalog(){
 if(isDemoMode)return
 useProducts.setState({status:'loading',error:''})
 try{const c=await db.fetchCatalog();useProducts.setState({products:c.products,categories:c.categories,status:'ready'});useSettings.getState().set(c.settings)}
 catch(e){useProducts.setState({status:'error',error:e instanceof Error?e.message:String(e)})}}
export async function syncWishlist(){const me=useAccount.getState().me;if(isDemoMode||!me)return
 try{const ids=await db.fetchWishlist(me.id);useCart.setState(s=>({wishlist:[...new Set([...s.wishlist,...ids])]}))}catch{/* wishlist stays local */}}
