import { Link } from 'react-router-dom'
import { Truck, RotateCcw, PackageCheck, ArrowLeft } from 'lucide-react'

export default function ShippingPage() {
 return (
  <div className="mx-auto max-w-4xl px-4 py-16">
   <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-char/70 hover:text-ink mb-8">
    <ArrowLeft size={14} /> Back to Storefront
   </Link>

   <div className="border-b border-ink/10 pb-8">
    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-char/60 mb-2">
     <Truck size={14} />
     <span>Logistics & Fulfillment</span>
    </div>
    <h1 className="h-serif text-4xl sm:text-5xl">Shipping & Returns</h1>
    <p className="mt-2 text-xs text-char/60">Insured express logistics covering 19,000+ Indian postal codes</p>
   </div>

   <div className="prose prose-sm mt-8 space-y-8 text-char/80 leading-relaxed text-sm">
    <section>
     <h2 className="h-serif text-2xl text-ink font-medium">1. Shipping Rates & Delivery Timelines</h2>
     <div className="mt-3 grid gap-4 sm:grid-cols-2 text-xs">
      <div className="border border-ink/15 bg-sand/20 p-4">
       <p className="font-bold text-ink uppercase tracking-wider">Complimentary Express</p>
       <p className="mt-1 text-base text-ink font-medium">Free on orders ₹1,999+</p>
       <p className="mt-1 text-char/70">Applicable automatically across all domestic orders.</p>
      </div>
      <div className="border border-ink/15 bg-sand/20 p-4">
       <p className="font-bold text-ink uppercase tracking-wider">Standard Domestic Shipping</p>
       <p className="mt-1 text-base text-ink font-medium">₹99 Flat Fee</p>
       <p className="mt-1 text-char/70">For orders beneath the ₹1,999 threshold.</p>
      </div>
     </div>

     <ul className="list-disc pl-5 mt-4 space-y-1.5 text-xs text-char/70">
      <li><strong>Metro Cities (Delhi NCR, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad):</strong> 2 to 4 business days.</li>
      <li><strong>Tier 2 & Regional Locations:</strong> 4 to 6 business days.</li>
      <li><strong>Northeast & Remote Island Regions:</strong> 5 to 7 business days.</li>
     </ul>
    </section>

    <section>
     <h2 className="h-serif text-2xl text-ink font-medium">2. Order Tracking & Notifications</h2>
     <p className="mt-2">
      Once your order is verified and dispatched from our atelier, an automated notification containing your airway bill (AWB) and live tracking link will be transmitted via SMS and WhatsApp. You may also track the status directly inside your <Link to="/account" className="underline font-medium text-ink">Customer Account</Link>.
     </p>
    </section>

    <section>
     <h2 className="h-serif text-2xl text-ink font-medium">3. 7-Day Hassle-Free Returns & Exchanges</h2>
     <p className="mt-2">
      If a garment or lifestyle object does not meet your expectations, we offer a straightforward 7-day return or exchange window from the date of confirmed delivery:
     </p>
     <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-char/70">
      <li>Items must be unworn, undamaged, with original tags affixed and packaging intact.</li>
      <li>Complimentary reverse pickup will be arranged at your delivery address.</li>
      <li>Refunds are initiated back to the original source payment method (or bank account for COD orders) within 48 hours of inspection at our facility.</li>
     </ul>
    </section>

    <section>
     <h2 className="h-serif text-2xl text-ink font-medium">4. Non-Returnable Categories</h2>
     <p className="mt-2">
      For consumer health and hygiene safety, the following items cannot be returned or exchanged once opened:
     </p>
     <p className="mt-1 text-xs text-char/70 italic">
      Skincare emulsions, cosmetic lip tinctures, body dry brushes, and earrings/piercing jewellery (unless arriving in damaged or defective condition).
     </p>
    </section>

    <div className="border-t border-ink/10 pt-6 mt-12 flex flex-wrap items-center justify-between gap-4 text-xs">
     <div className="flex items-center gap-2 text-char/70">
      <PackageCheck size={16} />
      <span>Plastic-free FSC certified protective packaging</span>
     </div>
     <Link to="/contact" className="underline font-medium hover:text-ink">
      Initiate a Return or Exchange
     </Link>
    </div>
   </div>
  </div>
 )
}
