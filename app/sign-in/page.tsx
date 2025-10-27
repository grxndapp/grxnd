import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"
import SignInForm from "./SignInForm";

export default async function SignInPage () {
   const session = await getServerSession(authOptions);
   if (session?.user) {
      redirect("/home");
   } else {
      return <SignInForm />;
   }
}
