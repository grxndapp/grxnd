import { dalRequireSubscriber } from "@/dal/helpers";
import BackPackPage from "./BackPack";

export default async function BackPack () {
   await dalRequireSubscriber();
   return <BackPackPage />;
}