import type { Product, SizeChartEntry } from '../types'

export const CATEGORIES = [
 'Clothing',
 'Streetwear',
 'Footwear',
 'Fragrance',
 'Eyewear',
 'Skincare',
 'Beauty',
 'Jewellery',
 'Accessories',
 'Home & Lifestyle',
 'Wellness'
]

const FOOTWEAR_CHART: SizeChartEntry[] = [
 { size: 'UK 6',  euSize: 'EU 40', footLength: '25.0 cm / 9.8 in' },
 { size: 'UK 7',  euSize: 'EU 41', footLength: '25.8 cm / 10.1 in' },
 { size: 'UK 8',  euSize: 'EU 42', footLength: '26.7 cm / 10.5 in' },
 { size: 'UK 9',  euSize: 'EU 43', footLength: '27.5 cm / 10.8 in' },
 { size: 'UK 10', euSize: 'EU 44', footLength: '28.3 cm / 11.1 in' },
 { size: 'UK 11', euSize: 'EU 45', footLength: '29.2 cm / 11.5 in' }
]

const STANDARD_TOP_CHART: SizeChartEntry[] = [
 { size: 'XS', chest: '38 in / 96 cm', shoulder: '18 in / 46 cm', length: '27 in / 68 cm', sleeve: '8 in / 20 cm' },
 { size: 'S',  chest: '40 in / 102 cm', shoulder: '19 in / 48 cm', length: '28 in / 71 cm', sleeve: '8.5 in / 21 cm' },
 { size: 'M',  chest: '42 in / 107 cm', shoulder: '20 in / 51 cm', length: '29 in / 74 cm', sleeve: '9 in / 23 cm' },
 { size: 'L',  chest: '44 in / 112 cm', shoulder: '21 in / 53 cm', length: '30 in / 76 cm', sleeve: '9.5 in / 24 cm' },
 { size: 'XL', chest: '46 in / 117 cm', shoulder: '22 in / 56 cm', length: '31 in / 79 cm', sleeve: '10 in / 25 cm' },
 { size: 'XXL',chest: '48 in / 122 cm', shoulder: '23 in / 58 cm', length: '32 in / 81 cm', sleeve: '10.5 in / 27 cm' }
]

const OVERSIZED_HOODIE_CHART: SizeChartEntry[] = [
 { size: 'S',  chest: '44 in / 112 cm', shoulder: '21 in / 53 cm', length: '27 in / 69 cm', sleeve: '24 in / 61 cm' },
 { size: 'M',  chest: '46 in / 117 cm', shoulder: '22 in / 56 cm', length: '28 in / 71 cm', sleeve: '24.5 in / 62 cm' },
 { size: 'L',  chest: '48 in / 122 cm', shoulder: '23 in / 58 cm', length: '29 in / 74 cm', sleeve: '25 in / 64 cm' },
 { size: 'XL', chest: '50 in / 127 cm', shoulder: '24 in / 61 cm', length: '30 in / 76 cm', sleeve: '25.5 in / 65 cm' }
]

const TROUSER_CHART: SizeChartEntry[] = [
 { size: '28', waist: '28 in / 71 cm', length: '39 in / 99 cm' },
 { size: '30', waist: '30 in / 76 cm', length: '40 in / 102 cm' },
 { size: '32', waist: '32 in / 81 cm', length: '41 in / 104 cm' },
 { size: '34', waist: '34 in / 86 cm', length: '42 in / 107 cm' },
 { size: '36', waist: '36 in / 91 cm', length: '42 in / 107 cm' }
]

