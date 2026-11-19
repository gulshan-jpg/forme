import { Link } from 'react-router-dom'
import { Shield, FileText, ArrowLeft } from 'lucide-react'

export default function TermsPage() {
 return (
  <div className="mx-auto max-w-4xl px-4 py-16">
   <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-char/70 hover:text-ink mb-8">
    <ArrowLeft size={14} /> Back to Storefront
   </Link>

   <div className="border-b border-ink/10 pb-8">
    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-char/60 mb-2">
     <FileText size={14} />
     <span>Legal & Governance</span>
    </div>
    <h1 className="h-serif text-4xl sm:text-5xl">Terms & Conditions</h1>
    <p className="mt-2 text-xs text-char/60">Last updated: November 2026 · FORME® Atelier</p>
   </div>

   <div className="prose prose-sm mt-8 space-y-8 text-char/80 leading-relaxed text-sm">
    <section>
     <h2 className="h-serif text-2xl text-ink font-medium">1. Overview & Acceptance</h2>
     <p className="mt-2">
      This website is operated by FORME®. Throughout the site, the terms "we", "us" and "our" refer to FORME®. By visiting our site and/or purchasing an item from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms").
     </p>
    </section>

    <section>
     <h2 className="h-serif text-2xl text-ink font-medium">2. Product Integrity & Orders</h2>
     <p className="mt-2">
      We make every effort to display as accurately as possible the colors, textures, and dimensions of our products. All descriptions of products or product pricing are subject to change at any time without notice at our sole discretion. We reserve the right to limit the sales of our products or Services to any person, geographic region, or jurisdiction.
     </p>
    </section>

    <section>
     <h2 className="h-serif text-2xl text-ink font-medium">3. Pricing & Payments</h2>
     <p className="mt-2">
      All prices are listed in Indian Rupees (₹/INR) and are inclusive of all applicable Goods and Services Tax (GST). Payment can be made via authorized online gateways (including Razorpay, supporting UPI, Credit/Debit Cards, NetBanking, and Wallets) or Cash on Delivery (COD) where available. Orders are only verified and processed once authorization is approved by our server-side settlement partner.
     </p>
    </section>

    <section>
     <h2 className="h-serif text-2xl text-ink font-medium">4. Shipping, Delivery & Inspection</h2>
     <p className="mt-2">
      Orders are dispatched within 24 to 48 business hours from our fulfillment ateliers. Estimated delivery times are indicative and subject to regional courier operations. Upon receipt, customers are advised to inspect the exterior seal of the parcel. Any transit damage or missing units must be reported to our concierge within 48 hours of recorded delivery.
     </p>
    </section>

    <section>
     <h2 className="h-serif text-2xl text-ink font-medium">5. Returns, Exchanges & Refunds</h2>
     <p className="mt-2">
      We honor a 7-day return and exchange window for unworn, unwashed apparel with original security tags and packaging intact. Due to hygiene regulations, skincare, beauty tinctures, earrings, and personal wellness tools that have been opened are non-returnable unless defective.
     </p>
    </section>

    <section>
     <h2 className="h-serif text-2xl text-ink font-medium">6. Intellectual Property</h2>
     <p className="mt-2">
      All content included on this site, such as photographs, editorial imagery, typography, logos, graphics, and software, is the proprietary property of FORME® and protected under international copyright and intellectual property laws.
     </p>
    </section>

    <section>
     <h2 className="h-serif text-2xl text-ink font-medium">7. Governing Law</h2>
     <p className="mt-2">
      These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India, with exclusive jurisdiction resting in the courts of New Delhi.
     </p>
    </section>

    <div className="border-t border-ink/10 pt-6 mt-12 flex flex-wrap items-center justify-between gap-4 text-xs">
     <div className="flex items-center gap-2 text-char/70">
      <Shield size={14} />
      <span>Encrypted & Compliant Commerce Architecture</span>
     </div>
     <Link to="/contact" className="underline font-medium hover:text-ink">
      Contact Concierge for Questions
     </Link>
    </div>
   </div>
  </div>
 )
}
