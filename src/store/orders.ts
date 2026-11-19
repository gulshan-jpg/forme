import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Order, OrderStatus, OrderReturn, RefundRecord, ShipmentRecord } from '../types'
import { DEMO_PRODUCTS } from '../data/products'
import { isDemoMode } from '../services/supabase'

const names = ['Aanya Sharma', 'Rohan Mehta', 'Ishita Kapoor', 'Kabir Singh', 'Meera Nair', 'Vihaan Gupta']
const st: OrderStatus[] = ['Delivered', 'Shipped', 'Packed', 'Placed', 'Delivered', 'Placed']

const seed: Order[] = names.map((n, i) => {
 const p = DEMO_PRODUCTS[i * 3]
 const q = 1 + (i % 2)
 const sub = p.price * q
 const ship = sub >= 1999 ? 0 : 99
 const orderCode = 'FRM-DEMO' + (100 + i)
 
 const shipment: ShipmentRecord | undefined = st[i] === 'Shipped' || st[i] === 'Delivered'
  ? {
     id: `shp_${100 + i}`,
     orderId: orderCode,
     courierPartner: i % 2 === 0 ? 'BlueDart Express' : 'Delhivery Air',
     awbCode: `AWB${8849200 + i}`,
     trackingNumber: `TRK${9920100 + i}`,
     trackingUrl: `https://track.example.com/${8849200 + i}`,
     status: st[i] === 'Delivered' ? 'Delivered' : 'In_Transit',
     shippedAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
     estimatedDelivery: new Date(Date.now() + (2 - i) * 86400000).toISOString()
    }
  : undefined

 return {
  id: orderCode,
  date: new Date(Date.now() - i * 86400000).toISOString(),
  customer: {
   name: n,
   email: n.split(' ')[0].toLowerCase() + '@example.com',
   phone: '9000000' + (100 + i),
   address: '12 Luxury Boulevard, Sector 44',
   city: 'New Delhi',
   state: 'Delhi',
   pin: '110001'
  },
  lines: [
   {
    name: p.name,
    size: p.sizes[0],
    color: p.color,
    qty: q,
    price: p.price,
    sku: p.sku,
    image: p.images[0]
   }
  ],
  subtotal: sub,
  discount: 0,
  shipping: ship,
  total: sub + ship,
  status: st[i],
  payment: i % 3 === 0 ? 'Cash on Delivery (COD)' : 'Razorpay Secure (UPI/Card)',
  paymentStatus: st[i] === 'Cancelled' ? 'Refunded' : 'Paid',
  razorpayPaymentId: `pay_${Date.now()}_${i}`,
  shipment,
  invoiceNumber: `INV-2026-${1000 + i}`,
  demo: true as const
 }
})

interface S {
 orders: Order[]
 setAll: (o: Order[]) => void
 add: (o: Order) => void
 setStatus: (id: string, s: OrderStatus) => void
 cancelOrder: (id: string, reason: string) => void
 requestReturn: (id: string, ret: Omit<OrderReturn, 'id' | 'requestedAt'>) => void
 updateReturnStatus: (orderId: string, returnId: string, status: OrderReturn['status'], adminNotes?: string) => void
 updateShipment: (orderId: string, shipment: Partial<ShipmentRecord>) => void
 recordRefund: (orderId: string, refund: Omit<RefundRecord, 'id' | 'createdAt'>) => void
}

export const useOrders = create<S>()(
 persist(
  (set) => ({
   orders: isDemoMode ? seed : [],
   setAll: (orders) => set({ orders }),
   add: (o) => set(s => ({ orders: [o, ...s.orders] })),
   setStatus: (id, status) => set(s => ({
    orders: s.orders.map(o => o.id === id ? { ...o, status } : o)
   })),
   cancelOrder: (id, reason) => set(s => ({
    orders: s.orders.map(o => {
     if (o.id !== id) return o
     const cancelReturn: OrderReturn = {
      id: `ret_${Date.now()}`,
      orderId: id,
      customerEmail: o.customer.email,
      type: 'cancellation',
      status: 'approved',
      reason,
      requestedAt: new Date().toISOString(),
      resolvedAt: new Date().toISOString()
     }
     return {
      ...o,
      status: 'Cancelled' as OrderStatus,
      cancelledReason: reason,
      paymentStatus: 'Refunded',
      returns: [...(o.returns || []), cancelReturn]
     }
    })
   })),
   requestReturn: (id, ret) => set(s => ({
    orders: s.orders.map(o => {
     if (o.id !== id) return o
     const newReturn: OrderReturn = {
      id: `ret_${Date.now()}`,
      requestedAt: new Date().toISOString(),
      ...ret
     }
     return {
      ...o,
      returns: [...(o.returns || []), newReturn]
     }
    })
   })),
   updateReturnStatus: (orderId, returnId, status, adminNotes) => set(s => ({
    orders: s.orders.map(o => {
     if (o.id !== orderId) return o
     return {
      ...o,
      returns: (o.returns || []).map(r => r.id === returnId ? {
       ...r,
       status,
       resolvedAt: status !== 'pending' ? new Date().toISOString() : r.resolvedAt,
       adminNotes: adminNotes || r.adminNotes
      } : r)
     }
    })
   })),
   updateShipment: (orderId, shp) => set(s => ({
    orders: s.orders.map(o => {
     if (o.id !== orderId) return o
     const existing = o.shipment || {
      id: `shp_${Date.now()}`,
      orderId,
      courierPartner: 'BlueDart Express',
      status: 'Manifested'
     }
     return {
      ...o,
      shipment: { ...existing, ...shp }
     }
    })
   })),
   recordRefund: (orderId, ref) => set(s => ({
    orders: s.orders.map(o => {
     if (o.id !== orderId) return o
     const newRef: RefundRecord = {
      id: `ref_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...ref
     }
     return {
      ...o,
      paymentStatus: 'Refunded',
      refunds: [...(o.refunds || []), newRef]
     }
    })
   }))
  }),
  {
   name: 'forme-orders',
   partialize: s => ({ orders: s.orders })
  }
 )
)
