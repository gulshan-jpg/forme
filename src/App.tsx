import { lazy, Suspense, useEffect } from 'react'; import { Routes, Route, Link } from 'react-router-dom'
import Layout from './components/Layout'; import Toaster from './components/Toaster'; import Home from './pages/Home'; import Shop from './pages/Shop'; import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'; import Checkout from './pages/Checkout'; import Confirmation from './pages/Confirmation'; import Wishlist from './pages/Wishlist'; import Account from './pages/Account'
import { loadCatalog, syncWishlist } from './services/hydrate'; import { useAccount } from './store/account'
const AdminLogin=lazy(()=>import('./admin/AdminLogin')),AdminLayout=lazy(()=>import('./admin/AdminLayout')),Dashboard=lazy(()=>import('./admin/Dashboard')),ProductsAdmin=lazy(()=>import('./admin/ProductsAdmin')),OrdersAdmin=lazy(()=>import('./admin/OrdersAdmin')),CustomersAdmin=lazy(()=>import('./admin/CustomersAdmin')),SettingsAdmin=lazy(()=>import('./admin/SettingsAdmin'))
const NotFound=()=><div className="py-32 text-center"><h1 className="h-serif text-5xl">Page not found</h1><Link to="/" className="btn btn-dark mt-8">Back to home</Link></div>
export default function App(){
 const meId=useAccount(s=>s.me?.id)
 useEffect(()=>{loadCatalog();useAccount.getState().init()},[])
 useEffect(()=>{syncWishlist()},[meId])
 return <><Suspense fallback={<p className="py-32 text-center text-sm">Loading…</p>}><Routes>
 <Route element={<Layout/>}>
  <Route index element={<Home/>}/><Route path="shop" element={<Shop/>}/><Route path="product/:slug" element={<ProductPage/>}/>
  <Route path="cart" element={<CartPage/>}/><Route path="checkout" element={<Checkout/>}/><Route path="order/:id" element={<Confirmation/>}/>
  <Route path="wishlist" element={<Wishlist/>}/><Route path="account" element={<Account/>}/><Route path="*" element={<NotFound/>}/>
 </Route>
 <Route path="admin/login" element={<AdminLogin/>}/>
 <Route path="admin" element={<AdminLayout/>}><Route index element={<Dashboard/>}/><Route path="products" element={<ProductsAdmin/>}/><Route path="orders" element={<OrdersAdmin/>}/><Route path="customers" element={<CustomersAdmin/>}/><Route path="settings" element={<SettingsAdmin/>}/></Route>
 </Routes></Suspense><Toaster/></>}
