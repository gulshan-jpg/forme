import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'
import { useCart } from '../src/store/cart'
import { useProducts } from '../src/store/products'
import { useOrders } from '../src/store/orders'
const go=(path:string)=>render(<MemoryRouter initialEntries={[path]}><App/></MemoryRouter>)
const errors:string[]=[]
beforeEach(()=>{sessionStorage.clear();window.scrollTo=()=>{};useCart.setState({lines:[],wishlist:[],open:false});vi.spyOn(console,'error').mockImplementation((...a)=>{errors.push(String(a[0]))})})
afterAll(()=>{expect(errors.filter(e=>!/not wrapped in act|Not implemented/.test(e))).toEqual([])})

it('guest checkout with coupon places an order and decrements stock',async()=>{
 const u=userEvent.setup();go('/product/boxy-heavyweight-tee')
 const before=useProducts.getState().products.find(p=>p.slug==='boxy-heavyweight-tee')!.stock
 await u.click(await screen.findByRole('button',{name:'M'}));await u.click(screen.getByRole('button',{name:/add to cart/i}))
 await u.click(await screen.findByRole('link',{name:'Checkout'}))
 await u.type(await screen.findByLabelText('Full name'),'Test User');await u.type(screen.getByLabelText('Email'),'test@example.com');await u.type(screen.getByLabelText('Phone number'),'9876500000')
 await u.type(screen.getByLabelText('Address'),'221B Baker Street');await u.type(screen.getByLabelText('City'),'Delhi');await u.type(screen.getByLabelText('State'),'Delhi');await u.type(screen.getByLabelText('PIN code'),'110001')
 await u.type(screen.getByLabelText('Coupon code'),'FORME10');await u.click(screen.getByRole('button',{name:'Apply'}));expect(await screen.findByText('Applied: 10% off')).toBeTruthy()
 await u.click(screen.getByRole('button',{name:/place demo order/i}))
 expect(await screen.findByText(/Thank you, Test/,{},{timeout:5000})).toBeTruthy()
 expect(useProducts.getState().products.find(p=>p.slug==='boxy-heavyweight-tee')!.stock).toBe(before-1)
 const o=useOrders.getState().orders[0];expect(o.total).toBe(1499-150+99);expect(useCart.getState().lines).toHaveLength(0)})

it('checkout validation blocks an empty form',async()=>{
 const u=userEvent.setup();useCart.getState().add('p14',1,'One size');go('/checkout')
 await u.click(await screen.findByRole('button',{name:/place demo order/i}))
 expect(await screen.findByText('Enter a valid email')).toBeTruthy()})

it('submitting a review shows it on the product page',async()=>{
 const u=userEvent.setup();go('/product/soy-wax-candle')
 await u.type(await screen.findByLabelText('Your name'),'Priya');await u.type(screen.getByLabelText('Review'),'Smells wonderful and burns evenly.')
 await u.click(screen.getByRole('button',{name:'Submit review'}));expect(await screen.findByText('Smells wonderful and burns evenly.')).toBeTruthy()})

it('customer can register and see the account page',async()=>{
 const u=userEvent.setup();go('/account');await u.click(await screen.findByRole('button',{name:'Register'}))
 await u.type(screen.getByLabelText('Full name'),'Tess Tester');await u.type(screen.getByLabelText('Email'),'tess@example.com');await u.type(screen.getByLabelText('Mobile number'),'9811122233');await u.type(screen.getByLabelText('Password'),'secret123')
 await u.click(screen.getByRole('button',{name:'Create account'}));expect(await screen.findByText('Hello, Tess')).toBeTruthy()})

it('admin can sign in, add a product and see it in the list',async()=>{
 const u=userEvent.setup();go('/admin/login');await u.click(await screen.findByRole('button',{name:'Sign in'}))
 await u.click(await screen.findByRole('link',{name:'Products'}));await u.click(await screen.findByRole('button',{name:'Add product'}))
 await u.type(screen.getByLabelText('Name'),'Test Candle');const price=screen.getByLabelText('Price (₹)');await u.clear(price);await u.type(price,'650')
 await u.click(screen.getByRole('button',{name:'Save product'}));expect(await screen.findByText('Test Candle')).toBeTruthy()
 expect(useProducts.getState().products.some(p=>p.name==='Test Candle'&&p.price===650)).toBe(true)})
