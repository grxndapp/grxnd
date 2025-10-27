import ToolsPage from "./ToolsPage";
import { dalRequireSubscriber } from "@/dal/helpers";

export default async function Tools () {
   await dalRequireSubscriber();
   return <ToolsPage />;
}