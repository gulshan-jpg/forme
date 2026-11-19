import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartLine } from '../types'
import { useAccount } from './account'
import { isDemoMode } from '../services/supabase'
import * as db from '../services/db'
import { useProducts } from './products'

interface CartStore {
 lines: CartLine[]
 savedForLater: CartLine[]
 open: boolean
 setOpen: (o: boolean) => void
 add: (productId: string, qty: number, size?: string) => void
 setQty: (key: string, qty: number) => void
 remove: (key: string) => void
 clear: () => void
 wishlist: string[]
 toggleWish: (id: string) => void
 saveForLater: (key: string) => void
 moveToCart: (key: string) => void
 removeSaved: (key: string) => void
}

export const useCart = create<CartStore>()(
 persist(
  (set, get) => ({
   lines: [],
   savedForLater: [],
   open: false,
   wishlist: [],
   setOpen: open => set({ open }),
   add: (productId, qty, size) =>
    set(s => {
     const p = useProducts.getState().products.find(x => x.id === productId)
     const maxStock = p ? p.stock : Infinity
     if (maxStock <= 0) return s
     const key = productId + '|' + (size ?? '')
     const f = s.lines.find(l => l.key === key)
     const cur = f ? f.qty : 0
     const nextQty = Math.min(maxStock, cur + qty)
     return {
      open: true,
      lines: f
       ? s.lines.map(l => (l.key === key ? { ...l, qty: nextQty } : l))
       : [...s.lines, { key, productId, size, qty: nextQty }]
     }
    }),
   setQty: (key, qty) =>
    set(s => {
     const line = s.lines.find(l => l.key === key)
     if (!line) return s
     if (qty <= 0) return { lines: s.lines.filter(l => l.key !== key) }
     const p = useProducts.getState().products.find(x => x.id === line.productId)
     const maxStock = p ? p.stock : Infinity
     return {
      lines: s.lines.map(l =>
       l.key === key ? { ...l, qty: Math.min(maxStock, qty) } : l
      )
     }
    }),
   remove: key => set(s => ({ lines: s.lines.filter(l => l.key !== key) })),
   clear: () => set({ lines: [] }),
   toggleWish: id => {
    const on = !get().wishlist.includes(id)
    const me = useAccount.getState().me
    if (me && !isDemoMode) db.setWish(me.id, id, on).catch(() => {})
    set(s => ({
     wishlist: on ? [...s.wishlist, id] : s.wishlist.filter(x => x !== id)
    }))
   },
   saveForLater: key =>
    set(s => {
     const item = s.lines.find(l => l.key === key)
     if (!item) return s
     return {
      lines: s.lines.filter(l => l.key !== key),
      savedForLater: [...s.savedForLater.filter(l => l.key !== key), item]
     }
    }),
   moveToCart: key =>
    set(s => {
     const item = s.savedForLater.find(l => l.key === key)
     if (!item) return s
     const p = useProducts.getState().products.find(x => x.id === item.productId)
     const maxStock = p ? p.stock : Infinity
     if (maxStock <= 0) return s
     const existing = s.lines.find(l => l.key === key)
     const newQty = existing ? Math.min(maxStock, existing.qty + item.qty) : Math.min(maxStock, item.qty)
     return {
      savedForLater: s.savedForLater.filter(l => l.key !== key),
      lines: existing
       ? s.lines.map(l => (l.key === key ? { ...l, qty: newQty } : l))
       : [...s.lines, { ...item, qty: newQty }]
     }
    }),
   removeSaved: key =>
    set(s => ({
     savedForLater: s.savedForLater.filter(l => l.key !== key)
    }))
  }),
  {
   name: 'forme-cart',
   partialize: s => ({
    lines: s.lines,
    wishlist: s.wishlist,
    savedForLater: s.savedForLater
   })
  }
 )
)
