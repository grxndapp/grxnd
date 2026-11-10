import { dalRequireSubscriber } from "@/dal/helpers";
import { getAllRecentFeedback } from "../actions/feedback";
import { sanitise } from "@/utils/extractJson";
import LoadingPage from "./loading";
import CommunityFeedbackPage from "./CommunityFeedbackPage";


export default async function page() {
   await dalRequireSubscriber();

   const feedbacks = await getAllRecentFeedback();

   if (feedbacks) {
      return <CommunityFeedbackPage feedbacks={sanitise(feedbacks)} />
   } else {
      return <LoadingPage />
   }
}
