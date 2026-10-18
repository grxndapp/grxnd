import { dalRequireAuthRedirect } from "@/dal/helpers";
import BackPackPage from "./BackPack";

export default async function BackPack () {
   await dalRequireAuthRedirect();
   return <BackPackPage />;
}