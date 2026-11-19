import { useState } from 'react'; import { useSettings, type Settings } from '../store/settings'; import * as db from '../services/db'; import { run } from '../lib/action'
const F:[keyof Settings,string][]=[['name','Brand name'],['tagline','Tagline'],['logoUrl','Logo URL'],['accent','Brand accent colour'],['whatsapp','WhatsApp number (digits, with country code)'],['email','Contact email'],['instagram','Instagram URL'],['announcement','Announcement bar'],['heroTitle','Hero title'],['heroSub','Hero subtitle']]
export default function SettingsAdmin(){const {set,...cur}=useSettings(),[d,setD]=useState<Settings>({...cur}),[busy,setBusy]=useState(false)
 return <form className="grid max-w-2xl gap-4" onSubmit={async e=>{e.preventDefault();setBusy(true);const ok=await run(()=>db.saveSettings(d),'Settings saved');setBusy(false);if(ok)set(d)}}>
 {F.map(([k,l])=><label key={k} className="text-sm">{l}<input className="input mt-1" type={k==='accent'?'color':'text'} value={String(d[k])} onChange={e=>setD({...d,[k]:e.target.value})}/></label>)}
 <div><button disabled={busy} className="btn btn-dark">{busy?'Saving…':'Save settings'}</button></div></form>}
