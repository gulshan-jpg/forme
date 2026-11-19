import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
 if (req.method !== 'POST') {
  return res.status(405).json({ error: 'Method not allowed' })
 }

 try {
  const { amount, receipt, notes } = req.body || {}
  const keyId = process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_U21pkx7bHuf4L0'
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'vYfZERGUHgOZi5R9ownBgTEM'

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
  const response = await fetch('https://api.razorpay.com/v1/orders', {
   method: 'POST',
   headers: {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json'
   },
   body: JSON.stringify({
    amount: Math.round(Number(amount) * 100), // INR to paise
    currency: 'INR',
    receipt: receipt || `rcpt_${Date.now()}`,
    notes: notes || {}
   })
  })

  const data = await response.json()
  if (!response.ok) {
   return res.status(response.status).json({ error: data.error?.description || 'Failed to create Razorpay order' })
  }

  return res.status(200).json({
   orderId: data.id,
   amount: data.amount,
   currency: data.currency,
   key: keyId
  })
 } catch (err: any) {
  return res.status(500).json({ error: err.message || 'Internal server error' })
 }
}
