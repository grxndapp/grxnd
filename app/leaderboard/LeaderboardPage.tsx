'use client'
import AppWrapper from '@/components/AppWrapper/AppWrapper'
import PlayerLeaderboard from '@/components/PlayerLeaderboard/PlayerLeaderboard'
import Spacing from '@/components/Spacing/Spacing'
import SwitchSlide from '@/components/SwitchSlide/SwitchSlide'
import { formatMilliseconds, getWeekRange } from '@/utils/date'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type LeaderboardPlayerInfo = {
   userid: string;
   name: string;
   score: number;
}

type LeaderboardPageProps = {
   allTime: LeaderboardPlayerInfo[];
   thisWeek: LeaderboardPlayerInfo[];
}

export default function LeaderboardPage ({ allTime, thisWeek }: LeaderboardPageProps) {
   const { end } = getWeekRange();
   const router = useRouter();
   const [leaderboardType, setLeaderboardType] = useState("this-week");

   return (
      <AppWrapper>
         <div className="box full h-full pd-2">
            <div className="box full pd-15 mb-1">
               <SwitchSlide 
                  items={[
                     { label: <>This Week</>, key: "this-week" },
                     { label: <>All Time</>, key: "all-time" },
                  ]}
                  onItemSelected={(key: any) => setLeaderboardType(key)}
                  defaultKeySelectedIndex={0}
               />
            </div>
            {(leaderboardType == "this-week") ? (<>
               {thisWeek.length == 0 ? (
                  <div className="box full mb-3 pd-1">
                     <div className="text-xxl bold-800 full gap-7 accent-color-gradient-text line-height-12">
                        No Quiz Points Earned<br />This Week yet
                     </div>
                     <div className="text-xxs full pd-1">
                        <b className="accent-color">£5.00</b> cash prize for the highest score at the end of the week. On <b>{formatMilliseconds(end.getTime())}</b>
                     </div>
                     <br />
                     <button className="xs pd-13 pdx-2 full mw-600 radius-20" onClick={() => router.push("/quiz-maker")}>
                        Get Ahead, Start Now!
                     </button>
                  </div>
               ) : (<>
                  <div className="box full mb-1 pd-1">
                     <div className="text-xxl bold-800 full gap-7 accent-color-gradient-text line-height-12">
                        Top Learners<br />This Week
                     </div>
                     <div className="text-xxs full pd-05">
                        The official <b className="accent-color">Grxnd</b> Leaderboard for this week. Grind your way to the top.
                     </div>
                     <div className="text-xxs full pd-05">
                        <b className="accent-color">£5.00</b> cash prize for the highest score at the end of the week. On <b>{formatMilliseconds(end.getTime())}</b>
                     </div>
                  </div>
                  <PlayerLeaderboard
                     players={[...thisWeek].sort((a, b) => b.score - a.score)}
                     noImage
                  />
               </>)}
            </>) : (<>
               <div className="box full mb-1 pd-1">
                  <div className="text-xxl bold-800 full gap-7 accent-color-gradient-text line-height-12">
                     All Time<br />Leaderboard
                  </div>
                  <div className="text-xxs full pd-05">
                     The official <b className="accent-color">Grxnd</b> Leaderboard for this week. Grind your way to the top.
                  </div>
               </div>
               <PlayerLeaderboard
                  players={[...allTime].sort((a, b) => b.score - a.score)}
                  noImage
               />
            </>)}
            <Spacing size={5} />
         </div>
      </AppWrapper>
   )
}
