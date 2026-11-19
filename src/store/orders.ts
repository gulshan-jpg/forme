import { create } from 'zustand'; import { persist } from 'zustand/middleware'
import type { Order, OrderStatus } from '../types'; import { DEMO_PRODUCTS } from '../data/products'; import { isDemoMode } from '../services/supabase'
const names=['Aanya Sharma','Rohan Mehta','Ishita Kapoor','Kabir Singh','Meera Nair','Vihaan Gupta']
const st:OrderStatus[]=['Delivered','Shipped','Packed','Placed','Delivered','Placed']
const seed:Order[]=names.map((n,i)=>{const p=DEMO_PRODUCTS[i*3],q=1+(i%2),sub=p.price*q,ship=sub>=1999?0:99
 return {id:'FRM-DEMO'+(100+i),date:new Date(Date.now()-i*86400000).toISOString(),customer:{name:n,email:n.split(' ')[0].toLowerCase()+'@example.com',phone:'9000000'+(100+i),address:'12 Demo Street',city:'New Delhi',state:'Delhi',pin:'110001'},
 lines:[{name:p.name,size:p.sizes[0],qty:q,price:p.price}],subtotal:sub,discount:0,shipping:ship,total:sub+ship,status:st[i],payment:'Demo payment (simulated)',demo:true as const}})
interface S{orders:Order[];setAll:(o:Order[])=>void;add:(o:Order)=>void;setStatus:(id:string,s:OrderStatus)=>void}
export const useOrders=create<S>()(persist((set)=>({orders:isDemoMode?seed:[],setAll:(orders)=>set({orders}),add:(o)=>set(s=>({orders:[o,...s.orders]})),setStatus:(id,status)=>set(s=>({orders:s.orders.map(o=>o.id===id?{...o,status}:o)}))}),{name:'forme-orders',partialize:s=>({orders:s.orders})}))
