export interface Coupon {
 code: string
 type: 'pct' | 'flat'
 value: number
 label: string
 minOrderValue?: number
 maxDiscount?: number
 expiryDate?: string
 firstOrderOnly?: boolean
 freeShipping?: boolean
}

export const COUPONS: Record<string, Coupon> = {
 FORME10: { code: 'FORME10', type: 'pct', value: 10, label: '10% off' },
 WELCOME200: { code: 'WELCOME200', type: 'flat', value: 200, label: '₹200 off', minOrderValue: 999 },
 FREESHIP: { code: 'FREESHIP', type: 'flat', value: 99, label: 'Free Shipping', freeShipping: true }
}

export const FREE_SHIP_ABOVE = 1999
export const SHIP_FEE = 99

export function totals(subtotal: number, c?: Coupon | null) {
 let discount = 0
 if (c && subtotal > 0) {
  if (!c.minOrderValue || subtotal >= c.minOrderValue) {
   const raw = c.type === 'pct' ? Math.round(subtotal * c.value / 100) : c.value
   discount = c.maxDiscount ? Math.min(raw, c.maxDiscount) : raw
   discount = Math.min(subtotal, discount)
  }
 }
 const after = Math.max(0, subtotal - discount)
 const shipping = subtotal === 0 || after >= FREE_SHIP_ABOVE || c?.freeShipping ? 0 : SHIP_FEE
 return { discount, shipping, total: after + shipping }
}
