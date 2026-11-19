export const inr=(n:number)=>'₹'+Math.round(n).toLocaleString('en-IN')
export const pct=(p:number,o:number)=>o>p?Math.round((1-p/o)*100):0
export const orderId=()=>'FRM-'+Date.now().toString(36).toUpperCase()+Math.random().toString(36).slice(2,5).toUpperCase()
