import { dalDbOperation, dalRequireSubscribedAuth } from "@/dal/helpers";
import { db } from "@/db";
import { quizzesTable, scoresTable, usersTable } from "@/db/schemas";
import { count, desc, eq } from "drizzle-orm";
import LeaderboardPage from "./LeaderboardPage";
import LoadingPage from "./loading";

export default async function Leaderboard () {
   const users = await dalRequireSubscribedAuth(user => 
      dalDbOperation(async () => {
         return await db
            .select({
               userid: usersTable.userid,
               name: usersTable.name,
               score: scoresTable.score,
               quizzesCompleted: count(quizzesTable.id)
            })
            .from(usersTable)
            .innerJoin(scoresTable, eq(usersTable.userid, scoresTable.userid))
            .innerJoin(quizzesTable, eq(usersTable.userid, quizzesTable.userid))
            .groupBy(usersTable.userid, usersTable.name, scoresTable.score)
            .orderBy(desc(scoresTable.score))
            .limit(20)
      })
   )
   
   if (users.success) {
      return <LeaderboardPage users={JSON.parse(JSON.stringify(users.data))} />;
   } else {
      return <LoadingPage />;
   }
}