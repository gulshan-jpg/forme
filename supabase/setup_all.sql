-- =========================================================================

-- FORME® E-COMMERCE ALL-IN-ONE SUPABASE DATABASE SETUP

-- Run this entire script in Supabase Dashboard -> SQL Editor -> Run

-- =========================================================================


-- 1. BASE SCHEMA & TABLES

-- Multi-brand schema. Every tenant table carries brand_id; RLS isolates brands.
create table brands(id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null, is_demo boolean not null default false, created_at timestamptz default now());
create table profiles(id uuid primary key references auth.users(id) on delete cascade, brand_id uuid not null references brands(id) on delete cascade, role text not null default 'admin' check (role in ('admin','staff')), full_name text);
create table store_settings(brand_id uuid primary key references brands(id) on delete cascade, tagline text, logo_url text, accent text default '#d9cdbd', whatsapp text, email text, instagram text, announcement text, hero_title text, hero_sub text);
create table categories(id uuid primary key default gen_random_uuid(), brand_id uuid not null references brands(id) on delete cascade, name text not null, slug text not null, unique(brand_id,slug));
create table products(id uuid primary key default gen_random_uuid(), brand_id uuid not null references brands(id) on delete cascade, category_id uuid references categories(id) on delete set null, slug text not null, name text not null, description text, price_inr integer not null check (price_inr>=0), original_price_inr integer not null check (original_price_inr>=0), stock integer not null default 0 check (stock>=0), tags text[] default '{}', featured boolean default false, bestseller boolean default false, is_new boolean default false, rating numeric(2,1) default 5, review_count integer default 0, created_at timestamptz default now(), unique(brand_id,slug));
create table product_images(id uuid primary key default gen_random_uuid(), brand_id uuid not null references brands(id) on delete cascade, product_id uuid not null references products(id) on delete cascade, url text not null, position int default 0);
create table product_variants(id uuid primary key default gen_random_uuid(), brand_id uuid not null references brands(id) on delete cascade, product_id uuid not null references products(id) on delete cascade, label text not null, stock integer default 0 check (stock>=0));
create table customers(id uuid primary key default gen_random_uuid(), brand_id uuid not null references brands(id) on delete cascade, name text not null, email text not null, phone text, user_id uuid references auth.users(id) on delete set null, created_at timestamptz default now(), unique(brand_id,email), unique(brand_id,user_id));
create table orders(id uuid primary key default gen_random_uuid(), brand_id uuid not null references brands(id) on delete cascade, customer_id uuid references customers(id) on delete set null, order_code text not null, status text not null default 'Placed' check (status in ('Placed','Packed','Shipped','Delivered','Cancelled')), subtotal integer not null, discount integer not null default 0, shipping integer not null default 0, total integer not null, payment_note text, is_demo boolean not null default true, ship_address jsonb not null, created_at timestamptz default now(), unique(brand_id,order_code));
create table order_items(id uuid primary key default gen_random_uuid(), brand_id uuid not null references brands(id) on delete cascade, order_id uuid not null references orders(id) on delete cascade, product_id uuid references products(id) on delete set null, name text not null, variant text, qty integer not null check (qty>0), price_inr integer not null);
create table wishlists(id uuid primary key default gen_random_uuid(), brand_id uuid not null references brands(id) on delete cascade, customer_id uuid not null references customers(id) on delete cascade, product_id uuid not null references products(id) on delete cascade, unique(customer_id,product_id));
create table reviews(id uuid primary key default gen_random_uuid(), brand_id uuid not null references brands(id) on delete cascade, product_id uuid not null references products(id) on delete cascade, author text not null, rating int not null check (rating between 1 and 5), body text, is_demo boolean default false, created_at timestamptz default now());
create table coupons(id uuid primary key default gen_random_uuid(), brand_id uuid not null references brands(id) on delete cascade, code text not null, kind text not null check (kind in ('pct','flat')), value integer not null check (value>0), active boolean default true, unique(brand_id,code));
create index on products(brand_id,category_id); create index on products(brand_id,created_at desc); create index on orders(brand_id,created_at desc); create index on order_items(order_id); create index on product_images(product_id); create index on reviews(product_id); create index on customers(brand_id);

-- RLS
create or replace function my_brand() returns uuid language sql stable security definer set search_path=public as $$ select brand_id from profiles where id=auth.uid() $$;
do $$ declare t text; begin
 foreach t in array array['brands','profiles','store_settings','categories','products','product_images','product_variants','customers','orders','order_items','wishlists','reviews','coupons'] loop execute format('alter table %I enable row level security',t); end loop; end $$;
