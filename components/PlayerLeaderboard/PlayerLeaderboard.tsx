'use client'
import "./PlayerLeaderboard.css";
import Card from "../Card/Card";
import { useSession } from "next-auth/react";
import { Medal } from "lucide-react";
import { CSSProperties } from "react";
import { CustomIcon } from "../Icons/Icon";
import { Crown, Trophy } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

type LeaderboardPlayerInfo = {
   userid: string;
   name: string;
   score: number;
}

type PlayerLeaderboardProps = {
   players: LeaderboardPlayerInfo[];
   noImage?: boolean;
}

export default function PlayerLeaderboard ({ players, noImage }: PlayerLeaderboardProps) {
   const { user } = useUser();

   const formatScore = (score: LeaderboardPlayerInfo["score"]) => new Intl.NumberFormat("en-GB").format(Number(score ?? 0));

   function getSubtitle(rank: number): string {
      if (rank === 1) return "Leading this week";
      if (rank === 2) return "2nd on the leaderboard";
      if (rank === 3) return "3rd on the leaderboard";
      return "Weekly challenger";
   }

   return (
      <section className="leaderboard">
         {players.slice(0, 10).map((player, index) => {
            const rank = index + 1;
            const isFirst = rank === 1;
            const isSecond = rank === 2;
            const isThird = rank === 3;

            const isCurrentUser = user?.userid == player.userid;

            const tier = isFirst
               ? "first"
               : isSecond
                  ? "second"
                  : isThird
                     ? "third"
                     : "standard";

            return (
               <article key={index} className={`weekly-board__player weekly-board__player--${tier}`}>
                  <span className="weekly-board__rank">{String(rank).padStart(2, "0")}</span>

                  <div className="weekly-board__identity">
                     <div className="weekly-board__name-row">
                        <span className="weekly-board__name text-xs bold-700">{player.name}</span>
                        {isCurrentUser && (<span className="weekly-board__you">YOU</span>)}
                     </div>
                     <span className="weekly-board__subtitle text-t">{getSubtitle(rank)}</span>
                  </div>

                  <div className="weekly-board__score">
                     <strong>{formatScore(player.score)}</strong>
                     <span>POINTS</span>
                  </div>

                  {(isFirst || isSecond || isThird) && (
                     <div
                        className="weekly-board__award"
                        aria-label={`${rank}${rank === 1 ? "st" : rank === 2 ? "nd" : "rd"} place`}
                     >
                        {isFirst ? (
                        <Crown size={21} strokeWidth={2} />
                        ) : (
                        <Medal size={21} strokeWidth={2} />
                        )}
                     </div>
                  )}
               </article>
            );
         })}
      </section>
   )
}