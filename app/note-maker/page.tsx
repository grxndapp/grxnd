import NoteMakerPage from "./NoteMakerPage";
import { dalRequireSubscriber } from "@/dal/helpers";

export default async function NoteMaker () {
   await dalRequireSubscriber();
   return <NoteMakerPage />;
}