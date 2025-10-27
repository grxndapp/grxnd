import QuizMakerPage from "./QuizMaker";
import { dalRequireSubscriber } from "@/dal/helpers";

export default async function QuizMaker () {
   await dalRequireSubscriber();
   return <QuizMakerPage />;
}