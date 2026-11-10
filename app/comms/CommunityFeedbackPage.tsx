'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Card from "@/components/Card/Card";
import { FeedbackCardStyles } from "@/styles-extra/styles";
import { timeAgo } from "@/utils/date";
import { formatNumber } from "@/utils/num";
import { Heart, Lock, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { upvoteFeedback } from "../actions/feedback";

type CommunityFeedbackPageProps = {
   feedbacks: Feedback[];
}

const feedbackVotedKey = "grxnd-feedback-voted-items"

export default function CommunityFeedbackPage ({ feedbacks }: CommunityFeedbackPageProps) {
   useEffect(() => {
      if (window.localStorage) {
         if (!window.localStorage.getItem(feedbackVotedKey)) {
            window.localStorage.setItem(feedbackVotedKey, JSON.stringify([]))
         }
      }
   }, [])

   return (
      <AppWrapper>
         <div className="text-xxl bold-800 accent-color-gradient-dark-text full">Users' Feedback</div>
         <div className="box full pd-15">
            <button className="xxxs pd-13 pdx-2 tiny-shadow radius-15" onClick={() => window.open('/feedback', '_target')}>
               <Plus size={18} /> Add Mine !
            </button>
         </div>
         <div className="box full pd-15 dfb column gap-10">
            {feedbacks.map(feedback => (
               <FeedbackCard key={feedback.feedbackId} feedback={feedback} />
            ))}
         </div>
      </AppWrapper>
   )
}


function FeedbackCard ({ feedback }: { feedback: Feedback }) {
   const [feedbackLikes, setFeedbackLikes] = useState(feedback.votes);
   const [hasLikedFeedback, setHasLikedFeedback] = useState(false);

   useEffect(() => {
      if (window.localStorage) {
         const rawUpvotedFeedbackItems = window.localStorage.getItem(feedbackVotedKey);
         if (rawUpvotedFeedbackItems) {
            const feedbackItems = JSON.parse(rawUpvotedFeedbackItems);
            console.log(feedbackItems);
            setHasLikedFeedback(feedbackItems.filter((f: string) => f == feedback.feedbackId).length>0);
         }
      }
   }, [])

   async function handleToggleUpvoteFeedback () {
      const accumulator = hasLikedFeedback ? -1 : 1
      setHasLikedFeedback(true);
      setFeedbackLikes(p => p+accumulator);
      const liked = await upvoteFeedback(feedback.feedbackId, accumulator);
      if (liked) {
         if (window.localStorage) {
            const rawUpvotedFeedbackItems = window.localStorage.getItem(feedbackVotedKey);
            if (rawUpvotedFeedbackItems) {
               const feedbackItems: string[] = JSON.parse(rawUpvotedFeedbackItems);
               if (accumulator > 0) {
                  feedbackItems.push(feedback.feedbackId);
                  window.localStorage.setItem(feedbackVotedKey, JSON.stringify([...feedbackItems]))
               } else {
                  setHasLikedFeedback(false);
                  window.localStorage.setItem(feedbackVotedKey, JSON.stringify([...feedbackItems.filter(f => f !== feedback.feedbackId)]))
               }
            }
         }
      } else {
         setHasLikedFeedback(false);
         setFeedbackLikes(p => p-accumulator);
      }
   }

   return (
      <Card styles={FeedbackCardStyles}>
         <div className="text-t grey-5 full dfb align-center gap-5">
            <Lock size={12} /> Anonymously Sent Feedback
         </div>
         <div className="text-xs pd-1">{feedback.feedback}</div>
         <div className="box full pd-1 dfb align-center gap-5">
            <button className="xxs pd-1 pdx-1 transparent no-shadow" onClick={handleToggleUpvoteFeedback}>
               <Heart size={20} color={hasLikedFeedback ? "#f80053" : "#000"} fill={hasLikedFeedback ? "#f80053" : "#fff"} /> 
            </button>
            <div className="text-s bold-600 fit" style={{ color: hasLikedFeedback ? "#f80053" : "#000" }}>
               {formatNumber(feedbackLikes, { useCommas: true })}
            </div>
         </div>
         <div className="text-xxxs full grey-5">{timeAgo(new Date(feedback.createdAt).getTime())}</div>
      </Card>
   )
}