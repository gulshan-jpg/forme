import { supabase } from './supabase'
import type { Product, Order, OrderStatus, Review, Customer } from '../types'
import type { Settings } from '../store/settings'
import { COUPONS, type Coupon } from '../lib/pricing'
export const BRAND_SLUG=(import.meta.env.VITE_BRAND_SLUG as string|undefined)||'forme'
const sb=()=>{if(!supabase)throw new Error('Supabase is not configured');return supabase}
const ok=(r:{error:{message:string}|null})=>{if(r.error)throw new Error(r.error.message)}
const must=<T>(r:{data:T|null;error:{message:string}|null}):T=>{if(r.error)throw new Error(r.error.message);return r.data as T}
const slugify=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
let brandId:string|null=null, catIds:Record<string,string>={}
export async function getBrandId(){if(brandId)return brandId
 const r=await sb().from('brands').select('id').eq('slug',BRAND_SLUG).maybeSingle();ok(r)
 if(!r.data)throw new Error(`Brand "${BRAND_SLUG}" was not found. Run supabase/seed.sql first.`)
 brandId=r.data.id as string;return brandId}

// ---- catalogue & settings
export async function fetchCatalog(){
 const b=await getBrandId(),c=sb()
 const [cats,prods,imgs,vars,set,brand]=await Promise.all([
  c.from('categories').select('id,name').eq('brand_id',b).order('name'),c.from('products').select('*').eq('brand_id',b),
  c.from('product_images').select('product_id,url,position').eq('brand_id',b).order('position'),c.from('product_variants').select('product_id,label').eq('brand_id',b),
  c.from('store_settings').select('*').eq('brand_id',b).maybeSingle(),c.from('brands').select('name,is_demo').eq('id',b).single()])
 const cl=must(cats) as {id:string;name:string}[]
 catIds=Object.fromEntries(cl.map(x=>[x.name,x.id]));const byId=Object.fromEntries(cl.map(x=>[x.id,x.name]))
 const im=must(imgs) as {product_id:string;url:string}[],vr=must(vars) as {product_id:string;label:string}[]
 const products:Product[]=(must(prods) as any[]).map(r=>{const images=im.filter(i=>i.product_id===r.id).map(i=>i.url),sizes=vr.filter(v=>v.product_id===r.id).map(v=>v.label)
  return {id:r.id,slug:r.slug,name:r.name,description:r.description??'',price:r.price_inr,originalPrice:r.original_price_inr,images:images.length?images:['/placeholder.svg'],category:byId[r.category_id]??'Other',tags:r.tags??[],sizes:sizes.length?sizes:['One size'],stock:r.stock,featured:r.featured,bestseller:r.bestseller,isNew:r.is_new,rating:Number(r.rating),reviews:r.review_count,createdAt:new Date(r.created_at).getTime()}})
 const br=must(brand) as {name:string;is_demo:boolean},s=set.data as any|null
 const settings:Partial<Settings>={name:br.name,isDemo:br.is_demo}
 if(s){const m:[keyof Settings,string][]=[['tagline','tagline'],['logoUrl','logo_url'],['accent','accent'],['whatsapp','whatsapp'],['email','email'],['instagram','instagram'],['announcement','announcement'],['heroTitle','hero_title'],['heroSub','hero_sub']]
  m.forEach(([k,col])=>{if(s[col]!=null)(settings as any)[k]=s[col]})}
 return {products,categories:cl.map(x=>x.name),settings}}
export async function saveSettings(s:Settings){const b=await getBrandId(),c=sb()
 ok(await c.from('store_settings').upsert({brand_id:b,tagline:s.tagline,logo_url:s.logoUrl,accent:s.accent,whatsapp:s.whatsapp,email:s.email,instagram:s.instagram,announcement:s.announcement,hero_title:s.heroTitle,hero_sub:s.heroSub}))
 ok(await c.from('brands').update({name:s.name}).eq('id',b))}
export async function addCategory(name:string){const b=await getBrandId()
 const r=await sb().from('categories').insert({brand_id:b,name,slug:slugify(name)}).select('id').single();catIds[name]=(must(r) as {id:string}).id}
export async function removeCategory(name:string){const b=await getBrandId();ok(await sb().from('categories').delete().eq('brand_id',b).eq('name',name));delete catIds[name]}
async function categoryId(name:string){if(!catIds[name])await addCategory(name);return catIds[name]}
export async function saveProduct(p:Product){const b=await getBrandId(),c=sb(),cid=await categoryId(p.category)
 ok(await c.from('products').upsert({id:p.id,brand_id:b,category_id:cid,slug:p.slug,name:p.name,description:p.description,price_inr:p.price,original_price_inr:p.originalPrice,stock:p.stock,tags:p.tags,featured:p.featured,bestseller:p.bestseller,is_new:p.isNew}))
 ok(await c.from('product_images').delete().eq('product_id',p.id));ok(await c.from('product_variants').delete().eq('product_id',p.id))
 const imgs=p.images.filter(u=>u!=='/placeholder.svg').map((url,position)=>({brand_id:b,product_id:p.id,url,position}))
 if(imgs.length)ok(await c.from('product_images').insert(imgs))
 ok(await c.from('product_variants').insert(p.sizes.map(label=>({brand_id:b,product_id:p.id,label,stock:p.stock}))))}
