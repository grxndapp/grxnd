import { dalDbOperation, dalRequireSubscribedAuth, dalRequireSubscriber } from "@/dal/helpers";
import { db } from "@/db";
import { scoresTable, usersTable } from "@/db/schemas";
import { desc, eq } from "drizzle-orm";
import LeaderboardPage from "./LeaderboardPage";
import LoadingPage from "./loading";

export default async function Leaderboard () {
   await dalRequireSubscriber();
   
   const users = await dalRequireSubscribedAuth(user => 
      dalDbOperation(async () => {
         return await db
            .select({
               userid: usersTable.userid,
               name: usersTable.name,
               score: scoresTable.score
            })
            .from(usersTable)
            .innerJoin(scoresTable, eq(usersTable.userid, scoresTable.userid))
            .orderBy(desc(scoresTable.score))
            .limit(20)
      })
   )
   
   if (users.success && users.data) {
      return <LeaderboardPage users={JSON.parse(JSON.stringify(users.data))} />;
   } else {
      return <LoadingPage />;
   }
}