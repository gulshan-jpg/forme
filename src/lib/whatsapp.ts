export const waUrl=(n:string,text:string)=>`https://wa.me/${n.replace(/\D/g,'')}?text=${encodeURIComponent(text)}`
