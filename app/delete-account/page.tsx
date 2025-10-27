import { dalRequireAuthRedirect } from "@/dal/helpers";
import DeleteAccountPage from "./DeleteAccountPage";

export default async function DeleteAccount () {
   await dalRequireAuthRedirect();
   return <DeleteAccountPage />;
}