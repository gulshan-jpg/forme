import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, isDemoMode } from '../services/supabase'
import * as db from '../services/db'
import type { SavedAddress } from '../types'

export interface Me {
 id: string
 name: string
 email: string
 phone: string
}

type Local = Me & { password: string }
export interface R { ok: boolean; msg?: string }

const INITIAL_DEMO_ADDRESSES: SavedAddress[] = [
 {
  id: 'addr_1',
  customerId: 'demo-customer',
  label: 'Home',
  name: 'Demo Customer',
  phone: '9876543210',
  address: 'Apartment 4B, Golf View Towers, Sector 54',
  apartment: 'Tower 2, Floor 4',
  city: 'Gurugram',
  state: 'Haryana',
  pin: '122002',
  isDefault: true
 },
 {
  id: 'addr_2',
  customerId: 'demo-customer',
  label: 'Office',
  name: 'Demo Customer',
  phone: '9876543210',
  address: 'Suite 602, Cyber City Hub, DLF Phase 2',
  city: 'Gurugram',
  state: 'Haryana',
  pin: '122008',
  isDefault: false
 }
]

interface S {
 me: Me | null
 local: Local[]
 addresses: SavedAddress[]
 init: () => Promise<void>
 signUp: (n: string, e: string, ph: string, pw: string) => Promise<R>
 signIn: (e: string, pw: string) => Promise<R>
 signOut: () => Promise<void>
 updateProfile: (name: string, phone: string) => Promise<R>
 changePassword: (oldPw: string, newPw: string) => Promise<R>
 addAddress: (addr: Omit<SavedAddress, 'id'>) => Promise<void>
 updateAddress: (id: string, addr: Partial<SavedAddress>) => Promise<void>
 deleteAddress: (id: string) => Promise<void>
 setDefaultAddress: (id: string) => Promise<void>
}

const DEMO: Local = {
 id: 'demo-customer',
 name: 'Demo Customer',
 email: 'customer@forme.demo',
 phone: '9876543210',
 password: 'demo1234'
}

export const DEMO_CUSTOMER = { email: DEMO.email, password: DEMO.password }
const strip = (a: Local): Me => ({ id: a.id, name: a.name, email: a.email, phone: a.phone })