-- Public storefront reads (catalogue data only)
create policy pub_brands on brands for select using (true);
create policy pub_settings on store_settings for select using (true);
create policy pub_categories on categories for select using (true);
create policy pub_products on products for select using (true);
create policy pub_images on product_images for select using (true);
create policy pub_variants on product_variants for select using (true);
create policy pub_reviews on reviews for select using (true);
-- Brand admins manage only their own brand
create policy own_profile on profiles for select using (id=auth.uid());
do $$ declare t text; begin
 foreach t in array array['store_settings','categories','products','product_images','product_variants','customers','orders','order_items','wishlists','reviews','coupons'] loop
  execute format('create policy admin_all on %I for all using (brand_id=my_brand()) with check (brand_id=my_brand())',t); end loop; end $$;



-- 2. PROCEDURES, POLICIES & TRIGGERS

-- Server-side checkout, customer accounts, reviews, storage. Shoppers never read or write private tables directly.
create or replace function place_order(p_brand uuid, p_code text, p_coupon text, p_ship jsonb, p_items jsonb, p_payment text, p_customer uuid default null)
returns jsonb language plpgsql security definer set search_path=public as $$
declare it jsonb; prod products%rowtype; c coupons%rowtype; sub int:=0; disc int:=0; ship int:=0; oid uuid:=gen_random_uuid(); cust uuid; q int;
begin
 if p_items is null or jsonb_array_length(p_items)=0 then raise exception 'Your cart is empty'; end if;
 if p_customer is not null then select id into cust from customers where id=p_customer and user_id=auth.uid() and brand_id=p_brand; end if;
 insert into orders(id,brand_id,customer_id,order_code,subtotal,total,ship_address,payment_note,is_demo)
  values (oid,p_brand,cust,p_code,0,0,p_ship,p_payment,coalesce((select is_demo from brands where id=p_brand),true));
 for it in select * from jsonb_array_elements(p_items) loop
  q:=(it->>'qty')::int;
  select * into prod from products where id=(it->>'product_id')::uuid and brand_id=p_brand for update;
  if not found then raise exception 'A product in your cart is no longer available'; end if;
  if q<1 or prod.stock<q then raise exception 'Not enough stock for %', prod.name; end if;
  update products set stock=stock-q where id=prod.id;
  insert into order_items(brand_id,order_id,product_id,name,variant,qty,price_inr) values (p_brand,oid,prod.id,prod.name,it->>'variant',q,prod.price_inr);
  sub:=sub+prod.price_inr*q;
 end loop;
 if p_coupon is not null then
  select * into c from coupons where brand_id=p_brand and upper(code)=upper(p_coupon) and active;
  if found then disc:=least(sub, case c.kind when 'pct' then round(sub*c.value/100.0)::int else c.value end); end if;
 end if;
 ship:=case when sub-disc>=1999 then 0 else 99 end;
 update orders set subtotal=sub,discount=disc,shipping=ship,total=sub-disc+ship where id=oid;
 return jsonb_build_object('id',oid,'order_code',p_code,'subtotal',sub,'discount',disc,'shipping',ship,'total',sub-disc+ship);
end $$;

create or replace function validate_coupon(p_brand uuid, p_code text) returns jsonb language sql stable security definer set search_path=public as $$
 select jsonb_build_object('code',code,'kind',kind,'value',value) from coupons where brand_id=p_brand and upper(code)=upper(p_code) and active limit 1 $$;

create or replace function ensure_customer(p_brand uuid) returns jsonb language plpgsql security definer set search_path=public as $$
declare u auth.users%rowtype; c customers%rowtype;
begin
 select * into u from auth.users where id=auth.uid(); if not found then return null; end if;
 insert into customers(brand_id,user_id,name,email,phone)
  values (p_brand,u.id,coalesce(u.raw_user_meta_data->>'name',split_part(u.email,'@',1)),u.email,u.raw_user_meta_data->>'phone')
  on conflict (brand_id,email) do update set user_id=coalesce(customers.user_id,excluded.user_id) returning * into c;
 return jsonb_build_object('id',c.id,'name',c.name,'email',c.email,'phone',coalesce(c.phone,''));
end $$;

create or replace function refresh_rating() returns trigger language plpgsql security definer set search_path=public as $$
declare pid uuid:=coalesce(new.product_id,old.product_id);
begin
 update products set rating=coalesce((select round(avg(rating)::numeric,1) from reviews where product_id=pid),5), review_count=(select count(*) from reviews where product_id=pid) where id=pid;
 return null;
end $$;
drop trigger if exists reviews_rating on reviews;
create trigger reviews_rating after insert or delete on reviews for each row execute function refresh_rating();

-- Policies
create policy admin_brand on brands for update using (id=my_brand()) with check (id=my_brand());
create policy shopper_review on reviews for insert with check (is_demo=false and rating between 1 and 5 and length(author)>1);
create policy own_customer on customers for select using (user_id=auth.uid());
create policy own_orders on orders for select using (customer_id in (select id from customers where user_id=auth.uid()));
create policy own_items on order_items for select using (order_id in (select id from orders where customer_id in (select id from customers where user_id=auth.uid())));
create policy own_wishlist on wishlists for all
 using (customer_id in (select id from customers where user_id=auth.uid()))
 with check (customer_id in (select id from customers where user_id=auth.uid()) and brand_id=(select brand_id from customers where id=customer_id));

