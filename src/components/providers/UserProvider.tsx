"use client"
import React, { createContext,useContext, useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs'
import { fetchUserData } from '@/lib/actions/user.actions';


interface UserContextType {
    user: User | null;
    updateUser: () => void;
    status: "autheticated"|"unautheticated"|"loading"
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { userId } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [status,setStatus]=useState<"autheticated"|"unautheticated"|"loading">("loading")

    useEffect(() => {
        const getUserData = async () => {
            if (!userId) {
                setStatus("unautheticated")  
              return
            }
            try {
                const userData = await fetchUserData();
                if(userData?.user){
                setUser(userData.user);
                setStatus("autheticated")
                return
               }
            } catch (error) {
                console.log(error)
                setStatus("unautheticated")  
            }
                
            
        };
        getUserData();
    }, [userId]);

    const updateUser = async() => {
        if(!userId){
            setStatus("unautheticated")  
             return
            }
        try {
            const userData = await fetchUserData();
            if(userData?.user){
                setUser(userData.user);
                setStatus("autheticated")
                return
               }
            if(userData?.error){
                setStatus("unautheticated")  
                throw new Error(userData.error)
            }   
        } catch (error:any) {
            setStatus("unautheticated")  
            console.log(error)
        }
    };

    return (
        <UserContext.Provider value={{ user, updateUser,status }}>
            {children}
        </UserContext.Provider>
    );
};

export const useCurrentUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};