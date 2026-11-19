import { useState } from 'react'
import { inr } from '../lib/format'
import { toast } from '../store/toast'
import {
 Mail,
 ShoppingCart,
 Send,
 Sparkles,
 ArrowRight,
 CheckCircle2,
 Clock,
 Eye,
 MessageSquare,
 Users,
 RefreshCw
} from 'lucide-react'
import type { AbandonedCart } from '../types'

const INITIAL_ABANDONED_CARTS: AbandonedCart[] = [
 {
  id: 'ac_101',
  customerEmail: 'kavya.nair@gmail.com',
  customerName: 'Kavya Nair',
  customerPhone: '9845012345',
  items: [
   { key: 'p1|L', productId: 'p1', size: 'L', qty: 1 },
   { key: 'p3|M', productId: 'p3', size: 'M', qty: 2 }
  ],
  cartTotal: 3897,
  recovered: false,
  recoveryEmailSent: false,
  lastActiveAt: '35 mins ago'
 },
 {
  id: 'ac_102',
  customerEmail: 'rohit.sharma88@yahoo.com',
  customerName: 'Rohit Sharma',
  customerPhone: '9810234567',
  items: [
   { key: 'p2|XL', productId: 'p2', size: 'XL', qty: 1 }
  ],
  cartTotal: 1899,
  recovered: false,
  recoveryEmailSent: true,
  lastActiveAt: '2 hours ago'
 },
 {
  id: 'ac_103',
  customerEmail: 'ananya.singh@outlook.com',
  customerName: 'Ananya Singh',
  customerPhone: '9920345678',
  items: [
   { key: 'p4|One size', productId: 'p4', size: 'One size', qty: 1 },
   { key: 'p5|M', productId: 'p5', size: 'M', qty: 1 }
  ],
  cartTotal: 2698,
  recovered: false,
  recoveryEmailSent: false,
  lastActiveAt: '5 hours ago'
 }
]

