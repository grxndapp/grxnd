import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"
import { dalDbOperation, dalRequireAuth } from "@/dal/helpers";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { notesTable } from "@/db/schemas";
import NoteBooksPage from "./NoteBooksPage";
import LoadingPage from "./loading";

export default async function NoteBooks () {   
   const notes = await dalRequireAuth(user => 
      dalDbOperation(async () => {
         return await db
            .select()
            .from(notesTable)
            .where(eq(notesTable.userid, user.userid!))
      })
   );

   const session = await getServerSession(authOptions);
   if (session?.user) {
      if (notes.success) {
         return <NoteBooksPage notes={notes.data.toReversed() as any} />;
      } else {
         return <LoadingPage />;
      }
   } else {
      redirect("/sign-in");
   }
}