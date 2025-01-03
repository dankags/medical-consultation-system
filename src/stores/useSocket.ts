import { DefaultEventsMap, Socket } from "socket.io"
import { create } from "zustand"

interface SocketStore {
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null; 
    setSocket: (newSocket: Socket<DefaultEventsMap, DefaultEventsMap>) => void; 
    removeSocket: () => void; 
  }

export const useSocket = create<SocketStore>((set) => ({
    socket: null, 
    setSocket: (newSocket) => set({ socket: newSocket }), 
    removeSocket: () => set({ socket: null }),
}))