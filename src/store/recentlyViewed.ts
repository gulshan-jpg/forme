import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface RecentlyViewedStore {
 recentIds: string[]
 recordView: (id: string) => void
 clearRecent: () => void
}

export const useRecentlyViewed = create<RecentlyViewedStore>()(
 persist(
  set => ({
   recentIds: [],
   recordView: id =>
    set(s => ({
     recentIds: [id, ...s.recentIds.filter(x => x !== id)].slice(0, 8)
    })),
   clearRecent: () => set({ recentIds: [] })
  }),
  { name: 'forme-recently-viewed' }
 )
)
