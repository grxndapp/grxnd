import { db } from "@/db";
import { usersTable } from "@/db/schemas";
import { hashPwd } from "@/utils/uuid";
import { and, eq } from "drizzle-orm";
import { NextAuthOptions } from "next-auth";
import { createUserAccountFromGoogleAuth } from "@/app/actions/user";
import { cookies } from "next/headers";
import { parseSignupData } from "./authHelper";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
   session: {
      strategy: "jwt"
   },
   providers: [
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!
      }),
      CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {},
				password: {}
			},
         async authorize (credentials, req) {
            if (credentials?.email == "" || credentials?.password == "") {
               return null;
            } else {
               const results = await db.select().from(usersTable)
               .where(and(
                  eq(usersTable.email, credentials?.email!),
                  eq(usersTable.password, hashPwd(credentials?.password!))
               )).limit(1);

               if (results.length > 0) {
                  return {
                     id: results[0].userid!,
                     email: results[0].email,
                     name: results[0].name,
                     image: `/user-def.png`,
                  }
               } else {
                  return null;
               }
            }
         }
      })
   ],
   callbacks: {
      async signIn({ user, account, profile }) {
         if (account?.provider !== "google") return true;
         if (!user.email) return false;

         const cookieStore = await cookies();
         const signupData = parseSignupData(cookieStore.get("grxnd_signup")?.value);

         console.log(signupData)

         const googleSignInUserAuth = await createUserAccountFromGoogleAuth({
            name: user.name!, email: user.email!,
            referralChannel: signupData?.referralChannel!, studentType: signupData?.studentType!
         })

         cookieStore.delete("grxnd_signup");
         return googleSignInUserAuth; // Allow sign in
      },
      jwt: async ({ user, token, trigger, session }) => {
         if (trigger == "update") {
            return { ...token, ...session.user }
         }
         return { ...token, ...user }
      }
   }
}