export const useAccount = create<S>()(
 persist(
  (set, get) => ({
   me: null,
   local: [DEMO],
   addresses: INITIAL_DEMO_ADDRESSES,

   init: async () => {
    if (!supabase) return
    try {
     const { data } = await supabase.auth.getSession()
     if (data?.session) {
      const liveUser = await db.ensureCustomer()
      if (liveUser) set({ me: liveUser })
     }
    } catch {
     // keep current authenticated user if already set
    }
   },

   signUp: async (name, email, phone, password) => {
    const e = email.toLowerCase().trim()
    const trimmedName = name.trim()
    const trimmedPhone = phone.trim()
    const localUser: Local = { id: 'c' + Date.now(), name: trimmedName, email: e, phone: trimmedPhone, password }

    // Check if account already exists in local demo registry
    const existing = get().local.find(a => a.email === e)
    if (existing) {
     if (existing.password === password) {
      set({ me: strip(existing) })
      return { ok: true }
     }
     return { ok: false, msg: 'An account with this email already exists.' }
    }

    // Try Supabase auth in background (if configured)
    if (supabase) {
     try {
      const { data } = await supabase.auth.signUp({
       email: e,
       password,
       options: { data: { name: trimmedName, phone: trimmedPhone } }
      })
      if (data?.user?.id) {
       localUser.id = data.user.id
      }
      if (data?.session) {
       set(s => ({
        local: [...s.local.filter(x => x.email !== e), localUser],
        me: strip(localUser)
       }))
       try {
        const liveUser = await db.ensureCustomer()
        if (liveUser) set({ me: liveUser })
       } catch {}
       return { ok: true }
      }
     } catch (err) {
      console.warn('Supabase auth notice (using instant demo registration):', err)
     }
    }

    // Demo Mode: Let user register without waiting for email verification
    // Instantly log in user so they can access orders, account & checkout right away
    set(s => ({
     local: [...s.local.filter(x => x.email !== e), localUser],
     me: strip(localUser)
    }))
    return { ok: true }
   },

   signIn: async (email, password) => {
    const e = email.toLowerCase().trim()

    // 1. Try Supabase auth if connected
    if (supabase) {
     try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: e, password })
      if (!error && data?.session) {
       try {
        const liveUser = await db.ensureCustomer()
        if (liveUser) {
         set({ me: liveUser })
         return { ok: true }
        }
       } catch {}
       const fallback = get().local.find(x => x.email === e) ?? {
        id: data.session.user.id,
        name: data.session.user.user_metadata?.name || 'Customer',
        email: e,
        phone: data.session.user.user_metadata?.phone || ''
       }
       set({ me: strip(fallback as Local) })
       return { ok: true }
      }
     } catch {}
    }

    // 2. Demo fallback: check if registered locally (bypasses "Email not confirmed")
    const a = get().local.find(x => x.email === e && x.password === password)
    if (a) {
     set({ me: strip(a) })
     return { ok: true }
    }

    return { ok: false, msg: 'Incorrect email or password.' }
   },

   signOut: async () => {
    if (supabase) await supabase.auth.signOut()
    set({ me: null })
   },

   updateProfile: async (name, phone) => {
    const cur = get().me
    if (!cur) return { ok: false, msg: 'Not signed in' }
    if (!name.trim()) return { ok: false, msg: 'Name is required' }
    if (!/^[6-9]\d{9}$/.test(phone)) return { ok: false, msg: 'Valid 10-digit mobile number required' }

    if (!supabase) {
     set(s => ({
      me: { ...cur, name, phone },
      local: s.local.map(u => u.id === cur.id ? { ...u, name, phone } : u)
     }))
     return { ok: true, msg: 'Profile updated successfully' }
    }

    const { error } = await supabase.auth.updateUser({ data: { name, phone } })
    if (error) return { ok: false, msg: error.message }
    set({ me: { ...cur, name, phone } })
    return { ok: true, msg: 'Profile updated' }
   },

   changePassword: async (oldPw, newPw) => {
    const cur = get().me
    if (!cur) return { ok: false, msg: 'Not signed in' }
    if (newPw.length < 6) return { ok: false, msg: 'Password must be at least 6 characters' }

    if (!supabase) {
     const user = get().local.find(u => u.id === cur.id)
     if (user && user.password !== oldPw) {
      return { ok: false, msg: 'Current password does not match' }
     }
     set(s => ({
      local: s.local.map(u => u.id === cur.id ? { ...u, password: newPw } : u)
     }))
     return { ok: true, msg: 'Password changed successfully' }
    }

    const { error } = await supabase.auth.updateUser({ password: newPw })
    if (error) return { ok: false, msg: error.message }
    return { ok: true, msg: 'Password changed successfully' }
   },

   addAddress: async (addr) => {
    const newAddr: SavedAddress = {
     ...addr,
     id: `addr_${Date.now()}`
    }
    set(s => {
     const list = addr.isDefault
      ? s.addresses.map(a => ({ ...a, isDefault: false }))
      : s.addresses
     return { addresses: [newAddr, ...list] }
    })
   },

   updateAddress: async (id, patch) => {
    set(s => ({
     addresses: s.addresses.map(a => {
      if (a.id !== id) return patch.isDefault ? { ...a, isDefault: false } : a
      return { ...a, ...patch }
     })
    }))
   },

   deleteAddress: async (id) => {
    set(s => ({
     addresses: s.addresses.filter(a => a.id !== id)
    }))
   },

   setDefaultAddress: async (id) => {
    set(s => ({
     addresses: s.addresses.map(a => ({
      ...a,
      isDefault: a.id === id
     }))
    }))
   }
  }),
  {
   name: 'forme-account',
   partialize: s => isDemoMode ? { me: s.me, local: s.local, addresses: s.addresses } : { addresses: s.addresses }
  }
 )
)
