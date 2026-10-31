'use client'
import { getCurrentUser, getUserClient } from "@/app/actions/user";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type UserContextType = {
   user: ClientUser | null;
   authentication: "unloaded" | "loading" | "authenticated" | "no-user";
};

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
   const ctx = useContext(UserContext);
   if (!ctx) throw new Error("UserProvider is missing");
   return ctx;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
   const [user, setUser] = useState<ClientUser | null>(null);
   const [authentication, setAuthentication] = useState<UserContextType['authentication']>("unloaded");

   const onLoad =  useCallback(async () => {
      setAuthentication("loading");
      const user = await getUserClient();
      setUser(user);
      setAuthentication( user ? "authenticated" : "no-user" );
   }, []);

   function useUser () {
      return { user, authentication }
   }

   useEffect(() => { onLoad() }, [])

   return (
      <UserContext.Provider value={{ user, authentication }}>
         {children}
      </UserContext.Provider>
   );
};
