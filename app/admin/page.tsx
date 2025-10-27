import { dalDbOperation, dalRequireAdmin, dalRequireAdminAuth } from "@/dal/helpers";
import { db } from "@/db";
import { usersTable } from "@/db/schemas";
import LoadingPage from "./loading";
import AdminPage from "./AdminPage";

export default async function Admin () {
   await dalRequireAdmin();

   const dataReq = await dalRequireAdminAuth(user => 
      dalDbOperation(async () => {
         const usersGraph = await db
            .select({
               name: usersTable.name,
               oauth_provider: usersTable.oauth_provider,
               is_subscribed: usersTable.is_subscribed,
               createdAt: usersTable.createdAt,
            })
            .from(usersTable)

         return { usersGraph };
      })
   )

   if (dataReq.success) {
      const { usersGraph } = dataReq.data;
      return <AdminPage
         usersGraph={JSON.parse(JSON.stringify(usersGraph))}
      />;
   } else {
      return <LoadingPage />
   }

}