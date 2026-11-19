import { useEffect, useState } from 'react'; import { useAccount } from '../store/account'; import { useOrders } from '../store/orders'; import { isDemoMode } from '../services/supabase'; import * as db from '../services/db'; import { toast } from '../store/toast'
type C={id:string;name:string;email:string;phone:string|null}
export default function CustomersAdmin(){const local=useAccount(s=>s.local),orders=useOrders(s=>s.orders),[rows,setRows]=useState<C[]>(isDemoMode?local:[]),[loading,setLoading]=useState(!isDemoMode)
 useEffect(()=>{if(isDemoMode){setRows(local);return};db.fetchCustomers().then(setRows).catch(e=>toast(e.message,'error')).finally(()=>setLoading(false))},[local])
 if(loading)return <p className="text-sm">Loading customers…</p>
 if(!rows.length)return <p className="py-10 text-center text-sm">No registered customers yet. Guest checkouts appear under Orders.</p>
 return <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase tracking-widest text-char/60"><tr><th className="py-2">Name</th><th>Email</th><th>Phone</th><th>Orders</th></tr></thead><tbody>{rows.map(c=><tr key={c.id} className="border-b border-ink/10"><td className="py-2">{c.name}</td><td>{c.email}</td><td>{c.phone??'—'}</td><td>{orders.filter(o=>o.customer.email.toLowerCase()===c.email.toLowerCase()).length}</td></tr>)}</tbody></table></div>}
