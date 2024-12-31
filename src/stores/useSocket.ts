import { create } from "zustand"

export const useSocket = create((set) => ({
    socket: null,
    setSocketId: (newSocketId:string) => set({ socket: newSocketId }), 
    removeSocket:()=>set({socket:null})
}))