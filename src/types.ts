export interface Product { id:string; slug:string; name:string; description:string; price:number; originalPrice:number; images:string[]; category:string; tags:string[]; sizes:string[]; stock:number; featured:boolean; bestseller:boolean; isNew:boolean; rating:number; reviews:number; createdAt:number }
export interface CartLine { key:string; productId:string; size?:string; qty:number }
export type OrderStatus='Placed'|'Packed'|'Shipped'|'Delivered'|'Cancelled'
export interface Customer { name:string; email:string; phone:string; address:string; city:string; state:string; pin:string }
export interface Review { id:string; productId:string; name:string; rating:number; text:string; date:string; sample?:boolean }
export interface Order { id:string; dbId?:string; date:string; customer:Customer; lines:{name:string;size?:string;qty:number;price:number}[]; subtotal:number; discount:number; shipping:number; total:number; status:OrderStatus; payment:string; demo:boolean }
