'use client'
import { ArrowLeft, NotebookPen, RotateCcw } from "lucide-react";
import { retrieveSubjectTopic, subjectLevels, subjects } from "@/utils/subjects";
import { RefObject, useEffect, useState } from "react";
import { generateUsingAi } from "../actions/ai";
import { subjectNoteMakerPrompt } from "@/prompts/subjectNoteMaker";
import { useSplashScreen } from "@/components/SplashScreen/SplashScreenContext";
import { ResponseFormats } from "@/prompts/responseFormats";
import { NoteIntensity } from "@/prompts/promptExtras";
import { noteExplanationTypeIntensityOptions } from "@/utils/intensityOptions";
import Spacing from "@/components/Spacing/Spacing"
import NoteViewer from "@/components/NoteViewer/NoteViewer";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import FullSelect from "@/components/FullSelect/FullSelect";
import IntensityChooser from "@/components/IntensityChooser/IntensityChooser";

type StepSection = "subject-level" | "subject" | "topic" | "detailed-topic";

export default function SubjectNoteMaker ({ contentRef, defaultSubjectLevel }: { contentRef: RefObject<HTMLDivElement | null>, defaultSubjectLevel?: string }) {
	const [stepSections, setStepSections] = useState<StepSection>(defaultSubjectLevel ? "subject" : "subject-level");

   const [subjectLevel, setSubjectLevel] = useState<string>(defaultSubjectLevel ?? '');
   const [subject, setSubject] = useState<string>('');
   const [topic, setTopic] = useState<string>('');
   const [detailedTopic, setDetailedTopic] = useState('');
	const [intensity, setIntensity] = useState<NoteIntensity>("high-school");

   const [canGenerateNote, setCanGenerateNote] = useState<boolean>(false);
   const [noteFromAI, setNoteFromAI] = useState<any | null>(null);

   const { openSplash, closeSplash } = useSplashScreen();

   useEffect(() => {
      setCanGenerateNote((subject !== "" && subjectLevel !== "" && topic !== ""));
   }, [subject, subjectLevel, topic])

   useEffect(() => {
      setTopic('');
   }, [subject, subjectLevel])

	function handleLoadingCreateNote () {
		openSplash({
			title: <>Creating Note</>,
			description: <>Creating your <b>{subjectLevel} {subject} {topic}</b> note...</>,
			style: "note",
			actions: []
		})
	}

   const createNoteAI = async (callback: Function) => {
      handleLoadingCreateNote();
      const data = await generateUsingAi({
         prompt: subjectNoteMakerPrompt({ subjectLevel, subject, subjectTopic: topic, detailedTopic, intensity }),
         responseFormat: ResponseFormats.NoteMaker
      })

      if (data.success == false) {
         openSplash({
            title: "Error",
            description: data.error,
            style: "error",
            actions: [
               {
                  appearance: "normal",
                  action: () => closeSplash(),
                  label: <><RotateCcw size={18} /> Try Again</>
               }
            ],
         })
         callback()
         return;
      }
      setNoteFromAI(data.data.note);
      contentRef.current?.scrollTo({ top: 0, behavior: "instant" });
      closeSplash();
   }

   return (<>
      {(noteFromAI !== null) && (<>
         {/* <RenderMarkdown content={noteFromAI} /> */}
         <NoteViewer 
				subject={`${subjectLevel} ${subject}`}
				note={noteFromAI}
				saveToDefaultFolder
			/>
         <Spacing size={4} />
      </>)}

		{(noteFromAI == null) && (<>
			{(stepSections == "subject-level") && (
				<FullSelect
					title="Choose Subject Level"
					description="It doesn't have to be an Advanced Higher, Higher or National 5"
					options={subjectLevels.map(n => ({ option: n, optionName: n }))}
					onSelect={(option) => {
						setSubjectLevel(option.optionName)
						setStepSections("subject")
					}}
				/>
			)}
			
			{(stepSections == "subject") && (
				<FullSelect
					title="Choose Subject"
					options={subjects.map(n => ({ option: n, optionName: n }))}
					onSelect={(option) => {
						setSubject(option.optionName)
						setStepSections("topic")
					}}
					backButton={() => setStepSections("subject-level")}
				/>
			)}
			
			{(stepSections == "topic") && (
				<FullSelect
					title="Choose Topic"
					options={retrieveSubjectTopic(subjectLevel, subject)?.map(n => ({ option: n, optionName: n }))!}
					onSelect={(option) => {
						setTopic(option.optionName)
						setStepSections("detailed-topic")
					}}
					backButton={() => setStepSections("subject")}
				/>
			)}
			
			
			{(stepSections == "detailed-topic") && (<div className="box full dfb column align-center pd-3">
				<div className="box full mw-1200">
					<div className="box full dfb column">
						<div className="text-xxs grey-5 full">Subject Chosen</div>
						<div className="text-s bold-600 full">{subjectLevel} {subject}</div>
					</div>
					<Spacing />
					<div className="box full dfb column">
						<div className="text-xxs grey-5 full">Topic Chosen</div>
						<div className="text-s bold-600 full">{topic}</div>
					</div>
				</div>
				<Spacing size={2} />

				<div className="text-s bold-600 full mw-1200">Detailed Topic (optional)</div>
				<div className="text-xxs full grey-5 pd-1 mw-1200">Enter the exact thing you want to learn from this</div>
				<textarea 
					className="xxs pd-15 pdx-2 full mw-1200 radius-20"
					value={detailedTopic} onChange={e => setDetailedTopic(e.target.value)}
				/>
				
				<Spacing />
				<div className="box full pd-2">
					<IntensityChooser
						title="Explanation Type"
						options={noteExplanationTypeIntensityOptions}
						onChange={name => setIntensity(name)}
						defaultOption={2}
					/>
				</div>
				<Spacing size={2} />

				<div className="box full dfb column align-center gap-10">
					{(canGenerateNote) && <AwaitButton className="xxs full pd-15 tiny-shadow mw-600 radius-20" onClick={createNoteAI}>
						<NotebookPen size={17} /> Generate Note
					</AwaitButton>}
					<button className="xxs pd-13 full mw-600 radius-20 outline-black" onClick={() => setStepSections("topic")}>
						<ArrowLeft size={18} /> Back
					</button>
				</div>
			</div>)}
         <Spacing size={7} />
      </>)}
   </>)
}