export default function MarketingAdmin() {
 const [carts, setCarts] = useState<AbandonedCart[]>(INITIAL_ABANDONED_CARTS)
 const [previewEmail, setPreviewEmail] = useState<AbandonedCart | null>(null)
 const [campSubject, setCampSubject] = useState('Exclusive 15% VIP Access on FORME® Autumn Knitwear Drop')
 const [campAudience, setCampAudience] = useState<'all' | 'high_value' | 'abandoned'>('all')
 const [campDiscount, setCampDiscount] = useState('VIP15')
 const [sendingCampaign, setSendingCampaign] = useState(false)

 const totalAbandonedValue = carts.filter(c => !c.recovered).reduce((acc, c) => acc + c.cartTotal, 0)
 const recoveredCount = carts.filter(c => c.recovered).length

 const sendRecovery = (id: string, email?: string) => {
  setCarts(prev =>
   prev.map(c => (c.id === id ? { ...c, recoveryEmailSent: true } : c))
  )
  toast(`Abandoned cart recovery email dispatched to ${email || 'customer'} with code COMEBACK10!`, 'info')
  setPreviewEmail(null)
 }

 const markRecovered = (id: string) => {
  setCarts(prev =>
   prev.map(c => (c.id === id ? { ...c, recovered: true } : c))
  )
  toast('Cart marked as successfully recovered!', 'ok')
 }

 const handleSendCampaign = (e: React.FormEvent) => {
  e.preventDefault()
  setSendingCampaign(true)
  setTimeout(() => {
   setSendingCampaign(false)
   toast(`Promotional campaign successfully dispatched to ${campAudience === 'all' ? '1,420 registered shoppers' : 'active audience segment'}!`, 'ok')
  }, 800)
 }

 return (
  <div className="space-y-8">
   {/* Header */}
   <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
     <h2 className="h-serif text-3xl">Marketing & Automations</h2>
     <p className="mt-1 text-xs text-char/70">
      Track abandoned carts, trigger transactional alerts, and dispatch customer email campaigns.
     </p>
    </div>
   </div>

   {/* Marketing KPIs */}
   <div className="grid gap-4 sm:grid-cols-3">
    <div className="border border-ink/10 bg-sand/20 p-5">
     <span className="text-xs uppercase tracking-widest text-char/60">Recoverable Cart Value</span>
     <p className="h-serif mt-3 text-3xl font-medium">{inr(totalAbandonedValue)}</p>
     <p className="mt-1 text-xs text-char/60">{carts.filter(c => !c.recovered).length} active abandoned sessions</p>
    </div>

    <div className="border border-ink/10 bg-sand/20 p-5">
     <span className="text-xs uppercase tracking-widest text-char/60">Cart Recovery Rate</span>
     <p className="h-serif mt-3 text-3xl font-medium">24.5%</p>
     <p className="mt-1 text-xs text-char/60">Avg. D2C benchmark: 11%</p>
    </div>

    <div className="border border-ink/10 bg-sand/20 p-5">
     <span className="text-xs uppercase tracking-widest text-char/60">Automated Dispatch</span>
     <p className="h-serif mt-3 text-3xl font-medium">Ready</p>
     <p className="mt-1 text-xs text-emerald-800 font-medium">✓ Razorpay & Courier webhooks active</p>
    </div>
   </div>

   {/* =========================================================================
       1. ABANDONED CARTS RECOVERY TABLE
       ========================================================================= */}
   <div className="border border-ink/10 p-6 bg-white">
    <div className="flex items-center justify-between border-b border-ink/10 pb-4">
     <div>
      <h3 className="h-serif text-2xl flex items-center gap-2">
       <ShoppingCart size={20} /> Abandoned Carts
      </h3>
      <p className="text-xs text-char/70">Shoppers who added items to checkout but did not complete payment.</p>
     </div>
     <button
      onClick={() => toast('Refreshed cart tracking activity.')}
      className="btn btn-line text-xs py-1.5 px-3 flex items-center gap-1"
     >
      <RefreshCw size={13} /> Refresh
     </button>
    </div>

    <div className="mt-4 overflow-x-auto">
     <table className="w-full text-left text-sm">
      <thead className="text-xs uppercase tracking-widest text-char/60 border-b border-ink/10 pb-2">
       <tr>
        <th className="py-2">Shopper</th>
        <th>Items in Cart</th>
        <th>Value</th>
        <th>Last Active</th>
        <th>Recovery Status</th>
        <th className="text-right">Action</th>
       </tr>
      </thead>
      <tbody className="divide-y divide-ink/10">
       {carts.map(c => (
        <tr key={c.id}>
         <td className="py-3">
          <p className="font-semibold text-xs sm:text-sm">{c.customerName || 'Guest'}</p>
          <span className="text-[11px] text-char/60">{c.customerEmail}</span>
         </td>
         <td className="text-xs">
          {c.items.length} item{c.items.length !== 1 ? 's' : ''} ({c.items.map(i => `${i.qty}x ${i.size || 'One size'}`).join(', ')})
         </td>
         <td className="font-medium text-xs sm:text-sm">{inr(c.cartTotal)}</td>
         <td className="text-xs text-char/70 flex items-center gap-1 py-4">
          <Clock size={12} /> {c.lastActiveAt}
         </td>
         <td>
          {c.recovered ? (
           <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-green-100 text-green-800">
            ✓ Recovered
           </span>
          ) : c.recoveryEmailSent ? (
           <span className="px-2 py-0.5 text-[10px] font-medium uppercase rounded bg-blue-100 text-blue-800">
            Email Sent
           </span>
          ) : (
           <span className="px-2 py-0.5 text-[10px] font-medium uppercase rounded bg-amber-100 text-amber-800">
            Pending Action
           </span>
          )}
         </td>
         <td className="text-right space-x-2 text-xs">
          {!c.recovered && (
           <>
            <button
             type="button"
             onClick={() => setPreviewEmail(c)}
             className="underline text-char hover:text-ink"
            >
             Preview Email
            </button>
            <button
             type="button"
             onClick={() => sendRecovery(c.id, c.customerEmail)}
             className="btn btn-dark py-1 px-3 text-xs inline-flex items-center gap-1"
            >
             <Send size={11} /> Send Email
            </button>
            <button
             type="button"
             onClick={() => markRecovered(c.id)}
             title="Mark as paid"
             className="underline text-emerald-800"
            >
             Mark Recovered
            </button>
           </>
          )}
         </td>
        </tr>
       ))}
      </tbody>
     </table>
    </div>
   </div>

   {/* =========================================================================
       2. PROMOTIONAL CAMPAIGN BROADCAST
       ========================================================================= */}
   <div className="border border-ink/10 p-6 bg-sand/10">
    <h3 className="h-serif text-2xl flex items-center gap-2">
     <Mail size={20} /> Broadcast Promotional Campaign
    </h3>
    <p className="mt-0.5 text-xs text-char/70">
     Send marketing emails with embedded discount codes to selected customer segments.
    </p>

    <form onSubmit={handleSendCampaign} className="mt-6 max-w-2xl space-y-4 text-xs">
     <div>
      <label className="block font-bold text-ink mb-1">Email Subject Line</label>
      <input
       value={campSubject}
       onChange={e => setCampSubject(e.target.value)}
       required
       className="input text-xs"
       placeholder="e.g. Early Access: Our New Knitwear Drop is Live"
      />
     </div>

     <div className="grid grid-cols-2 gap-4">
      <div>
       <label className="block font-bold text-ink mb-1">Target Customer Audience</label>
       <select
        value={campAudience}
        onChange={e => setCampAudience(e.target.value as any)}
        className="input text-xs"
       >
        <option value="all">All Registered Customers (1,420)</option>
        <option value="high_value">High-Value VIP Shoppers (&gt; ₹5,000 spent)</option>
        <option value="abandoned">Recent Abandoned Cart Shoppers</option>
       </select>
      </div>

      <div>
       <label className="block font-bold text-ink mb-1">Attach Promotional Coupon</label>
       <input
        value={campDiscount}
        onChange={e => setCampDiscount(e.target.value.toUpperCase())}
        className="input text-xs uppercase"
        placeholder="e.g. FORME10"
       />
      </div>
     </div>

     <button
      type="submit"
      disabled={sendingCampaign}
      className="btn btn-dark text-xs flex items-center gap-2"
     >
      <Send size={13} />
      <span>{sendingCampaign ? 'Broadcasting campaign…' : 'Broadcast Email Campaign'}</span>
     </button>
    </form>
   </div>

   {/* =========================================================================
       MODAL: PREVIEW RECOVERY EMAIL
       ========================================================================= */}
   {previewEmail && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
     <div className="w-full max-w-lg rounded-[24px] border border-black/10 bg-white p-6 sm:p-8 shadow-2xl">
      <div className="flex items-center justify-between border-b border-black/10 pb-3">
       <div>
        <h3 className="font-bold text-base text-black">Preview Recovery Email</h3>
        <p className="text-xs text-black/50">To: {previewEmail.customerEmail}</p>
       </div>
       <button onClick={() => setPreviewEmail(null)} className="text-black/40 hover:text-black">×</button>
      </div>

      <div className="mt-4 rounded-xl border border-black/10 p-5 bg-[#F0EEED]/40 text-xs space-y-3">
       <p className="font-semibold text-black">Subject: Did you leave something behind at FORME®?</p>
       <div className="border-t border-black/10 pt-3 space-y-2 text-black/70">
        <p>Hey {previewEmail.customerName?.split(' ')[0] || 'there'},</p>
        <p>
         We noticed you left items in your cart. Your selections are currently saved, but high-demand pieces sell out quickly.
        </p>
        <div className="bg-white p-3 rounded-lg border border-black/10 font-medium">
         <p className="text-black font-bold">Your Saved Bag ({inr(previewEmail.cartTotal)}):</p>
         <p className="text-xs text-black/60 mt-1">{previewEmail.items.length} item(s) awaiting checkout</p>
        </div>
        <p>
         Take an additional <strong>10% off</strong> your purchase with private code <strong>COMEBACK10</strong>.
        </p>
       </div>
      </div>

      <div className="mt-6 flex gap-3">
       <button
        onClick={() => setPreviewEmail(null)}
        className="btn btn-line flex-1 text-xs"
       >
        Close
       </button>
       <button
        onClick={() => sendRecovery(previewEmail.id, previewEmail.customerEmail)}
        className="btn btn-dark flex-1 text-xs flex items-center justify-center gap-1.5"
       >
        <Send size={13} /> Send Email Now
       </button>
      </div>
     </div>
    </div>
   )}
  </div>
 )
}
