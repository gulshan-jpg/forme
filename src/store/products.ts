import { create } from 'zustand'; import { persist } from 'zustand/middleware'
import type { Product } from '../types'; import { DEMO_PRODUCTS, CATEGORIES } from '../data/products'; import { isDemoMode } from '../services/supabase'
interface S{products:Product[];categories:string[];status:'loading'|'ready'|'error';error:string;save:(p:Product)=>void;remove:(id:string)=>void;addCategory:(c:string)=>void;removeCategory:(c:string)=>void}
export const useProducts=create<S>()(persist((set)=>({products:isDemoMode?DEMO_PRODUCTS:[],categories:isDemoMode?CATEGORIES:[],status:isDemoMode?'ready':'loading',error:'',
 save:(p)=>set(s=>({products:s.products.some(x=>x.id===p.id)?s.products.map(x=>x.id===p.id?p:x):[p,...s.products]})),
 remove:(id)=>set(s=>({products:s.products.filter(x=>x.id!==id)})),
 addCategory:(c)=>set(s=>s.categories.includes(c)?s:{categories:[...s.categories,c]}),
 removeCategory:(c)=>set(s=>({categories:s.categories.filter(x=>x!==c)}))}),
 {name:'forme-products-v7',partialize:s=>isDemoMode?{products:s.products,categories:s.categories}:{}}))
