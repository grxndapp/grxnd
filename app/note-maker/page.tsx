import { sanitise } from "@/utils/extractJson";
import { getUserSubjectFolders } from "../actions/folder";
import { dalRequireSubscriber } from "@/dal/helpers";
import LoadingPage from "./loading";
import NoteMakerPage from "./NoteMakerPage";

export default async function NoteMaker () {
   await dalRequireSubscriber();

   const folders = await getUserSubjectFolders();
   if (folders) {
      return <NoteMakerPage allUserFolders={sanitise([ ...folders.map(f => f.name.toLowerCase()) ])} />;
   } else {
      return <LoadingPage />
   }
}