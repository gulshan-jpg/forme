import { useToasts } from '../store/toast'
export default function Toaster(){const items=useToasts(s=>s.items)
 return <div role="status" aria-live="polite" className="fixed bottom-4 left-4 z-[60] flex flex-col gap-2">{items.map(t=><div key={t.id} className={`max-w-xs px-4 py-3 text-sm text-cream shadow-lg ${t.kind==='error'?'bg-red-800':'bg-ink'}`}>{t.msg}</div>)}</div>}
