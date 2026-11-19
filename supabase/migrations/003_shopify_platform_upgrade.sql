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
