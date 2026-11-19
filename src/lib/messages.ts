import type { CartLine, Product, Order } from '../types'; import { inr } from './format'
export const productMessage=(p:Product,size?:string)=>`Hi! I'm interested in ${p.name}${size?` (size/variant: ${size})`:''} at ${inr(p.price)}. Is it available?`
export const cartMessage=(items:(CartLine&{p:Product})[])=>`Hi! I'd like help with my cart:\n${items.map(i=>`• ${i.p.name}${i.size?` (${i.size})`:''} × ${i.qty}`).join('\n')}`
export const orderMessage=(o:Order)=>`Hi! I have a question about order ${o.id} (${inr(o.total)}, status: ${o.status}).`
