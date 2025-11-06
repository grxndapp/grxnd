import { dalRequireSubscriber } from "@/dal/helpers";
import ImposterPage from "./ImposterPage";

export default async function Imposter () {
   await dalRequireSubscriber();
   return <ImposterPage />;
}