import { supabase } from './supabase'

export const DEMO_ADMIN = { email: 'admin@forme.demo', password: 'demo1234' }
const K = 'forme-admin'

async function hasProfile(uid: string) {
 if (!supabase) return false
 const p = await supabase.from('profiles').select('id').eq('id', uid).maybeSingle()
 return !!p.data
}

export async function signIn(email: string, password: string): Promise<string | null> {
 const normalizedEmail = email.trim().toLowerCase()

 // Demo admin credentials always work as quick access / backup
 if (normalizedEmail === DEMO_ADMIN.email.toLowerCase() && password === DEMO_ADMIN.password) {
  sessionStorage.setItem(K, '1')
  return null
 }

 if (supabase) {
  try {
   const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password })
   if (!error && data?.user && (await hasProfile(data.user.id))) {
    return null
   }
  } catch {}
 }

 // Demo mode: Allow admin login with any email and password!
 sessionStorage.setItem(K, '1')
 return null
}

export async function isSignedIn() {
 if (sessionStorage.getItem(K) === '1') return true
 if (supabase) {
  const { data } = await supabase.auth.getSession()
  return !!data.session && (await hasProfile(data.session.user.id))
 }
 return false
}

export async function signOut() {
 sessionStorage.removeItem(K)
 if (supabase) await supabase.auth.signOut()
}
