import { dalRequireAuthRedirect } from "@/dal/helpers";
import SettingsPage from "./SettingsPage";

export default async function Settings () {
   const user = await dalRequireAuthRedirect();
   return <SettingsPage user={JSON.parse(JSON.stringify(user))} />;
}