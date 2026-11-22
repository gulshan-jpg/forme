import { lazy, Suspense, useEffect } from 'react'; import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Layout from './components/Layout'; import Toaster from './components/Toaster'; import LoadingScreen from './components/LoadingScreen'
import Home from './pages/Home'

// Route-level code splitting: keep Home eager for 0ms initial paint, lazy-load all other pages
const Shop = lazy(() => import('./pages/Shop'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Confirmation = lazy(() => import('./pages/Confirmation'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Account = lazy(() => import('./pages/Account'))
const TrackOrder = lazy(() => import('./pages/TrackOrder'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const ShippingPage = lazy(() => import('./pages/ShippingPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const ReturnsPage = lazy(() => import('./pages/ReturnsPage'))

import { loadCatalog, syncWishlist } from './services/hydrate'; import { useAccount } from './store/account'

// Preload key secondary routes when browser is idle so navigation is instant
if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
 window.requestIdleCallback(() => {
  import('./pages/Shop')
  import('./pages/ProductPage')
 })
}

const AdminLogin = lazy(() => import('./admin/AdminLogin'))
const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const Dashboard = lazy(() => import('./admin/Dashboard'))
const ProductsAdmin = lazy(() => import('./admin/ProductsAdmin'))
const OrdersAdmin = lazy(() => import('./admin/OrdersAdmin'))
const CustomersAdmin = lazy(() => import('./admin/CustomersAdmin'))
const CouponsAdmin = lazy(() => import('./admin/CouponsAdmin'))
const MarketingAdmin = lazy(() => import('./admin/MarketingAdmin'))
const SettingsAdmin = lazy(() => import('./admin/SettingsAdmin'))

const NotFound = () => (
 <div className="py-32 text-center">
  <h1 className="font-integral text-4xl sm:text-5xl font-black text-black">Page not found</h1>
  <Link to="/" className="btn btn-dark mt-8 rounded-full px-8 py-3 text-xs font-bold">Back to home</Link>
 </div>
)

export default function App() {
 const meId = useAccount(s => s.me?.id)
 useEffect(() => { loadCatalog(); useAccount.getState().init() }, [])
 useEffect(() => { syncWishlist() }, [meId])

 return (
  <>
   <Suspense fallback={<LoadingScreen fullScreen message="Loading FORME®…" />}>
    <Routes>
     <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="shop" element={<Shop />} />
      <Route path="product/:slug" element={<ProductPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="order/:id" element={<Confirmation />} />
      <Route path="wishlist" element={<Wishlist />} />
      <Route path="account" element={<Account />} />
      <Route path="track" element={<TrackOrder />} />
      <Route path="terms" element={<TermsPage />} />
      <Route path="privacy" element={<PrivacyPage />} />
      <Route path="shipping" element={<ShippingPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="returns" element={<ReturnsPage />} />
      <Route path="refund-policy" element={<ReturnsPage />} />
      <Route path="*" element={<NotFound />} />
     </Route>

     <Route path="admin/login" element={<AdminLogin />} />
     <Route path="admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="products" element={<ProductsAdmin />} />
      <Route path="orders" element={<OrdersAdmin />} />
      <Route path="customers" element={<CustomersAdmin />} />
      <Route path="coupons" element={<CouponsAdmin />} />
      <Route path="marketing" element={<MarketingAdmin />} />
      <Route path="settings" element={<SettingsAdmin />} />
     </Route>
    </Routes>
   </Suspense>
   <Toaster />
  </>
 )
}
