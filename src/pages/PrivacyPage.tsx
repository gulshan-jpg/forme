import { Link } from 'react-router-dom'
import { ShieldCheck, Lock, ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
 return (
  <div className="mx-auto max-w-4xl px-4 py-16">
   <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-char/70 hover:text-ink mb-8">
    <ArrowLeft size={14} /> Back to Storefront
   </Link>

   <div className="border-b border-ink/10 pb-8">
    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-char/60 mb-2">
     <Lock size={14} />
     <span>Data Protection & Privacy</span>
    </div>
    <h1 className="h-serif text-4xl sm:text-5xl">Privacy Policy</h1>
    <p className="mt-2 text-xs text-char/60">Compliance under Digital Personal Data Protection Act (DPDPA) & IT Act</p>
   </div>

   <div className="prose prose-sm mt-8 space-y-8 text-char/80 leading-relaxed text-sm">
    <section>
     <h2 className="h-serif text-2xl text-ink font-medium">1. Introduction</h2>
     <p className="mt-2">
      At FORME®, your privacy is fundamental to our craft. This Privacy Policy describes how your personal information is collected, used, and protected when you visit, create an account, or complete an acquisition at our online platform.
     </p>
    </section>

    <section>
     <h2 className="h-serif text-2xl text-ink font-medium">2. Information We Collect</h2>
     <p className="mt-2">
      When you interact with our storefront, we collect information necessary to fulfill your orders and enhance your patronage:
     </p>
     <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-char/70">
      <li><strong>Contact Information:</strong> Full name, verified mobile phone number, and email address.</li>
      <li><strong>Fulfillment Information:</strong> Physical delivery address, landmark, state, and 6-digit Indian PIN code.</li>
      <li><strong>Device & Session Data:</strong> Browser user agent, IP address, and cookie identifiers used for cart persistence and secure session authorization.</li>
     </ul>
    </section>

    <section>
     <h2 className="h-serif text-2xl text-ink font-medium">3. Payment Security & Third-Party Processors</h2>
     <p className="mt-2">
      We operate a Zero-Knowledge payment architecture. FORME® does not store, process, or transmit sensitive credit/debit card numbers, CVVs, or bank netbanking passwords. All payment transactions are handled through certified PCI-DSS Level 1 compliant gateway partners (including Razorpay Software Private Limited) via encrypted TLS 1.3 channels.
     </p>
    </section>

    <section>
     <h2 className="h-serif text-2xl text-ink font-medium">4. How We Use Your Information</h2>
     <p className="mt-2">
      We use collected data solely for legitimate commercial purposes:
     </p>
     <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-char/70">
      <li>Processing and verifying customer orders, calculating applicable discounts, and generating tax invoices.</li>
      <li>Coordinating parcel handoffs with insured national logistics carriers.</li>
      <li>Dispatching transactional updates (order confirmation, courier tracking numbers, delivery alerts via SMS or WhatsApp).</li>
      <li>Preventing duplicate orders, fraudulent transactions, and unauthorized access attempts.</li>
     </ul>
    </section>

    <section>
     <h2 className="h-serif text-2xl text-ink font-medium">5. Data Retention & Your Rights</h2>
     <p className="mt-2">
      We retain transaction records only as mandated by Indian tax and commercial statutes (e.g. GST regulations). You retain the right to review, rectify, or request erasure of your personal customer profile by writing directly to our data grievance officer.
     </p>
    </section>

    <section>
     <h2 className="h-serif text-2xl text-ink font-medium">6. Contact Data Protection Officer</h2>
     <p className="mt-2">
      For inquiries regarding our privacy standards or to exercise statutory privacy rights, email our team at: <a href="mailto:privacy@forme.example" className="underline font-medium text-ink">privacy@forme.example</a>.
     </p>
    </section>

    <div className="border-t border-ink/10 pt-6 mt-12 flex items-center gap-2 text-xs text-char/70">
     <ShieldCheck size={16} className="text-emerald-700" />
     <span>Strict adherence to PCI-DSS Level 1 Standards and Indian Data Protection Norms</span>
    </div>
   </div>
  </div>
 )
}
