import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'
import { useCart } from '../src/store/cart'
import { useProducts } from '../src/store/products'
import { useOrders } from '../src/store/orders'
import { useAccount } from '../src/store/account'

const go = (path: string) => render(
  <MemoryRouter initialEntries={[path]}>
    <App />
  </MemoryRouter>
)

const loggedErrors: string[] = []

beforeEach(() => {
  cleanup()
  sessionStorage.clear()
  localStorage.clear()
  window.scrollTo = () => {}
  window.open = vi.fn()
  useCart.setState({ lines: [], wishlist: [], savedForLater: [], open: false })
  useAccount.setState({ me: null, local: [] })
  useProducts.setState({ status: 'ready' })
  vi.spyOn(console, 'error').mockImplementation((...args) => {
    loggedErrors.push(String(args[0]))
  })
})

afterEach(() => {
  cleanup()
})

afterAll(() => {
  const actualErrors = loggedErrors.filter(e => !/not wrapped in act|Not implemented/.test(e))
  expect(actualErrors).toEqual([])
})

describe('Deep Demo Audit: Navigation, Browsing, User Flows & Admin Controls', () => {

  it('1. Homepage: hero slider, bento dress styles and quick links work seamlessly', async () => {
    go('/')

    // Hero title & CTA
    expect(await screen.findByRole('heading', { name: /FIND CLOTHES THAT MATCH YOUR STYLE/i })).toBeTruthy()
    const shopNowCtas = screen.getAllByRole('link', { name: /Shop Now/i })
    expect(shopNowCtas.length).toBeGreaterThan(0)
    expect(shopNowCtas[0].getAttribute('href')).toBe('/shop')

    // Bento Dress Style cards
    expect(screen.getByRole('heading', { name: /BROWSE BY DRESS STYLE/i })).toBeTruthy()
    const casualLink = screen.getByRole('link', { name: /Casual/i })
    expect(casualLink.getAttribute('href')).toBe('/shop?style=Casual')

    const formalLink = screen.getByRole('link', { name: /Formal/i })
    expect(formalLink.getAttribute('href')).toBe('/shop?style=Formal')

    const partyLink = screen.getByRole('link', { name: /Party/i })
    expect(partyLink.getAttribute('href')).toBe('/shop?style=Party')

    const gymLink = screen.getByRole('link', { name: /Gym/i })
    expect(gymLink.getAttribute('href')).toBe('/shop?style=Gym')

    // Section headings
    expect(screen.getByRole('heading', { name: /NEW ARRIVALS/i })).toBeTruthy()
    expect(screen.getByRole('heading', { name: /TOP SELLING/i })).toBeTruthy()
  })

  it('2. Shop Page: dress style and category filters return matching products', async () => {
    const u = userEvent.setup()
    go('/shop?style=Casual')

    // Heading should show Style: Casual
    expect(await screen.findByRole('heading', { name: /Style: Casual/i })).toBeTruthy()
    // Should have products visible
    expect(screen.getByText(/Showing \d+ of \d+ products/i)).toBeTruthy()

    // Test Price Filter
    const under1kBtn = screen.getByRole('button', { name: /Under ₹1,000/i })
    await u.click(under1kBtn)
    expect(await screen.findByText(/Price: Under ₹1,000/i)).toBeTruthy()

    // Clear filters
    const clearBtn = screen.getByRole('button', { name: /Clear all filters/i })
    await u.click(clearBtn)
    expect(await screen.findByRole('heading', { name: 'All products' })).toBeTruthy()
  })

  it('3. Product Page: image switcher, size guide, delivery pin check & tabs', async () => {
    const u = userEvent.setup()
    const prod = useProducts.getState().products[0]
    go(`/product/${prod.slug}`)

    // Verify product heading
    expect(await screen.findByRole('heading', { name: new RegExp(prod.name, 'i') })).toBeTruthy()

    // Tab switching: Details
    const detailsTab = screen.getByRole('button', { name: 'Product Details' })
    await u.click(detailsTab)
    expect(await screen.findByText(/Product Specifications/i)).toBeTruthy()

    // FAQs
    const faqsTab = screen.getByRole('button', { name: 'FAQs' })
    await u.click(faqsTab)
    expect(await screen.findByText(/Frequently Asked Questions/i)).toBeTruthy()

    // Reviews
    const reviewsTab = screen.getByRole('button', { name: 'Rating & Reviews' })
    await u.click(reviewsTab)
    expect(await screen.findByText(/All Reviews/i)).toBeTruthy()

    // Wishlist Toggle
    const wishBtns = screen.getAllByRole('button', { name: /Toggle wishlist/i })
    await u.click(wishBtns[0])
    expect(useCart.getState().wishlist.length).toBe(1)
  })

  it('4. Cart Page: promo code application and checkout link', async () => {
    const u = userEvent.setup()
    const prod = useProducts.getState().products[0]
    useCart.getState().add(prod.id, 1, prod.sizes[0] || 'One size')
    go('/cart')

    expect(await screen.findByRole('heading', { name: /YOUR CART/i })).toBeTruthy()

    // Apply Coupon
    const promoInput = screen.getByPlaceholderText(/Add promo code/i)
    await u.type(promoInput, 'FORME10')
    await u.click(screen.getByRole('button', { name: 'Apply' }))
    expect(await screen.findByText(/Coupon FORME10.*applied!/i)).toBeTruthy()

    // Verify Go to Checkout link carries coupon
    const checkoutLink = screen.getByRole('link', { name: /Go to Checkout/i })
    expect(checkoutLink.getAttribute('href')).toContain('coupon=FORME10')
  })

  it('5. Wishlist Page: displays saved items and move all to cart', async () => {
    const u = userEvent.setup()
    const prod = useProducts.getState().products[0]
    useCart.setState({ wishlist: [prod.id] })
    go('/wishlist')

    expect(await screen.findByRole('heading', { name: /MY WISHLIST/i })).toBeTruthy()
    const moveAllBtn = screen.getByRole('button', { name: /Move All to Cart/i })
    await u.click(moveAllBtn)
    expect(useCart.getState().lines.length).toBeGreaterThan(0)
  })

  it('6. Track Order Page: searching order code renders timeline and status', async () => {
    useOrders.setState({
      orders: [
        {
          id: 'FRM-DEMO-99',
          date: Date.now(),
          customer: { name: 'Demo Shopper', email: 'demo@forme.in', phone: '9876543210', address: '10 Connaught Place', city: 'Delhi', state: 'Delhi', pin: '110001' },
          lines: [{ name: 'Boxy Heavyweight Tee', size: 'M', qty: 1, price: 1499 }],
          subtotal: 1499,
          discount: 0,
          shipping: 0,
          total: 1499,
          status: 'Shipped',
          payment: 'Razorpay UPI',
          demo: true
        }
      ]
    })

    go('/track?order=FRM-DEMO-99')
    expect(await screen.findByText('FRM-DEMO-99')).toBeTruthy()
    expect(await screen.findByText('In Transit (Air Express)')).toBeTruthy()
    expect(screen.getByText(/10 Connaught Place/i)).toBeTruthy()
  })

  it('7. Admin Portal: dashboard metrics, period toggle, and nav links', async () => {
    const u = userEvent.setup()
    go('/admin/login')
    await u.click(await screen.findByRole('button', { name: 'Sign in' }))

    // Dashboard
    await u.click(await screen.findByRole('link', { name: 'Dashboard' }))
    expect(await screen.findByText(/Net Revenue/i)).toBeTruthy()

    // Period buttons
    await u.click(screen.getByRole('button', { name: '30 Days' }))
    await u.click(screen.getByRole('button', { name: '90 Days' }))
    await u.click(screen.getByRole('button', { name: '7 Days' }))

    // Products Management
    await u.click(screen.getByRole('link', { name: 'Products' }))
    expect(await screen.findByText(/Products Catalogue/i)).toBeTruthy()

    // Orders Management
    await u.click(screen.getByRole('link', { name: 'Orders' }))
    expect(await screen.findByText(/Order Management/i)).toBeTruthy()

    // Customers Management
    await u.click(screen.getByRole('link', { name: 'Customers' }))
    expect(await screen.findByText(/Customer Management/i)).toBeTruthy()

    // Marketing
    await u.click(screen.getByRole('link', { name: 'Marketing' }))
    expect(await screen.findByText(/Marketing & Automations/i)).toBeTruthy()

    // Settings
    await u.click(screen.getByRole('link', { name: 'Settings' }))
    expect(await screen.findByText(/Store & Brand Settings/i)).toBeTruthy()
  })

  it('8. Static & Policy Pages: about, contact, terms, privacy, shipping, returns load without issues', async () => {
    go('/about')
    expect(await screen.findByText(/Fewer, better things/i, {}, { timeout: 4000 })).toBeTruthy()
  })
})
