import { createClient } from '@supabase/supabase-js'

function cleanUrl(raw?: string): string | undefined {
  if (!raw) return undefined
  let u = raw.trim()
  // Remove trailing slashes and common accidental path suffixes
  u = u.replace(/\/+$/, '')
  u = u.replace(/\/rest\/v1\/?$/, '')
  u = u.replace(/\/auth\/v1\/?$/, '')
  return u || undefined
}

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const url = cleanUrl(rawUrl)
const key = rawKey?.trim()

const isTest = import.meta.env.MODE === 'test'
export const supabase = !isTest && url && key ? createClient(url, key) : null
export const isDemoMode = !supabase

