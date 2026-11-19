import type { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'node:crypto'

export default async function handler(req: VercelRequest, res: VercelResponse) {
 if (req.method !== 'POST') {
  return res.status(405).json({ error: 'Method not allowed' })
 }

 try {
  const signature = (req.headers['x-razorpay-signature'] as string) || ''
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || 'vYfZERGUHgOZi5R9ownBgTEM'

  if (!signature) {
   return res.status(400).json({ status: 'error', message: 'Missing x-razorpay-signature header' })
  }

  // Calculate HMAC SHA256 of incoming raw payload
  const payloadStr = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
  const expectedSignature = crypto
   .createHmac('sha256', webhookSecret)
   .update(payloadStr)
   .digest('hex')

  const isValid = crypto.timingSafeEqual(
   Buffer.from(expectedSignature),
   Buffer.from(signature)
  )

  if (!isValid) {
   return res.status(400).json({ status: 'error', message: 'Invalid webhook signature' })
  }

  const event = req.body?.event
  const payload = req.body?.payload

  // Process supported Razorpay webhook events
  switch (event) {
   case 'payment.captured': {
    const payment = payload?.payment?.entity
    console.log(`[Razorpay Webhook] Payment Captured: ${payment?.id} for order ${payment?.order_id}, amount: ${payment?.amount / 100}`)
    break
   }
   case 'payment.failed': {
    const payment = payload?.payment?.entity
    console.warn(`[Razorpay Webhook] Payment Failed: ${payment?.id}, reason: ${payment?.error_description}`)
    break
   }
   case 'refund.processed': {
    const refund = payload?.refund?.entity
    console.log(`[Razorpay Webhook] Refund Processed: ${refund?.id} for payment ${refund?.payment_id}, amount: ${refund?.amount / 100}`)
    break
   }
   default:
    console.log(`[Razorpay Webhook] Unhandled event: ${event}`)
  }

  return res.status(200).json({
   status: 'success',
   received: true,
   event
  })
 } catch (err: any) {
  console.error('[Razorpay Webhook Error]', err)
  return res.status(500).json({ status: 'error', message: err.message || 'Webhook processing failed' })
 }
}
