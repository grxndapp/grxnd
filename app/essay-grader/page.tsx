import EssayGraderPage from "./EssayGraderPage";
import { dalRequireAuthRedirect } from "@/dal/helpers";

export default async function EssayGrader () {
   await dalRequireAuthRedirect();
   return <EssayGraderPage />;
}