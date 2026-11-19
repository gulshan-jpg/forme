import type { Product } from '../types'
export const CATEGORIES=['Fashion','Skincare','Jewellery','Accessories','Home']
const L=['XS','S','M','L','XL']
const mk=(i:number,name:string,category:string,price:number,original:number,desc:string,sizes:string[],o:Partial<Product>={}):Product=>{
 const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'')
 return {id:'p'+i,slug,name,description:desc,price,originalPrice:original,category,sizes,tags:[category.toLowerCase(),...(o.tags??[])],
 images:[0,1,2].map(n=>`https://picsum.photos/seed/${slug}-${n}/800/1000`),stock:20,featured:false,bestseller:false,isNew:false,
 rating:Math.round((4+((i*7)%10)/10)*10)/10,reviews:12+i*9,createdAt:Date.now()-i*86400000*6,...o}}
export const DEMO_PRODUCTS:Product[]=[
 mk(1,'Boxy Heavyweight Tee','Fashion',1499,1999,'240 GSM combed cotton with a dropped shoulder and a clean, structured drape.',L,{bestseller:true,featured:true}),
 mk(2,'Pleated Wide Trousers','Fashion',2799,3499,'Relaxed pleated trousers in a fluid viscose blend. Tailored waist, easy movement.',['28','30','32','34','36'],{featured:true,isNew:true}),
 mk(3,'Linen Overshirt','Fashion',2499,3299,'Breathable stone-washed linen overshirt, built to layer through every season.',L,{isNew:true}),
 mk(4,'Essential Zip Hoodie','Fashion',2299,2999,'Brushed-back fleece, YKK zip, and a boxy fit that holds its shape wash after wash.',L,{bestseller:true,stock:3}),
 mk(5,'Utility Cargo Jacket','Fashion',3999,5499,'Water-resistant cotton twill with four pockets and a quiet matte finish.',L,{isNew:true}),
 mk(6,'Vitamin C Brightening Serum','Skincare',899,1199,'A stable 10% vitamin C serum for visibly even, radiant skin. 30 ml.',['30 ml'],{bestseller:true,featured:true}),
 mk(7,'Ceramide Barrier Moisturiser','Skincare',799,999,'Lightweight daily cream with ceramides and niacinamide to support the skin barrier. 50 g.',['50 g'],{bestseller:true}),
 mk(8,'Mineral SPF 50 Fluid','Skincare',699,899,'Sheer, non-greasy broad-spectrum sunscreen with no white cast. 50 ml.',['50 ml'],{isNew:true}),
 mk(9,'Gentle Gel Cleanser','Skincare',499,649,'A low-foam cleanser that removes the day without stripping. 100 ml.',['100 ml'],{stock:0}),
 mk(10,'Sterling Silver Hoops','Jewellery',1899,2499,'Hand-polished 925 sterling silver hoops with an anti-tarnish finish.',['Small','Medium'],{featured:true,bestseller:true}),
 mk(11,'Layered Chain Necklace','Jewellery',2199,2899,'Two delicate 18k gold-plated chains designed to sit together or apart.',['16 in','18 in'],{isNew:true}),
 mk(12,'Freshwater Pearl Studs','Jewellery',1599,2099,'Real freshwater pearls set in hypoallergenic sterling silver.',['One size']),
 mk(13,'Engraved Signet Ring','Jewellery',2499,3199,'A weighty signet in 925 silver, available for personal engraving.',['6','7','8','9'],{stock:5}),
 mk(14,'Leather Card Holder','Accessories',1299,1799,'Full-grain vegetable-tanned leather that ages beautifully. Holds six cards.',['One size'],{bestseller:true}),
 mk(15,'Everyday Canvas Tote','Accessories',1199,1599,'Heavy 14 oz canvas with an inner zip pocket and reinforced handles.',['One size'],{featured:true}),
 mk(16,'Minimal Quartz Watch','Accessories',3499,4999,'36 mm brushed steel case, sapphire-coated glass, and a Japanese quartz movement.',['One size'],{isNew:true}),
 mk(17,'Soy Wax Candle','Home',899,1199,'Hand-poured soy wax in a reusable amber jar. Notes of fig, cedar and sea salt. 45-hour burn.',['200 g'],{bestseller:true,featured:true}),
 mk(18,'Ceramic Mug Set of 2','Home',1399,1899,'Wheel-thrown stoneware mugs with a matte reactive glaze. Dishwasher safe.',['Set of 2']),
 mk(19,'Waffle Linen Throw','Home',2999,3999,'Oversized cotton-linen throw with a soft waffle weave and knotted fringe.',['130 x 170 cm'],{isNew:true}),
 mk(20,'Stoneware Bud Vase','Home',999,1399,'A small hand-finished vase, ideal for single stems and dried flowers.',['One size'],{stock:8}),
]
export const SAMPLE_REVIEWS=[
 {name:'Aanya S.',text:'The quality is far beyond what I expected. Packaging felt premium too.',rating:5},
 {name:'Rohan M.',text:'Fit is perfect and the fabric holds up after multiple washes.',rating:5},
 {name:'Ishita K.',text:'Delivery was quick and support answered on WhatsApp within minutes.',rating:4},
]
