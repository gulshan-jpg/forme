import { create } from 'zustand'; import { persist } from 'zustand/middleware'; import type { Review } from '../types'
export const useReviews=create<{reviews:Review[];add:(r:Review)=>void}>()(persist((set)=>({reviews:[],add:(r)=>set(s=>({reviews:[r,...s.reviews]}))}),{name:'forme-reviews'}))
