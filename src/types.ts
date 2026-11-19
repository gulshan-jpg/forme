export interface SizeChartEntry {
 size: string
 chest?: string
 shoulder?: string
 length?: string
 sleeve?: string
 waist?: string
 footLength?: string
 euSize?: string
}

export interface Product {
 id: string
 slug: string
 name: string
 sku?: string
 brand?: string
 description: string
 price: number
 originalPrice: number
 images: string[]
 category: string
 tags: string[]
 sizes: string[]
 stock: number
 featured: boolean
 bestseller: boolean
 isNew: boolean
 rating: number
 reviews: number
 createdAt: number
 specifications?: Record<string, string>
 sizeChart?: SizeChartEntry[]
 careInstructions?: string
 modelInfo?: string
 color?: string
 weightGrams?: number
 published?: boolean
}

export interface CartLine {
 key: string
 productId: string
 size?: string
 color?: string
 qty: number
}

export type OrderStatus = 'Placed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned' | 'Exchanged'
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded' | 'Partially_Refunded'

export interface Customer {
 name: string
 email: string
 phone: string
 address: string
 city: string
 state: string
 pin: string
}

export interface SavedAddress {
 id: string
 customerId: string
 label: 'Home' | 'Office' | 'Other'
 name: string
 phone: string
 address: string
 apartment?: string
 city: string
 state: string
 pin: string
 isDefault: boolean
}

export interface Review {
 id: string
 productId: string
 name: string
 rating: number
 text: string
 date: string
 sample?: boolean
}

export type ReturnType = 'cancellation' | 'return' | 'exchange'
export type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'inspected' | 'completed'

export interface OrderReturn {
 id: string
 orderId: string
 customerEmail?: string
 type: ReturnType
 status: ReturnStatus
 reason: string
 details?: string
 exchangeVariant?: string
 rejectionReason?: string
 requestedAt: string
 resolvedAt?: string
 adminNotes?: string
}

export interface RefundRecord {
 id: string
 orderId: string
 returnId?: string
 amount: number
 gateway: 'razorpay' | 'cod_transfer' | 'store_credit'
 gatewayRefundId?: string
 gatewayPaymentId?: string
 status: 'pending' | 'processed' | 'failed'
 reason?: string
 processedAt?: string
 createdAt: string
}

export type ShipmentStatus = 'Pending' | 'Manifested' | 'In_Transit' | 'Out_For_Delivery' | 'Delivered' | 'RTO'

export interface ShipmentRecord {
 id: string
 orderId: string
 courierPartner: string // 'BlueDart' | 'Delhivery' | 'Shiprocket' | 'DTDC'
 awbCode?: string
 trackingNumber?: string
 trackingUrl?: string
 labelUrl?: string
 shippedAt?: string
 estimatedDelivery?: string
 deliveredAt?: string
 status: ShipmentStatus
 notes?: string
}

export interface Order {
 id: string
 dbId?: string
 date: string
 customer: Customer
 lines: { name: string; size?: string; color?: string; qty: number; price: number; sku?: string; image?: string }[]
 subtotal: number
 discount: number
 shipping: number
 total: number
 status: OrderStatus
 payment: string
 paymentStatus?: PaymentStatus
 razorpayOrderId?: string
 razorpayPaymentId?: string
 demo: boolean
 returns?: OrderReturn[]
 refunds?: RefundRecord[]
 shipment?: ShipmentRecord
 invoiceNumber?: string
 trackingNumber?: string
 cancelledReason?: string
}

export interface CouponRule {
 id: string
 code: string
 kind: 'pct' | 'flat'
 value: number
 active: boolean
 minOrderValue?: number
 maxDiscount?: number
 expiryDate?: string
 usageLimit?: number
 usageCount?: number
 firstOrderOnly?: boolean
 freeShipping?: boolean
}

export interface AbandonedCart {
 id: string
 customerEmail?: string
 customerPhone?: string
 customerName?: string
 items: CartLine[]
 cartTotal: number
 recovered: boolean
 recoveryEmailSent: boolean
 lastActiveAt: string
}
