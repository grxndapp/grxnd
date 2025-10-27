import { db } from "@/db";
import { scoresTable, usersTable } from "@/db/schemas";
import { hashPwd, uuid } from "@/utils/uuid";
import { and, eq } from "drizzle-orm";
import { NextAuthOptions } from "next-auth";
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
               const results = await db
               .select().from(usersTable)
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
         const existingUser = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, user.email!))
            .limit(1);

         if (existingUser.length < 1) {
            const userid = uuid();
            await db.insert(usersTable).values({
               userid,
               name: user.name,
               email: user.email,
               oauth_provider: "google",
               password: hashPwd(`${user.name}${user.email}`),
               user_role: "user",
               is_subscribed: false
            });
            await db.insert(scoresTable).values({ userid, score: 0 })
         }
         return true; // Allow sign in
      },
      jwt: async ({ user, token, trigger, session }) => {
         if (trigger == "update") {
            return { ...token, ...session.user }
         }
         return { ...token, ...user }
      }
   }
}