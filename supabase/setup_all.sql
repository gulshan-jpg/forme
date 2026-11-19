-- =========================================================================
-- FORME® E-COMMERCE MASTER ALL-IN-ONE SUPABASE DATABASE SETUP
-- Everything included: Schema, Tables, RLS Policies, Functions, Storage,
-- Brand Settings, Categories, Coupons, Products, Images, Variants & Demo Orders.
-- Safe to re-run multiple times (idempotent).
-- =========================================================================

-- 1. BASE SCHEMA & TABLES
create table if not exists brands(
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  is_demo boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists profiles(
  id uuid primary key references auth.users(id) on delete cascade,
  brand_id uuid not null references brands(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin','staff')),
  full_name text
);

create table if not exists store_settings(
  brand_id uuid primary key references brands(id) on delete cascade,
  tagline text,
  logo_url text,
  accent text default '#d9cdbd',
  whatsapp text,
  email text,
  instagram text,
  announcement text,
  hero_title text,
  hero_sub text
);

create table if not exists categories(
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  name text not null,
  slug text not null,
  unique(brand_id,slug)
);

create table if not exists products(
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  slug text not null,
  name text not null,
  description text,
  price_inr integer not null check (price_inr>=0),
  original_price_inr integer not null check (original_price_inr>=0),
  stock integer not null default 0 check (stock>=0),
  tags text[] default '{}',
  featured boolean default false,
  bestseller boolean default false,
  is_new boolean default false,
  rating numeric(2,1) default 5,
  review_count integer default 0,
  created_at timestamptz default now(),
  unique(brand_id,slug)
);

create table if not exists product_images(
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  position int default 0
);

create table if not exists product_variants(
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  label text not null,
  stock integer default 0 check (stock>=0)
);

create table if not exists customers(
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  unique(brand_id,email),
  unique(brand_id,user_id)
);

create table if not exists orders(
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  customer_id uuid references customers(id) on delete set null,
  order_code text not null,
  status text not null default 'Placed' check (status in ('Placed','Packed','Shipped','Delivered','Cancelled')),
  subtotal integer not null,
  discount integer not null default 0,
  shipping integer not null default 0,
  total integer not null,
  payment_note text,
  is_demo boolean not null default true,
  ship_address jsonb not null,
  created_at timestamptz default now(),
  unique(brand_id,order_code)
);

create table if not exists order_items(
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  name text not null,
  variant text,
  qty integer not null check (qty>0),
  price_inr integer not null
);

create table if not exists wishlists(
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  unique(customer_id,product_id)
);

create table if not exists reviews(
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  author text not null,
  rating int not null check (rating between 1 and 5),
  body text,
  is_demo boolean default false,
  created_at timestamptz default now()
);

create table if not exists coupons(
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  code text not null,
  kind text not null check (kind in ('pct','flat')),
  value integer not null check (value>0),
  active boolean default true,
  min_order_value integer,
  max_discount integer,
  expiry_date timestamptz,
  free_shipping boolean default false,
  first_order_only boolean default false,
  unique(brand_id,code)
);

alter table coupons add column if not exists min_order_value integer;
alter table coupons add column if not exists max_discount integer;
alter table coupons add column if not exists expiry_date timestamptz;
alter table coupons add column if not exists free_shipping boolean default false;
alter table coupons add column if not exists first_order_only boolean default false;

-- Base indexes
create index if not exists idx_products_cat on products(brand_id,category_id);
create index if not exists idx_products_created on products(brand_id,created_at desc);
create index if not exists idx_orders_created on orders(brand_id,created_at desc);
create index if not exists idx_order_items_order on order_items(order_id);
create index if not exists idx_product_images_prod on product_images(product_id);
create index if not exists idx_reviews_prod on reviews(product_id);
create index if not exists idx_customers_brand on customers(brand_id);

-- Grants for Supabase API roles
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all routines in schema public to anon, authenticated, service_role;

alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant all on routines to anon, authenticated, service_role;



-- 2. SHOPIFY UPGRADE TABLES (Addresses, Shipments, Returns, Refunds, Inventory Logs, Abandoned Carts, Loyalty)
create table if not exists customer_addresses (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  label text default 'Home' check (label in ('Home', 'Office', 'Other')),
  name text not null,
  phone text not null,
  address text not null,
  apartment text,
  city text not null,
  state text not null,
  pin text not null,
  is_default boolean default false,
  created_at timestamptz default now()
);

create table if not exists shipments (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  order_id uuid not null references orders(id) on delete cascade,
  courier_partner text not null default 'BlueDart',
  awb_code text,
  tracking_number text,
  tracking_url text,
  label_url text,
  shipped_at timestamptz,
  estimated_delivery timestamptz,
  delivered_at timestamptz,
  status text not null default 'Pending' check (status in ('Pending', 'Manifested', 'In_Transit', 'Out_For_Delivery', 'Delivered', 'RTO', 'Failed')),
  notes text,
  created_at timestamptz default now()
);

create table if not exists order_returns (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  order_id uuid not null references orders(id) on delete cascade,
  customer_id uuid references customers(id) on delete set null,
  type text not null default 'return' check (type in ('cancellation', 'return', 'exchange')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'inspected', 'completed')),
  reason text not null,
  details text,
  exchange_variant text,
  rejection_reason text,
  requested_at timestamptz default now(),
  resolved_at timestamptz,
  admin_notes text
);

create table if not exists refunds (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  order_id uuid not null references orders(id) on delete cascade,
  return_id uuid references order_returns(id) on delete set null,
  amount integer not null check (amount > 0),
  gateway text not null default 'razorpay' check (gateway in ('razorpay', 'cod_transfer', 'store_credit')),
  gateway_refund_id text,
  gateway_payment_id text,
  status text not null default 'pending' check (status in ('pending', 'processed', 'failed')),
  reason text,
  processed_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists inventory_logs (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  variant_id uuid references product_variants(id) on delete set null,
  previous_stock integer not null,
  new_stock integer not null,
  change_amount integer not null,
  reason text not null check (reason in ('order_placed', 'order_cancelled', 'return_restock', 'manual_adjustment', 'restock_shipment', 'damaged_writeoff')),
  reference_id text,
  created_at timestamptz default now()
);

create table if not exists abandoned_carts (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  customer_email text,
  customer_phone text,
  customer_name text,
  items jsonb not null default '[]'::jsonb,
  cart_total integer not null default 0,
  recovered boolean default false,
  recovery_email_sent boolean default false,
  last_active_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists loyalty_accounts (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  referral_code text unique,
  points_balance integer default 0 check (points_balance >= 0),
  total_earned integer default 0,
  created_at timestamptz default now(),
  unique(brand_id, customer_id)
);

-- Upgrade indexes
create index if not exists ifs_customer_addrs on customer_addresses(customer_id);
create index if not exists ifs_shipments_order on shipments(order_id);
create index if not exists ifs_returns_order on order_returns(order_id);
create index if not exists ifs_refunds_order on refunds(order_id);
create index if not exists ifs_inv_product on inventory_logs(product_id, created_at desc);
create index if not exists ifs_abandoned_email on abandoned_carts(customer_email);


-- 3. ROW LEVEL SECURITY (RLS) & POLICIES
create or replace function my_brand() returns uuid language sql stable security definer set search_path=public as $$
  select brand_id from profiles where id=auth.uid()
$$;

do $$ declare t text; begin
 foreach t in array array['brands','profiles','store_settings','categories','products','product_images','product_variants','customers','orders','order_items','wishlists','reviews','coupons','customer_addresses','shipments','order_returns','refunds','inventory_logs','abandoned_carts','loyalty_accounts'] loop
  execute format('alter table %I enable row level security', t);
 end loop;
end $$;

-- Public storefront reads (catalogue data)
drop policy if exists pub_brands on brands;
create policy pub_brands on brands for select using (true);

drop policy if exists pub_settings on store_settings;
create policy pub_settings on store_settings for select using (true);

drop policy if exists pub_categories on categories;
create policy pub_categories on categories for select using (true);

drop policy if exists pub_products on products;
create policy pub_products on products for select using (true);

drop policy if exists pub_images on product_images;
create policy pub_images on product_images for select using (true);

drop policy if exists pub_variants on product_variants;
create policy pub_variants on product_variants for select using (true);

drop policy if exists pub_reviews on reviews;
create policy pub_reviews on reviews for select using (true);

drop policy if exists pub_coupons on coupons;
create policy pub_coupons on coupons for select using (true);

-- Public order tracking and placement
drop policy if exists pub_orders_select on orders;
create policy pub_orders_select on orders for select using (true);

drop policy if exists pub_order_items_select on order_items;
create policy pub_order_items_select on order_items for select using (true);

drop policy if exists pub_orders_insert on orders;
create policy pub_orders_insert on orders for insert with check (true);

drop policy if exists pub_order_items_insert on order_items;
create policy pub_order_items_insert on order_items for insert with check (true);

-- User-specific policies
drop policy if exists own_profile on profiles;
create policy own_profile on profiles for select using (id=auth.uid());

drop policy if exists admin_brand on brands;
create policy admin_brand on brands for update using (id=my_brand()) with check (id=my_brand());

drop policy if exists shopper_review on reviews;
create policy shopper_review on reviews for insert with check (is_demo=false and rating between 1 and 5 and length(author)>1);

drop policy if exists own_customer on customers;
create policy own_customer on customers for select using (user_id=auth.uid());

drop policy if exists own_orders on orders;
create policy own_orders on orders for select using (customer_id in (select id from customers where user_id=auth.uid()));

drop policy if exists own_items on order_items;
create policy own_items on order_items for select using (order_id in (select id from orders where customer_id in (select id from customers where user_id=auth.uid())));

drop policy if exists own_wishlist on wishlists;
create policy own_wishlist on wishlists for all
  using (customer_id in (select id from customers where user_id=auth.uid()))
  with check (customer_id in (select id from customers where user_id=auth.uid()) and brand_id=(select brand_id from customers where id=customer_id));

-- Admin management across all tenant tables
do $$ declare t text; begin
 foreach t in array array['store_settings','categories','products','product_images','product_variants','customers','orders','order_items','wishlists','reviews','coupons','customer_addresses','shipments','order_returns','refunds','inventory_logs','abandoned_carts','loyalty_accounts'] loop
  execute format('drop policy if exists admin_all on %I', t);
  execute format('create policy admin_all on %I for all using (brand_id=my_brand()) with check (brand_id=my_brand())', t);
 end loop;
end $$;

-- Shopify upgrade customer policies
drop policy if exists cust_own_addrs on customer_addresses;
create policy cust_own_addrs on customer_addresses for all
  using (customer_id in (select id from customers where user_id=auth.uid()))
  with check (customer_id in (select id from customers where user_id=auth.uid()));

drop policy if exists cust_own_returns on order_returns;
create policy cust_own_returns on order_returns for all
  using (customer_id in (select id from customers where user_id=auth.uid()))
  with check (customer_id in (select id from customers where user_id=auth.uid()));

drop policy if exists cust_read_shipments on shipments;
create policy cust_read_shipments on shipments for select
  using (order_id in (select id from orders where customer_id in (select id from customers where user_id=auth.uid())));


-- 4. PROCEDURES, FUNCTIONS & TRIGGERS
create or replace function place_order(
  p_brand uuid,
  p_code text,
  p_coupon text,
  p_ship jsonb,
  p_items jsonb,
  p_payment text,
  p_customer uuid default null
)
returns jsonb language plpgsql security definer set search_path=public as $$
declare
  it jsonb;
  prod products%rowtype;
  c coupons%rowtype;
  sub int:=0;
  disc int:=0;
  ship int:=0;
  oid uuid:=gen_random_uuid();
  cust uuid;
  q int;
  raw_pid text;
  line_price int;
  line_name text;
begin
  if p_items is null or jsonb_array_length(p_items)=0 then
    raise exception 'Your cart is empty';
  end if;

  if p_customer is not null then
    select id into cust from customers where id=p_customer and user_id=auth.uid() and brand_id=p_brand;
  end if;

  insert into orders(id,brand_id,customer_id,order_code,subtotal,total,ship_address,payment_note,is_demo)
    values (oid,p_brand,cust,p_code,0,0,p_ship,p_payment,coalesce((select is_demo from brands where id=p_brand),true));

  for it in select * from jsonb_array_elements(p_items) loop
    q := coalesce((it->>'qty')::int, 1);
    raw_pid := it->>'product_id';
    line_name := coalesce(it->>'name', 'Item');
    line_price := coalesce((it->>'price_inr')::int, (it->>'price')::int, 999);

    -- Safe lookup: check if raw_pid matches a valid UUID pattern
    prod := null;
    if raw_pid ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
      select * into prod from products where id = raw_pid::uuid and brand_id = p_brand for update;
    else
      -- fallback search by slug
      select * into prod from products where (slug = raw_pid or id::text = raw_pid) and brand_id = p_brand limit 1;
    end if;

    if prod.id is not null then
      update products set stock = greatest(0, stock - q) where id = prod.id;
      insert into order_items(brand_id, order_id, product_id, name, variant, qty, price_inr)
        values (p_brand, oid, prod.id, prod.name, it->>'variant', q, prod.price_inr);
      sub := sub + prod.price_inr * q;
    else
      -- Demo or custom item fallback: product_id is null
      insert into order_items(brand_id, order_id, product_id, name, variant, qty, price_inr)
        values (p_brand, oid, null, line_name, it->>'variant', q, line_price);
      sub := sub + line_price * q;
    end if;
  end loop;

  if p_coupon is not null then
    select * into c from coupons where brand_id=p_brand and upper(code)=upper(p_coupon) and active;
    if found then
      disc := least(sub, case c.kind when 'pct' then round(sub*c.value/100.0)::int else c.value end);
    end if;
  end if;

  ship := case when sub-disc>=1999 then 0 else 99 end;
  update orders set subtotal=sub, discount=disc, shipping=ship, total=sub-disc+ship where id=oid;
  return jsonb_build_object('id',oid, 'order_code',p_code, 'subtotal',sub, 'discount',disc, 'shipping',ship, 'total',sub-disc+ship);
end $$;

create or replace function validate_coupon(p_brand uuid, p_code text)
returns jsonb language sql stable security definer set search_path=public as $$
  select jsonb_build_object('code',code,'kind',kind,'value',value)
  from coupons
  where brand_id=p_brand and upper(code)=upper(p_code) and active
  limit 1
$$;

create or replace function ensure_customer(p_brand uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare
  u auth.users%rowtype;
  c customers%rowtype;
begin
  select * into u from auth.users where id=auth.uid();
  if not found then return null; end if;
  insert into customers(brand_id,user_id,name,email,phone)
    values (p_brand,u.id,coalesce(u.raw_user_meta_data->>'name',split_part(u.email,'@',1)),u.email,u.raw_user_meta_data->>'phone')
    on conflict (brand_id,email) do update set user_id=coalesce(customers.user_id,excluded.user_id)
    returning * into c;
  return jsonb_build_object('id',c.id,'name',c.name,'email',c.email,'phone',coalesce(c.phone,''));
end $$;

create or replace function refresh_rating()
returns trigger language plpgsql security definer set search_path=public as $$
declare
  pid uuid:=coalesce(new.product_id,old.product_id);
begin
  update products
  set rating=coalesce((select round(avg(rating)::numeric,1) from reviews where product_id=pid),5),
      review_count=(select count(*) from reviews where product_id=pid)
  where id=pid;
  return null;
end $$;

drop trigger if exists reviews_rating on reviews;
create trigger reviews_rating
  after insert or delete on reviews
  for each row execute function refresh_rating();

-- Storage setup (safe wrapper)
do $$
begin
  insert into storage.buckets(id,name,public) values ('product-images','product-images',true) on conflict do nothing;
exception when others then null;
end $$;

do $$
begin
  drop policy if exists "product images public read" on storage.objects;
  create policy "product images public read" on storage.objects for select using (bucket_id='product-images');
exception when others then null;
end $$;

do $$
begin
  drop policy if exists "product images brand write" on storage.objects;
  create policy "product images brand write" on storage.objects for all
    using (bucket_id='product-images' and (storage.foldername(name))[1]=my_brand()::text)
    with check (bucket_id='product-images' and (storage.foldername(name))[1]=my_brand()::text);
exception when others then null;
end $$;


-- 5. INITIAL SEED (BRAND, SETTINGS, CATEGORIES, COUPONS)
insert into brands(slug,name,is_demo)
values ('forme','FORME®',true)
on conflict (slug) do update set is_demo=true;

insert into store_settings(brand_id,tagline,whatsapp,email,announcement)
select id,'Everything worth discovering.','91XXXXXXXXXX','hello@forme.example','Free shipping above ₹1,999 · Demo store'
from brands where slug='forme'
on conflict do nothing;

insert into categories(brand_id,name,slug)
select b.id,c,lower(c)
from brands b, unnest(array['Fashion','Skincare','Jewellery','Accessories','Home']) c
where b.slug='forme'
on conflict do nothing;

insert into coupons(brand_id,code,kind,value)
select id,'FORME10','pct',10 from brands where slug='forme'
on conflict do nothing;

insert into coupons(brand_id,code,kind,value)
select id,'WELCOME200','flat',200 from brands where slug='forme'
on conflict do nothing;

insert into coupons(brand_id,code,kind,value,free_shipping)
select id,'FREESHIP','flat',99,true from brands where slug='forme'
on conflict do nothing;


-- 6. DEMO PRODUCTS, IMAGES, VARIANTS, REVIEWS & SAMPLE ORDERS

-- Generated by scripts/gen-seed.ts (npm run seed:sql). Resets the DEMO brand catalogue and sample orders; safe to re-run.
delete from products where brand_id=(select id from brands where slug='forme') and exists(select 1 from brands where id=(select id from brands where slug='forme') and is_demo);
delete from orders where brand_id=(select id from brands where slug='forme') and order_code like 'FRM-DEMO%';
insert into products(brand_id,category_id,slug,name,description,price_inr,original_price_inr,stock,tags,featured,bestseller,is_new,rating,review_count) values ((select id from brands where slug='forme'),(select id from categories where brand_id=(select id from brands where slug='forme') and name='Fashion'),'boxy-heavyweight-tee','Boxy Heavyweight Tee','240 GSM combed cotton with a dropped shoulder and a clean, structured drape.',1499,1999,20,array['fashion']::text[],true,true,false,4.7,21) on conflict (brand_id,slug) do nothing;
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='boxy-heavyweight-tee'),'https://picsum.photos/seed/boxy-heavyweight-tee-0/800/1000',0);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='boxy-heavyweight-tee'),'https://picsum.photos/seed/boxy-heavyweight-tee-1/800/1000',1);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='boxy-heavyweight-tee'),'https://picsum.photos/seed/boxy-heavyweight-tee-2/800/1000',2);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='boxy-heavyweight-tee'),'XS',20);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='boxy-heavyweight-tee'),'S',20);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='boxy-heavyweight-tee'),'M',20);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='boxy-heavyweight-tee'),'L',20);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='boxy-heavyweight-tee'),'XL',20);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='boxy-heavyweight-tee'),'Aanya S.',5,'The quality is far beyond what I expected. Packaging felt premium too.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='boxy-heavyweight-tee'),'Rohan M.',5,'Fit is perfect and the fabric holds up after multiple washes.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='boxy-heavyweight-tee'),'Ishita K.',4,'Delivery was quick and support answered on WhatsApp within minutes.',true);
insert into products(brand_id,category_id,slug,name,description,price_inr,original_price_inr,stock,tags,featured,bestseller,is_new,rating,review_count) values ((select id from brands where slug='forme'),(select id from categories where brand_id=(select id from brands where slug='forme') and name='Fashion'),'pleated-wide-trousers','Pleated Wide Trousers','Relaxed pleated trousers in a fluid viscose blend. Tailored waist, easy movement.',2799,3499,20,array['fashion']::text[],true,false,true,4.4,30) on conflict (brand_id,slug) do nothing;
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='pleated-wide-trousers'),'https://picsum.photos/seed/pleated-wide-trousers-0/800/1000',0);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='pleated-wide-trousers'),'https://picsum.photos/seed/pleated-wide-trousers-1/800/1000',1);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='pleated-wide-trousers'),'https://picsum.photos/seed/pleated-wide-trousers-2/800/1000',2);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='pleated-wide-trousers'),'28',20);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='pleated-wide-trousers'),'30',20);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='pleated-wide-trousers'),'32',20);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='pleated-wide-trousers'),'34',20);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='pleated-wide-trousers'),'36',20);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='pleated-wide-trousers'),'Aanya S.',5,'The quality is far beyond what I expected. Packaging felt premium too.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='pleated-wide-trousers'),'Rohan M.',5,'Fit is perfect and the fabric holds up after multiple washes.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='pleated-wide-trousers'),'Ishita K.',4,'Delivery was quick and support answered on WhatsApp within minutes.',true);
insert into products(brand_id,category_id,slug,name,description,price_inr,original_price_inr,stock,tags,featured,bestseller,is_new,rating,review_count) values ((select id from brands where slug='forme'),(select id from categories where brand_id=(select id from brands where slug='forme') and name='Fashion'),'linen-overshirt','Linen Overshirt','Breathable stone-washed linen overshirt, built to layer through every season.',2499,3299,20,array['fashion']::text[],false,false,true,4.1,39) on conflict (brand_id,slug) do nothing;
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='linen-overshirt'),'https://picsum.photos/seed/linen-overshirt-0/800/1000',0);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='linen-overshirt'),'https://picsum.photos/seed/linen-overshirt-1/800/1000',1);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='linen-overshirt'),'https://picsum.photos/seed/linen-overshirt-2/800/1000',2);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='linen-overshirt'),'XS',20);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='linen-overshirt'),'S',20);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='linen-overshirt'),'M',20);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='linen-overshirt'),'L',20);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='linen-overshirt'),'XL',20);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='linen-overshirt'),'Aanya S.',5,'The quality is far beyond what I expected. Packaging felt premium too.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='linen-overshirt'),'Rohan M.',5,'Fit is perfect and the fabric holds up after multiple washes.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='linen-overshirt'),'Ishita K.',4,'Delivery was quick and support answered on WhatsApp within minutes.',true);
insert into products(brand_id,category_id,slug,name,description,price_inr,original_price_inr,stock,tags,featured,bestseller,is_new,rating,review_count) values ((select id from brands where slug='forme'),(select id from categories where brand_id=(select id from brands where slug='forme') and name='Fashion'),'essential-zip-hoodie','Essential Zip Hoodie','Brushed-back fleece, YKK zip, and a boxy fit that holds its shape wash after wash.',2299,2999,3,array['fashion']::text[],false,true,false,4.8,48) on conflict (brand_id,slug) do nothing;
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='essential-zip-hoodie'),'https://picsum.photos/seed/essential-zip-hoodie-0/800/1000',0);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='essential-zip-hoodie'),'https://picsum.photos/seed/essential-zip-hoodie-1/800/1000',1);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='essential-zip-hoodie'),'https://picsum.photos/seed/essential-zip-hoodie-2/800/1000',2);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='essential-zip-hoodie'),'XS',3);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='essential-zip-hoodie'),'S',3);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='essential-zip-hoodie'),'M',3);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='essential-zip-hoodie'),'L',3);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='essential-zip-hoodie'),'XL',3);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='essential-zip-hoodie'),'Aanya S.',5,'The quality is far beyond what I expected. Packaging felt premium too.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='essential-zip-hoodie'),'Rohan M.',5,'Fit is perfect and the fabric holds up after multiple washes.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='essential-zip-hoodie'),'Ishita K.',4,'Delivery was quick and support answered on WhatsApp within minutes.',true);
insert into products(brand_id,category_id,slug,name,description,price_inr,original_price_inr,stock,tags,featured,bestseller,is_new,rating,review_count) values ((select id from brands where slug='forme'),(select id from categories where brand_id=(select id from brands where slug='forme') and name='Fashion'),'utility-cargo-jacket','Utility Cargo Jacket','Water-resistant cotton twill with four pockets and a quiet matte finish.',3999,5499,20,array['fashion']::text[],false,false,true,4.5,57) on conflict (brand_id,slug) do nothing;
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='utility-cargo-jacket'),'https://picsum.photos/seed/utility-cargo-jacket-0/800/1000',0);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='utility-cargo-jacket'),'https://picsum.photos/seed/utility-cargo-jacket-1/800/1000',1);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='utility-cargo-jacket'),'https://picsum.photos/seed/utility-cargo-jacket-2/800/1000',2);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='utility-cargo-jacket'),'XS',20);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='utility-cargo-jacket'),'S',20);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='utility-cargo-jacket'),'M',20);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='utility-cargo-jacket'),'L',20);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='utility-cargo-jacket'),'XL',20);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='utility-cargo-jacket'),'Aanya S.',5,'The quality is far beyond what I expected. Packaging felt premium too.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='utility-cargo-jacket'),'Rohan M.',5,'Fit is perfect and the fabric holds up after multiple washes.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='utility-cargo-jacket'),'Ishita K.',4,'Delivery was quick and support answered on WhatsApp within minutes.',true);
insert into products(brand_id,category_id,slug,name,description,price_inr,original_price_inr,stock,tags,featured,bestseller,is_new,rating,review_count) values ((select id from brands where slug='forme'),(select id from categories where brand_id=(select id from brands where slug='forme') and name='Skincare'),'vitamin-c-brightening-serum','Vitamin C Brightening Serum','A stable 10% vitamin C serum for visibly even, radiant skin. 30 ml.',899,1199,20,array['skincare']::text[],true,true,false,4.2,66) on conflict (brand_id,slug) do nothing;
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='vitamin-c-brightening-serum'),'https://picsum.photos/seed/vitamin-c-brightening-serum-0/800/1000',0);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='vitamin-c-brightening-serum'),'https://picsum.photos/seed/vitamin-c-brightening-serum-1/800/1000',1);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='vitamin-c-brightening-serum'),'https://picsum.photos/seed/vitamin-c-brightening-serum-2/800/1000',2);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='vitamin-c-brightening-serum'),'30 ml',20);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='vitamin-c-brightening-serum'),'Aanya S.',5,'The quality is far beyond what I expected. Packaging felt premium too.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='vitamin-c-brightening-serum'),'Rohan M.',5,'Fit is perfect and the fabric holds up after multiple washes.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='vitamin-c-brightening-serum'),'Ishita K.',4,'Delivery was quick and support answered on WhatsApp within minutes.',true);
insert into products(brand_id,category_id,slug,name,description,price_inr,original_price_inr,stock,tags,featured,bestseller,is_new,rating,review_count) values ((select id from brands where slug='forme'),(select id from categories where brand_id=(select id from brands where slug='forme') and name='Skincare'),'ceramide-barrier-moisturiser','Ceramide Barrier Moisturiser','Lightweight daily cream with ceramides and niacinamide to support the skin barrier. 50 g.',799,999,20,array['skincare']::text[],false,true,false,4.9,75) on conflict (brand_id,slug) do nothing;
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='ceramide-barrier-moisturiser'),'https://picsum.photos/seed/ceramide-barrier-moisturiser-0/800/1000',0);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='ceramide-barrier-moisturiser'),'https://picsum.photos/seed/ceramide-barrier-moisturiser-1/800/1000',1);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='ceramide-barrier-moisturiser'),'https://picsum.photos/seed/ceramide-barrier-moisturiser-2/800/1000',2);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='ceramide-barrier-moisturiser'),'50 g',20);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='ceramide-barrier-moisturiser'),'Aanya S.',5,'The quality is far beyond what I expected. Packaging felt premium too.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='ceramide-barrier-moisturiser'),'Rohan M.',5,'Fit is perfect and the fabric holds up after multiple washes.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='ceramide-barrier-moisturiser'),'Ishita K.',4,'Delivery was quick and support answered on WhatsApp within minutes.',true);
insert into products(brand_id,category_id,slug,name,description,price_inr,original_price_inr,stock,tags,featured,bestseller,is_new,rating,review_count) values ((select id from brands where slug='forme'),(select id from categories where brand_id=(select id from brands where slug='forme') and name='Skincare'),'mineral-spf-50-fluid','Mineral SPF 50 Fluid','Sheer, non-greasy broad-spectrum sunscreen with no white cast. 50 ml.',699,899,20,array['skincare']::text[],false,false,true,4.6,84) on conflict (brand_id,slug) do nothing;
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='mineral-spf-50-fluid'),'https://picsum.photos/seed/mineral-spf-50-fluid-0/800/1000',0);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='mineral-spf-50-fluid'),'https://picsum.photos/seed/mineral-spf-50-fluid-1/800/1000',1);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='mineral-spf-50-fluid'),'https://picsum.photos/seed/mineral-spf-50-fluid-2/800/1000',2);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='mineral-spf-50-fluid'),'50 ml',20);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='mineral-spf-50-fluid'),'Aanya S.',5,'The quality is far beyond what I expected. Packaging felt premium too.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='mineral-spf-50-fluid'),'Rohan M.',5,'Fit is perfect and the fabric holds up after multiple washes.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='mineral-spf-50-fluid'),'Ishita K.',4,'Delivery was quick and support answered on WhatsApp within minutes.',true);
insert into products(brand_id,category_id,slug,name,description,price_inr,original_price_inr,stock,tags,featured,bestseller,is_new,rating,review_count) values ((select id from brands where slug='forme'),(select id from categories where brand_id=(select id from brands where slug='forme') and name='Skincare'),'gentle-gel-cleanser','Gentle Gel Cleanser','A low-foam cleanser that removes the day without stripping. 100 ml.',499,649,0,array['skincare']::text[],false,false,false,4.3,93) on conflict (brand_id,slug) do nothing;
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='gentle-gel-cleanser'),'https://picsum.photos/seed/gentle-gel-cleanser-0/800/1000',0);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='gentle-gel-cleanser'),'https://picsum.photos/seed/gentle-gel-cleanser-1/800/1000',1);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='gentle-gel-cleanser'),'https://picsum.photos/seed/gentle-gel-cleanser-2/800/1000',2);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='gentle-gel-cleanser'),'100 ml',0);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='gentle-gel-cleanser'),'Aanya S.',5,'The quality is far beyond what I expected. Packaging felt premium too.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='gentle-gel-cleanser'),'Rohan M.',5,'Fit is perfect and the fabric holds up after multiple washes.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='gentle-gel-cleanser'),'Ishita K.',4,'Delivery was quick and support answered on WhatsApp within minutes.',true);
insert into products(brand_id,category_id,slug,name,description,price_inr,original_price_inr,stock,tags,featured,bestseller,is_new,rating,review_count) values ((select id from brands where slug='forme'),(select id from categories where brand_id=(select id from brands where slug='forme') and name='Jewellery'),'sterling-silver-hoops','Sterling Silver Hoops','Hand-polished 925 sterling silver hoops with an anti-tarnish finish.',1899,2499,20,array['jewellery']::text[],true,true,false,4,102) on conflict (brand_id,slug) do nothing;
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='sterling-silver-hoops'),'https://picsum.photos/seed/sterling-silver-hoops-0/800/1000',0);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='sterling-silver-hoops'),'https://picsum.photos/seed/sterling-silver-hoops-1/800/1000',1);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='sterling-silver-hoops'),'https://picsum.photos/seed/sterling-silver-hoops-2/800/1000',2);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='sterling-silver-hoops'),'Small',20);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='sterling-silver-hoops'),'Medium',20);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='sterling-silver-hoops'),'Aanya S.',5,'The quality is far beyond what I expected. Packaging felt premium too.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='sterling-silver-hoops'),'Rohan M.',5,'Fit is perfect and the fabric holds up after multiple washes.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='sterling-silver-hoops'),'Ishita K.',4,'Delivery was quick and support answered on WhatsApp within minutes.',true);
insert into products(brand_id,category_id,slug,name,description,price_inr,original_price_inr,stock,tags,featured,bestseller,is_new,rating,review_count) values ((select id from brands where slug='forme'),(select id from categories where brand_id=(select id from brands where slug='forme') and name='Jewellery'),'layered-chain-necklace','Layered Chain Necklace','Two delicate 18k gold-plated chains designed to sit together or apart.',2199,2899,20,array['jewellery']::text[],false,false,true,4.7,111) on conflict (brand_id,slug) do nothing;
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='layered-chain-necklace'),'https://picsum.photos/seed/layered-chain-necklace-0/800/1000',0);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='layered-chain-necklace'),'https://picsum.photos/seed/layered-chain-necklace-1/800/1000',1);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='layered-chain-necklace'),'https://picsum.photos/seed/layered-chain-necklace-2/800/1000',2);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='layered-chain-necklace'),'16 in',20);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='layered-chain-necklace'),'18 in',20);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='layered-chain-necklace'),'Aanya S.',5,'The quality is far beyond what I expected. Packaging felt premium too.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='layered-chain-necklace'),'Rohan M.',5,'Fit is perfect and the fabric holds up after multiple washes.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='layered-chain-necklace'),'Ishita K.',4,'Delivery was quick and support answered on WhatsApp within minutes.',true);
insert into products(brand_id,category_id,slug,name,description,price_inr,original_price_inr,stock,tags,featured,bestseller,is_new,rating,review_count) values ((select id from brands where slug='forme'),(select id from categories where brand_id=(select id from brands where slug='forme') and name='Jewellery'),'freshwater-pearl-studs','Freshwater Pearl Studs','Real freshwater pearls set in hypoallergenic sterling silver.',1599,2099,20,array['jewellery']::text[],false,false,false,4.4,120) on conflict (brand_id,slug) do nothing;
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='freshwater-pearl-studs'),'https://picsum.photos/seed/freshwater-pearl-studs-0/800/1000',0);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='freshwater-pearl-studs'),'https://picsum.photos/seed/freshwater-pearl-studs-1/800/1000',1);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='freshwater-pearl-studs'),'https://picsum.photos/seed/freshwater-pearl-studs-2/800/1000',2);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='freshwater-pearl-studs'),'One size',20);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='freshwater-pearl-studs'),'Aanya S.',5,'The quality is far beyond what I expected. Packaging felt premium too.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='freshwater-pearl-studs'),'Rohan M.',5,'Fit is perfect and the fabric holds up after multiple washes.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='freshwater-pearl-studs'),'Ishita K.',4,'Delivery was quick and support answered on WhatsApp within minutes.',true);
insert into products(brand_id,category_id,slug,name,description,price_inr,original_price_inr,stock,tags,featured,bestseller,is_new,rating,review_count) values ((select id from brands where slug='forme'),(select id from categories where brand_id=(select id from brands where slug='forme') and name='Jewellery'),'engraved-signet-ring','Engraved Signet Ring','A weighty signet in 925 silver, available for personal engraving.',2499,3199,5,array['jewellery']::text[],false,false,false,4.1,129) on conflict (brand_id,slug) do nothing;
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='engraved-signet-ring'),'https://picsum.photos/seed/engraved-signet-ring-0/800/1000',0);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='engraved-signet-ring'),'https://picsum.photos/seed/engraved-signet-ring-1/800/1000',1);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='engraved-signet-ring'),'https://picsum.photos/seed/engraved-signet-ring-2/800/1000',2);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='engraved-signet-ring'),'6',5);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='engraved-signet-ring'),'7',5);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='engraved-signet-ring'),'8',5);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='engraved-signet-ring'),'9',5);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='engraved-signet-ring'),'Aanya S.',5,'The quality is far beyond what I expected. Packaging felt premium too.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='engraved-signet-ring'),'Rohan M.',5,'Fit is perfect and the fabric holds up after multiple washes.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='engraved-signet-ring'),'Ishita K.',4,'Delivery was quick and support answered on WhatsApp within minutes.',true);
insert into products(brand_id,category_id,slug,name,description,price_inr,original_price_inr,stock,tags,featured,bestseller,is_new,rating,review_count) values ((select id from brands where slug='forme'),(select id from categories where brand_id=(select id from brands where slug='forme') and name='Accessories'),'leather-card-holder','Leather Card Holder','Full-grain vegetable-tanned leather that ages beautifully. Holds six cards.',1299,1799,20,array['accessories']::text[],false,true,false,4.8,138) on conflict (brand_id,slug) do nothing;
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='leather-card-holder'),'https://picsum.photos/seed/leather-card-holder-0/800/1000',0);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='leather-card-holder'),'https://picsum.photos/seed/leather-card-holder-1/800/1000',1);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='leather-card-holder'),'https://picsum.photos/seed/leather-card-holder-2/800/1000',2);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='leather-card-holder'),'One size',20);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='leather-card-holder'),'Aanya S.',5,'The quality is far beyond what I expected. Packaging felt premium too.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='leather-card-holder'),'Rohan M.',5,'Fit is perfect and the fabric holds up after multiple washes.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='leather-card-holder'),'Ishita K.',4,'Delivery was quick and support answered on WhatsApp within minutes.',true);
insert into products(brand_id,category_id,slug,name,description,price_inr,original_price_inr,stock,tags,featured,bestseller,is_new,rating,review_count) values ((select id from brands where slug='forme'),(select id from categories where brand_id=(select id from brands where slug='forme') and name='Accessories'),'everyday-canvas-tote','Everyday Canvas Tote','Heavy 14 oz canvas with an inner zip pocket and reinforced handles.',1199,1599,20,array['accessories']::text[],true,false,false,4.5,147) on conflict (brand_id,slug) do nothing;
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='everyday-canvas-tote'),'https://picsum.photos/seed/everyday-canvas-tote-0/800/1000',0);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='everyday-canvas-tote'),'https://picsum.photos/seed/everyday-canvas-tote-1/800/1000',1);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='everyday-canvas-tote'),'https://picsum.photos/seed/everyday-canvas-tote-2/800/1000',2);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='everyday-canvas-tote'),'One size',20);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='everyday-canvas-tote'),'Aanya S.',5,'The quality is far beyond what I expected. Packaging felt premium too.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='everyday-canvas-tote'),'Rohan M.',5,'Fit is perfect and the fabric holds up after multiple washes.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='everyday-canvas-tote'),'Ishita K.',4,'Delivery was quick and support answered on WhatsApp within minutes.',true);
insert into products(brand_id,category_id,slug,name,description,price_inr,original_price_inr,stock,tags,featured,bestseller,is_new,rating,review_count) values ((select id from brands where slug='forme'),(select id from categories where brand_id=(select id from brands where slug='forme') and name='Accessories'),'minimal-quartz-watch','Minimal Quartz Watch','36 mm brushed steel case, sapphire-coated glass, and a Japanese quartz movement.',3499,4999,20,array['accessories']::text[],false,false,true,4.2,156) on conflict (brand_id,slug) do nothing;
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='minimal-quartz-watch'),'https://picsum.photos/seed/minimal-quartz-watch-0/800/1000',0);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='minimal-quartz-watch'),'https://picsum.photos/seed/minimal-quartz-watch-1/800/1000',1);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='minimal-quartz-watch'),'https://picsum.photos/seed/minimal-quartz-watch-2/800/1000',2);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='minimal-quartz-watch'),'One size',20);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='minimal-quartz-watch'),'Aanya S.',5,'The quality is far beyond what I expected. Packaging felt premium too.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='minimal-quartz-watch'),'Rohan M.',5,'Fit is perfect and the fabric holds up after multiple washes.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='minimal-quartz-watch'),'Ishita K.',4,'Delivery was quick and support answered on WhatsApp within minutes.',true);
insert into products(brand_id,category_id,slug,name,description,price_inr,original_price_inr,stock,tags,featured,bestseller,is_new,rating,review_count) values ((select id from brands where slug='forme'),(select id from categories where brand_id=(select id from brands where slug='forme') and name='Home'),'soy-wax-candle','Soy Wax Candle','Hand-poured soy wax in a reusable amber jar. Notes of fig, cedar and sea salt. 45-hour burn.',899,1199,20,array['home']::text[],true,true,false,4.9,165) on conflict (brand_id,slug) do nothing;
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='soy-wax-candle'),'https://picsum.photos/seed/soy-wax-candle-0/800/1000',0);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='soy-wax-candle'),'https://picsum.photos/seed/soy-wax-candle-1/800/1000',1);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='soy-wax-candle'),'https://picsum.photos/seed/soy-wax-candle-2/800/1000',2);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='soy-wax-candle'),'200 g',20);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='soy-wax-candle'),'Aanya S.',5,'The quality is far beyond what I expected. Packaging felt premium too.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='soy-wax-candle'),'Rohan M.',5,'Fit is perfect and the fabric holds up after multiple washes.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='soy-wax-candle'),'Ishita K.',4,'Delivery was quick and support answered on WhatsApp within minutes.',true);
insert into products(brand_id,category_id,slug,name,description,price_inr,original_price_inr,stock,tags,featured,bestseller,is_new,rating,review_count) values ((select id from brands where slug='forme'),(select id from categories where brand_id=(select id from brands where slug='forme') and name='Home'),'ceramic-mug-set-of-2','Ceramic Mug Set of 2','Wheel-thrown stoneware mugs with a matte reactive glaze. Dishwasher safe.',1399,1899,20,array['home']::text[],false,false,false,4.6,174) on conflict (brand_id,slug) do nothing;
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='ceramic-mug-set-of-2'),'https://picsum.photos/seed/ceramic-mug-set-of-2-0/800/1000',0);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='ceramic-mug-set-of-2'),'https://picsum.photos/seed/ceramic-mug-set-of-2-1/800/1000',1);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='ceramic-mug-set-of-2'),'https://picsum.photos/seed/ceramic-mug-set-of-2-2/800/1000',2);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='ceramic-mug-set-of-2'),'Set of 2',20);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='ceramic-mug-set-of-2'),'Aanya S.',5,'The quality is far beyond what I expected. Packaging felt premium too.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='ceramic-mug-set-of-2'),'Rohan M.',5,'Fit is perfect and the fabric holds up after multiple washes.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='ceramic-mug-set-of-2'),'Ishita K.',4,'Delivery was quick and support answered on WhatsApp within minutes.',true);
insert into products(brand_id,category_id,slug,name,description,price_inr,original_price_inr,stock,tags,featured,bestseller,is_new,rating,review_count) values ((select id from brands where slug='forme'),(select id from categories where brand_id=(select id from brands where slug='forme') and name='Home'),'waffle-linen-throw','Waffle Linen Throw','Oversized cotton-linen throw with a soft waffle weave and knotted fringe.',2999,3999,20,array['home']::text[],false,false,true,4.3,183) on conflict (brand_id,slug) do nothing;
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='waffle-linen-throw'),'https://picsum.photos/seed/waffle-linen-throw-0/800/1000',0);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='waffle-linen-throw'),'https://picsum.photos/seed/waffle-linen-throw-1/800/1000',1);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='waffle-linen-throw'),'https://picsum.photos/seed/waffle-linen-throw-2/800/1000',2);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='waffle-linen-throw'),'130 x 170 cm',20);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='waffle-linen-throw'),'Aanya S.',5,'The quality is far beyond what I expected. Packaging felt premium too.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='waffle-linen-throw'),'Rohan M.',5,'Fit is perfect and the fabric holds up after multiple washes.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='waffle-linen-throw'),'Ishita K.',4,'Delivery was quick and support answered on WhatsApp within minutes.',true);
insert into products(brand_id,category_id,slug,name,description,price_inr,original_price_inr,stock,tags,featured,bestseller,is_new,rating,review_count) values ((select id from brands where slug='forme'),(select id from categories where brand_id=(select id from brands where slug='forme') and name='Home'),'stoneware-bud-vase','Stoneware Bud Vase','A small hand-finished vase, ideal for single stems and dried flowers.',999,1399,8,array['home']::text[],false,false,false,4,192) on conflict (brand_id,slug) do nothing;
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='stoneware-bud-vase'),'https://picsum.photos/seed/stoneware-bud-vase-0/800/1000',0);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='stoneware-bud-vase'),'https://picsum.photos/seed/stoneware-bud-vase-1/800/1000',1);
insert into product_images(brand_id,product_id,url,position) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='stoneware-bud-vase'),'https://picsum.photos/seed/stoneware-bud-vase-2/800/1000',2);
insert into product_variants(brand_id,product_id,label,stock) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='stoneware-bud-vase'),'One size',8);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='stoneware-bud-vase'),'Aanya S.',5,'The quality is far beyond what I expected. Packaging felt premium too.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='stoneware-bud-vase'),'Rohan M.',5,'Fit is perfect and the fabric holds up after multiple washes.',true);
insert into reviews(brand_id,product_id,author,rating,body,is_demo) values ((select id from brands where slug='forme'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='stoneware-bud-vase'),'Ishita K.',4,'Delivery was quick and support answered on WhatsApp within minutes.',true);
insert into orders(brand_id,order_code,status,subtotal,discount,shipping,total,payment_note,is_demo,ship_address,created_at) values ((select id from brands where slug='forme'),'FRM-DEMO100','Delivered',1499,0,99,1598,'Demo payment (simulated)',true,'{"name":"Aanya Sharma","email":"aanya@example.com","phone":"9000000100","address":"12 Demo Street","city":"New Delhi","state":"Delhi","pin":"110001"}'::jsonb,now()-interval '0 days');
insert into order_items(brand_id,order_id,product_id,name,variant,qty,price_inr) values ((select id from brands where slug='forme'),(select id from orders where brand_id=(select id from brands where slug='forme') and order_code='FRM-DEMO100'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='boxy-heavyweight-tee'),'Boxy Heavyweight Tee','XS',1,1499);
insert into orders(brand_id,order_code,status,subtotal,discount,shipping,total,payment_note,is_demo,ship_address,created_at) values ((select id from brands where slug='forme'),'FRM-DEMO101','Shipped',4598,0,0,4598,'Demo payment (simulated)',true,'{"name":"Rohan Mehta","email":"rohan@example.com","phone":"9000000101","address":"12 Demo Street","city":"New Delhi","state":"Delhi","pin":"110001"}'::jsonb,now()-interval '1 days');
insert into order_items(brand_id,order_id,product_id,name,variant,qty,price_inr) values ((select id from brands where slug='forme'),(select id from orders where brand_id=(select id from brands where slug='forme') and order_code='FRM-DEMO101'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='essential-zip-hoodie'),'Essential Zip Hoodie','XS',2,2299);
insert into orders(brand_id,order_code,status,subtotal,discount,shipping,total,payment_note,is_demo,ship_address,created_at) values ((select id from brands where slug='forme'),'FRM-DEMO102','Packed',799,0,99,898,'Demo payment (simulated)',true,'{"name":"Ishita Kapoor","email":"ishita@example.com","phone":"9000000102","address":"12 Demo Street","city":"New Delhi","state":"Delhi","pin":"110001"}'::jsonb,now()-interval '2 days');
insert into order_items(brand_id,order_id,product_id,name,variant,qty,price_inr) values ((select id from brands where slug='forme'),(select id from orders where brand_id=(select id from brands where slug='forme') and order_code='FRM-DEMO102'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='ceramide-barrier-moisturiser'),'Ceramide Barrier Moisturiser','50 g',1,799);
insert into orders(brand_id,order_code,status,subtotal,discount,shipping,total,payment_note,is_demo,ship_address,created_at) values ((select id from brands where slug='forme'),'FRM-DEMO103','Placed',3798,0,0,3798,'Demo payment (simulated)',true,'{"name":"Kabir Singh","email":"kabir@example.com","phone":"9000000103","address":"12 Demo Street","city":"New Delhi","state":"Delhi","pin":"110001"}'::jsonb,now()-interval '3 days');
insert into order_items(brand_id,order_id,product_id,name,variant,qty,price_inr) values ((select id from brands where slug='forme'),(select id from orders where brand_id=(select id from brands where slug='forme') and order_code='FRM-DEMO103'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='sterling-silver-hoops'),'Sterling Silver Hoops','Small',2,1899);
insert into orders(brand_id,order_code,status,subtotal,discount,shipping,total,payment_note,is_demo,ship_address,created_at) values ((select id from brands where slug='forme'),'FRM-DEMO104','Delivered',2499,0,0,2499,'Demo payment (simulated)',true,'{"name":"Meera Nair","email":"meera@example.com","phone":"9000000104","address":"12 Demo Street","city":"New Delhi","state":"Delhi","pin":"110001"}'::jsonb,now()-interval '4 days');
insert into order_items(brand_id,order_id,product_id,name,variant,qty,price_inr) values ((select id from brands where slug='forme'),(select id from orders where brand_id=(select id from brands where slug='forme') and order_code='FRM-DEMO104'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='engraved-signet-ring'),'Engraved Signet Ring','6',1,2499);
insert into orders(brand_id,order_code,status,subtotal,discount,shipping,total,payment_note,is_demo,ship_address,created_at) values ((select id from brands where slug='forme'),'FRM-DEMO105','Placed',6998,0,0,6998,'Demo payment (simulated)',true,'{"name":"Vihaan Gupta","email":"vihaan@example.com","phone":"9000000105","address":"12 Demo Street","city":"New Delhi","state":"Delhi","pin":"110001"}'::jsonb,now()-interval '5 days');
insert into order_items(brand_id,order_id,product_id,name,variant,qty,price_inr) values ((select id from brands where slug='forme'),(select id from orders where brand_id=(select id from brands where slug='forme') and order_code='FRM-DEMO105'),(select id from products where brand_id=(select id from brands where slug='forme') and slug='minimal-quartz-watch'),'Minimal Quartz Watch','One size',2,3499);
