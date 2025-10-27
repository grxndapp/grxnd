import HumanWriterPage from "./HumanWriterPage";
import { dalRequireSubscriber } from "@/dal/helpers";

export default async function HumanWriter () {
   await dalRequireSubscriber();
   return <HumanWriterPage />;
}