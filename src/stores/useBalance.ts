import { create } from "zustand"

interface SocketStore {
    balance: number ; 
    setBalance: (newBalance: number) => void; 
  }

export const useBalance = create<SocketStore>((set) => ({
    balance: 0, 
    setBalance: (newBalance) => set({ balance: newBalance }), 
    
}))