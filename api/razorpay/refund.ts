import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
 if (req.method !== 'POST') {
  return res.status(405).json({ error: 'Method not allowed' })
 }

 try {
  const { paymentId, amount, notes, receipt } = req.body || {}
  const keyId = process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_U21pkx7bHuf4L0'
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'vYfZERGUHgOZi5R9ownBgTEM'

  if (!paymentId) {
   return res.status(400).json({ error: 'Missing paymentId for refund' })
  }

  // If in local simulated test mode without real Razorpay transaction
  if (paymentId.startsWith('pay_simulated_') || paymentId.startsWith('pay_demo_')) {
   return res.status(200).json({
    refundId: `rfnd_sim_${Date.now()}`,
    paymentId,
    amount: amount ? Math.round(Number(amount) * 100) : 0,
    status: 'processed',
    speed_processed: 'optimum',
    note: 'Simulated payment refunded successfully'
   })
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
  const refundPayload: any = {
   speed: 'optimum',
   receipt: receipt || `rfnd_${Date.now()}`,
   notes: notes || {}
  }
  if (amount && Number(amount) > 0) {
   refundPayload.amount = Math.round(Number(amount) * 100) // INR to paise
  }

  const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
   method: 'POST',
   headers: {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json'
   },
   body: JSON.stringify(refundPayload)
  })

  const data = await response.json()
  if (!response.ok) {
   return res.status(response.status).json({
    error: data.error?.description || 'Razorpay refund API call failed'
   })
  }

  return res.status(200).json({
   refundId: data.id,
   paymentId: data.payment_id,
   amount: data.amount,
   currency: data.currency,
   status: data.status,
   receipt: data.receipt
  })
 } catch (err: any) {
  return res.status(500).json({ error: err.message || 'Internal refund error' })
 }
}
