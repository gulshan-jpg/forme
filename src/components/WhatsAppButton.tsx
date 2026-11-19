import type { ReactNode } from 'react'; import { MessageCircle } from 'lucide-react'
import { useSettings } from '../store/settings'; import { waUrl } from '../lib/whatsapp'
export default function WhatsAppButton({text,children,className='btn btn-line'}:{text:string;children:ReactNode;className?:string}){
 const n=useSettings(s=>s.whatsapp)
 const go=()=>{ if(!n){alert('WhatsApp number not set yet. Add VITE_WHATSAPP_NUMBER or set it in Admin → Settings.');return}; window.open(waUrl(n,text),'_blank','noopener') }
 return <button type="button" onClick={go} className={className}><MessageCircle size={16}/>{children}</button>}
