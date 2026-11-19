import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Clock, MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react'
import { useSettings } from '../store/settings'
import WhatsAppButton from '../components/WhatsAppButton'

export default function ContactPage() {
 const s = useSettings()
 const [name, setName] = useState('')
 const [email, setEmail] = useState('')
 const [phone, setPhone] = useState('')
 const [subject, setSubject] = useState('Order Enquiry')
 const [message, setMessage] = useState('')
 const [submitted, setSubmitted] = useState(false)
 const [err, setErr] = useState('')

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  if (!name.trim()) {
   setErr('Please provide your name.')
   return
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
   setErr('Please enter a valid email address.')
   return
  }
  if (!message.trim()) {
   setErr('Please describe your enquiry.')
   return
  }

  setErr('')
  setSubmitted(true)
 }

 return (
  <div className="mx-auto max-w-6xl px-4 py-12 pb-24 sm:px-6 lg:px-8">
   {/* Breadcrumbs */}
   <nav className="mb-6 flex items-center gap-2 text-xs uppercase tracking-wider text-char/60">
    <Link to="/" className="hover:text-ink">Home</Link>
    <span>/</span>
    <span className="text-char">Contact Us</span>
   </nav>

   <div className="border-b border-ink/10 pb-8">
    <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-red-600 font-bold">
     CUSTOMER CONCIERGE & ATELIER DESK
    </span>
    <h1 className="h-serif mt-2 text-4xl sm:text-5xl font-normal text-ink">
     Get in Touch
    </h1>
    <p className="mt-3 max-w-xl text-sm text-char/75 leading-relaxed">
     Our concierge team is available to assist you with order tracking, sizing guidance, bespoke orders, or press inquiries.
    </p>
   </div>

   <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
    {/* Left Column: Direct Contact Details & WhatsApp */}
    <div className="lg:col-span-5 space-y-8">
     {/* Concierge Cards */}
     <div className="rounded-2xl border border-ink/10 bg-sand/20 p-6 space-y-6">
      <div className="flex items-start gap-4">
       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-cream">
        <Mail size={16} />
       </div>
       <div>
        <p className="text-xs uppercase tracking-wider font-bold text-ink">Email Concierge</p>
        <a href={`mailto:${s.email}`} className="mt-1 text-sm text-char hover:text-ink underline block break-all">
         {s.email}
        </a>
        <p className="mt-0.5 text-[11px] text-char/60">Responses typically within 3 business hours.</p>
       </div>
      </div>

      <div className="border-t border-ink/10 pt-4 flex items-start gap-4">
       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
        <MessageSquare size={16} />
       </div>
       <div className="flex-1">
        <p className="text-xs uppercase tracking-wider font-bold text-ink">Instant WhatsApp Support</p>
        <p className="mt-1 text-xs text-char/75">Chat with a personal stylist or check live dispatch updates.</p>
        <div className="mt-3">
         <WhatsAppButton className="btn btn-dark w-full text-xs py-2.5 rounded-full" text="Hi FORME® Concierge, I have an inquiry.">
          Chat on WhatsApp ↗
         </WhatsAppButton>
        </div>
       </div>
      </div>

      <div className="border-t border-ink/10 pt-4 flex items-start gap-4">
       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-cream">
        <Clock size={16} />
       </div>
       <div>
        <p className="text-xs uppercase tracking-wider font-bold text-ink">Operating Hours</p>
        <p className="mt-1 text-sm text-char">Monday to Saturday</p>
        <p className="text-xs text-char/60">10:00 AM – 7:00 PM IST (GMT +5:30)</p>
       </div>
      </div>

      <div className="border-t border-ink/10 pt-4 flex items-start gap-4">
       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-cream">
        <MapPin size={16} />
       </div>
       <div>
        <p className="text-xs uppercase tracking-wider font-bold text-ink">Atelier & Studio Location</p>
        <p className="mt-1 text-sm text-char leading-relaxed">
         FORME® Design Studio & Fulfillment Hub<br />
         Plot 42, Okhla Industrial Area Phase III<br />
         New Delhi, Delhi 110020, India
        </p>
       </div>
      </div>
     </div>
    </div>

    {/* Right Column: Contact Inquiry Form */}
    <div className="lg:col-span-7">
     <div className="rounded-2xl border border-ink/10 bg-cream p-6 sm:p-10 shadow-sm">
      <h2 className="text-xl font-bold uppercase tracking-wider text-ink">
       Send Us a Message
      </h2>
      <p className="mt-1 text-xs text-char/70">
       Fill out the details below and an atelier representative will contact you shortly.
      </p>

      {submitted ? (
       <div className="mt-8 rounded-xl border border-emerald-500/30 bg-emerald-50 p-6 text-center animate-fade-in">
        <CheckCircle2 size={36} className="mx-auto text-emerald-600 mb-2" />
        <h3 className="text-base font-bold text-emerald-950">Message Transmitted</h3>
        <p className="mt-1 text-xs text-emerald-800">
         Thank you, {name}. Your ticket has been logged into our concierge queue. Expect a response at <b>{email}</b> within 3 business hours.
        </p>
        <button
         onClick={() => { setSubmitted(false); setName(''); setEmail(''); setMessage('') }}
         className="btn btn-dark mt-6 text-xs uppercase tracking-widest rounded-full py-2.5 px-6"
        >
         Send Another Inquiry
        </button>
       </div>
      ) : (
       <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         <div>
          <label className="block text-xs uppercase tracking-wider font-medium text-char mb-1.5">
           Your Name *
          </label>
          <input
           value={name}
           onChange={e => setName(e.target.value)}
           placeholder="e.g. Arjun Kapoor"
           className="input rounded-lg bg-sand/10"
          />
         </div>
         <div>
          <label className="block text-xs uppercase tracking-wider font-medium text-char mb-1.5">
           Email Address *
          </label>
          <input
           type="email"
           value={email}
           onChange={e => setEmail(e.target.value)}
           placeholder="arjun@example.com"
           className="input rounded-lg bg-sand/10"
          />
         </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         <div>
          <label className="block text-xs uppercase tracking-wider font-medium text-char mb-1.5">
           Phone / WhatsApp (Optional)
          </label>
          <input
           value={phone}
           onChange={e => setPhone(e.target.value)}
           placeholder="+91 98765 43210"
           className="input rounded-lg bg-sand/10"
          />
         </div>
         <div>
          <label className="block text-xs uppercase tracking-wider font-medium text-char mb-1.5">
           Subject
          </label>
          <select
           value={subject}
           onChange={e => setSubject(e.target.value)}
           className="input rounded-lg bg-sand/10 cursor-pointer"
          >
           <option value="Order Enquiry">Order Status & Tracking</option>
           <option value="Return / Exchange">Return, Refund & Exchange</option>
           <option value="Sizing Assistance">Sizing & Material Advice</option>
           <option value="Bespoke / Bulk">Corporate Gifting / Bespoke</option>
           <option value="Press / Collaboration">Press & Media</option>
          </select>
         </div>
        </div>

        <div>
         <label className="block text-xs uppercase tracking-wider font-medium text-char mb-1.5">
          Your Inquiry *
         </label>
         <textarea
          rows={5}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Please provide order number (if applicable) and specifics..."
          className="input rounded-lg bg-sand/10 resize-none"
         />
        </div>

        {err && <p className="text-xs text-red-600 font-medium">{err}</p>}

        <button
         type="submit"
         className="btn btn-dark w-full rounded-full py-3.5 text-xs font-bold uppercase tracking-widest shadow-md hover:shadow-lg transition"
        >
         Transmit Message
        </button>
       </form>
      )}
     </div>
    </div>
   </div>
  </div>
 )
}
