import { dalRequireAuthRedirect } from "@/dal/helpers";
import ChangePasswordPage from "./ChangePasswordPage";

export default async function ChangePassword () {
   await dalRequireAuthRedirect();
   return <ChangePasswordPage />;
}