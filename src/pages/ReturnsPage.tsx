import { Link } from 'react-router-dom'
import { RotateCcw, ShieldCheck, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'
import WhatsAppButton from '../components/WhatsAppButton'

export default function ReturnsPage() {
 return (
  <div className="mx-auto max-w-4xl px-4 py-12 pb-24 sm:px-6 lg:px-8">
   {/* Breadcrumbs */}
   <nav className="mb-6 flex items-center gap-2 text-xs uppercase tracking-wider text-char/60">
    <Link to="/" className="hover:text-ink">Home</Link>
    <span>/</span>
    <span className="text-char">Return, Refund & Cancellation</span>
   </nav>

   <div className="border-b border-ink/10 pb-8">
    <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-red-600 font-bold">
     PATRON ASSURANCE & TRANSPARENCY
    </span>
    <h1 className="h-serif mt-2 text-3xl sm:text-5xl font-normal text-ink">
     Return, Refund & Cancellation Policy
    </h1>
    <p className="mt-3 text-sm text-char/75 leading-relaxed">
     Last updated: November 2026. Applicable for all domestic orders fulfilled across India.
    </p>
   </div>

   {/* Highlights Banner */}
   <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="rounded-xl border border-ink/10 bg-sand/20 p-5">
     <div className="flex items-center gap-2 text-ink font-bold text-xs uppercase tracking-wider">
      <RotateCcw size={16} />
      <span>7-Day Doorstep Window</span>
     </div>
     <p className="mt-2 text-xs text-char/80 leading-relaxed">
      Initiate a return or size exchange within 7 days of package delivery.
     </p>
    </div>

    <div className="rounded-xl border border-ink/10 bg-sand/20 p-5">
     <div className="flex items-center gap-2 text-ink font-bold text-xs uppercase tracking-wider">
      <Clock size={16} />
      <span>24–48h Fast Refunds</span>
     </div>
     <p className="mt-2 text-xs text-char/80 leading-relaxed">
      Reversals processed directly via Razorpay back to your original source of payment.
     </p>
    </div>

    <div className="rounded-xl border border-ink/10 bg-sand/20 p-5">
     <div className="flex items-center gap-2 text-ink font-bold text-xs uppercase tracking-wider">
      <ShieldCheck size={16} />
      <span>Zero Reverse Fee</span>
     </div>
     <p className="mt-2 text-xs text-char/80 leading-relaxed">
      Reverse pick-up courier fees are completely absorbed by FORME®.
     </p>
    </div>
   </div>

   <div className="mt-12 space-y-10 text-sm text-char/85 leading-relaxed">
    {/* 1. Returns */}
    <section>
     <h2 className="text-lg font-bold uppercase tracking-wider text-ink border-b border-ink/10 pb-2">
      1. Returns & Exchange Eligibility
     </h2>
     <p className="mt-3">
      We want you to be entirely satisfied with your FORME® piece. You may initiate a return or size exchange within <b>7 days</b> of verified delivery.
     </p>
     <ul className="mt-3 list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
      <li><b>Garments & Streetwear:</b> Must be in original, unwashed, and unworn condition with all atelier tags intact.</li>
      <li><b>Footwear:</b> Must be tried on carpeted surfaces with zero outsole scuffs, enclosed in the original dust bag and shoebox.</li>
      <li><b>Jewellery & Eyewear:</b> Must have tamper-evident security tags unopened and accompanied by the certificate pouch.</li>
      <li><b>Hygiene Exclusions:</b> Fragrances (if cellophane seal is broken) and personal skincare fluids with unsealed stoppers cannot be returned due to hygiene protocols.</li>
     </ul>
    </section>

    {/* 2. Reverse Logistics */}
    <section>
     <h2 className="text-lg font-bold uppercase tracking-wider text-ink border-b border-ink/10 pb-2">
      2. Doorstep Reverse Pick-Up
     </h2>
     <p className="mt-3">
      Once your return request is logged, our express courier partner (BlueDart / Delhivery / Bluedart Express) will arrange a pick-up from your delivery address within <b>24 to 48 hours</b>. Please keep the garment in the original mailer box. The courier associate will provide an acknowledgment receipt upon collection.
     </p>
    </section>

    {/* 3. Refunds */}
    <section>
     <h2 className="text-lg font-bold uppercase tracking-wider text-ink border-b border-ink/10 pb-2">
      3. Refund Execution & Timelines
     </h2>
     <p className="mt-3">
      Upon arrival at our New Delhi fulfillment hub, our quality inspection team verifies the return condition within 24 hours. Once approved:
     </p>
     <ul className="mt-3 list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
      <li><b>Razorpay / UPI / Google Pay / PhonePe:</b> Reversed instantly and reflected in your bank account within 24 to 48 hours.</li>
      <li><b>Credit / Debit Cards:</b> Refund credited back to your issuing bank card account within 3 to 5 business days, subject to your card issuer's clearing cycle.</li>
      <li><b>Cash on Delivery (COD):</b> Refund deposited via direct NEFT bank transfer upon receiving your IFSC details, or instantly credited as store credit with an additional 5% patronage bonus.</li>
     </ul>
    </section>

    {/* 4. Cancellation Policy */}
    <section>
     <h2 className="text-lg font-bold uppercase tracking-wider text-ink border-b border-ink/10 pb-2">
      4. Order Cancellation Policy
     </h2>
     <p className="mt-3">
      You may cancel your order at any time <b>prior to fulfillment and courier dispatch</b>.
     </p>
     <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50/70 p-4 text-xs text-amber-900 flex items-start gap-2.5">
      <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-800" />
      <div>
       <p className="font-bold">Prior to Dispatch:</p>
       <p className="mt-0.5">100% of your paid amount (including shipping charges) will be refunded to your original payment mode immediately.</p>
      </div>
     </div>
     <p className="mt-3 text-xs sm:text-sm">
      If the order has already been dispatched and is in transit with the air courier, please refuse acceptance at the door or initiate a standard return upon receipt.
     </p>
    </section>

    {/* 5. How to Initiate */}
    <section>
     <h2 className="text-lg font-bold uppercase tracking-wider text-ink border-b border-ink/10 pb-2">
      5. How to Initiate a Return or Cancellation
     </h2>
     <p className="mt-3">
      You can initiate a request in under 60 seconds through any of the following channels:
     </p>
     <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-xl border border-ink/15 bg-sand/20 p-5">
       <p className="text-xs uppercase tracking-wider font-bold text-ink">Via WhatsApp Concierge</p>
       <p className="mt-1 text-xs text-char/70">Send your order ID and reason. Our concierge handles the pick-up scheduling instantly.</p>
       <div className="mt-3">
        <WhatsAppButton className="btn btn-dark w-full text-xs py-2 rounded-full" text="Hi FORME®, I would like to request a return / exchange for my order.">
         Initiate on WhatsApp ↗
        </WhatsAppButton>
       </div>
      </div>

      <div className="rounded-xl border border-ink/15 bg-sand/20 p-5">
       <p className="text-xs uppercase tracking-wider font-bold text-ink">Via Account Portal</p>
       <p className="mt-1 text-xs text-char/70">View past orders in your patron dashboard and click "Request Return" on eligible shipments.</p>
       <div className="mt-3">
        <Link to="/account" className="btn btn-line w-full text-xs py-2 rounded-full bg-cream text-center">
         Go to My Account
        </Link>
       </div>
      </div>
     </div>
    </section>
   </div>
  </div>
 )
}
