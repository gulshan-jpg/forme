import { create } from 'zustand'
export const useToasts = create<{ items: { id: number; msg: string; kind: 'ok' | 'error' | 'info' }[] }>(() => ({ items: [] }))
export function toast(msg: string, kind: 'ok' | 'error' | 'info' = 'ok') {
 const id = Date.now() + Math.random()
 useToasts.setState(s => ({ items: [...s.items, { id, msg, kind }] }))
 setTimeout(() => useToasts.setState(s => ({ items: s.items.filter(t => t.id !== id) })), 3500)
}
