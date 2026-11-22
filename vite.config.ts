import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import crypto from 'node:crypto'

function razorpayDevApiPlugin() {
 return {
  name: 'razorpay-dev-api',
  configureServer(server: any) {
   server.middlewares.use(async (req: any, res: any, next: any) => {
    // 1. Create Order endpoint
    if (req.method === 'POST' && req.url === '/api/razorpay/create-order') {
     let raw = ''
     req.on('data', (chunk: any) => { raw += chunk })
     req.on('end', async () => {
      try {
       const { amount, receipt, notes } = JSON.parse(raw || '{}')
       const env = loadEnv('development', process.cwd(), '')
       const keyId = env.VITE_RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_U21pkx7bHuf4L0'
       const keySecret = env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || 'vYfZERGUHgOZi5R9ownBgTEM'

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
       res.setHeader('Content-Type', 'application/json')
       if (!response.ok) {
        res.statusCode = response.status
        res.end(JSON.stringify({ error: data.error?.description || 'Failed to create Razorpay order' }))
        return
       }

       res.statusCode = 200
       res.end(JSON.stringify({
        orderId: data.id,
        amount: data.amount,
        currency: data.currency,
        key: keyId
       }))
      } catch (err: any) {
       res.statusCode = 500
       res.setHeader('Content-Type', 'application/json')
       res.end(JSON.stringify({ error: err.message }))
      }
     })
     return
    }

    // 2. Verify Payment signature endpoint
    if (req.method === 'POST' && req.url === '/api/razorpay/verify-payment') {
     let raw = ''
     req.on('data', (chunk: any) => { raw += chunk })
     req.on('end', () => {
      try {
       const { orderId, paymentId, signature } = JSON.parse(raw || '{}')
       const env = loadEnv('development', process.cwd(), '')
       const keySecret = env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || 'vYfZERGUHgOZi5R9ownBgTEM'

       if (!orderId || !paymentId || !signature) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ verified: false, error: 'Missing parameters' }))
        return
       }

       const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex')

       let isMatch = false
       try {
        isMatch = crypto.timingSafeEqual(
         Buffer.from(expectedSignature),
         Buffer.from(signature)
        )
       } catch {
        isMatch = false
       }

       res.setHeader('Content-Type', 'application/json')
       res.statusCode = 200
       res.end(JSON.stringify({ verified: isMatch, paymentId, orderId }))
      } catch (err: any) {
       res.statusCode = 500
       res.setHeader('Content-Type', 'application/json')
       res.end(JSON.stringify({ verified: false, error: err.message }))
      }
     })
     return
    }

    next()
   })
  }
 }
}

export default defineConfig({
 plugins: [react(), razorpayDevApiPlugin()],
 build: {
  target: 'esnext',
  cssMinify: true,
  chunkSizeWarningLimit: 600,
  rollupOptions: {
   output: {
    manualChunks(id) {
     if (id.includes('node_modules')) {
      if (id.includes('react/') || id.includes('react-dom') || id.includes('react-router-dom')) {
       return 'vendor-react'
      }
      if (id.includes('@supabase')) {
       return 'vendor-supabase'
      }
      if (id.includes('lucide-react')) {
       return 'vendor-ui'
      }
      if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
       return 'vendor-forms'
      }
     }
    }
   }
  }
 },
 test: {
  environment: 'jsdom',
  globals: true,
  testTimeout: 15000
 }
})
