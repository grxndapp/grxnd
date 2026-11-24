import { dalRequireAuthRedirect } from "@/dal/helpers";
import LabGraderPage from "./LabGraderPage";

export default async function LabGrader () {
   await dalRequireAuthRedirect();
   return <LabGraderPage />;
}