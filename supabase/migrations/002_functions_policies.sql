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
