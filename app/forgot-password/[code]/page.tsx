import { db } from "@/db";
import { forgotPasswordTable } from "@/db/schemas";
import { authOptions } from "@/lib/authOptions"
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";
import { sanitise } from "@/utils/extractJson";
import ForgotPasswordPage from "./ForgotPasswordPage";


type ForgotPwdPageProps = {
   params: Promise<{
      code: string;
   }>
}

export default async function page ({ params }: ForgotPwdPageProps) {
   const session = await getServerSession(authOptions);
   if (session?.user) {
      redirect("/home");
   }

   try {
      const { code } = await params;
      const [forgotPassword] = await db.select().from(forgotPasswordTable).where(eq(forgotPasswordTable.forgottenPasswordCode, code)).limit(1);
   
      return (
         <ForgotPasswordPage forgotPassword={forgotPassword ? sanitise(forgotPassword) : null} />
      )
   } catch (err) {
      console.error(err);
      return (
         <ForgotPasswordPage forgotPassword={null} />
      )
   }

}
