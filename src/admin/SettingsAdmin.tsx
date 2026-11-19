import { useState } from 'react'
import { useSettings, type Settings } from '../store/settings'
import * as db from '../services/db'
import { run } from '../lib/action'
import { getRazorpayKey, setRazorpayKey } from '../services/payment'

export default function SettingsAdmin() {
 const { set, ...cur } = useSettings()
 const [d, setD] = useState<Settings>({ ...cur })
 const [rpKey, setRpKey] = useState(getRazorpayKey())
 const [busy, setBusy] = useState(false)

 const submit = async (e: React.FormEvent) => {
  e.preventDefault()
  setBusy(true)
  const ok = await run(() => db.saveSettings(d), 'Settings saved successfully')
  setBusy(false)
  if (ok) {
   set(d)
   setRazorpayKey(rpKey)
  }
 }

 return (
  <form className="max-w-3xl space-y-8" onSubmit={submit}>
   <div>
    <h2 className="h-serif text-3xl">Store & Brand Settings</h2>
    <p className="mt-1 text-xs text-char/70">Customize brand identity, banners, WhatsApp integration and appearance.</p>
   </div>

   {/* Brand Identity */}
   <div className="border border-ink/10 bg-sand/10 p-6 space-y-4">
    <h3 className="h-serif text-xl font-medium">Brand Identity</h3>
    <div className="grid gap-4 sm:grid-cols-2">
     <label className="text-xs">Brand Name
      <input className="input mt-1" value={d.name} onChange={e => setD({ ...d, name: e.target.value })} />
     </label>
     <label className="text-xs">Tagline
      <input className="input mt-1" value={d.tagline} onChange={e => setD({ ...d, tagline: e.target.value })} />
     </label>
    </div>
    <label className="text-xs block">Logo Image URL
     <input className="input mt-1" placeholder="https://example.com/logo.png" value={d.logoUrl || ''} onChange={e => setD({ ...d, logoUrl: e.target.value })} />
     {d.logoUrl && <img src={d.logoUrl} alt="Logo preview" className="mt-2 h-8 object-contain bg-cream/80 p-1 border border-ink/10" />}
    </label>
    <div className="flex items-center gap-4">
     <label className="text-xs">Brand Accent Colour
      <div className="mt-1 flex items-center gap-3">
       <input type="color" className="h-9 w-14 cursor-pointer border border-ink/20 p-0.5 bg-transparent" value={d.accent} onChange={e => setD({ ...d, accent: e.target.value })} />
       <span className="text-xs font-mono">{d.accent}</span>
      </div>
     </label>
    </div>
   </div>

   {/* Homepage Banners & Announcements */}
   <div className="border border-ink/10 bg-sand/10 p-6 space-y-4">
    <h3 className="h-serif text-xl font-medium">Homepage Banners & Hero</h3>
    <label className="text-xs block">Top Announcement Bar Text
     <input className="input mt-1" value={d.announcement} onChange={e => setD({ ...d, announcement: e.target.value })} />
    </label>
    <div className="grid gap-4 sm:grid-cols-2">
     <label className="text-xs">Hero Title
      <input className="input mt-1" value={d.heroTitle} onChange={e => setD({ ...d, heroTitle: e.target.value })} />
     </label>
     <label className="text-xs">Hero Subtitle
      <input className="input mt-1" value={d.heroSub} onChange={e => setD({ ...d, heroSub: e.target.value })} />
     </label>
    </div>
   </div>

   {/* Contact & Integrations */}
   <div className="border border-ink/10 bg-sand/10 p-6 space-y-4">
    <h3 className="h-serif text-xl font-medium">Customer Communication</h3>
    <div className="grid gap-4 sm:grid-cols-2">
     <label className="text-xs">WhatsApp Business Number (digits with country code, e.g. 919876543210)
      <input className="input mt-1" type="tel" value={d.whatsapp} onChange={e => setD({ ...d, whatsapp: e.target.value.replace(/\D/g, '') })} />
     </label>
     <label className="text-xs">Customer Support Email
      <input className="input mt-1" type="email" value={d.email} onChange={e => setD({ ...d, email: e.target.value })} />
     </label>
    </div>
    <label className="text-xs block">Instagram Profile URL
     <input className="input mt-1" type="url" value={d.instagram} onChange={e => setD({ ...d, instagram: e.target.value })} />
    </label>
   </div>

   {/* Shipping, Taxes & Payments */}
   <div className="border border-ink/10 bg-sand/10 p-6 space-y-4">
    <h3 className="h-serif text-xl font-medium">Shipping, GST & Checkout Options</h3>
    <div className="grid gap-4 sm:grid-cols-2">
     <label className="text-xs">Free Shipping Threshold (₹)
      <input
       type="number"
       min={0}
       className="input mt-1"
       value={d.freeShippingThreshold ?? 1999}
       onChange={e => setD({ ...d, freeShippingThreshold: Number(e.target.value) })}
      />
     </label>
     <label className="text-xs">Standard Courier Fee (₹)
      <input
       type="number"
       min={0}
       className="input mt-1"
       value={d.shippingFee ?? 99}
       onChange={e => setD({ ...d, shippingFee: Number(e.target.value) })}
      />
     </label>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
     <label className="text-xs">GST Registration Number
      <input
       className="input mt-1 font-mono uppercase"
       placeholder="e.g. 07AABCF1234F1Z5"
       value={d.gstNumber ?? '07AABCF1234F1Z5'}
       onChange={e => setD({ ...d, gstNumber: e.target.value.toUpperCase() })}
      />
     </label>
     <label className="flex items-center gap-2 pt-6 cursor-pointer text-xs font-semibold">
      <input
       type="checkbox"
       checked={d.codEnabled ?? true}
       onChange={e => setD({ ...d, codEnabled: e.target.checked })}
      />
      <span>Enable Cash on Delivery (COD) Checkout</span>
     </label>
    </div>
   </div>

   {/* Razorpay Gateway Integration */}
   <div className="border border-ink/10 bg-sand/10 p-6 space-y-4">
    <div className="flex items-center justify-between">
     <h3 className="h-serif text-xl font-medium">Razorpay Payment Gateway</h3>
     <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 font-medium ${
      rpKey ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-sand text-char/70'
     }`}>
      {rpKey ? 'Active Key' : 'Simulated Test Mode'}
     </span>
    </div>
    <p className="text-xs text-char/70 leading-relaxed">
     Configure your Razorpay Key ID (<code className="font-mono">rzp_test_...</code> or <code className="font-mono">rzp_live_...</code>) from your <a href="https://dashboard.razorpay.com/#/app/keys" target="_blank" rel="noreferrer" className="underline font-medium text-ink">Razorpay Dashboard ↗</a> to accept real payments via UPI, Credit/Debit Cards, NetBanking, and Wallets.
    </p>
    <label className="text-xs block">Razorpay Key ID
     <input
      className="input mt-1 font-mono text-xs"
      placeholder="rzp_test_xxxxxxxxxxxxxxxx or rzp_live_xxxxxxxxxxxxxxxx"
      value={rpKey}
      onChange={e => setRpKey(e.target.value.trim())}
     />
    </label>
   </div>

   <div>
    <button disabled={busy} className="btn btn-dark">
     {busy ? 'Saving changes…' : 'Save store settings'}
    </button>
   </div>
  </form>
 )
}
