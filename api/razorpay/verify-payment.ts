import type { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'node:crypto'

export default async function handler(req: VercelRequest, res: VercelResponse) {
 if (req.method !== 'POST') {
  return res.status(405).json({ error: 'Method not allowed' })
 }

 try {
  const { orderId, paymentId, signature } = req.body || {}
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'vYfZERGUHgOZi5R9ownBgTEM'

  if (!orderId || !paymentId || !signature) {
   return res.status(400).json({ verified: false, error: 'Missing parameters' })
  }

  const expectedSignature = crypto
   .createHmac('sha256', keySecret)
   .update(`${orderId}|${paymentId}`)
   .digest('hex')

  const isMatch = crypto.timingSafeEqual(
   Buffer.from(expectedSignature),
   Buffer.from(signature)
  )

  return res.status(200).json({
   verified: isMatch,
   paymentId,
   orderId
  })
 } catch (err: any) {
  return res.status(500).json({ verified: false, error: err.message || 'Verification error' })
 }
}
