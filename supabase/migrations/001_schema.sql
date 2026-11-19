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
