import { useEffect, useState } from 'react'; import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'; import { isSignedIn, signOut } from '../services/auth'
import { isDemoMode } from '../services/supabase'; import * as db from '../services/db'; import { useOrders } from '../store/orders'; import { toast } from '../store/toast'
import LoadingScreen from '../components/LoadingScreen'

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

 if (!ok) return <LoadingScreen message="Authenticating admin access…" />

 const L = ({ to, children }: { to: string; children: string }) => (
  <NavLink
   to={to}
   className={({ isActive }) =>
    `px-3.5 py-2 text-xs uppercase tracking-wider font-bold transition rounded-md ${
     isActive
      ? 'bg-black text-white shadow-xs'
      : 'text-black/75 hover:text-black hover:bg-black/5'
    }`
   }
  >
   {children}
  </NavLink>
 )

 return (
  <div className="mx-auto max-w-7xl px-4 py-8">
   <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-4">
    <div className="flex items-center gap-3">
     <Link to="/admin/dashboard" className="flex items-baseline gap-2">
      <span className="font-brand text-3xl font-black uppercase text-black leading-none">FORME</span>
      <span className="font-sans text-xs uppercase tracking-widest text-black font-extrabold">Admin</span>
     </Link>
     <span className="bg-black/5 border border-black/10 px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold text-black rounded-md">
      Portal
     </span>
    </div>

    <nav className="flex flex-wrap items-center gap-1 border border-black/10 p-1 bg-white rounded-lg shadow-xs">
     <L to="/admin/dashboard">Dashboard</L>
     <L to="/admin/products">Products</L>
     <L to="/admin/orders">Orders</L>
     <L to="/admin/customers">Customers</L>
     <L to="/admin/coupons">Coupons</L>
     <L to="/admin/marketing">Marketing</L>
     <L to="/admin/settings">Settings</L>
     <NavLink
      to="/"
      className="px-3.5 py-2 text-xs uppercase tracking-wider font-bold text-black/75 hover:text-black hover:bg-black/5 transition rounded-md"
     >
      Storefront ↗
     </NavLink>
     <button
      className="px-3.5 py-2 text-xs uppercase tracking-wider font-bold text-red-700 hover:text-red-900 hover:bg-red-50 transition rounded-md"
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
