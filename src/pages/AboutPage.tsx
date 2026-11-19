import { Link } from 'react-router-dom'
import { Sparkles, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react'

export default function AboutPage() {
 return (
  <div className="mx-auto max-w-5xl px-4 py-12 pb-24 sm:px-6 lg:px-8">
   {/* Breadcrumbs */}
   <nav className="mb-6 flex items-center gap-2 text-xs uppercase tracking-wider text-char/60">
    <Link to="/" className="hover:text-ink">Home</Link>
    <span>/</span>
    <span className="text-char">About Us</span>
   </nav>

   {/* Editorial Header */}
   <div className="border-b border-ink/10 pb-10">
    <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-red-600 font-bold">
     OUR GENESIS & ETHOS
    </span>
    <h1 className="h-serif mt-3 text-4xl sm:text-6xl font-normal leading-[1.08] text-ink">
     Fewer, better things.
    </h1>
    <p className="mt-5 max-w-2xl text-base text-char/80 leading-relaxed font-sans">
     FORME® was conceived on a quiet rebellion against the frantic pace of disposable fast-fashion. We believe that true luxury is tactile—found in the dense weight of custom-spun textiles, hand-cut stone, and timeless architectural silhouettes.
    </p>
   </div>

   {/* Hero Atelier Visual */}
   <div className="mt-10 overflow-hidden rounded-2xl border border-ink/10 bg-sand/20 aspect-[21/9]">
    <img
     src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80"
     alt="FORME Atelier Studio"
     className="h-full w-full object-cover"
    />
   </div>

   {/* The Three Pillars Grid */}
   <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
    <div className="rounded-xl border border-ink/10 bg-sand/15 p-6">
     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-cream mb-4">
      <Sparkles size={18} />
     </div>
     <h2 className="text-lg font-bold uppercase tracking-wider text-ink">Material Integrity</h2>
     <p className="mt-2 text-xs sm:text-sm text-char/75 leading-relaxed">
      We engineer our own textiles from scratch—custom-knitting 240 GSM to 500 GSM combed cottons in Tirupur, sourcing certified 18K gold vermeil over 925 sterling silver in Jaipur, and procuring Italian full-grain nappa calfskin.
     </p>
    </div>

    <div className="rounded-xl border border-ink/10 bg-sand/15 p-6">
     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-cream mb-4">
      <HeartHandshake size={18} />
     </div>
     <h2 className="text-lg font-bold uppercase tracking-wider text-ink">Fair-Wage Ateliers</h2>
     <p className="mt-2 text-xs sm:text-sm text-char/75 leading-relaxed">
      No sweatshops. Every garment and object is crafted in fair-wage, audited specialty partner studios across India and select master craft guilds abroad, maintaining transparency and generational expertise.
     </p>
    </div>

    <div className="rounded-xl border border-ink/10 bg-sand/15 p-6">
     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-cream mb-4">
      <ShieldCheck size={18} />
     </div>
     <h2 className="text-lg font-bold uppercase tracking-wider text-ink">Zero-Plastic Footprint</h2>
     <p className="mt-2 text-xs sm:text-sm text-char/75 leading-relaxed">
      From our FSC-certified unbleached rigid boxes to water-soluble cassava mailers and soy-based printing inks, our logistics and packaging contain 0% single-use plastic.
     </p>
    </div>
   </div>

   {/* Detailed Atelier Manifesto */}
   <div className="mt-16 rounded-2xl border border-ink/10 bg-sand/30 p-8 sm:p-12">
    <h2 className="h-serif text-3xl text-ink">The Architecture of Drape</h2>
    <div className="mt-4 space-y-4 text-sm text-char/80 leading-relaxed max-w-3xl">
     <p>
      Mass production prioritizes fabric economy over fit. Standard t-shirts cut corners on shoulder drop and neck ribbing, leading to collars that warp after two washes. At FORME®, every pattern is drafted with deliberate geometric volume.
     </p>
     <p>
      Our 500 GSM boxy hoodies are constructed with internal binding and double-stitched reinforcements. Our perfumes are formulated with high-concentration natural botanicals that mature with skin chemistry rather than vanishing within hours.
     </p>
    </div>

    <div className="mt-8 flex flex-wrap gap-4 items-center">
     <Link to="/shop" className="btn btn-dark text-xs uppercase tracking-widest px-8">
      <span>Explore the Catalogue</span>
      <ArrowRight size={14} />
     </Link>
     <Link to="/contact" className="btn btn-line text-xs uppercase tracking-widest bg-cream">
      Contact Concierge
     </Link>
    </div>
   </div>
  </div>
 )
}