export async function deleteProduct(id:string){ok(await sb().from('products').delete().eq('id',id))}
export async function setStock(id:string,stock:number){ok(await sb().from('products').update({stock}).eq('id',id))}
export async function uploadImage(blob:Blob){const b=await getBrandId(),c=sb(),path=`${b}/${crypto.randomUUID()}.jpg`
 ok(await c.storage.from('product-images').upload(path,blob,{contentType:'image/jpeg'}));return c.storage.from('product-images').getPublicUrl(path).data.publicUrl}

// ---- orders
const rowToOrder=(r:any):Order=>{const a=r.ship_address??{}
 return {id:r.order_code,dbId:r.id,date:r.created_at,customer:{name:a.name??'',email:a.email??'',phone:a.phone??'',address:a.address??'',city:a.city??'',state:a.state??'',pin:a.pin??''},
  lines:(r.order_items??[]).map((i:any)=>({name:i.name,size:i.variant??undefined,qty:i.qty,price:i.price_inr})),subtotal:r.subtotal,discount:r.discount,shipping:r.shipping,total:r.total,status:r.status,payment:r.payment_note??'',demo:!!r.is_demo}}
export async function fetchOrders(){const b=await getBrandId();return (must(await sb().from('orders').select('*, order_items(*)').eq('brand_id',b).order('created_at',{ascending:false})) as any[]).map(rowToOrder)}
export async function fetchMyOrders(){return (must(await sb().from('orders').select('*, order_items(*)').order('created_at',{ascending:false})) as any[]).map(rowToOrder)}
export async function updateOrderStatus(dbId:string,status:OrderStatus){ok(await sb().from('orders').update({status}).eq('id',dbId))}
export async function placeOrder(a:{code:string;coupon?:string;ship:Customer;items:{product_id:string;variant?:string;qty:number}[];payment:string;customerId?:string}){
 const b=await getBrandId()
 const r=await sb().rpc('place_order',{p_brand:b,p_code:a.code,p_coupon:a.coupon??null,p_ship:a.ship,p_items:a.items,p_payment:a.payment,p_customer:a.customerId??null})
 if(r.error)throw new Error(r.error.message)
 return r.data as {id:string;order_code:string;subtotal:number;discount:number;shipping:number;total:number}}
export async function fetchCoupon(code:string):Promise<Coupon|null>{
 if(!supabase)return COUPONS[code.trim().toUpperCase()]??null
 const b=await getBrandId(),r=await supabase.rpc('validate_coupon',{p_brand:b,p_code:code.trim()});if(r.error)throw new Error(r.error.message)
 const d=r.data as {code:string;kind:'pct'|'flat';value:number}|null
 return d?{code:d.code,type:d.kind,value:d.value,label:d.kind==='pct'?`${d.value}% off`:`₹${d.value} off`}:null}

// ---- customers & wishlist
export async function ensureCustomer(){const b=await getBrandId(),r=await sb().rpc('ensure_customer',{p_brand:b});if(r.error)throw new Error(r.error.message)
 return r.data as {id:string;name:string;email:string;phone:string}}
export async function fetchCustomers(){const b=await getBrandId();return must(await sb().from('customers').select('id,name,email,phone').eq('brand_id',b).order('created_at',{ascending:false})) as {id:string;name:string;email:string;phone:string|null}[]}
export async function fetchWishlist(customerId:string){return (must(await sb().from('wishlists').select('product_id').eq('customer_id',customerId)) as {product_id:string}[]).map(r=>r.product_id)}
export async function setWish(customerId:string,productId:string,on:boolean){const b=await getBrandId(),c=sb()
 if(on)ok(await c.from('wishlists').upsert({brand_id:b,customer_id:customerId,product_id:productId},{onConflict:'customer_id,product_id'}))
 else ok(await c.from('wishlists').delete().eq('customer_id',customerId).eq('product_id',productId))}

// ---- reviews
const rowToReview=(r:any):Review=>({id:r.id,productId:r.product_id,name:r.author,rating:r.rating,text:r.body??'',date:r.created_at,sample:!!r.is_demo})
export async function fetchReviews(productId:string){return (must(await sb().from('reviews').select('*').eq('product_id',productId).order('created_at',{ascending:false})) as any[]).map(rowToReview)}
export async function fetchLatestReviews(n:number){const b=await getBrandId();return (must(await sb().from('reviews').select('*').eq('brand_id',b).order('created_at',{ascending:false}).limit(n)) as any[]).map(rowToReview)}
export async function addReview(productId:string,name:string,rating:number,text:string){const b=await getBrandId()
 return rowToReview(must(await sb().from('reviews').insert({brand_id:b,product_id:productId,author:name,rating,body:text,is_demo:false}).select().single()))}
