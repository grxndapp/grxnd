'use client'
import { LogIn, PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { subjectLevels, subjects, retrieveSubjectTopic } from "@/utils/subjects";
import { callChatGPT } from "../actions/ai";
import { toast } from "sonner";
import { createTournamentCode } from "@/utils/uuid";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Spacing from "@/components/Spacing/Spacing";
import SwitchSlide from "@/components/SwitchSlide/SwitchSlide";
import socket from "@/lib/socket";
import QuizRoomGame from "./QuizRoomGame";
import ModalSelect from "@/components/ModalSelect/ModalSelect";
import TournamentLoading from "@/components/TournamentLoading/TournamentLoading";
import quizMakerPrompt, { quizMakerPromptNoTopic } from "@/prompts/quizMaker";

export default function QuizRoomPage({ initialTourneyCode }: { initialTourneyCode: string }) {
   const { data: session } = useSession();
   const [quizStartType, setQuizStartType] = useState('create');

   const [roomId, setRoomId] = useState("");
   const [gameRoomId, setGameRoomId] = useState("");
   const [tournamentCode, setTournamentCode] = useState(initialTourneyCode);

   const [subjectLevel, setSubjectLevel] = useState<string>('');
   const [subject, setSubject] = useState<string>('');
   const [topic, setTopic] = useState<string>('');
   const [numQuestions, setNumQuestions] = useState<string>('5');
   const [canGenerateQuiz, setCanGenerateQuiz] = useState<boolean>(false);

   const [quizJson, setQuizJson] = useState<Quiz | null>(null);

   useEffect(() => {
      setCanGenerateQuiz((subject !== "" && subjectLevel !== ""));
   }, [subject, subjectLevel])
   
   useEffect(() => {
      socket.connect();
   }, [])
   
   const createQuizAI = async () => {
      let data;
      if (topic == '' || !topic) {
         data = await callChatGPT(quizMakerPromptNoTopic(subjectLevel, subject, numQuestions));
      } else {
         data = await callChatGPT(quizMakerPrompt(subjectLevel, subject, topic, numQuestions));
      }
      if (data.quiz) {
         return data.quiz;
      } else {
         return null;
      }
   }

   const resetTourneyCode = () => {
      setTournamentCode(createTournamentCode());
   }

   const joinTournament = () => {
      if (!session?.user) return;
      if (roomId.trim().length == 7) {
         socket.on("join_result", (data: any) => {
            const { rid, status, result } = data;
            if (rid == roomId.toLowerCase()) {
               if (status == "success") {
                  toast.success(result)
                  setGameRoomId(roomId.toLowerCase());
                  setRoomId("")
                  setQuizStartType("game");
               } else {
                  toast.error(result);
               }
            }
         })
         socket.emit("join_room", {
            roomId: roomId.toLowerCase(),
            image: session.user.image!,
            username: session.user.name!
         });
      }
   };

   const createTournament = async () => {
      if (!session?.user) return;
      setQuizStartType("game");
      setQuizStartType("loading-quiz");
      const quizDataFromAi = await createQuizAI();

      if (quizDataFromAi) {
         socket.emit("create_room", {
            roomId: tournamentCode,
            image: session.user.image!,
            username: session.user.name!,
            quiz: quizDataFromAi,
            quizConfig: { subjectLevel, subject, topic, numQuestions }
         });
         setQuizJson(quizDataFromAi);
         setGameRoomId(tournamentCode);
         setQuizStartType("game");
      } else {
         toast.error("Failed to create quiz. Please try again!");
         setGameRoomId("");
         setRoomId("");
         setNumQuestions("5");
         setSubject("");
         setSubjectLevel("");
         setTopic("");
         setCanGenerateQuiz(false);
         setQuizStartType("create");
      }
   };

   return (
      <AppWrapper noNavbar={(quizStartType === "loading-quiz")}>
         {(quizStartType == "game") ? (<>
            <QuizRoomGame 
               gameRoomId={gameRoomId} 
               leaveAction={() => {
                  socket.emit("leave", gameRoomId);
                  socket.connect();
                  resetTourneyCode();
                  setGameRoomId("");
                  setRoomId("");
                  setNumQuestions("5");
                  setSubject("");
                  setSubjectLevel("");
                  setTopic("");
                  setCanGenerateQuiz(false);
                  setQuizStartType("create");
               }}
               quiz={quizJson}
               quizConfigSet={{ subjectLevel, subject, topic, numQuestions }}
            />
         </>) : (quizStartType == "loading-quiz") ? (<>
            <TournamentLoading
               quizConfig={{ subjectLevel, subject, topic, numQuestions }}
            />
         </>) : (<>
            <div className="box full h-full">
               <div className="box full mb-2">
                  <div className="text-xxl bold-700 full text-center">Quiz Tournament</div>
               </div>

               {(quizStartType == "create" || quizStartType == "join") && (<>
                  <SwitchSlide
                     items={[{ label: <><PlusCircle size={17} /> Create</>, key: "create" }, { label: <><LogIn size={17} /> Join</>, key: "join" }]}
                     onItemSelected={(itemKey) => setQuizStartType(itemKey)}
                  />
                  <Spacing size={2} />
               </>)}

               {(quizStartType == "create") && (<>
                  <div className="box full mb-2">
                     <div className="text-xxs grey-4 full text-center">Tournament Code</div>
                     <div className="text-xl bold-700 text-center pd-1" style={{textTransform:"uppercase"}}>
                        {tournamentCode}
                     </div>
                  </div>
                  <div className="text-sm bold-600 full mt-05">Number of Questions</div>
                  <div className="text-xs full pd-1">More questions takes a longer time to generate quiz</div>
                  <ModalSelect
                     options={["5","10","20","30","40","50"]}
                     onSelect={(option) => setNumQuestions(option)}
                     title="Choose Number of Questions"
                     defaultOption={0}
                  />
                  <Spacing size={1} />

                  <div className="text-sm bold-600 full pd-1">Subject Level</div>
                  <ModalSelect
                     options={subjectLevels}
                     onSelect={(option) => setSubjectLevel(option)}
                     title="Choose Subject Level"
                  />
                  <Spacing size={1} />

                  <div className="text-sm bold-600 full pd-1">Subject</div>
                  <ModalSelect
                     options={subjects}
                     onSelect={(option) => setSubject(option)}
                     title="Choose Subject"
                  />
                  <Spacing size={1} />

                  {(subject !== "" && subjectLevel !== "") && (<>
                     <div className="text-sm bold-600 full pd-1">Subject Topic (optional)</div>
                     <ModalSelect
                        options={retrieveSubjectTopic(subjectLevel, subject)!}
                        onSelect={(option) => setTopic(option)}
                        title={`Choose ${subjectLevel} ${subject} Topic`} showDeselect
                     />
                     <Spacing size={2} />
                  </>)}

                  <button className="xxs full pd-12" onClick={createTournament} disabled={!canGenerateQuiz}>
                     Create Tournament
                  </button>
                  <Spacing size={5} />
               </>)}

               {(quizStartType == "join") && (<>
                  <div className="box full mb-2">
                     <div className="text-xxs grey-4 full text-center mb-1">Enter Tournament Code</div>
                     <input
                        className="l full pd-13 pdx-2"
                        placeholder="Tournament Code"
                        value={roomId}
                        style={{textTransform: "uppercase"}}
                        maxLength={7}
                        onChange={(e) => setRoomId(e.target.value)}
                     />
                  </div>
                  <button className="xxs full pd-12" onClick={joinTournament}>Join</button>
               </>)}
            </div>
         </>)}
      </AppWrapper>
   );
}
