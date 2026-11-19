import { useEffect, useState } from 'react'; import { NavLink, Outlet, useNavigate } from 'react-router-dom'; import { isSignedIn, signOut } from '../services/auth'
import { isDemoMode } from '../services/supabase'; import * as db from '../services/db'; import { useOrders } from '../store/orders'; import { toast } from '../store/toast'
export default function AdminLayout(){const [ok,setOk]=useState<boolean|null>(null),nav=useNavigate()
 useEffect(()=>{isSignedIn().then(v=>{setOk(v);if(!v)nav('/admin/login',{replace:true})})},[nav])
 useEffect(()=>{if(ok&&!isDemoMode)db.fetchOrders().then(o=>useOrders.getState().setAll(o)).catch(e=>toast(e.message,'error'))},[ok])
 if(!ok)return <p className="py-32 text-center text-sm">Checking access…</p>
 const L=({to,end,children}:{to:string;end?:boolean;children:string})=><NavLink end={end} to={to} className={({isActive})=>`px-3 py-2 text-xs uppercase tracking-widest ${isActive?'bg-ink text-cream':''}`}>{children}</NavLink>
 return <div className="mx-auto max-w-7xl px-4 py-8"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4"><p className="h-serif text-3xl">Admin</p>
  <nav className="flex flex-wrap gap-1"><L to="/admin" end>Dashboard</L><L to="/admin/products">Products</L><L to="/admin/orders">Orders</L><L to="/admin/customers">Customers</L><L to="/admin/settings">Settings</L><NavLink to="/" className="px-3 py-2 text-xs uppercase tracking-widest">View store</NavLink><button className="px-3 py-2 text-xs uppercase tracking-widest" onClick={async()=>{await signOut();nav('/admin/login')}}>Sign out</button></nav></div>
  <div className="py-8"><Outlet/></div></div>}
