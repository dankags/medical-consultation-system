
import { create } from "zustand"

interface SocketStore {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket: any| null ; 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSocket: (newSocket: any ) => void; 
    removeSocket: () => void; 
  }

export const useSocket = create<SocketStore>((set) => ({
    socket: null, 
    setSocket: (newSocket) => set({ socket: newSocket }), 
    removeSocket: () => set({ socket: null }),
}))