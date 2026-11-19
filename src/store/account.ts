import { create } from 'zustand'; import { persist } from 'zustand/middleware'
import { supabase, isDemoMode } from '../services/supabase'; import * as db from '../services/db'
export interface Me{id:string;name:string;email:string;phone:string}
type Local=Me&{password:string}
export interface R{ok:boolean;msg?:string}
interface S{me:Me|null;local:Local[];init:()=>Promise<void>;signUp:(n:string,e:string,ph:string,pw:string)=>Promise<R>;signIn:(e:string,pw:string)=>Promise<R>;signOut:()=>Promise<void>}
const DEMO:Local={id:'demo-customer',name:'Demo Customer',email:'customer@forme.demo',phone:'9876543210',password:'demo1234'}
export const DEMO_CUSTOMER={email:DEMO.email,password:DEMO.password}
const strip=(a:Local):Me=>({id:a.id,name:a.name,email:a.email,phone:a.phone})
export const useAccount=create<S>()(persist((set,get)=>({me:null,local:[DEMO],
 init:async()=>{if(!supabase)return;const {data}=await supabase.auth.getSession()
  if(!data.session){set({me:null});return};try{set({me:await db.ensureCustomer()})}catch{set({me:null})}},
 signUp:async(name,email,phone,password)=>{
  if(!supabase){const e=email.toLowerCase();if(get().local.some(a=>a.email===e))return {ok:false,msg:'An account with this email already exists.'}
   const a:Local={id:'c'+Date.now(),name,email:e,phone,password};set(s=>({local:[...s.local,a],me:strip(a)}));return {ok:true}}
  const {data,error}=await supabase.auth.signUp({email,password,options:{data:{name,phone}}});if(error)return {ok:false,msg:error.message}
  if(!data.session)return {ok:true,msg:'Check your email to confirm your account, then sign in.'}
  try{set({me:await db.ensureCustomer()})}catch(e){return {ok:false,msg:e instanceof Error?e.message:'Could not create account'}};return {ok:true}},
 signIn:async(email,password)=>{
  if(!supabase){const a=get().local.find(x=>x.email===email.toLowerCase()&&x.password===password);if(!a)return {ok:false,msg:'Incorrect email or password.'};set({me:strip(a)});return {ok:true}}
  const {error}=await supabase.auth.signInWithPassword({email,password});if(error)return {ok:false,msg:error.message}
  try{set({me:await db.ensureCustomer()})}catch(e){return {ok:false,msg:e instanceof Error?e.message:'Sign-in failed'}};return {ok:true}},
 signOut:async()=>{if(supabase)await supabase.auth.signOut();set({me:null})}}),
 {name:'forme-account',partialize:s=>isDemoMode?{me:s.me,local:s.local}:{}}))
