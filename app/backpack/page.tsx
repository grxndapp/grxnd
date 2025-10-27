import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"
import BackPackPage from "./BackPack";

export default async function BackPack () {
   const session = await getServerSession(authOptions);
   if (session?.user) {
      return <BackPackPage />;
   } else {
      redirect("/sign-in");
   }
}