-- Product image storage: public read, writes only inside the admin's own brand folder
insert into storage.buckets(id,name,public) values ('product-images','product-images',true) on conflict do nothing;
create policy "product images public read" on storage.objects for select using (bucket_id='product-images');
create policy "product images brand write" on storage.objects for all
 using (bucket_id='product-images' and (storage.foldername(name))[1]=my_brand()::text)
 with check (bucket_id='product-images' and (storage.foldername(name))[1]=my_brand()::text);



-- 3. SHOPIFY UPGRADE (COUPONS, SHIPMENTS, RETURNS, REFUNDS)

-- =========================================================================
-- MIGRATION 003: SHOPIFY-GRADE E-COMMERCE PLATFORM UPGRADE
-- Adds: Returns & Exchanges, Refunds, Customer Saved Addresses, Shipments,
--        Inventory Logs, Abandoned Carts, and Customer Loyalty / Referrals
-- =========================================================================

-- 1. Customer Saved Addresses
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

-- 2. Shipments & Tracking (Modular Courier Support: Delhivery, BlueDart, Shiprocket, DTDC)
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

-- 3. Returns and Exchanges
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

-- 4. Payment Gateway Refunds (Razorpay / Cash / Store Credit)
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

-- 5. Inventory Adjustment Audit Logs
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

-- 6. Abandoned Carts for Retargeting & Recovery
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

-- 7. Customer Loyalty & Referral Points
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

-- Indexes for performance
create index ifs_customer_addrs on customer_addresses(customer_id);
create index ifs_shipments_order on shipments(order_id);
create index ifs_returns_order on order_returns(order_id);
create index ifs_refunds_order on refunds(order_id);
create index ifs_inv_product on inventory_logs(product_id, created_at desc);
create index ifs_abandoned_email on abandoned_carts(customer_email);

-- Enable RLS
alter table customer_addresses enable row level security;
alter table shipments enable row level security;
alter table order_returns enable row level security;
alter table refunds enable row level security;
alter table inventory_logs enable row level security;
alter table abandoned_carts enable row level security;
alter table loyalty_accounts enable row level security;

-- Admin policies
create policy admin_addrs on customer_addresses for all using (brand_id=my_brand()) with check (brand_id=my_brand());
create policy admin_shipments on shipments for all using (brand_id=my_brand()) with check (brand_id=my_brand());
create policy admin_returns on order_returns for all using (brand_id=my_brand()) with check (brand_id=my_brand());
create policy admin_refunds on refunds for all using (brand_id=my_brand()) with check (brand_id=my_brand());
create policy admin_inv on inventory_logs for all using (brand_id=my_brand()) with check (brand_id=my_brand());
create policy admin_abandoned on abandoned_carts for all using (brand_id=my_brand()) with check (brand_id=my_brand());
create policy admin_loyalty on loyalty_accounts for all using (brand_id=my_brand()) with check (brand_id=my_brand());

-- Customer self-service policies
create policy cust_own_addrs on customer_addresses for all
  using (customer_id in (select id from customers where user_id=auth.uid()))
  with check (customer_id in (select id from customers where user_id=auth.uid()));

create policy cust_own_returns on order_returns for all
  using (customer_id in (select id from customers where user_id=auth.uid()))
  with check (customer_id in (select id from customers where user_id=auth.uid()));

create policy cust_read_shipments on shipments for select
  using (order_id in (select id from orders where customer_id in (select id from customers where user_id=auth.uid())));



-- 4. INITIAL SEED (FORME BRAND & CATEGORIES)

-- Demo brand + categories + coupons. Run supabase/seed_products.sql next for products, reviews and sample orders.
insert into brands(slug,name,is_demo) values ('forme','FORME®',true) on conflict do nothing;
insert into store_settings(brand_id,tagline,whatsapp,email,announcement) select id,'Everything worth discovering.','91XXXXXXXXXX','hello@forme.example','Free shipping above ₹1,999 · Demo store' from brands where slug='forme' on conflict do nothing;
insert into categories(brand_id,name,slug) select b.id,c,lower(c) from brands b, unnest(array['Fashion','Skincare','Jewellery','Accessories','Home']) c where b.slug='forme' on conflict do nothing;
insert into coupons(brand_id,code,kind,value) select id,'FORME10','pct',10 from brands where slug='forme' on conflict do nothing;
insert into coupons(brand_id,code,kind,value) select id,'WELCOME200','flat',200 from brands where slug='forme' on conflict do nothing;
-- After creating an auth user (Supabase dashboard → Authentication), link them to the brand:
-- insert into profiles(id,brand_id,role) select '<AUTH_USER_UUID>', id, 'admin' from brands where slug='forme';
