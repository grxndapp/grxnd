import { dalRequireSubscriber } from "@/dal/helpers";
import LabGraderPage from "./LabGraderPage";

export default async function LabGrader () {
   await dalRequireSubscriber();
   return <LabGraderPage />;
}