export interface Coupon{code:string;type:'pct'|'flat';value:number;label:string}
export const COUPONS:Record<string,Coupon>={
 FORME10:{code:'FORME10',type:'pct',value:10,label:'10% off'},WELCOME200:{code:'WELCOME200',type:'flat',value:200,label:'₹200 off'}}
export const FREE_SHIP_ABOVE=1999, SHIP_FEE=99
export function totals(subtotal:number,c?:Coupon|null){
 const discount=c?Math.min(subtotal,c.type==='pct'?Math.round(subtotal*c.value/100):c.value):0
 const after=subtotal-discount
 const shipping=subtotal===0||after>=FREE_SHIP_ABOVE?0:SHIP_FEE
 return {discount,shipping,total:after+shipping}
}