export const DEMO_PRODUCTS: Product[] = [
 // ---- CLOTHING (6) ----
 {
  id: 'p-clo-01',
  slug: 'boxy-heavyweight-tee',
  name: 'Oversized Heavyweight T-Shirt',
  sku: 'FRM-CLO-001',
  brand: 'FORME®',
  description: 'Crafted from dense 240 GSM combed ring-spun cotton. Features dropped shoulders, a reinforced 1.25" rib collar, and a boxy silhouette designed to hold structure wear after wear.',
  price: 1499,
  originalPrice: 1999,
  category: 'Clothing',
  color: 'Vintage Black',
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  tags: ['clothing', 't-shirt', 'heavyweight', 'cotton', 'oversized'],
  images: [
   'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
   'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 24,
  featured: true,
  bestseller: true,
  isNew: false,
  rating: 4.9,
  reviews: 64,
  createdAt: Date.now() - 86400000 * 4,
  modelInfo: "Model is 6'1\" / 185 cm wearing size L",
  careInstructions: 'Machine wash cold inside-out. Do not tumble dry. Warm iron on reverse.',
  sizeChart: STANDARD_TOP_CHART,
  specifications: {
   'Fabric Composition': '100% Combed Ring-Spun Cotton',
   'Fabric Weight': '240 GSM',
   'Fit Type': 'Boxy / Dropped Shoulder',
   'Neckline': 'Crewneck with 1.25" bound rib collar',
   'Origin': 'Ethically knit and dyed in Tirupur, India'
  }
 },
 {
  id: 'p-clo-02',
  slug: 'pleated-wide-leg-trousers',
  name: 'Pleated Wide-Leg Trousers',
  sku: 'FRM-CLO-002',
  brand: 'FORME®',
  description: 'Double front pleats meet an effortless, fluid drape. Tailored from a breathable tropical wool blend with hidden side adjusters and deep slant pockets.',
  price: 3299,
  originalPrice: 4299,
  category: 'Clothing',
  color: 'Charcoal Grey',
  sizes: ['28', '30', '32', '34', '36'],
  tags: ['clothing', 'trousers', 'tailored', 'wool', 'pleated'],
  images: [
   'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 12,
  featured: true,
  bestseller: false,
  isNew: true,
  rating: 4.8,
  reviews: 38,
  createdAt: Date.now() - 86400000 * 2,
  modelInfo: "Model is 5'11\" wearing waist size 32",
  careInstructions: 'Dry clean recommended. Cool iron under pressing cloth.',
  sizeChart: TROUSER_CHART,
  specifications: {
   'Fabric Composition': '70% Poly-Viscose, 30% Tropical Wool',
   'Fabric Weight': '220 GSM',
   'Fit Type': 'Relaxed Wide-Leg / High Rise',
   'Closure': 'YKK zip fly with concealed tab closure',
   'Pockets': '2 front slant pockets, 2 back welt pockets'
  }
 },
 {
  id: 'p-clo-03',
  slug: 'french-terry-crewneck-sweatshirt',
  name: 'Heavy French Terry Crewneck',
  sku: 'FRM-CLO-003',
  brand: 'FORME®',
  description: 'Built from 450 GSM diagonal-loop French terry cotton. Pre-shrunk with vintage flatlock stitching, rib side gussets, and zero synthetic polyester fillers.',
  price: 2799,
  originalPrice: 3499,
  category: 'Clothing',
  color: 'Heather Ash',
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  tags: ['clothing', 'sweatshirt', 'french-terry', 'minimal'],
  images: [
   'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 18,
  featured: false,
  bestseller: true,
  isNew: false,
  rating: 4.9,
  reviews: 51,
  createdAt: Date.now() - 86400000 * 10,
  modelInfo: "Model is 6'0\" wearing size M",
  careInstructions: 'Machine wash cold on gentle cycle. Lay flat to dry.',
  sizeChart: STANDARD_TOP_CHART,
  specifications: {
   'Fabric Composition': '100% Cotton French Terry',
   'Fabric Weight': '450 GSM Heavyweight',
   'Fit Type': 'Subtle Oversized',
   'Details': 'Underarm & side rib expansion gussets'
  }
 },
 {
  id: 'p-clo-04',
  slug: 'washed-linen-overshirt',
  name: 'Washed European Linen Overshirt',
  sku: 'FRM-CLO-004',
  brand: 'FORME®',
  description: 'Pure French flax linen, enzyme washed for immediate softness. Finished with natural horn buttons, dual chest patch pockets, and a clean straight hem.',
  price: 2899,
  originalPrice: 3899,
  category: 'Clothing',
  color: 'Natural Oatmeal',
  sizes: ['S', 'M', 'L', 'XL'],
  tags: ['clothing', 'linen', 'overshirt', 'summer', 'minimal'],
  images: [
   'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 8,
  featured: false,
  bestseller: false,
  isNew: true,
  rating: 4.7,
  reviews: 29,
  createdAt: Date.now() - 86400000 * 1,
  modelInfo: "Model is 6'2\" wearing size L",
  careInstructions: 'Machine wash cold. Hang dry in shade. Iron damp if desired.',
  sizeChart: STANDARD_TOP_CHART,
  specifications: {
   'Fabric Composition': '100% Certified European Flax Linen',
   'Fabric Weight': '185 GSM',
   'Fit Type': 'Relaxed Straight Fit',
   'Hardware': 'Natural carved horn buttons'
  }
 },
 {
  id: 'p-clo-05',
  slug: 'relaxed-wool-blend-blazer',
  name: 'Unstructured Wool-Blend Blazer',
  sku: 'FRM-CLO-005',
  brand: 'FORME®',
  description: 'Tailoring freed from stiff canvassing. Unstructured shoulders, horn buttons, partial cupro lining, and a soft drape that pairs easily with denim or matching trousers.',
  price: 5499,
  originalPrice: 7499,
  category: 'Clothing',
  color: 'Midnight Navy',
  sizes: ['38', '40', '42', '44'],
  tags: ['clothing', 'blazer', 'wool', 'tailored', 'outerwear'],
  images: [
   'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=80',
   'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 6,
  featured: true,
  bestseller: false,
  isNew: false,
  rating: 4.9,
  reviews: 23,
  createdAt: Date.now() - 86400000 * 15,
  modelInfo: "Model is 6'1\" wearing size 40",
  careInstructions: 'Dry clean only.',
  sizeChart: STANDARD_TOP_CHART,
  specifications: {
   'Fabric Composition': '60% Merino Wool, 40% Viscose',
   'Lining': '100% Breathable Cupro (sleeves & half-back)',
   'Shoulder': 'Soft / Zero padding'
  }
 },
 {
  id: 'p-clo-06',
  slug: 'merino-knit-polo',
  name: 'Fine Gauge Merino Knit Polo',
  sku: 'FRM-CLO-006',
  brand: 'FORME®',
  description: 'Spun from extra-fine 19.5-micron Australian merino wool. Features a seamless knitted collar, rib trims, and naturally temperature-regulating properties.',
  price: 2499,
  originalPrice: 3199,
  category: 'Clothing',
  color: 'Espresso Brown',
  sizes: ['S', 'M', 'L', 'XL'],
  tags: ['clothing', 'merino', 'knitwear', 'polo'],
  images: [
   'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 14,
  featured: false,
  bestseller: false,
  isNew: true,
  rating: 4.8,
  reviews: 19,
  createdAt: Date.now() - 86400000 * 3,
  modelInfo: "Model is 5'11\" wearing size M",
  careInstructions: 'Hand wash in cold water with wool detergent. Dry flat.',
  sizeChart: STANDARD_TOP_CHART,
  specifications: {
   'Yarn': '100% Extra-Fine Australian Merino Wool',
   'Gauge': '14-Gauge Plain Knit',
   'Placket': 'Seamless 3-button buttonless open Johnny collar'
  }
 },

 // ---- STREETWEAR (5) ----
 {
  id: 'p-str-01',
  slug: 'raw-edge-boxy-hoodie',
  name: '500 GSM Heavyweight Boxy Hoodie',
  sku: 'FRM-STR-001',
  brand: 'FORME®',
  description: 'Ultra-heavy 500 GSM custom fleece with a double-layered crossover hood (no drawstrings), dropped shoulders, raw-edge hem finish, and a wide silhouette.',
  price: 3499,
  originalPrice: 4499,
  category: 'Streetwear',
  color: 'Washed Olive',
  sizes: ['S', 'M', 'L', 'XL'],
  tags: ['streetwear', 'hoodie', 'heavyweight', 'oversized'],
  images: [
   'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 9,
  featured: true,
  bestseller: true,
  isNew: false,
  rating: 5.0,
  reviews: 84,
  createdAt: Date.now() - 86400000 * 7,
  modelInfo: "Model is 6'2\" wearing size L for an oversized streetwear drape",
  careInstructions: 'Machine wash cold inside-out. Hang dry to maintain fleece weight.',
  sizeChart: OVERSIZED_HOODIE_CHART,
  specifications: {
   'Fabric Composition': '100% Cotton Ultra-Dense Fleece',
   'Fabric Weight': '500 GSM',
   'Hood': 'Double-layered crossover without grommets/drawstrings',
   'Fit Type': 'Extreme Boxy Drop-Shoulder'
  }
 },
 {
  id: 'p-str-02',
  slug: 'parachute-cargo-pants',
  name: 'Technical Parachute Cargo Pants',
  sku: 'FRM-STR-002',
  brand: 'FORME®',
  description: 'Constructed from lightweight, water-repellent ripstop nylon. Features toggle adjusters at the knees and hems for custom volume control and 6 gusseted utility pockets.',
  price: 2999,
  originalPrice: 3999,
  category: 'Streetwear',
  color: 'Matte Obsidian',
  sizes: ['S (30)', 'M (32)', 'L (34)', 'XL (36)'],
  tags: ['streetwear', 'cargo', 'ripstop', 'parachute', 'techwear'],
  images: [
   'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 16,
  featured: false,
  bestseller: true,
  isNew: true,
  rating: 4.8,
  reviews: 42,
  createdAt: Date.now() - 86400000 * 5,
  modelInfo: "Model is 6'0\" wearing size M",
  careInstructions: 'Machine wash cool. Do not iron directly on nylon.',
  sizeChart: TROUSER_CHART,
  specifications: {
   'Fabric Composition': '100% Water-Resistant Ripstop Nylon',
   'Hardware': 'Matte black alloy bungee toggles and YKK zippers',
   'Cuffs': 'Adjustable elastic drawcord'
  }
 },
 {
  id: 'p-str-03',
  slug: 'vintage-acid-wash-tee',
  name: 'Vintage Acid Wash Graphic Tee',
  sku: 'FRM-STR-003',
  brand: 'FORME®',
  description: 'Individually hand-treated acid wash cotton tee with distressed collar hems and a subtle typographic back print. Every piece features a one-of-a-kind fade.',
  price: 1699,
  originalPrice: 2299,
  category: 'Streetwear',
  color: 'Faded Charcoal',
  sizes: ['S', 'M', 'L', 'XL'],
  tags: ['streetwear', 'vintage', 'graphic', 'acid-wash'],
  images: [
   'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 22,
  featured: false,
  bestseller: false,
  isNew: true,
  rating: 4.7,
  reviews: 31,
  createdAt: Date.now() - 86400000 * 1,
  modelInfo: "Model is 6'1\" wearing size L",
  careInstructions: 'Machine wash cold with like colours.',
  sizeChart: STANDARD_TOP_CHART,
  specifications: {
   'Fabric Composition': '100% Carded Vintage Cotton',
   'Fabric Weight': '260 GSM',
   'Finish': 'Individual manual mineral acid wash'
  }
 },
 {
  id: 'p-str-04',
  slug: 'cropped-canvas-work-jacket',
  name: 'Cropped Canvas Work Jacket',
  sku: 'FRM-STR-004',
  brand: 'FORME®',
  description: '12 oz duck canvas with corduroy collar detailing, brass hardware, and a modern cropped, boxy silhouette. Insulated with lightweight diamond quilted lining.',
  price: 4499,
  originalPrice: 5999,
  category: 'Streetwear',
  color: 'Tobacco Brown',
  sizes: ['M', 'L', 'XL'],
  tags: ['streetwear', 'workwear', 'jacket', 'canvas'],
  images: [
   'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 5,
  featured: true,
  bestseller: false,
  isNew: false,
  rating: 4.9,
  reviews: 37,
  createdAt: Date.now() - 86400000 * 12,
  modelInfo: "Model is 6'0\" wearing size M",
  careInstructions: 'Spot clean or hand wash cold. Air dry.',
  sizeChart: OVERSIZED_HOODIE_CHART,
  specifications: {
   'Shell': '100% Heavy 12 oz Cotton Duck Canvas',
   'Collar': '100% Cotton 8-Wale Corduroy',
   'Lining': 'Diamond quilted nylon with 80 GSM polyfill'
  }
 },
 {
  id: 'p-str-05',
  slug: 'modular-tactical-vest',
  name: 'Modular Utility Tech Vest',
  sku: 'FRM-STR-005',
  brand: 'FORME®',
  description: 'Cordura® nylon construction with magnetic Fidlock® buckles, MOLLE webbing, and detachable front utility pouch pockets for an adaptable streetwear fit.',
  price: 2699,
  originalPrice: 3499,
  category: 'Streetwear',
  color: 'Stealth Black',
  sizes: ['Adjustable Regular', 'Adjustable Oversized'],
  tags: ['streetwear', 'techwear', 'vest', 'tactical'],
  images: [
   'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 10,
  featured: false,
  bestseller: false,
  isNew: true,
  rating: 4.8,
  reviews: 18,
  createdAt: Date.now() - 86400000 * 3,
  careInstructions: 'Wipe clean with a damp microfiber cloth.',
  specifications: {
   'Material': 'Cordura® 500D Ballistic Nylon',
   'Hardware': 'Fidlock® V-Buckles & YKK Waterproof zips',
   'Fit': 'Fully adjustable chest and shoulder straps'
  }
 },

 // ---- SKINCARE (5) ----
 {
  id: 'p-skn-01',
  slug: 'vitamin-c-glow-serum-15',
  name: '15% Ethyl Ascorbic Acid Glow Serum',
  sku: 'FRM-SKN-001',
  brand: 'FORME®',
  description: 'A clinically stable, non-oxidizing 15% Vitamin C serum infused with ferulic acid and hyaluronic acid. Fades post-acne marks, boosts collagen synthesis, and defends against daily free-radical stress.',
  price: 999,
  originalPrice: 1399,
  category: 'Skincare',
  sizes: ['30 ml', '50 ml'],
  tags: ['skincare', 'vitamin-c', 'serum', 'brightening'],
  images: [
   'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 35,
  featured: true,
  bestseller: true,
  isNew: false,
  rating: 4.9,
  reviews: 112,
  createdAt: Date.now() - 86400000 * 20,
  careInstructions: 'Store in a cool, dry place away from direct sunlight.',
  specifications: {
   'Net Quantity': '30 ml / 1.0 fl. oz.',
   'Active Ingredients': '15% 3-O-Ethyl Ascorbic Acid, 0.5% Ferulic Acid, 1% Low Molecular HA',
   'Skin Type': 'All skin types, including sensitive and acne-prone',
   'Usage Instructions': 'Apply 3-4 drops every morning on clean, dry face before sunscreen',
   'Shelf Life': '24 months from manufacturing (6 months after opening)',
   'Fragrance': 'Fragrance-free, Essential oil-free'
  }
 },
 {
  id: 'p-skn-02',
  slug: 'ceramide-barrier-restorative-cream',
  name: '5-Ceramide Barrier Restorative Cream',
  sku: 'FRM-SKN-002',
  brand: 'FORME®',
  description: 'Formulated with a 3:1:1 physiological ratio of essential ceramides, cholesterol, and fatty acids. Instantly repairs sensitized, over-exfoliated skin barriers without clogging pores.',
  price: 849,
  originalPrice: 1199,
  category: 'Skincare',
  sizes: ['50 g', '100 g'],
  tags: ['skincare', 'ceramides', 'moisturiser', 'barrier-repair'],
  images: [
   'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 40,
  featured: false,
  bestseller: true,
  isNew: false,
  rating: 4.9,
  reviews: 89,
  createdAt: Date.now() - 86400000 * 18,
  specifications: {
   'Net Quantity': '50 g / 1.76 oz.',
   'Active Ingredients': 'Ceramides NP, AP, EOP, NS, AS, Phytosphingosine, 2% Niacinamide',
   'Skin Type': 'Dry, dehydrated, combination and compromised skin',
   'Usage Instructions': 'Massage a coin-sized amount morning and evening as the final hydration step',
   'Texture': 'Rich velvet emulsion that absorbs with zero greasy residue'
  }
 },
 {
  id: 'p-skn-03',
  slug: 'bha-salicylic-exfoliating-toner',
  name: '2% BHA Pore Clarifying Liquid',
  sku: 'FRM-SKN-003',
  brand: 'FORME®',
  description: 'Gentle leave-on exfoliant with oil-soluble 2% Salicylic Acid and green tea extract. Clears sebum build-up deep inside pores, diminishes blackheads, and smoothes rough bumps.',
  price: 799,
  originalPrice: 999,
  category: 'Skincare',
  sizes: ['120 ml'],
  tags: ['skincare', 'bha', 'toner', 'acne', 'exfoliant'],
  images: [
   'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 19,
  featured: false,
  bestseller: false,
  isNew: true,
  rating: 4.8,
  reviews: 44,
  createdAt: Date.now() - 86400000 * 6,
  specifications: {
   'Net Quantity': '120 ml / 4.0 fl. oz.',
   'Active Ingredients': '2% Salicylic Acid, Camellia Sinensis (Green Tea) Leaf Extract, Allantoin',
   'Skin Type': 'Oily, combination, and acne-prone skin',
   'Usage Instructions': 'Saturate a cotton pad or pat directly onto clean skin 2-3 nights per week'
  }
 },
 {
  id: 'p-skn-04',
  slug: 'peptide-firming-eye-cream',
  name: 'Multi-Peptide & Caffeine Eye Cream',
  sku: 'FRM-SKN-004',
  brand: 'FORME®',
  description: 'Targeted eye concentrate with 3% pure caffeine, Matrixyl 3000, and light-reflecting peptides. Depuffs morning eye bags and brightens stubborn vascular dark circles.',
  price: 949,
  originalPrice: 1299,
  category: 'Skincare',
  sizes: ['15 ml'],
  tags: ['skincare', 'eye-cream', 'peptides', 'caffeine'],
  images: [
   'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 25,
  featured: false,
  bestseller: false,
  isNew: true,
  rating: 4.7,
  reviews: 26,
  createdAt: Date.now() - 86400000 * 3,
  specifications: {
   'Net Quantity': '15 ml / 0.5 fl. oz.',
   'Active Ingredients': '3% Green Coffee Caffeine, Palmitoyl Tripeptide-1, Squalane',
   'Skin Type': 'Delicate under-eye area, all skin types',
   'Usage Instructions': 'Gently tap a rice-grain amount around orbital bone with ring finger'
  }
 },
 {
  id: 'p-skn-05',
  slug: 'ultra-sheer-spf-50-fluid',
  name: 'Invisible Fluid Sunscreen SPF 50+ PA++++',
  sku: 'FRM-SKN-005',
  brand: 'FORME®',
  description: 'Next-generation hybrid chemical/mineral UV filters suspended in a weightless fluid. Zero white cast, zero sting around eyes, leaves a natural satin skin-like finish.',
  price: 749,
  originalPrice: 999,
  category: 'Skincare',
  sizes: ['50 ml'],
  tags: ['skincare', 'sunscreen', 'spf50', 'mineral', 'no-white-cast'],
  images: [
   'https://images.unsplash.com/photo-1608248597359-2c67675f9d1d?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 45,
  featured: true,
  bestseller: true,
  isNew: false,
  rating: 4.9,
  reviews: 104,
  createdAt: Date.now() - 86400000 * 15,
  specifications: {
   'Net Quantity': '50 ml / 1.7 fl. oz.',
   'Protection Rating': 'SPF 50+, PA++++ Broad Spectrum UVA/UVB',
   'Key Filters': 'Tinosorb S, Uvinul A Plus, Micronized Zinc Oxide',
   'Finish': 'Natural invisible matte-satin'
  }
 },

 // ---- BEAUTY (4) ----
 {
  id: 'p-bt-01',
  slug: 'glazed-peptide-lip-oil',
  name: 'Peptide Infused Glazed Lip Oil',
  sku: 'FRM-BEA-001',
  brand: 'FORME®',
  description: 'High-shine cushioning lip oil packed with tripeptides, jojoba ester, and botanical squalane. Deeply hydrates chapped lips with a glassy mirror sheen and zero tackiness.',
  price: 699,
  originalPrice: 899,
  category: 'Beauty',
  color: 'Honey Fig',
  sizes: ['6 ml'],
  tags: ['beauty', 'lip-oil', 'peptides', 'gloss', 'cruelty-free'],
  images: [
   'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 30,
  featured: true,
  bestseller: true,
  isNew: true,
  rating: 4.9,
  reviews: 73,
  createdAt: Date.now() - 86400000 * 8,
  specifications: {
   'Net Quantity': '6 ml / 0.2 fl. oz.',
   'Formulation': 'Cushioning botanical lip oil',
   'Finish': 'Glassy, non-sticky high shine',
   'Key Ingredients': 'Maxi-Lip™ Palmitoyl Tripeptide, Cold-Pressed Jojoba, Vitamin E',
   'Standards': '100% Vegan, Cruelty-Free, Paraben-Free'
  }
 },
 {
  id: 'p-bt-02',
  slug: 'radiant-dew-skin-tint',
  name: 'Radiant Dewy Skin Tint SPF 25',
  sku: 'FRM-BEA-002',
  brand: 'FORME®',
  description: 'Breathable serum foundation delivering sheer-to-light buildable coverage. Formulated with 70% skincare base to even tone, blur imperfections, and leave a luminous lit-from-within glow.',
  price: 1199,
  originalPrice: 1599,
  category: 'Beauty',
  color: 'Medium Warm 03',
  sizes: ['Fair 01', 'Light 02', 'Medium 03', 'Tan 04', 'Deep 05'],
  tags: ['beauty', 'skin-tint', 'foundation', 'dewy', 'spf'],
  images: [
   'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 20,
  featured: false,
  bestseller: false,
  isNew: true,
  rating: 4.8,
  reviews: 35,
  createdAt: Date.now() - 86400000 * 5,
  specifications: {
   'Net Quantity': '30 ml / 1.0 fl. oz.',
   'Coverage': 'Sheer to medium flexible buildable',
   'Finish': 'Dewy, radiant skin-like finish',
   'Active Skincare': 'Sodium Hyaluronate, Niacinamide, Glycerin'
  }
 },
 {
  id: 'p-bt-03',
  slug: 'velvet-matte-liquid-blush',
  name: 'Weightless Liquid Cheek Tint',
  sku: 'FRM-BEA-003',
  brand: 'FORME®',
  description: 'Featherlight liquid blush that melts effortlessly into bare skin or over base makeup. Long-wearing formula sets into a soft-focus blur that lasts up to 12 hours.',
  price: 799,
  originalPrice: 1049,
  category: 'Beauty',
  color: 'Terracotta Rose',
  sizes: ['8 ml'],
  tags: ['beauty', 'blush', 'liquid-blush', 'cheeks'],
  images: [
   'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 22,
  featured: false,
  bestseller: true,
  isNew: false,
  rating: 4.8,
  reviews: 48,
  createdAt: Date.now() - 86400000 * 9,
  specifications: {
   'Net Quantity': '8 ml',
   'Applicator': 'Plump doe-foot applicator',
   'Pigment': 'Ultra-concentrated, 1 dot blends across cheek',
   'Wear Time': '12 Hours Transfer-Resistant'
  }
 },
 {
  id: 'p-bt-04',
  slug: 'sculpt-laminating-brow-wax',
  name: 'Clear Sculpting Brow Laminator',
  sku: 'FRM-BEA-004',
  brand: 'FORME®',
  description: 'Flake-free styling wax that delivers the feathered look of salon brow lamination. Lifts and locks every individual brow hair in place all day without residue.',
  price: 549,
  originalPrice: 799,
  category: 'Beauty',
  sizes: ['15 g'],
  tags: ['beauty', 'brows', 'lamination', 'makeup'],
  images: [
   'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 35,
  featured: false,
  bestseller: false,
  isNew: true,
  rating: 4.7,
  reviews: 28,
  createdAt: Date.now() - 86400000 * 4,
  specifications: {
   'Net Quantity': '15 g in aluminum compact',
   'Hold Level': 'Extreme 16-Hour Lock',
   'Residue': 'Zero white flakes or stiffness'
  }
 },

 // ---- JEWELLERY (4) ----
 {
  id: 'p-jwl-01',
  slug: '18k-gold-vermeil-rope-chain',
  name: '18K Gold Vermeil 3mm Rope Chain',
  sku: 'FRM-JWL-001',
  brand: 'FORME®',
  description: 'Timeless diamond-cut twisted rope chain hand-crafted from thick 2.5-micron 18K gold over a solid 925 sterling silver core. Hypoallergenic, waterproof, and heat resistant.',
  price: 3299,
  originalPrice: 4499,
  category: 'Jewellery',
  sizes: ['18 inch / 45 cm', '20 inch / 50 cm', '22 inch / 55 cm'],
  tags: ['jewellery', 'gold', 'chain', 'vermeil', 'waterproof'],
  images: [
   'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 15,
  featured: true,
  bestseller: true,
  isNew: false,
  rating: 5.0,
  reviews: 62,
  createdAt: Date.now() - 86400000 * 14,
  careInstructions: 'Safe for showers and workouts. Wipe with provided suede polishing cloth.',
  specifications: {
   'Base Metal': 'Solid 925 Sterling Silver',
   'Plating': '2.5 Micron 18 Karat Yellow Gold Vermeil',
   'Width': '3.0 mm Diamond Cut',
   'Clasp': 'Heavy-duty lobster clasp with stamped 925 hallmark',
   'Weight': '14.8 grams'
  }
 },
 {
  id: 'p-jwl-02',
  slug: 'sterling-silver-chunky-hoops',
  name: 'Hollow Chunky Silver Hoops',
  sku: 'FRM-JWL-002',
  brand: 'FORME®',
  description: 'Classic bold tubular silhouette engineered with a hollow interior for ultra-lightweight, all-day comfort without tugging earlobes. Hand-polished to a high mirror shine.',
  price: 2199,
  originalPrice: 2899,
  category: 'Jewellery',
  sizes: ['20 mm (Mini)', '28 mm (Statement)'],
  tags: ['jewellery', 'earrings', 'hoops', 'sterling-silver'],
  images: [
   'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 18,
  featured: false,
  bestseller: true,
  isNew: false,
  rating: 4.9,
  reviews: 47,
  createdAt: Date.now() - 86400000 * 11,
  specifications: {
   'Material': 'Recycled 925 Sterling Silver',
   'Coating': 'Anti-tarnish rhodium plating',
   'Diameter': '28 mm Outer Diameter, 5 mm Tube Thickness',
   'Weight': '4.2 grams per hoop (ultra lightweight)'
  }
 },
 {
  id: 'p-jwl-03',
  slug: 'baroque-pearl-pendant-necklace',
  name: 'Natural Baroque Pearl Pendant',
  sku: 'FRM-JWL-003',
  brand: 'FORME®',
  description: 'Suspended from a delicate paperclip chain, each natural AAA-grade freshwater baroque pearl is selected by hand for its organic irregular contours and iridescent rainbow lustre.',
  price: 2699,
  originalPrice: 3499,
  category: 'Jewellery',
  sizes: ['16-18 in Adjustable'],
  tags: ['jewellery', 'pearls', 'necklace', 'gold', 'baroque'],
  images: [
   'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 11,
  featured: true,
  bestseller: false,
  isNew: true,
  rating: 4.8,
  reviews: 31,
  createdAt: Date.now() - 86400000 * 6,
  specifications: {
   'Pearl Type': '100% Genuine Natural Freshwater Baroque Pearl (~14-16mm)',
   'Chain Material': '18K Gold Plated over 925 Sterling Silver',
   'Chain Length': '16" with 2" extension loop'
  }
 },
 {
  id: 'p-jwl-04',
  slug: 'hammered-sterling-signet-ring',
  name: 'Hammered Texture Signet Ring',
  sku: 'FRM-JWL-004',
  brand: 'FORME®',
  description: 'Solid 925 silver signet with a tactile, artisanal hand-hammered table surface. Comfort-fit interior band with substantial presence on the hand.',
  price: 2499,
  originalPrice: 3199,
  category: 'Jewellery',
  sizes: ['US 7 (17.3 mm)', 'US 8 (18.1 mm)', 'US 9 (18.9 mm)', 'US 10 (19.8 mm)', 'US 11 (20.6 mm)'],
  tags: ['jewellery', 'ring', 'signet', 'silver', 'handmade'],
  images: [
   'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 10,
  featured: false,
  bestseller: false,
  isNew: true,
  rating: 4.9,
  reviews: 24,
  createdAt: Date.now() - 86400000 * 2,
  specifications: {
   'Material': 'Solid 925 Sterling Silver (Non-hollow)',
   'Surface': 'Hand-hammered textured table with polished shank',
   'Weight': '8.6 grams'
  }
 },

 // ---- ACCESSORIES (4) ----
 {
  id: 'p14',
  slug: 'italian-leather-card-holder',
  name: 'Minimal Italian Vachetta Cardholder',
  sku: 'FRM-ACC-001',
  brand: 'FORME®',
  description: 'Precision cut from full-grain vegetable-tanned Tuscan leather. Features 4 card slots, a central folded banknote compartment, and hand-painted burnished edges that develop a rich patina.',
  price: 1399,
  originalPrice: 1899,
  category: 'Accessories',
  color: 'Cognac Brown',
  sizes: ['One Size'],
  tags: ['accessories', 'leather', 'wallet', 'minimal'],
  images: [
   'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 28,
  featured: true,
  bestseller: true,
  isNew: false,
  rating: 4.9,
  reviews: 79,
  createdAt: Date.now() - 86400000 * 25,
  specifications: {
   'Material': '100% Full-Grain Vegetable-Tanned Italian Vachetta',
   'Dimensions': '10.2 cm × 7.3 cm × 0.4 cm',
   'Capacity': '6-8 cards plus folded cash',
   'Weight': '32 grams'
  }
 },
 {
  id: 'p-acc-02',
  slug: 'heavyweight-canvas-studio-tote',
  name: 'Heavy 16 oz Canvas Studio Tote',
  sku: 'FRM-ACC-002',
  brand: 'FORME®',
  description: 'Engineered for daily hauls. Crafted from waterproof 16 oz cotton duck canvas with dual shoulder straps, a reinforced bottom gusset, an interior key leash, and a padded 16" laptop sleeve.',
  price: 1699,
  originalPrice: 2299,
  category: 'Accessories',
  color: 'Ecru / Natural',
  sizes: ['One Size'],
  tags: ['accessories', 'tote', 'canvas', 'bag'],
  images: [
   'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 19,
  featured: false,
  bestseller: true,
  isNew: false,
  rating: 4.8,
  reviews: 63,
  createdAt: Date.now() - 86400000 * 16,
  specifications: {
   'Fabric': '100% Unbleached Heavy 16 oz Cotton Canvas',
   'Dimensions': '42 cm High × 38 cm Wide × 14 cm Deep',
   'Laptop Compartment': 'Fits up to 16" MacBook Pro',
   'Strap Drop': '28 cm (fits comfortably over coats)'
  }
 },
 {
  id: 'p-acc-03',
  slug: 'bauhaus-sapphire-quartz-watch',
  name: 'Bauhaus 38mm Sapphire Quartz Watch',
  sku: 'FRM-ACC-003',
  brand: 'FORME®',
  description: 'A tribute to reductive German watch design. Features a surgical-grade 316L stainless steel case, anti-reflective sapphire crystal glass, Japanese Miyota movement, and an interchangeable quick-release strap.',
  price: 4999,
  originalPrice: 6999,
  category: 'Accessories',
  color: 'Brushed Steel / Black Dial',
  sizes: ['38 mm Case'],
  tags: ['accessories', 'watch', 'minimal', 'sapphire', 'timepiece'],
  images: [
   'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 7,
  featured: true,
  bestseller: false,
  isNew: true,
  rating: 5.0,
  reviews: 41,
  createdAt: Date.now() - 86400000 * 7,
  specifications: {
   'Movement': 'Japanese Miyota 1L45 Quartz Caliber',
   'Glass': 'Scratch-Resistant Sapphire Crystal with AR Coating',
   'Case Size': '38 mm Diameter × 7.5 mm Slim Profile',
   'Water Resistance': '5 ATM / 50 Meters'
  }
 },
 {
  id: 'p-acc-04',
  slug: 'handcrafted-acetate-sunglasses',
  name: 'Square Italian Acetate Sunglasses',
  sku: 'FRM-ACC-004',
  brand: 'FORME®',
  description: 'Handcrafted from premium Mazzucchelli cellulose acetate with five-barrel German hinges. Features category 3 polarized lenses providing 100% UVA/UVB protection.',
  price: 2799,
  originalPrice: 3799,
  category: 'Accessories',
  color: 'Tortoise Havana',
  sizes: ['49-21-145 (Universal)'],
  tags: ['accessories', 'sunglasses', 'acetate', 'eyewear'],
  images: [
   'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 12,
  featured: false,
  bestseller: false,
  isNew: true,
  rating: 4.8,
  reviews: 29,
  createdAt: Date.now() - 86400000 * 3,
  specifications: {
   'Frame': 'Mazzucchelli 1849 Cellulose Acetate',
   'Lenses': 'Polarized CR-39 Optical Lenses (UV400)',
   'Hardware': 'Reinforced 5-barrel barrel rivets'
  }
 },

 // ---- HOME & LIFESTYLE (4) ----
 {
  id: 'p-hom-01',
  slug: 'soy-wax-candle',
  name: 'Amber Glass Soy Wax Candle (45h)',
  sku: 'FRM-HOM-001',
  brand: 'FORME®',
  description: 'Hand-poured in small batches using 100% natural soy wax and lead-free cotton wicks. Features an evocative olfactory blend of wild fig, smoked cedarwood, and sea salt.',
  price: 999,
  originalPrice: 1299,
  category: 'Home & Lifestyle',
  sizes: ['220 g / 45-Hour Burn'],
  tags: ['home', 'candle', 'soy-wax', 'fragrance', 'lifestyle'],
  images: [
   'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 32,
  featured: true,
  bestseller: true,
  isNew: false,
  rating: 4.9,
  reviews: 77,
  createdAt: Date.now() - 86400000 * 22,
  careInstructions: 'Trim wick to 1/4" before lighting each time. Allow wax to melt to the edge on first burn.',
  specifications: {
   'Wax Type': '100% Clean-Burning Golden Soy Wax (Non-GMO)',
   'Burn Time': '45 - 50 Hours',
   'Vessel': 'Reusable UV-filtering apothecary amber glass jar with bakelite lid',
   'Weight': '220 g / 7.8 oz Net Weight'
  }
 },
 {
  id: 'p-hom-02',
  slug: 'stoneware-ceramic-mug-set',
  name: 'Hand-Thrown Stoneware Ceramic Mugs (Set of 2)',
  sku: 'FRM-HOM-002',
  brand: 'FORME®',
  description: 'Individually wheel-thrown from coarse iron-rich clay. Finished with a matte reactive oatmeal glaze that reveals warm speckles through the rim.',
  price: 1599,
  originalPrice: 2199,
  category: 'Home & Lifestyle',
  sizes: ['Set of 2 (350 ml each)'],
  tags: ['home', 'ceramic', 'mug', 'coffee', 'stoneware'],
  images: [
   'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 14,
  featured: false,
  bestseller: true,
  isNew: false,
  rating: 5.0,
  reviews: 43,
  createdAt: Date.now() - 86400000 * 13,
  specifications: {
   'Material': 'High-Fired Stoneware Clay (1240°C)',
   'Glaze': 'Food-safe, Lead-free reactive feldspathic matte glaze',
   'Capacity': '350 ml / 12 oz',
   'Care': 'Dishwasher and microwave safe'
  }
 },
 {
  id: 'p-hom-03',
  slug: 'waffle-weave-linen-throw-blanket',
  name: 'Waffle Weave Linen Throw Blanket',
  sku: 'FRM-HOM-003',
  brand: 'FORME®',
  description: 'Oversized 140 × 200 cm throw woven from a blend of natural washed flax linen and combed long-staple cotton in an airy honeycombed three-dimensional waffle weave.',
  price: 3499,
  originalPrice: 4799,
  category: 'Home & Lifestyle',
  color: 'Warm Sand',
  sizes: ['140 × 200 cm'],
  tags: ['home', 'throw', 'linen', 'blanket', 'waffle'],
  images: [
   'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 10,
  featured: false,
  bestseller: false,
  isNew: true,
  rating: 4.8,
  reviews: 32,
  createdAt: Date.now() - 86400000 * 5,
  specifications: {
   'Fabric Composition': '55% French Flax Linen, 45% Turkish Cotton',
   'Dimensions': '140 cm × 200 cm (55" × 79")',
   'Weight': '850 grams'
  }
 },
 {
  id: 'p-hom-04',
  slug: 'minimalist-matte-ceramic-bud-vase',
  name: 'Sculptural Matte Ceramic Bud Vase',
  sku: 'FRM-HOM-004',
  brand: 'FORME®',
  description: 'A striking geometric vessel that doubles as an architectural art piece. Designed with an unglazed chalk-matte exterior and a glazed waterproof interior.',
  price: 1299,
  originalPrice: 1799,
  category: 'Home & Lifestyle',
  sizes: ['Height 18 cm'],
  tags: ['home', 'vase', 'ceramic', 'decor', 'minimalist'],
  images: [
   'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80'
  ],
  stock: 16,
  featured: false,
  bestseller: false,
  isNew: true,
  rating: 4.7,
  reviews: 19,
  createdAt: Date.now() - 86400000 * 1,
  specifications: {
   'Material': 'Slip-cast white terracotta',
   'Dimensions': '18 cm H × 11 cm W (Mouth Opening: 2.5 cm)',
   'Interior': 'Waterproof interior glaze for fresh or dried florals'
  }
 }
,
  // ---- FOOTWEAR (4) ----
  {
   id: 'p-ftw-01',
   slug: 'monolith-minimalist-calfskin-sneaker',
   name: 'Monolith Minimalist Calfskin Sneaker',
   sku: 'FRM-FTW-001',
   brand: 'FORME®',
   description: 'Handmade in small workshops with butter-soft full-grain Italian nappa calfskin. Features reinforced Margom-style vulcanized rubber cup soles, removable memory foam footbeds, and full calf leather lining for unmatched breathable comfort.',
   price: 4899,
   originalPrice: 6499,
   category: 'Footwear',
   color: 'Chalk White',
   sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
   sizeChart: FOOTWEAR_CHART,
   tags: ['footwear', 'sneakers', 'leather', 'minimalist', 'shoes'],
   images: [
   'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80'
  ],
   stock: 22,
   featured: true,
   bestseller: true,
   isNew: true,
   rating: 5.0,
   reviews: 38,
   createdAt: Date.now() - 86400000 * 2,
   careInstructions: 'Wipe with damp cloth. Condition leather with neutral leather cream every 3 months.',
   specifications: {
    'Upper Material': '100% Full-grain Italian Nappa Calfskin',
    'Sole': 'Vulcanized Italian rubber cupsole (side-stitched)',
    'Lining': 'Natural vegetable-tanned vachetta calfskin',
    'Insole': 'Ergonomic high-density memory foam with arch support'
   }
  },
  {
   id: 'p-ftw-02',
   slug: 'raw-suede-belgian-penny-loafer',
   name: 'Raw Suede Belgian Penny Loafer',
   sku: 'FRM-FTW-002',
   brand: 'FORME®',
   description: 'An unstructured silhouette defined by relaxed elegance. Constructed from water-repellent oiled calf suede with a hand-stitched apron, stacked leather heel with injected rubber traction, and unlined quarters for glove-like softness.',
   price: 5299,
   originalPrice: 6999,
   category: 'Footwear',
   color: 'Tuscan Snuff Suede',
   sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
   sizeChart: FOOTWEAR_CHART,
   tags: ['footwear', 'loafers', 'suede', 'shoes', 'formal'],
   images: [
   'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1000&q=80'
  ],
   stock: 15,
   featured: false,
   bestseller: true,
   isNew: false,
   rating: 4.9,
   reviews: 27,
   createdAt: Date.now() - 86400000 * 9,
   careInstructions: 'Brush with soft brass suede brush. Treat with waterproof suede protector spray.',
   specifications: {
    'Upper': 'Water-resistant split calf suede (1.8 mm)',
    'Sole': 'Hand-stained oak bark leather sole with rubber island tap',
    'Lining': 'Unlined forefoot with calfskin heel grip',
    'Construction': 'Flexible Blake stitch construction'
   }
  },
  {
   id: 'p-ftw-03',
   slug: 'architectural-padded-leather-slide',
   name: 'Architectural Padded Leather Slide',
   sku: 'FRM-FTW-003',
   brand: 'FORME®',
   description: 'Sculptural loungewear minimalism. Built with an oversized pillow-padded lambskin strap, anatomically contoured cork footbed wrapped in smooth nappa, and lightweight EVA ripple outsole.',
   price: 2999,
   originalPrice: 3999,
   category: 'Footwear',
   color: 'Matte Pitch Black',
   sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
   sizeChart: FOOTWEAR_CHART,
   tags: ['footwear', 'slides', 'leather', 'sandals', 'minimalist'],
   images: [
   'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=80'
  ],
   stock: 18,
   featured: false,
   bestseller: false,
   isNew: true,
   rating: 4.8,
   reviews: 19,
   createdAt: Date.now() - 86400000 * 4,
   specifications: {
    'Strap': 'Foam-padded tumbled lambskin nappa leather',
    'Footbed': 'Deep ergonomic molded cork-latex footbed',
    'Outsole': 'Lightweight EVA chevron ripple tread'
   }
  },
  {
   id: 'p-ftw-04',
   slug: 'waxed-leather-commando-chelsea-boot',
   name: 'Waxed Leather Commando Chelsea Boot',
   sku: 'FRM-FTW-004',
   brand: 'FORME®',
   description: 'Rugged yet refined. Features pull-up oiled cowhide that patinas dynamically, heavy-duty ribbed elastic side gores, woven heel pulls, and Goodyear welted lugged commando soles.',
   price: 6499,
   originalPrice: 8499,
   category: 'Footwear',
   color: 'Dark Espresso',
   sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
   sizeChart: FOOTWEAR_CHART,
   tags: ['footwear', 'boots', 'chelsea', 'leather', 'winter'],
   images: [
   'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=1000&q=80'
  ],
   stock: 12,
   featured: true,
   bestseller: false,
   isNew: true,
   rating: 5.0,
   reviews: 23,
   createdAt: Date.now() - 86400000 * 6,
   careInstructions: 'Apply beeswax leather dubbin to maintain water resistance and deepen leather pull-up.',
   specifications: {
    'Upper': '2.2 mm Oiled pull-up full-grain steerhide',
    'Welt': '360° Goodyear Storm Welt (fully recraftable)',
    'Outsole': 'Heavy-duty oil-resistant commando rubber lug',
    'Shaft Height': '15 cm'
   }
  },

  // ---- FRAGRANCE (4) ----
  {
   id: 'p-frg-01',
   slug: 'santal-nomade-extrait-de-parfum',
   name: 'Santal Nomade Extrait de Parfum (50 ml)',
   sku: 'FRM-FRG-001',
   brand: 'FORME®',
   description: 'A hypnotic, smoke-laced wood extrait blended at 28% perfume oil concentration. Opens with crushed cardamom and crisp papyrus before evolving into Australian sandalwood, cedar, and warm skin amber.',
   price: 3499,
   originalPrice: 4499,
   category: 'Fragrance',
   sizes: ['50 ml / 1.7 fl oz'],
   tags: ['fragrance', 'perfume', 'sandalwood', 'luxury', 'extrait'],
   images: [
   'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80'
  ],
   stock: 26,
   featured: true,
   bestseller: true,
   isNew: true,
   rating: 4.9,
   reviews: 51,
   createdAt: Date.now() - 86400000 * 3,
   specifications: {
    'Concentration': 'Extrait de Parfum (28% Pure Oil Concentration)',
    'Top Notes': 'Green Cardamom, Violet Leaf, Crisp Egyptian Papyrus',
    'Heart Notes': 'Tuscan Orris, Virginian Cedarwood, Dry Amber',
    'Base Notes': 'Australian Sandalwood, Cashmeran, Smoked Leather',
    'Longevity': '10 - 14 Hours on skin, 24+ Hours on garments'
   }
  },
  {
   id: 'p-frg-02',
   slug: 'hinoki-bergamot-eau-de-parfum',
   name: 'Hinoki & Bergamot Eau de Parfum (100 ml)',
   sku: 'FRM-FRG-002',
   brand: 'FORME®',
   description: 'Capturing the serene damp quietude of an ancient Kyoto temple garden. Sunlit Calabrian bergamot mingles with resinous Japanese cypress, earthy vetiver roots, and a touch of white musk.',
   price: 3999,
   originalPrice: 5299,
   category: 'Fragrance',
   sizes: ['100 ml / 3.4 fl oz'],
   tags: ['fragrance', 'perfume', 'hinoki', 'fresh', 'woody'],
   images: [
   'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80'
  ],
   stock: 20,
   featured: false,
   bestseller: true,
   isNew: false,
   rating: 4.8,
   reviews: 44,
   createdAt: Date.now() - 86400000 * 12,
   specifications: {
    'Concentration': 'Eau de Parfum (20% Oil Concentration)',
    'Top Notes': 'Calabrian Bergamot, Pink Peppercorn, Yuzu Zest',
    'Heart Notes': 'Japanese Hinoki Cypress, Pine Needles, Incense',
    'Base Notes': 'Haitian Vetiver, White Amber, Oakmoss',
    'Longevity': '8 - 10 Hours'
   }
  },
  {
   id: 'p-frg-03',
   slug: 'oud-velvet-rose-solid-pocket-perfume',
   name: 'Oud & Velvet Rose Solid Pocket Perfume',
   sku: 'FRM-FRG-003',
   brand: 'FORME®',
   description: 'Alcohol-free wax formulation housed in an engraved solid raw brass slider case. Melts at skin temperature to release deep Damask rose, warm nutmeg, rich smoky agarwood, and praline.',
   price: 1199,
   originalPrice: 1599,
   category: 'Fragrance',
   sizes: ['15 g Brass Slider Compact'],
   tags: ['fragrance', 'solid perfume', 'pocket', 'rose', 'oud'],
   images: [
   'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=1000&q=80'
  ],
   stock: 35,
   featured: false,
   bestseller: false,
   isNew: true,
   rating: 4.7,
   reviews: 18,
   createdAt: Date.now() - 86400000 * 5,
   specifications: {
    'Base Ingredients': 'Organic Jojoba Oil, Candelilla Wax, Coconut Oil, Vitamin E',
    'Olfactory Family': 'Oriental Floral Woody (Damask Rose, Agarwood, Amber)',
    'Packaging': 'Heavy solid raw brass sliding case (TSA-friendly)',
    'Application': 'Rub onto pulse points, neck and wrists'
   }
  },
  {
   id: 'p-frg-04',
   slug: 'kyoto-fog-room-mist-diffuser-set',
   name: 'Kyoto Fog Ceramic Diffuser & Room Mist Set',
   sku: 'FRM-FRG-004',
   brand: 'FORME®',
   description: 'Transform living spaces with architectural scent. Includes a porous raw basalt scent stone dish and a 200 ml fine-mist amber glass flacon scented with eucalyptus, damp moss, cedar, and tea leaves.',
   price: 2199,
   originalPrice: 2899,
   category: 'Fragrance',
   sizes: ['200 ml Mist + Basalt Dish'],
   tags: ['fragrance', 'room spray', 'home', 'diffuser', 'aromatherapy'],
   images: [
   'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1000&q=80'
  ],
   stock: 14,
   featured: false,
   bestseller: false,
   isNew: true,
   rating: 4.9,
   reviews: 21,
   createdAt: Date.now() - 86400000 * 7,
   specifications: {
    'Volume': '200 ml / 6.8 fl oz',
    'Included Vessel': 'Carved volcanic basalt stone diffuser dish',
    'Scent Profile': 'Wild Bamboo, Wet River Stones, Green Tea, Cedarwood',
    'Formula': 'Non-toxic bio-based sugarcane alcohol and pure botanical oils'
   }
  },

  // ---- EYEWEAR (4) ----
  {
   id: 'p-eye-01',
   slug: 'beveled-architectural-acetate-sunglasses',
   name: 'Beveled Architectural Acetate Sunglasses',
   sku: 'FRM-EYE-001',
   brand: 'FORME®',
   description: 'Bold, chiseled lines with 8mm cured Japanese acetate stock. Features hand-chamfered brow lines, custom wire-core temples with art deco knurling, and Category 3 anti-reflective polarized green-tinted lenses.',
   price: 3199,
   originalPrice: 4299,
   category: 'Eyewear',
   color: 'Smoked Obsidian Black',
   sizes: ['49-22-145 (Universal)'],
   tags: ['eyewear', 'sunglasses', 'acetate', 'polarized', 'fashion'],
   images: [
   'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1000&q=80'
  ],
   stock: 16,
   featured: true,
   bestseller: true,
   isNew: true,
   rating: 4.9,
   reviews: 33,
   createdAt: Date.now() - 86400000 * 4,
   specifications: {
    'Frame Material': '8mm CNC-milled Mazzucchelli cellulose acetate',
    'Lens': 'Category 3 Polarized CR-39 UV400 with rear anti-reflective coat',
    'Hinges': 'Custom 7-barrel riveted German alloy hinges',
    'Dimensions': 'Lens 49 mm · Bridge 22 mm · Temple 145 mm'
   }
  },
  {
   id: 'p-eye-02',
   slug: 'japanese-beta-titanium-round-optical',
   name: 'Japanese Beta-Titanium Round Optical',
   sku: 'FRM-EYE-002',
   brand: 'FORME®',
   description: 'Featherweight elegance weighing just 12 grams. Crafted from ultra-flexible aerospace beta-titanium with filigree coin-edge rim engraving, hypoallergenic silicone nose pads, and zero-distortion blue-light blocking lenses.',
   price: 3899,
   originalPrice: 5199,
   category: 'Eyewear',
   color: 'Raw Brushed Antique Gold',
   sizes: ['47-21-140 (Universal)'],
   tags: ['eyewear', 'optical', 'glasses', 'titanium', 'blue-light'],
   images: [
   'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1000&q=80'
  ],
   stock: 11,
   featured: false,
   bestseller: false,
   isNew: true,
   rating: 5.0,
   reviews: 26,
   createdAt: Date.now() - 86400000 * 8,
   specifications: {
    'Frame': '100% Japanese Beta-Titanium (Flexible, Shape-Memory)',
    'Weight': '12.4 grams total weight',
    'Lenses': 'Zero-power anti-reflective blue-light filter lenses (prescription ready)',
    'Nose Pads': 'Surgical-grade medical silicone pads'
   }
  },
  {
   id: 'p-eye-03',
   slug: 'sculptural-cat-eye-geometric-sunframe',
   name: 'Sculptural Cat-Eye Geometric Sunframe',
   sku: 'FRM-EYE-003',
   brand: 'FORME®',
   description: 'A modern architectural reimagining of the 1960s cat-eye. Distinct sharp angles meet soft hand-polished curves, fitted with warm gradient bronze lenses that flatter all skin undertones.',
   price: 2999,
   originalPrice: 3999,
   category: 'Eyewear',
   color: 'Champagne Crystal Acetate',
   sizes: ['51-19-142'],
   tags: ['eyewear', 'sunglasses', 'cat-eye', 'champagne', 'summer'],
   images: [
   'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=80'
  ],
   stock: 15,
   featured: false,
   bestseller: false,
   isNew: true,
   rating: 4.8,
   reviews: 17,
   createdAt: Date.now() - 86400000 * 5,
   specifications: {
    'Frame': 'Hand-polished transparent Mazzucchelli champagne acetate',
    'Lenses': 'Warm gradient bronze UV400 Cat 3',
    'Hardware': 'Teflon-coated 5-barrel hinge assembly',
    'Fit': 'Medium/Narrow'
   }
  },
  {
   id: 'p-eye-04',
   slug: 'minimalist-aviator-dual-bridge-sunframe',
   name: 'Minimalist Aviator Dual-Bridge Sunframe',
   sku: 'FRM-EYE-004',
   brand: 'FORME®',
   description: 'Re-engineered teardrop aviator with linear architectural lines. Features a laser-welded flat brow bar, acetate temple tips, and optical-grade amber lenses.',
   price: 3499,
   originalPrice: 4699,
   category: 'Eyewear',
   color: 'Gunmetal / Amber Tint',
   sizes: ['54-18-145'],
   tags: ['eyewear', 'aviator', 'sunglasses', 'metal', 'unisex'],
   images: [
   'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1000&q=80'
  ],
   stock: 19,
   featured: false,
   bestseller: true,
   isNew: false,
   rating: 4.7,
   reviews: 31,
   createdAt: Date.now() - 86400000 * 15,
   specifications: {
    'Frame': 'Corrosion-resistant monel alloy with surgical steel temples',
    'Lenses': 'Shatter-resistant optical nylon with 100% UV400 protection',
    'Bridge': 'Double bridge with laser-engraved cross pattern'
   }
  },

  // ---- WELLNESS (4) ----
  {
   id: 'p-wln-01',
   slug: 'ceremonial-uji-matcha-whisk-bowl-set',
   name: 'Ceremonial Uji Matcha Whisk & Bowl Ritual Set',
   sku: 'FRM-WLN-001',
   brand: 'FORME®',
   description: 'Elevate your morning stillness. Includes a hand-thrown speckled ceramic chawan (matcha bowl) with pouring spout, 100-tine white bamboo chasen whisk, ceramic whisk holder, and curved bamboo chashaku scoop.',
   price: 2699,
   originalPrice: 3499,
   category: 'Wellness',
   sizes: ['4-Piece Ritual Kit'],
   tags: ['wellness', 'matcha', 'tea', 'ceramic', 'ritual'],
   images: [
   'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80'
  ],
   stock: 25,
   featured: true,
   bestseller: true,
   isNew: true,
   rating: 4.9,
   reviews: 42,
   createdAt: Date.now() - 86400000 * 2,
   careInstructions: 'Rinse bamboo whisk under warm water; never use soap. Air-dry on the included ceramic keeper.',
   specifications: {
    'Chawan Bowl': 'High-fired ironstone ceramic (450 ml capacity with pouring spout)',
    'Chasen Whisk': 'Hand-split single piece 100-tine organic bamboo',
    'Accessories': 'Matching ceramic whisk stand + hand-carved bamboo scoop',
    'Origin': 'Handcrafted tradition inspired by Uji, Kyoto'
   }
  },
  {
   id: 'p-wln-02',
   slug: 'organic-22-momme-mulberry-silk-sleep-mask',
   name: 'Organic 22 Momme Mulberry Silk Sleep Mask',
   sku: 'FRM-WLN-002',
   brand: 'FORME®',
   description: 'Designed for uninterrupted restorative sleep. Cut from ultra-dense Grade 6A 22 Momme long-fibre mulberry silk on both sides with pure silk floss filling. Gentle on delicate eye contour skin and eliminates friction wrinkles.',
   price: 1499,
   originalPrice: 1999,
   category: 'Wellness',
   color: 'Oatmeal Pearl',
   sizes: ['One Size (Adjustable)'],
   tags: ['wellness', 'silk', 'sleep', 'mask', 'beauty'],
   images: [
   'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1000&q=80'
  ],
   stock: 30,
   featured: false,
   bestseller: true,
   isNew: false,
   rating: 5.0,
   reviews: 67,
   createdAt: Date.now() - 86400000 * 18,
   careInstructions: 'Hand wash cold using delicate silk detergent. Lay flat to dry out of direct sunlight.',
   specifications: {
    'Fabric': '100% Grade 6A Pure Mulberry Silk (22 Momme)',
    'Filling': '100% Multi-layer breathable pure silk floss',
    'Band': 'Elasticated silk-covered ruched strap (pressure-free)',
    'Dimensions': '21 cm × 10 cm'
   }
  },
  {
   id: 'p-wln-03',
   slug: 'dead-sea-mineral-magnesium-recovery-bath-soak',
   name: 'Dead Sea Mineral & Magnesium Recovery Bath Soak (500g)',
   sku: 'FRM-WLN-003',
   brand: 'FORME®',
   description: 'Therapeutic recovery formulated to melt muscular tension and restore trace minerals. Blends raw Dead Sea magnesium flakes, coarse French grey sea salt, colloidal oatmeal, and wild French lavender essential oil.',
   price: 1299,
   originalPrice: 1699,
   category: 'Wellness',
   sizes: ['500 g Apothecary Jar'],
   tags: ['wellness', 'bath', 'soak', 'magnesium', 'recovery'],
   images: [
   'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80'
  ],
   stock: 28,
   featured: false,
   bestseller: false,
   isNew: true,
   rating: 4.8,
   reviews: 29,
   createdAt: Date.now() - 86400000 * 7,
   specifications: {
    'Net Weight': '500 g / 17.6 oz (approx. 5–7 baths)',
    'Active Minerals': 'Dead Sea Magnesium Chloride, Epsom Salt, French Grey Celtic Salt',
    'Botanicals': 'Colloidal Oat Flour, Organic French Lavender Oil, Roman Chamomile',
    'Packaging': 'Reusable apothecary glass jar with airtight seal'
   }
  },
  {
   id: 'p-wln-04',
   slug: 'ionized-copper-bristle-dry-body-brush',
   name: 'Ionized Copper Bristle Dry Body Brush',
   sku: 'FRM-WLN-004',
   brand: 'FORME®',
   description: 'An Ayurvedic and Nordic ritual brush made with solid FSC-certified oiled beechwood, extra-fine ionized copper wire bristles, and ethically sourced natural boar bristles to accelerate lymphatic drainage and skin exfoliation.',
   price: 1399,
   originalPrice: 1899,
   category: 'Wellness',
   sizes: ['Palm Size (13.5 cm)'],
   tags: ['wellness', 'brush', 'lymphatic', 'body', 'exfoliation'],
   images: [
   'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=80'
  ],
   stock: 22,
   featured: false,
   bestseller: false,
   isNew: true,
   rating: 4.8,
   reviews: 35,
   createdAt: Date.now() - 86400000 * 3,
   careInstructions: 'Tap bristles gently after use. Clean with dry cloth or lightly mist with alcohol. Do not soak wood.',
   specifications: {
    'Wood': '100% FSC-Certified European Oiled Beechwood',
    'Bristles': 'Fine ionized copper wire core with surrounding natural Tampico plant fibre',
    'Strap': 'Heavy woven raw cotton hand strap with brass rivets',
    'Benefits': 'Stimulates blood flow, drains lymph nodes, neutralizes surface static'
   }
  },

  // ---- EXPANDED HERO ESSENTIALS (4) ----
  {
   id: 'p-clo-07',
   slug: 'pure-mulberry-silk-bias-cut-slip-dress',
   name: 'Pure Mulberry Silk Bias Cut Slip Dress',
   sku: 'FRM-CLO-007',
   brand: 'FORME®',
   description: 'A fluid, liquid drape engineered on the true bias. Cut from 19 Momme sand-washed mulberry silk with delicate French seams, adjustable micro-straps, and a soft cowl neckline that gently hugs curves.',
   price: 5999,
   originalPrice: 7999,
   category: 'Clothing',
   color: 'Midnight Espresso',
   sizes: ['XS', 'S', 'M', 'L'],
   sizeChart: STANDARD_TOP_CHART,
   tags: ['clothing', 'silk', 'dress', 'slip', 'evening'],
   images: [
   'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80'
  ],
   stock: 9,
   featured: true,
   bestseller: false,
   isNew: true,
   rating: 5.0,
   reviews: 14,
   createdAt: Date.now() - 86400000 * 1,
   modelInfo: 'Model is 5\'9" (175 cm) with 33" bust wearing size S',
   careInstructions: 'Dry clean or hand wash cold with silk detergent. Iron inside out on low heat.',
   specifications: {
    'Fabric Composition': '100% Grade 6A Sand-Washed Mulberry Silk (19 Momme)',
    'Construction': 'True 45-degree diagonal bias grain for natural stretch',
    'Seams': 'Luxury enclosed French seams',
    'Length': 'Midi length (118 cm from shoulder apex)'
   }
  },
  {
   id: 'p-acc-05',
   slug: 'mongolian-cashmere-ribbed-beanie',
   name: '100% Mongolian Cashmere Ribbed Beanie',
   sku: 'FRM-ACC-005',
   brand: 'FORME®',
   description: 'Cloud-soft warmth without weight. Knitted from 4-ply Grade-A Mongolian cashmere yarns with a classic 2x2 ribbed structure and an adjustable folded cuff.',
   price: 2499,
   originalPrice: 3299,
   category: 'Accessories',
   color: 'Heather Oatmeal',
   sizes: ['One Size (Unisex)'],
   tags: ['accessories', 'cashmere', 'beanie', 'winter', 'wool'],
   images: [
   'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=1000&q=80'
  ],
   stock: 24,
   featured: false,
   bestseller: true,
   isNew: true,
   rating: 4.9,
   reviews: 36,
   createdAt: Date.now() - 86400000 * 5,
   careInstructions: 'Hand wash cold with wool wash. Press gently between towels, dry flat.',
   specifications: {
    'Fiber': '100% Pure Grade A Mongolian Cashmere (15.2 micron)',
    'Yarn Ply': '4-ply worsted spun yarn for long-term pilling resistance',
    'Structure': 'Full cardigan 2x2 rib knit',
    'Weight': '75 grams'
   }
  },
  {
   id: 'p-skn-06',
   slug: 'camellia-golden-jojoba-cleansing-oil',
   name: 'Camellia & Golden Jojoba Cleansing Oil (150 ml)',
   sku: 'FRM-SKN-005',
   brand: 'FORME®',
   description: 'A decadent melt-away cleansing oil that effortlessly dissolves waterproof makeup, sunscreen, and daily pollutants without stripping the moisture barrier. Emulsifies instantly on contact with warm water.',
   price: 1399,
   originalPrice: 1799,
   category: 'Skincare',
   sizes: ['150 ml / 5.1 fl oz'],
   tags: ['skincare', 'cleanser', 'oil', 'camellia', 'clean'],
   images: [
   'https://images.unsplash.com/photo-1608248597359-5633b47f4fc2?auto=format&fit=crop&w=1000&q=80'
  ],
   stock: 31,
   featured: false,
   bestseller: true,
   isNew: true,
   rating: 4.9,
   reviews: 48,
   createdAt: Date.now() - 86400000 * 8,
   specifications: {
    'Net Quantity': '150 ml / 5.1 fl oz',
    'Key Actives': 'Cold-Pressed Japanese Camellia Seed Oil, Golden Jojoba, Vitamin E Tocopherol',
    'Skin Type': 'All skin types, including sensitive and acne-prone (non-comedogenic)',
    'Rinse': '100% water-soluble micro-emulsifying formula'
   }
  },
  {
   id: 'p-jwl-05',
   slug: 'ribbed-sculptural-cuff-bracelet',
   name: 'Ribbed Sculptural Cuff Bracelet',
   sku: 'FRM-JWL-005',
   brand: 'FORME®',
   description: 'An architectural wrist statement featuring fluid fluted ribbing inspired by classical Roman pillars. Cast in recycled sterling silver and electroplated with 3.0 microns of radiant 18K yellow gold.',
   price: 3199,
   originalPrice: 4299,
   category: 'Jewellery',
   color: '18K Gold Vermeil',
   sizes: ['Adjustable Malleable Fit'],
   tags: ['jewellery', 'cuff', 'bracelet', 'gold', 'sculptural'],
   images: [
   'https://images.unsplash.com/photo-1611591475152-473549298492?auto=format&fit=crop&w=1000&q=80'
  ],
   stock: 14,
   featured: true,
   bestseller: false,
   isNew: true,
   rating: 5.0,
   reviews: 21,
   createdAt: Date.now() - 86400000 * 3,
   specifications: {
    'Material': '18K Yellow Gold Vermeil (3.0 microns plating over 925 Sterling Silver)',
    'Band Width': '18 mm fluted architectural band',
    'Weight': '16.5 grams solid weight',
    'Sizing': 'Malleable open-cuff structure adjusts to wrists 14 cm to 19 cm'
   }
  }
]

export const SAMPLE_REVIEWS = [
 { name: 'Aanya Sharma', text: 'The heavyweight tee exceeded my expectations. You can instantly feel the 240 GSM density, and it washed with zero collar shrinkage.', rating: 5 },
 { name: 'Rohan Mehta', text: 'Cleanest D2C brand in India right now. Packaging was plastic-free, delivery took 3 days to Mumbai, and the cardholder leather smells fantastic.', rating: 5 },
 { name: 'Dr. Ishita Kapoor', text: 'The 15% Vitamin C serum is cosmetically elegant. Doesn’t pill under sunscreen and the barrier cream saved my dry skin.', rating: 5 },
 { name: 'Kabir V.', text: 'The 500 GSM boxy hoodie has the exact oversized drape I have been hunting for. Worth every rupee.', rating: 5 }
]
