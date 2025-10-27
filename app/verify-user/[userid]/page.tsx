import { GrxndLogo } from "@/components/Icons/Icon";
import { db } from "@/db";
import { usersTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import { House } from "lucide-react";
import Link from "next/link";

type VerifyUserPageProps = {
   params: Promise<{
      userid: string;
   }>
}

export default async function VerifyUserPage ({ params }: VerifyUserPageProps) {
   const { userid } = await params;

   const res = await db
      .select()
      .from(usersTable)
      .where(and(
         eq(usersTable.userid, userid),
         eq(usersTable.oauth_provider, "nv-credentials")
      )).limit(1);

   if (res.length > 0) {
      const verified = await db
         .update(usersTable)
         .set({ oauth_provider: "v-credentials" })
         .where(and(
            eq(usersTable.userid, userid),
            eq(usersTable.oauth_provider, "nv-credentials")
         ));

      if (verified.rowCount === 1) {
         return (<>
            <div className="box full h-full pd-5 pdx-2">
               <div className="box full mt-2">
                  <div className="box dfb justify-center align-center full pd-1 mb-1">
                     <GrxndLogo size={45} />
                  </div>
                  <div className="text-l full bold-700 text-center">
                     Account Verified
                  </div>
                  <div className="text-xxs pd-1 full text-center">
                     {res[0].name} your account has been successfully verified
                  </div>
                  <div className="box pd-1 full dfb column align-center">
                     <Link href="/home">
                        <button className="xxs pd-12 pdx-4">
                           <House size={17} /> Go to Home
                        </button>
                     </Link>
                  </div>
               </div>
            </div>
         </>)
      } else {
         return null;
      }
   } else {
      return null;
   }
}
