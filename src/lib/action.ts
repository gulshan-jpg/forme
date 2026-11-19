import { isDemoMode } from '../services/supabase'; import { toast } from '../store/toast'
/** Runs a Supabase write (skipped in demo mode), toasts the outcome, returns success. */
export async function run(fn:()=>Promise<unknown>,okMsg?:string):Promise<boolean>{
 try{if(!isDemoMode)await fn();if(okMsg)toast(okMsg);return true}
 catch(e){toast(e instanceof Error?e.message:'Something went wrong','error');return false}}
