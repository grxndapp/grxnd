'use client'
import {  BookOpen, Lightbulb } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CustomRawIcon } from "@/components/Icons/Icon";
import { CustomIconUrls } from "@/lib/icons";
import { QuizIllustration, NotesIllustration, FillInTheBlankIllustration, FlashcardsIllustration, LyricGimmickIllustration, SixtySevenIllustration } from "@/components/StudyMethodIcons/StudyMethodIcons";
import { useModal } from "@/components/Modal/ModalContext";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import StudyMethodCard from "@/components/StudyMethodCard/StudyMethodCard";
import Spacing from "@/components/Spacing/Spacing";
import { FillInTheBlankLoader, FlashcardMakingLoader, LyricGimmickLoader, NoteMakingLoader, QuizLoader, SixtySevenLoader } from "@/components/SubjectLoaders/SubjectLoaders";

type HomePageProps = {
   // quizzes: QuizT[];
   // notes: Note[];
   welcomeString: string;
}

const featureDescriptions: Record<string, any> = {
   "67-way": {
      icon: SixtySevenLoader,
      title: "67 Way",
      subtitle: "The secret sauce is coming.",
      description: "A new way to switch up your study routine. Stay tuned."
   },
   "quiz": {
      icon: QuizLoader,
      title: "Take a Quiz",
      subtitle: "Find out what actually stuck.",
      description: "Put your knowledge to the test, spot what needs work and earn points as you practise."
   },
   "notes": {
      icon: NoteMakingLoader,
      title: "New Note",
      subtitle: "Big topics. Clear notes.",
      description: "Turn your files and topics into structured study notes that make the key ideas easier to understand."
   },
   "fitb": {
      icon: FillInTheBlankLoader,
      title: "Fill in the Blank",
      subtitle: "Know it? Fill it in.",
      description: "Complete the missing words to practise recalling key facts and check your understanding."
   },
   "flashcards": {
      icon: FlashcardMakingLoader,
      title: "Quick Learn",
      subtitle: "Small cards. Steady progress.",
      description: "Work through bite-sized flashcards to learn key ideas and refresh your memory."
   },
   "lyric": {
      icon: LyricGimmickLoader,
      title: "Lyric Gimmick",
      subtitle: "Give tricky topics a familiar twist.",
      description: "Explore concepts through stories, analogies or lyrics that connect new ideas to things you already know."
   }
};

export default function HomePage ({ welcomeString }: HomePageProps) {
   const router = useRouter();
   const { data: session } = useSession();
   const { showModal, close } = useModal();
   const studyMethodIconSize = 30;

   function getFeatureInfo (key: string) {
      return featureDescriptions[key];
   }

   function openFeatureDescription (key: string) {
      const featureInfo = getFeatureInfo(key);
      showModal({
         content: (<div className="box full pd-3 pdx-3 dfb column gap-10">
            <div className="box full">
               <featureInfo.icon size={studyMethodIconSize*4} />
            </div>
            <div className="text-l full bold-700">{featureInfo.title}</div>
            <div className="text-xxs full">{featureInfo.subtitle}</div>
            <div className="text-xs full">{featureInfo.description}</div>
            <div className="box full mt-1">
               <button className="xxs pd-12 pdx-2 radius-2 outline-black tiny-shadow" onClick={() => close()}>Close</button>
            </div>
         </div>)
      })
   }

   return (
      <AppWrapper>
         <div className="box full h-full pd-1">
            <div className="box full mt-15">
               <div className="box full mb-1 dfb align-center justify-center">
                  <CustomRawIcon url={CustomIconUrls.WelcomeIcon} size={150} />
               </div>
               <div className="text-l full dfb wrap gap-5 align-center justify-center">Hello, <span className="text-l bold-600 fit">{session?.user?.name}</span></div>
               <div className="text-xxs full pd-05 text-center">{welcomeString}</div>
            </div>

            <div className="box full dfb column gap-10 align-center pd-2">
               <button className="xs pd-15 full mw-500 radius-20 accent-hover" onClick={() => router.push("/quiz-maker")}>
                  <Lightbulb size={19} /> Start A Quiz
               </button>
               <button className="xs pd-15 full mw-500 radius-20 outline-black" onClick={() => router.push("/note-maker")}>
                  <BookOpen size={19} /> Learn Something
               </button>
            </div>

            <div className="box full pd-3 dfb justify-center wrap gap-10">
               <StudyMethodCard
                  icon={<SixtySevenIllustration width={studyMethodIconSize} height={studyMethodIconSize} size={studyMethodIconSize} />}
                  onClick={() => openFeatureDescription("67-way")}
                  title="67 Way"
                  description="Coming Soon. Secret Sauce Geniuses use"
               />
               <StudyMethodCard
                  icon={<QuizIllustration size={studyMethodIconSize} />}
                  onClick={() => openFeatureDescription("quiz")}
                  title="Take A Quiz"
                  description="Good for practising and gaining points"
               />
               <StudyMethodCard
                  icon={<NotesIllustration size={studyMethodIconSize} />}
                  onClick={() => openFeatureDescription("notes")}
                  title="New Note"
                  description="Helps you make structured notes on big files and topics"
               />
               <StudyMethodCard
                  icon={<FillInTheBlankIllustration size={studyMethodIconSize} />}
                  onClick={() => openFeatureDescription("fitb")}
                  title="Fill in the Blank"
                  description="Perfect for theory and understanding"
               />
               <StudyMethodCard
                  icon={<FlashcardsIllustration size={studyMethodIconSize} />}
                  onClick={() => openFeatureDescription("flashcards")}
                  title="Quick Learn"
                  description="Learn a topic very fast with fast (flash) cards"
               />
               <StudyMethodCard
                  icon={<LyricGimmickIllustration size={studyMethodIconSize} />}
                  onClick={() => openFeatureDescription("lyric")}
                  title="Lyric Gimmick"
                  description="Helps you learn any concept with stories, analogies or lyrics"
               />
            </div>

            <Spacing size={3} />
         </div>
      </AppWrapper>
   )
}
