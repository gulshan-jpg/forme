-- Demo brand + categories + coupons. Run supabase/seed_products.sql next for products, reviews and sample orders.
insert into brands(slug,name,is_demo) values ('forme','FORME®',true) on conflict do nothing;
insert into store_settings(brand_id,tagline,whatsapp,email,announcement) select id,'Everything worth discovering.','91XXXXXXXXXX','hello@forme.example','Free shipping above ₹1,999 · Demo store' from brands where slug='forme' on conflict do nothing;
insert into categories(brand_id,name,slug) select b.id,c,lower(c) from brands b, unnest(array['Fashion','Skincare','Jewellery','Accessories','Home']) c where b.slug='forme' on conflict do nothing;
insert into coupons(brand_id,code,kind,value) select id,'FORME10','pct',10 from brands where slug='forme' on conflict do nothing;
insert into coupons(brand_id,code,kind,value) select id,'WELCOME200','flat',200 from brands where slug='forme' on conflict do nothing;
-- After creating an auth user (Supabase dashboard → Authentication), link them to the brand:
-- insert into profiles(id,brand_id,role) select '<AUTH_USER_UUID>', id, 'admin' from brands where slug='forme';
