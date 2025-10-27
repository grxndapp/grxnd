'use client'
import Card from "../Card/Card";
import { useSession } from "next-auth/react";
import { Medal } from "lucide-react";
import { CSSProperties } from "react";
import { CustomIcon } from "../Icons/Icon";

type PlayerLeaderboardProps = {
   players: any[];
   playerNameKey?: string;
   noImage?: boolean;
}

export default function PlayerLeaderboard ({ players, playerNameKey, noImage }: PlayerLeaderboardProps) {
   const { data: session } = useSession();
   
   const positionBadges = (position: number) => {
      const styles: CSSProperties = {
         width: "fit-content", height: "fit-content", aspectRatio: 1,
         display: "flex", alignItems: "center",
         justifyContent: "center", borderRadius: "100%",
         position: "absolute", top: "20px", right: "20px",
         padding: "5px"
      }
      const medalIconSize = 20;
      if (position === 1) {
         return (<div style={{
            ...styles, backgroundColor: "#ffae00", color: "black"
         }}><Medal size={medalIconSize} /></div>)
      } else if (position === 2) {
         return (<div style={{
            ...styles, backgroundColor: "#C0C0C0", color: "black"
         }}><Medal size={medalIconSize} /></div>)
      } else if (position === 3) {
         return (<div style={{
            ...styles, backgroundColor: "#8f5216", color: "white"
         }}><Medal size={medalIconSize} /></div>)
      }
      return null;
   }

   const validateCurrentPlayer = (player: any) => {
      if (noImage) {
         return (player[playerNameKey || 'name'] == session?.user?.name!)
            ? "2px solid #1131ff"
            : ""
      } else {
         return (player[playerNameKey || 'name'] == session?.user?.name! && player.image == session?.user?.image)
            ? "2px solid #1131ff"
            : ""
      }
   }

   return (
      <div className="box full dfb column gap-20">
         {players.map((player: any, index: number) => (
            <Card key={index} styles={{
               width: "100%", padding: "15px",
               display: "flex", flexDirection: "column",
               position: "relative",
               border: validateCurrentPlayer(player)
            }}>
               {positionBadges(index+1)}
               <div className="text-xs bold-600 full mb-1 accent-color">#{index+1} place</div>
               <div className="box full dfb align-center gap-10">
                  {(!noImage) && (<div className="box fit h-full">
                     <CustomIcon size={50} url={player.image} round />
                  </div>)}
                  <div className="box full dfb column">
                     <div className="text-xs bold-600 full dfb align-center gap-10">
                        {player[playerNameKey || 'name']}
                     </div>
                     <div className="text-xxs accent-color full">{player.score} points</div>
                  </div>
               </div>
            </Card>
         ))}
      </div>
   )
}
