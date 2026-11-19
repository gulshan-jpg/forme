export function resizeImage(file:File,max=1200):Promise<Blob>{return new Promise((res,rej)=>{
 const url=URL.createObjectURL(file),img=new Image()
 img.onload=()=>{const k=Math.min(1,max/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*k);c.height=Math.round(img.height*k)
  c.getContext('2d')!.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);c.toBlob(b=>b?res(b):rej(new Error('Could not process image')),'image/jpeg',0.82)}
 img.onerror=()=>{URL.revokeObjectURL(url);rej(new Error('That file is not a valid image'))};img.src=url})}
export const blobToDataUrl=(b:Blob)=>new Promise<string>((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result));r.onerror=()=>rej(new Error('Could not read image'));r.readAsDataURL(b)})
