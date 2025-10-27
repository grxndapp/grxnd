'use client'
import Card from "@/components/Card/Card";
import TournamentQuizViewer from "./TournamentQuizViewer";
import Spacing from "@/components/Spacing/Spacing";
import PlayerLeaderboard from "@/components/PlayerLeaderboard/PlayerLeaderboard";
import socket from "@/lib/socket";
import RoomLoading from "@/components/RoomLoading/RoomLoading";
import { CustomIcon } from "@/components/Icons/Icon";
import { pluralSuffixer, titleCase } from "@/lib/str";
import { LogIn, LogOut, Play } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type QuizConfig = {
   subjectLevel: string;
   numQuestions: string;
   subject: string;
   topic: string;
}

type QuizRoomGameProps = {
   gameRoomId: string;
   leaveAction: Function;
   quizConfigSet: QuizConfig;
   quiz: QuizQuestion[] | null;
}

export default function QuizRoomGame ({ gameRoomId, leaveAction, quizConfigSet, quiz }: QuizRoomGameProps) {
   const { data: session } = useSession();
   const router = useRouter();

   const [loadGame, setLoadGame] = useState(false);
   const [users, setUsers] = useState<any[]>([]);
   const [currentUser, setCurrentUser] = useState<any>(null);

   const [quizData, setQuizData] = useState<Quiz | null>(quiz || null);
   const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(quizConfigSet || null);

   const [quizQuestionStatus, setQuizQuestionStatus] = useState<"complete"|"play-game"|"leaderboard">("complete");

   useEffect(() => {
      if (users.length > 0) setLoadGame(true);
   }, [users]);

   useEffect(() => {
      socket.on("room_update", (updatedUsers: any) => {
         setUsers(updatedUsers);
         setCurrentUser(updatedUsers.filter((user: any) => (user.image == session?.user?.image! && user.username === session?.user?.name! ))[0]);
      });

      socket.on("owner_start", () => {
         setQuizQuestionStatus("play-game");
      })

      socket.on("quiz_update", ({ quizJson, quizConfig }: any) => {
         setQuizConfig(quizConfig);
         setQuizData(quizJson);
         setQuizQuestionStatus("complete");
      })

      return () => {
         socket.off("room_update");
         socket.off("quiz_update");
         socket.off("owner_start");
      };
   }, []);

   const leaveGameBtn = () => {
      socket.disconnect();
      leaveAction();
   }

   const ownerStartGame = () => {
      if (currentUser == null) return;
      if (currentUser.role !== "owner") return;
      socket.emit("owner_start_game", gameRoomId);
   }

   const finishQuizAction = (score: number) => {
      if (currentUser == null) return;
      if (!currentUser) return;
      socket.emit("finished_quiz", {
         roomId: gameRoomId,
         userId: currentUser.userid,
         newScore: score
      })
      setQuizQuestionStatus("leaderboard")
   }

   return (<>
      {(loadGame === false) ? (<>
         <RoomLoading />
      </>) : (<>
         {(quizQuestionStatus == "play-game" && quizData !== null && quizConfig !== null) && (<>
            <TournamentQuizViewer
               subject={quizConfig.subject}
               subjectLevel={quizConfig.subjectLevel}
               subjectTopic={quizConfig.topic}
               quiz={quizData}
               playerCount={users.length}
               gotoLeaderboard={(score: number) => finishQuizAction(score)}
            />
         </>)}
         
         {(quizQuestionStatus == "leaderboard") && (<>
            <div className="box full h-fit">
               <div className="text-ml bold-700 full text-center pd-1">Leaderboard</div>
               <div className="text-xs bold-500 full text-center">{quizConfig?.subjectLevel} {quizConfig?.subject} {quizConfig?.topic}</div>
               <Spacing size={1} />
               <button className="full xxs pd-12" onClick={() => leaveAction()}>
                  <LogIn size={17} /> Join Another Tournament
               </button>
               <Spacing size={2} />
               <div className="box full dfb column gap-20">
                  <PlayerLeaderboard
                     players={[...users].sort((a, b) => b.score - a.score)}
                     playerNameKey="username"
                  />
               </div>
            </div>
         </>)}

         {(quizQuestionStatus == "complete") && (<>
            <div className="box full">
               <div className="box full mb-1">
                  <div className="text-xl bold-700 full text-center pd-1">Quiz Tournament</div>
               </div>
               <div className="box full mb-1 dfb align-center">
                  <div className="box full">
                     <div className="text-xxs grey-4 full text-center">Tournament Code</div>
                     <div className="text-xl bold-700 text-center pd-05" style={{textTransform:"uppercase"}}>
                        {gameRoomId}
                     </div>
                  </div>
                  <div className="box full">
                     <div className="text-xxs grey-4 full text-center">{titleCase(pluralSuffixer('player', users.length, 's'))}</div>
                     <div className="text-xl bold-700 text-center pd-05">{users.length}</div>
                  </div>
               </div>

               {(users.length < 2) && (<>
                  <div className="text-xs text-center pd-15 error-text">
                     You need at least one other player to start the tournament.
                  </div>
               </>)}
               <div className="box dfb align-center justify-end gap-10">
                  {(currentUser !== null && currentUser.role == "owner" && quizQuestionStatus == "complete") && (<>
                     <button 
                        className="xxxs pd-1 full pdx-15 tiny-shadow" 
                        onClick={ownerStartGame}
                        disabled={(users.length < 2)}
                     >
                        <Play size={17} /> Start Game
                     </button>
                  </>)}
                  <button className="xxxs pd-1 full pdx-15 delete tiny-shadow" onClick={leaveGameBtn}>
                     <LogOut size={17} /> Leave
                  </button>
               </div>

               <Spacing size={1} />

               <div className="box full dfb column gap-10">
                  {users.map((user, index) => (
                     <Card key={index} styles={{padding:"15px"}}>
                        <div className="box full dfb align-center gap-10">
                           <div className="box h-full fit">
                              <CustomIcon url={user.image} size={40} round />
                           </div>
                           <div className="box full dfb column">
                              <div className="text-xs full bold-700 dfb align-center gap-6">
                                 {user.username}
                                 {(user.username == session?.user?.name! && user.image == session?.user?.image) && (
                                    <div className="text-xxxt fit accent-color-pill">YOU</div>
                                 )}
                              </div>
                              <div className="text-xxs accent-color full">{titleCase(user.role)}</div>
                           </div>
                           <div className="text-l bold-700 fit pdx-1">{user.score}</div>
                        </div>
                     </Card>
                  ))}
               </div>
            </div>
         </>)}
      </>)}
   </>)
}
