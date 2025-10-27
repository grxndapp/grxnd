'use client'
import AppWrapper from '@/components/AppWrapper/AppWrapper'
import PlayerLeaderboard from '@/components/PlayerLeaderboard/PlayerLeaderboard'

type LeaderboardPageProps = {
   users: {
      userid: string;
      name: string;
      score: number;
      quizzesCompleted: number;
   }[]
}

export default function LeaderboardPage ({ users }: LeaderboardPageProps) {

   return (
      <AppWrapper>
         <div className="box full h-full">
            <div className="text-xxl mb-1 bold-700 full dfb align-center justify-center gap-7">
               Global Leaderboard
            </div>
            <div className="text-xs text-center full mb-3">
               The official <b className="accent-color">Grxnd</b> Leaderboard. Grind your way to the top.
            </div>
            <PlayerLeaderboard
               players={[...users].sort((a, b) => b.score - a.score)}
               noImage
            />
         </div>
      </AppWrapper>
   )
}
