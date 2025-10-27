import { dalRequireSubscriber } from "@/dal/helpers";
import { createTournamentCode } from "@/utils/uuid";
import QuizRoomPage from "./QuizRoomPage";

export default async function QuizRoom () {
   await dalRequireSubscriber();
   return <QuizRoomPage initialTourneyCode={createTournamentCode()} />;
}