import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isDemoMode } from '../services/supabase'

export interface Settings {
 name: string
 tagline: string
 announcement: string
 email: string
 instagram: string
 whatsapp: string
 accent: string
 heroTitle: string
 heroSub: string
 logoUrl: string
 isDemo: boolean
 freeShippingThreshold?: number
 shippingFee?: number
 codEnabled?: boolean
 gstNumber?: string
}

const envWa = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? ''

export const defaultSettings: Settings = {
 name: 'FORME®',
 tagline: 'Everything worth discovering.',
 announcement: 'Free shipping above ₹1,999 · Use code FORME10 · Demo store',
 email: 'hello@forme.example',
 instagram: 'https://instagram.com',
 whatsapp: /\d{10}/.test(envWa.replace(/X/g, '')) && !envWa.includes('X') ? envWa : '',
 accent: '#d9cdbd',
 heroTitle: 'Everything worth discovering.',
 heroSub: 'Considered pieces across fashion, skincare, jewellery and home. Made to be kept.',
 logoUrl: '',
 isDemo: true,
 freeShippingThreshold: 1999,
 shippingFee: 99,
 codEnabled: true,
 gstNumber: '07AABCF1234F1Z5'
}

export const useSettings = create<Settings & { set: (p: Partial<Settings>) => void }>()(
 persist(
  set => ({
   ...defaultSettings,
   set: p => set(p)
  }),
  {
   name: 'forme-settings',
   partialize: s => (isDemoMode ? s : {})
  }
 )
)
