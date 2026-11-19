import { useEffect, useState } from 'react'
import { useAccount } from '../store/account'
import { useOrders } from '../store/orders'
import { isDemoMode } from '../services/supabase'
import * as db from '../services/db'
import { toast } from '../store/toast'
import { inr } from '../lib/format'
import { Download, User, ShoppingBag, ShieldCheck, X, Eye } from 'lucide-react'
import type { Order } from '../types'

type C = { id: string; name: string; email: string; phone: string | null }

export default function CustomersAdmin() {
 const local = useAccount(s => s.local)
 const orders = useOrders(s => s.orders)
 const [rows, setRows] = useState<C[]>(isDemoMode ? local : [])
 const [q, setQ] = useState('')
 const [loading, setLoading] = useState(!isDemoMode)
 const [selectedCustomer, setSelectedCustomer] = useState<C | null>(null)
 const [customerStatus, setCustomerStatus] = useState<Record<string, 'Active' | 'VIP' | 'Flagged'>>({})

 useEffect(() => {
  if (isDemoMode) { setRows(local); return }
  db.fetchCustomers().then(setRows).catch(e => toast(e.message, 'error')).finally(() => setLoading(false))
 }, [local])

 const filtered = rows.filter(c => (c.name + c.email + (c.phone ?? '')).toLowerCase().includes(q.toLowerCase()))

 const exportCSV = () => {
  const headers = ['Name', 'Email', 'Phone', 'Orders Count', 'Total Spent (INR)']
  const data = filtered.map(c => {
   const userOrders = orders.filter(o => o.customer.email.toLowerCase() === c.email.toLowerCase())
   const spent = userOrders.reduce((a, o) => a + o.total, 0)
   return [
    `"${c.name.replace(/"/g, '""')}"`,
    `"${c.email}"`,
    `"${c.phone ?? ''}"`,
    userOrders.length,
    spent
   ]
  })
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...data.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `forme_customers_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
 }

 if (loading) return <p className="text-sm">Loading customers…</p>

 const customerOrders: Order[] = selectedCustomer
  ? orders.filter(o => o.customer.email.toLowerCase() === selectedCustomer.email.toLowerCase())
  : []
 const customerSpent = customerOrders.reduce((a, o) => a + o.total, 0)

 return (
  <div>
   <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
     <h2 className="h-serif text-3xl">Customer Management</h2>
     <p className="mt-1 text-xs text-char/70">View registered store customers, spending history, and profile accounts.</p>
    </div>
    <button onClick={exportCSV} disabled={filtered.length === 0} className="btn btn-line flex items-center gap-2 text-xs">
     <Download size={14}/> Export CSV
    </button>
   </div>

   <div className="mt-4">
    <input className="input max-w-sm text-xs" placeholder="Search customers by name, email, phone…" value={q} onChange={e => setQ(e.target.value)}/>
   </div>

   {!filtered.length ? (
    <p className="py-10 text-center text-sm">No customers match your search.</p>
   ) : (
    <div className="mt-6 overflow-x-auto">
     <table className="w-full text-left text-sm">
      <thead className="text-xs uppercase tracking-widest text-char/60 border-b border-ink/10 pb-2">
       <tr>
        <th className="py-2">Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Total Orders</th>
        <th>Lifetime Spend</th>
        <th>Status</th>
        <th className="text-right">Action</th>
       </tr>
      </thead>
      <tbody className="divide-y divide-ink/10">
       {filtered.map(c => {
        const userOrders = orders.filter(o => o.customer.email.toLowerCase() === c.email.toLowerCase())
        const spent = userOrders.reduce((a, o) => a + o.total, 0)
        const status = customerStatus[c.id] || (spent >= 5000 ? 'VIP' : 'Active')

        return (
         <tr key={c.id}>
          <td className="py-3 font-medium text-xs sm:text-sm">{c.name}</td>
          <td className="text-xs">{c.email}</td>
          <td className="text-xs font-mono">{c.phone ?? '—'}</td>
          <td>
           <span className="inline-block px-2 py-0.5 text-xs bg-sand/60">
            {userOrders.length} order{userOrders.length !== 1 ? 's' : ''}
           </span>
          </td>
          <td className="text-xs sm:text-sm font-semibold">{inr(spent)}</td>
          <td>
           <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
            status === 'VIP' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
            status === 'Flagged' ? 'bg-red-100 text-red-900' :
            'bg-emerald-100 text-emerald-900'
           }`}>
            {status}
           </span>
          </td>
          <td className="text-right">
           <button
            onClick={() => setSelectedCustomer(c)}
            className="btn btn-line py-1 px-3 text-xs inline-flex items-center gap-1"
           >
            <Eye size={12} /> View Profile
           </button>
          </td>
         </tr>
        )
       })}
      </tbody>
     </table>
    </div>
   )}

   {/* Customer Profile Modal */}
   {selectedCustomer && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
     <div className="w-full max-w-2xl rounded-[24px] border border-black/10 bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between border-b border-black/10 pb-4">
       <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
         {selectedCustomer.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
         <h3 className="font-bold text-lg text-black">{selectedCustomer.name}</h3>
         <p className="text-xs text-black/60">{selectedCustomer.email} · {selectedCustomer.phone || 'No phone'}</p>
        </div>
       </div>
       <button onClick={() => setSelectedCustomer(null)} className="p-1 text-black/40 hover:text-black">
        <X size={20} />
       </button>
      </div>

      {/* Customer Metrics */}
      <div className="grid grid-cols-3 gap-3 my-5">
       <div className="rounded-xl border border-black/10 bg-[#F0EEED]/50 p-4">
        <span className="text-[10px] uppercase font-bold text-black/50">Total Orders</span>
        <p className="text-xl font-bold text-black mt-1">{customerOrders.length}</p>
       </div>
       <div className="rounded-xl border border-black/10 bg-[#F0EEED]/50 p-4">
        <span className="text-[10px] uppercase font-bold text-black/50">Total Lifetime Value</span>
        <p className="text-xl font-bold text-black mt-1 font-sans">{inr(customerSpent)}</p>
       </div>
       <div className="rounded-xl border border-black/10 bg-[#F0EEED]/50 p-4">
        <span className="text-[10px] uppercase font-bold text-black/50">Account Status</span>
        <select
         value={customerStatus[selectedCustomer.id] || (customerSpent >= 5000 ? 'VIP' : 'Active')}
         onChange={e => {
          const s = e.target.value as 'Active' | 'VIP' | 'Flagged'
          setCustomerStatus(prev => ({ ...prev, [selectedCustomer.id]: s }))
          toast(`Customer status updated to ${s}!`, 'info')
         }}
         className="mt-1 input py-1 text-xs font-semibold"
        >
         <option value="Active">Active Shopper</option>
         <option value="VIP">VIP Customer</option>
         <option value="Flagged">Flagged Account</option>
        </select>
       </div>
      </div>

      {/* Customer Order History */}
      <div className="border-t border-black/10 pt-4">
       <h4 className="font-bold text-sm text-black mb-3">Order History ({customerOrders.length})</h4>
       {customerOrders.length === 0 ? (
        <p className="text-xs text-black/50 py-4 text-center">No orders placed under this customer account yet.</p>
       ) : (
        <div className="space-y-2">
         {customerOrders.map(o => (
          <div key={o.id} className="rounded-xl border border-black/10 p-3 flex items-center justify-between text-xs">
           <div>
            <span className="font-bold text-black">{o.id}</span>
            <span className="text-black/50 ml-2">{new Date(o.date).toLocaleDateString('en-IN')}</span>
            <p className="text-black/60 text-[11px] mt-0.5">{o.lines.map(l => `${l.qty}x ${l.name}`).join(', ')}</p>
           </div>
           <div className="text-right">
            <span className="font-bold font-sans">{inr(o.total)}</span>
            <span className={`block text-[10px] font-semibold mt-0.5 ${
             o.status === 'Delivered' ? 'text-emerald-700' :
             o.status === 'Cancelled' ? 'text-red-600' : 'text-blue-700'
            }`}>
             {o.status}
            </span>
           </div>
          </div>
         ))}
        </div>
       )}
      </div>

      <div className="mt-6 flex justify-end">
       <button onClick={() => setSelectedCustomer(null)} className="btn btn-dark text-xs px-6 py-2">
        Done
       </button>
      </div>
     </div>
    </div>
   )}
  </div>
 )
}
