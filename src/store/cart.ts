import { create } from 'zustand'; import { persist } from 'zustand/middleware'
import type { CartLine } from '../types'; import { useAccount } from './account'; import { isDemoMode } from '../services/supabase'; import * as db from '../services/db'
interface S{lines:CartLine[];open:boolean;setOpen:(o:boolean)=>void;add:(productId:string,qty:number,size?:string)=>void;setQty:(key:string,qty:number)=>void;remove:(key:string)=>void;clear:()=>void;
 wishlist:string[];toggleWish:(id:string)=>void}
export const useCart=create<S>()(persist((set,get)=>({lines:[],open:false,wishlist:[],
 setOpen:(open)=>set({open}),
 add:(productId,qty,size)=>set(s=>{const key=productId+'|'+(size??'');const f=s.lines.find(l=>l.key===key)
  return {open:true,lines:f?s.lines.map(l=>l.key===key?{...l,qty:l.qty+qty}:l):[...s.lines,{key,productId,size,qty}]}}),
 setQty:(key,qty)=>set(s=>({lines:qty<=0?s.lines.filter(l=>l.key!==key):s.lines.map(l=>l.key===key?{...l,qty}:l)})),
 remove:(key)=>set(s=>({lines:s.lines.filter(l=>l.key!==key)})),clear:()=>set({lines:[]}),
 toggleWish:(id)=>{const on=!get().wishlist.includes(id),me=useAccount.getState().me;if(me&&!isDemoMode)db.setWish(me.id,id,on).catch(()=>{});set(s=>({wishlist:on?[...s.wishlist,id]:s.wishlist.filter(x=>x!==id)}))}}),
 {name:'forme-cart',partialize:s=>({lines:s.lines,wishlist:s.wishlist})}))
