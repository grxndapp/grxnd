import EssayGraderPage from "./EssayGraderPage";
import { dalRequireSubscriber } from "@/dal/helpers";

export default async function EssayGrader () {
   await dalRequireSubscriber();
   return <EssayGraderPage />;
}