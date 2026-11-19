import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signIn, DEMO_ADMIN } from '../services/auth'
import { isDemoMode } from '../services/supabase'
import { Lock, Mail, KeyRound, ArrowLeft, ShieldCheck, Check } from 'lucide-react'

export default function AdminLogin() {
 const [e, setE] = useState(isDemoMode ? DEMO_ADMIN.email : '')
 const [p, setP] = useState(isDemoMode ? DEMO_ADMIN.password : '')
 const [err, setErr] = useState('')
 const [loading, setLoading] = useState(false)
 const [copied, setCopied] = useState(false)
 const nav = useNavigate()

 const go = async (ev: React.FormEvent) => {
  ev.preventDefault()
  setErr('')
  setLoading(true)
  try {
   const r = await signIn(e, p)
   if (r) {
    setErr(r)
   } else {
    nav('/admin/dashboard')
   }
  } catch (err: any) {
   setErr(err?.message || 'Failed to sign in')
  } finally {
   setLoading(false)
  }
 }

 const fillDemoCredentials = () => {
  setE(DEMO_ADMIN.email)
  setP(DEMO_ADMIN.password)
  setErr('')
  setCopied(true)
  setTimeout(() => setCopied(false), 2000)
 }

 return (
  <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#FAFAFA]">
   <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-black/5">
    {/* Header */}
    <div className="text-center mb-8">
     <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-4 shadow-md">
      <Lock className="w-7 h-7" />
     </div>
     <h1 className="font-integral text-3xl font-black uppercase tracking-tight text-black">
      Admin sign in
     </h1>
     <p className="text-xs sm:text-sm text-black/60 mt-1.5 font-normal">
      Enter store credentials to access FORME® Management Portal
     </p>
    </div>

    {/* Admin Credentials Helper Card */}
    <div className="mb-6 rounded-2xl bg-[#F6F6F6] border border-black/10 p-4">
     <div className="flex items-center justify-between mb-2">
      <span className="text-[11px] font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
       <ShieldCheck className="w-4 h-4 text-emerald-600" />
       Admin Credentials
      </span>
      <button
       type="button"
       onClick={fillDemoCredentials}
       className="text-xs font-bold text-black hover:text-black/70 underline flex items-center gap-1 cursor-pointer transition"
      >
       {copied ? (
        <>
         <Check className="w-3.5 h-3.5 text-emerald-600" /> Filled!
        </>
       ) : (
        'Auto-Fill Credentials'
       )}
      </button>
     </div>
     <div className="space-y-1 font-mono text-xs text-black/80">
      <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-black/5">
       <span className="font-sans text-black/50 text-[11px]">Email:</span>
       <span className="font-semibold select-all">{DEMO_ADMIN.email}</span>
      </div>
      <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-black/5">
       <span className="font-sans text-black/50 text-[11px]">Password:</span>
       <span className="font-semibold select-all">{DEMO_ADMIN.password}</span>
      </div>
     </div>
    </div>

    {/* Form */}
    <form onSubmit={go} className="space-y-4">
     <div>
      <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-black/70 mb-1.5">
       <Mail className="w-3.5 h-3.5 text-black/50" />
       Admin Email
      </label>
      <input
       className="input placeholder:text-black/40 text-sm"
       type="email"
       placeholder="Enter email here"
       value={e}
       onChange={x => setE(x.target.value)}
       aria-label="Email"
       required
      />
     </div>

     <div>
      <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-black/70 mb-1.5">
       <KeyRound className="w-3.5 h-3.5 text-black/50" />
       Password
      </label>
      <input
       className="input placeholder:text-black/40 text-sm"
       type="password"
       placeholder="Enter password here"
       value={p}
       onChange={x => setP(x.target.value)}
       aria-label="Password"
       required
      />
     </div>

     {err && (
      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
       {err}
      </div>
     )}

     <button
      type="submit"
      disabled={loading}
      className="btn btn-dark w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-wider mt-2 shadow-md hover:bg-black/90 transition"
     >
      {loading ? 'Verifying access…' : 'Sign in'}
     </button>
    </form>

    {/* Back link */}
    <div className="mt-8 text-center">
     <Link
      to="/"
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-black/60 hover:text-black transition"
     >
      <ArrowLeft className="w-3.5 h-3.5" /> Back to store
     </Link>
    </div>
   </div>
  </div>
 )
}
