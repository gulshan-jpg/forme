import { useEffect, useState } from 'react'; import { NavLink, Outlet, useNavigate } from 'react-router-dom'; import { isSignedIn, signOut } from '../services/auth'
import { isDemoMode } from '../services/supabase'; import * as db from '../services/db'; import { useOrders } from '../store/orders'; import { toast } from '../store/toast'

export default function AdminLayout(){
 const [ok, setOk] = useState<boolean | null>(null)
 const nav = useNavigate()

 useEffect(() => {
  isSignedIn().then(v => {
   setOk(v)
   if (!v) nav('/admin/login', { replace: true })
  })
 }, [nav])

 useEffect(() => {
  if (ok && !isDemoMode) {
   db.fetchOrders().then(o => useOrders.getState().setAll(o)).catch(e => toast(e.message, 'error'))
  }
 }, [ok])

 if (!ok) return <div className="py-32 text-center text-sm text-char/70">Authenticating admin access…</div>

 const L = ({ to, children }: { to: string; children: string }) => (
  <NavLink
   to={to}
   className={({ isActive }) => `px-3.5 py-2 text-xs uppercase tracking-wider transition ${isActive ? 'bg-ink text-cream' : 'text-char/80 hover:text-ink hover:bg-sand/40'}`}
  >
   {children}
  </NavLink>
 )

 return (
  <div className="mx-auto max-w-7xl px-4 py-8">
   <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
    <div className="flex items-center gap-3">
     <p className="h-serif text-3xl font-medium">FORME® Admin</p>
     <span className="bg-sand/80 px-2 py-0.5 text-[10px] uppercase tracking-wider text-char">Portal</span>
    </div>

    <nav className="flex flex-wrap items-center gap-1 border border-ink/10 p-1 bg-cream">
     <L to="/admin/dashboard">Dashboard</L>
     <L to="/admin/products">Products</L>
     <L to="/admin/orders">Orders</L>
     <L to="/admin/customers">Customers</L>
     <L to="/admin/coupons">Coupons</L>
     <L to="/admin/marketing">Marketing</L>
     <L to="/admin/settings">Settings</L>
     <NavLink to="/" className="px-3.5 py-2 text-xs uppercase tracking-wider text-char/80 hover:text-ink">
      Storefront ↗
     </NavLink>
     <button
      className="px-3.5 py-2 text-xs uppercase tracking-wider text-red-700 hover:text-red-900"
      onClick={async () => { await signOut(); nav('/admin/login') }}
     >
      Sign out
     </button>
    </nav>
   </div>
   <div className="py-8"><Outlet /></div>
  </div>
 )
}
