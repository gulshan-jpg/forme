import { supabase } from './supabase'
export const DEMO_ADMIN={email:'admin@forme.demo',password:'demo1234'}
const K='forme-admin'
async function hasProfile(uid:string){if(!supabase)return false;const p=await supabase.from('profiles').select('id').eq('id',uid).maybeSingle();return !!p.data}
export async function signIn(email:string,password:string):Promise<string|null>{
 if(supabase){const {data,error}=await supabase.auth.signInWithPassword({email,password});if(error)return error.message
  return data.user&&await hasProfile(data.user.id)?null:'This account is not an admin of this store.'}
 if(email===DEMO_ADMIN.email&&password===DEMO_ADMIN.password){sessionStorage.setItem(K,'1');return null}
 return 'Invalid demo credentials'}
export async function isSignedIn(){if(supabase){const {data}=await supabase.auth.getSession();return !!data.session&&await hasProfile(data.session.user.id)};return sessionStorage.getItem(K)==='1'}
export async function signOut(){if(supabase)await supabase.auth.signOut();sessionStorage.removeItem(K)}
