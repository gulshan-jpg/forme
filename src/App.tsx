import { lazy, Suspense, useEffect } from 'react'; import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Layout from './components/Layout'; import Toaster from './components/Toaster'; import Home from './pages/Home'; import Shop from './pages/Shop'; import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'; import Checkout from './pages/Checkout'; import Confirmation from './pages/Confirmation'; import Wishlist from './pages/Wishlist'; import Account from './pages/Account'; import TrackOrder from './pages/TrackOrder'
import TermsPage from './pages/TermsPage'; import PrivacyPage from './pages/PrivacyPage'; import ShippingPage from './pages/ShippingPage'
import AboutPage from './pages/AboutPage'; import ContactPage from './pages/ContactPage'; import ReturnsPage from './pages/ReturnsPage'
import { loadCatalog, syncWishlist } from './services/hydrate'; import { useAccount } from './store/account'

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
   <Suspense fallback={<p className="py-32 text-center text-sm text-char/60">Loading FORME®…</p>}>
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
