"use client";

import React, { createContext, useContext, useEffect, useState, useCallback} from "react";
import { useAuth } from "@clerk/nextjs";
import { fetchUserData } from "@/lib/actions/user.actions";

interface UserContextType {
  user: User | null;
  updateUser: () => void;
  status: "authenticated" | "unauthenticated" | "loading";
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"authenticated" | "unauthenticated" | "loading">("loading");
  
  // Prevent double execution on mount
 

  // Fetch user data
  const fetchAndSetUser = useCallback(async () => {
    if (!userId ) return;


    try {
      const { user, error } = await fetchUserData();
      if (error) throw new Error(error);

      setUser(user);
      setStatus("authenticated");
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
      setStatus("unauthenticated");
    }
  }, [userId]);

  // Fetch user data only once per mount or when userId first becomes available
  useEffect(() => {
    if (userId) {
      fetchAndSetUser();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // Removed `fetchAndSetUser` from dependencies

  return (
    <UserContext.Provider value={{ user, updateUser: fetchAndSetUser, status }}>
      {children}
    </UserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useCurrentUser must be used within a UserProvider");
  }
  return context;
};
