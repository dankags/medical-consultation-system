import { create } from "zustand"

interface SocketStore {
    balance: number | null; 
    setBalance: (newBalance: number) => void; 
  }

export const useBalance = create<SocketStore>((set) => ({
    balance: null, 
    setBalance: (newBalance) => set({ balance: newBalance }), 
    
}))