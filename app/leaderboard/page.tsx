import { dalDbOperation, dalRequireSubscribedAuth, dalRequireSubscriber } from "@/dal/helpers";
import { db } from "@/db";
import { quizzesTable, scoresTable, usersTable } from "@/db/schemas";
import { getWeekRange } from "@/utils/date";
import { and, between, desc, eq, sum } from "drizzle-orm";
import LeaderboardPage from "./LeaderboardPage";
import LoadingPage from "./loading";

export default async function Leaderboard () {
   await dalRequireSubscriber();

   // get the week's highest scorers
   const { start, end } = getWeekRange();
   
   const leaderboard = await dalRequireSubscribedAuth(user => 
      dalDbOperation(async () => {
         const allTimeLeaderboard = await db
            .select({
               userid: usersTable.userid,
               name: usersTable.name,
               score: scoresTable.score
            })
            .from(usersTable)
            .innerJoin(scoresTable, eq(usersTable.userid, scoresTable.userid))
            .orderBy(desc(scoresTable.score))
            .limit(20)
         
         const currentWeekLeaderboard = await db
            .select({
               userid: usersTable.userid,
               name: usersTable.name,
               score: sum(quizzesTable.scorePoints).mapWith(Number)
            })
            .from(usersTable)
            .innerJoin(quizzesTable, and(
               eq(usersTable.userid, quizzesTable.userid),
               between(quizzesTable.createdAt, start, end)
            ))
            .orderBy(desc(sum(quizzesTable.scorePoints)))
            .groupBy(usersTable.userid, usersTable.name)
            .limit(10)
         
         return {
            currentWeekLeaderboard,
            allTimeLeaderboard
         }
      })
   )
   
   if (leaderboard.success && leaderboard.data) {
      return <LeaderboardPage 
         thisWeek={JSON.parse(JSON.stringify(leaderboard.data.currentWeekLeaderboard))}
         allTime={JSON.parse(JSON.stringify(leaderboard.data.allTimeLeaderboard))}
      />;
   } else {
      return <LoadingPage />;
   }
}