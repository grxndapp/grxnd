'use client'
import { useSplashScreen } from "@/components/SplashScreen/SplashScreenContext";
import { titleCase } from "@/lib/str";
import { useEffect, useState } from "react";
import { subjectCombinator } from "../clientHelper";
import { PlayingCardsFan, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { generateUsingAi } from "@/app/actions/ai";
import { ResponseFormats } from "@/prompts/responseFormats";
import { subjectIcon } from "@/utils/subjects";
import { flashcardSubjectMakerPrompt } from "@/prompts/aiFlashcardsMaker";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Spacing from "@/components/Spacing/Spacing";
import ModalSelect from "@/components/ModalSelect/ModalSelect";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import BackpackBreadcrumb from "@/components/BackpackBreadcrumb/BackpackBreadcrumb";
import FlashcardViewer from "@/components/FlashcardViewer/FlashcardViewer";

type DefaultSubFlashcardsProps = {
   noteSelected: Note;
   subject: string;
   subjectLevel: string;
}

const testFlashcards = [
    {
        "question": "Define a **two-dimensional array**.",
        "answer": "A data structure storing elements in rows and columns, accessed by two indices."
    },
    {
        "question": "How are elements typically organised within a two-dimensional array?",
        "answer": "In a grid-like structure, with elements arranged in rows and columns."
    },
    {
        "question": "State the two indices used to access an element in a two-dimensional array.",
        "answer": "A row index and a column index."
    },
    {
        "question": "Describe how a two-dimensional array named `grid` with 3 rows and 4 columns might be declared.",
        "answer": "`grid[3][4]` or similar, depending on the programming language."
    },
    {
        "question": "Explain why nested loops are commonly used to process two-dimensional arrays.",
        "answer": "An outer loop iterates through rows, and an inner loop iterates through columns."
    },
    {
        "question": "What is meant by **traversing** a two-dimensional array?",
        "answer": "Visiting each element in the array exactly once, usually for processing."
    },
    {
        "question": "In row-major order traversal, which index changes fastest?",
        "answer": "The column index changes fastest."
    },
    {
        "question": "In column-major order traversal, which index changes fastest?",
        "answer": "The row index changes fastest."
    },
    {
        "question": "If a 2D array `data` has 5 rows and 6 columns, what are the valid index ranges for rows and columns?",
        "answer": "Rows $0$ to $4$, columns $0$ to $5$."
    },
    {
        "question": "Write pseudocode to access the element in the 2nd row and 3rd column of `myArray` (0-indexed).",
        "answer": "`myArray[1][2]`"
    },
    {
        "question": "Describe the general approach to find the maximum value in a two-dimensional array.",
        "answer": "Initialise max to first element, then iterate through all elements, updating max."
    },
    {
        "question": "How would you calculate the sum of all elements in a specific row (e.g., row 0) of a 2D array?",
        "answer": "Use a loop to iterate through columns of that specific row, adding each element."
    },
    {
        "question": "How would you calculate the sum of all elements in a specific column (e.g., column 1) of a 2D array?",
        "answer": "Use a loop to iterate through rows of that specific column, adding each element."
    },
    {
        "question": "Outline the process of searching for a specific value in a two-dimensional array.",
        "answer": "Use nested loops to check each element until the value is found or all checked."
    },
    {
        "question": "Give an example of a real-world application where a two-dimensional array would be suitable.",
        "answer": "Storing pixel data for an image, a chessboard, or a spreadsheet."
    },
    {
        "question": "What is the purpose of a **boundary check** when accessing elements in a 2D array?",
        "answer": "To prevent errors by ensuring indices are within the valid range of the array."
    },
    {
        "question": "What happens if you try to access an element using an index outside the array's defined range?",
        "answer": "An **out-of-bounds error** or **runtime error** occurs, potentially crashing the program."
    },
    {
        "question": "In pseudocode, if `rows` is the number of rows and `cols` is the number of columns, how would you iterate through all elements?",
        "answer": "`FOR row FROM 0 TO rows-1`, then `FOR col FROM 0 TO cols-1`."
    },
    {
        "question": "What is a common mistake when initialising or processing a 2D array with nested loops?",
        "answer": "Swapping the row and column indices, leading to incorrect access or errors."
    },
    {
        "question": "How are two-dimensional arrays typically stored in computer memory?",
        "answer": "As a contiguous block of memory, often in row-major order."
    }
]

export default function DefaultSubFlashcards ({ noteSelected, subject, subjectLevel }: DefaultSubFlashcardsProps) {
   const subInfo = subjectCombinator(subject, subjectLevel);
   const [topicSelected, setTopicSelected] = useState<string | null>('Testing');
   const [aiFlashcards, setAiFlashcards] = useState<Flashcard[] | null>(testFlashcards);
   
   const { openSplash, closeSplash } = useSplashScreen();

   function handleLoadingCreateFlashcards () {
      openSplash({
         title: <>Creating Flashcards</>,
         description: <>We are getting the flashcard questions for <b>{titleCase(subjectLevel)} {titleCase(subject)} {topicSelected!}</b>...</>,
         style: "flashcard",
         actions: []
      })
   }

   async function handleCreateFlashcardsAI (callback: Function) {
      if (!topicSelected) {
         toast.error("Please select a topic");
         callback();
         return;
      }
      handleLoadingCreateFlashcards();
      const data = await generateUsingAi({
         prompt: flashcardSubjectMakerPrompt({
            topic: topicSelected, subjectLevel: subInfo.subjectLevel, subject: subInfo.subject
         }),
         responseFormat: ResponseFormats.FlashcardMaker
      });

      if (data.success == false) {
         openSplash({
            title: "Error",
            description: data.error,
            style: "error",
            actions: [
               {
                  appearance: "normal",
                  action: () => handleCreateFlashcardsAI(()=>{}),
                  label: <><RotateCcw size={18} /> Try Again</>
               }
            ],
         })
         callback();
         return;
      }
      setAiFlashcards(data.data.flashcards || null);
      callback();
      closeSplash();
   }

   function resetFlashcards () {
      setAiFlashcards(null)
   }

   return (
      <AppWrapper>
         <div className="box full">
            <BackpackBreadcrumb
               startingBackpack
               links={[
                  {
                     label: <>{subjectIcon[subInfo.subject]} {titleCase(subjectLevel)} {titleCase(subject)}</>,
                     link: subInfo.subjectPageUrl
                  }
               ]}
            />

            {aiFlashcards ? (<>
               <div className="text-xl full bold-700 accent-color-gradient-dark-text">Flashcards</div>
               <div className="text-s full bold-500" style={{ color: subInfo.subjectColor }}>{subInfo.subjectLevel} {subInfo.subject}</div>
               <div className="box full pd-1">
                  <button className="xxxs pd-13 pdx-2 radius-20" onClick={resetFlashcards}><PlayingCardsFan size={16} /> New Flashcards</button>
               </div>
               <FlashcardViewer flashcards={aiFlashcards} />
            </>) : (<>
               <div className="box full pd-15">
                  <div className="text-xl full bold-700 accent-color-gradient-dark-text">Create Flashcards</div>
                  <div className="text-xs full bold-500" style={{ color: subInfo.subjectColor }}>{subInfo.subjectLevel} {subInfo.subject}</div>
               </div>
               <div className="box full pd-1 dfb column gap-15">
                  <div className="box full dfb column gap-10 pd-1">
                     <div className="text-m full bold-600">Choose Topic</div>
                     <ModalSelect
                        title="Choose Topic"
                        options={subInfo.subjectTopics}
                        onSelect={option => setTopicSelected(option)}
                     />
                  </div>
               </div>
               <div className="box full pd-1 dfb column gap-15">
                  <AwaitButton className="xxs pd-15 pdx-3 accent-hover radius-20" onClick={handleCreateFlashcardsAI}>
                     <PlayingCardsFan size={18} /> Create
                  </AwaitButton>
               </div>
            </>)}
         </div>
      </AppWrapper>
   )
}
