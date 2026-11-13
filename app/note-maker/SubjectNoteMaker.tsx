'use client'
import { ArrowLeft, ArrowRight, NotebookPen, RotateCcw } from "lucide-react";
import { retrieveSubjectTopic, subjectLevels, subjects } from "@/utils/subjects";
import { RefObject, useState } from "react";
import { generateUsingAi } from "../actions/ai";
import { subjectNoteMakerPrompt } from "@/prompts/subjectNoteMaker";
import { useSplashScreen } from "@/components/SplashScreen/SplashScreenContext";
import { ResponseFormats } from "@/prompts/responseFormats";
import { NoteIntensity } from "@/prompts/promptExtras";
import { noteExplanationTypeIntensityOptions } from "@/utils/intensityOptions";
import { ModalCustomSelect } from "@/components/ModalSelect/ModalSelect";
import { toast } from "sonner";
import { titleCase } from "@/lib/str";
import Spacing from "@/components/Spacing/Spacing"
import NoteViewer from "@/components/NoteViewer/NoteViewer";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import IntensityChooser from "@/components/IntensityChooser/IntensityChooser";

type StepSection = "subject" | "topic";

export default function SubjectNoteMaker ({ contentRef, defaultSubjectLevel }: { contentRef: RefObject<HTMLDivElement | null>, defaultSubjectLevel?: string }) {
	const [stepSections, setStepSections] = useState<StepSection>("subject");
   const [subjectLevel, setSubjectLevel] = useState<string>(defaultSubjectLevel ?? '');
   const [subject, setSubject] = useState<string>('');
   const [topic, setTopic] = useState<string>('');
   const [detailedTopic, setDetailedTopic] = useState('');
	const [intensity, setIntensity] = useState<NoteIntensity>("high-school");
   const [noteFromAI, setNoteFromAI] = useState<any | null>(null);

   const { openSplash, closeSplash } = useSplashScreen();

	function handleLoadingCreateNote () {
		openSplash({
			title: <>Creating Note</>,
			description: <>Creating your <b>{subjectLevel} {subject} {topic}</b> note...</>,
			style: "note",
			actions: []
		})
	}

   const createNoteAI = async (callback: Function) => {
		if (subjectLevel.trim() == "" || subject.trim() == "" || topic.trim() == "") {
			toast.error("Please fill in all the fields");
			callback();
			return;
		}

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

   function handleChooseTopic () {
      if (subjectLevel.trim() == '' || subject.trim() == '') {
         toast.error("Please fill in the fields");
      } else {
         setStepSections("topic")
      }
   }

   function handleChooseSubject () {
      setStepSections("subject")
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
			{(stepSections == "subject") && (<div className="box full dfb column gap-20 pd-2">
				{(!defaultSubjectLevel) && (<div className="box full dfb column pd-1">
					<div className="text-sm full bold-700 mb-1">Choose Subject Level</div>
					<ModalCustomSelect
						title="Choose Subject Level"
						options={subjectLevels.map(n => ({ option: n, optionName: n }))}
						onSelect={(option) => setSubjectLevel(option.optionName)}
						defaultOption={(subjectLevel !== '') ? subjectLevels.indexOf(subjectLevel) : undefined}
					/>
				</div>)}

				<div className="box full dfb column pd-1">
					<div className="box full mb-1">
						<div className="text-sm full bold-700">Choose Subject</div>
						{defaultSubjectLevel && (
							<div className="text-xs full">{titleCase(subjectLevel)}</div>
						)}
					</div>
					<ModalCustomSelect
						title="Choose Subject"
						options={subjects.map(n => ({ option: n, optionName: n }))}
						onSelect={(option) => setSubject(option.optionName)}
						defaultOption={(subject !== '') ? subjects.indexOf(subject)  : undefined}
					/>
				</div>

				<div className="box full dfb column pd-1">
					<button className="xxs pdx-2 pd-14 tiny-shadow radius-20 accent-hover" onClick={handleChooseTopic}>
						Continue <ArrowRight size={17} />
					</button>
				</div>
			</div>)}
			
			
			{(stepSections == "topic") && (<>
				<div className="box full dfb column pd-1">
					<button className="xxs pdx-2 pd-13 tiny-shadow radius-20 outline-black tiny-shadow" onClick={handleChooseSubject}>
						<ArrowLeft size={17} /> Back
					</button>
				</div>

				<div className="box full dfb column pd-1">
					<div className="text-sm full bold-700">Choose Subject Topic</div>
					<div className="text-xs full pd-05 mb-1">{titleCase(subjectLevel)} {titleCase(subject)}</div>
					<ModalCustomSelect
						title="Choose Subject Topic"
						options={retrieveSubjectTopic(subjectLevel, subject)!.map(n => ({ option: n, optionName: n }))}
						onSelect={(option) => setTopic(option.optionName)}
					/>
				</div>

				<div className="box full pd-2">
					<div className="box full pd-1">
						<div className="text-sm bold-700 full">Detailed Topic (optional)</div>
						<div className="text-xs full pd-1 mb-1">Enter the exact thing you want to learn from this quiz</div>
						<textarea 
							className="xs pd-15 pdx-2 full h-20 radius-15"
							value={detailedTopic} onChange={e => setDetailedTopic(e.target.value)}
							placeholder="I want questions on..."
						/>
					</div>
					<Spacing />
					
					<div className="box full pd-1">
						<div className="text-sm bold-700 full">Choose Explanation Type</div>
						<IntensityChooser
							title=""
							options={noteExplanationTypeIntensityOptions}
							onChange={name => setIntensity(name)}
							defaultOption={2}
						/>
					</div>
					<Spacing size={2} />

					<AwaitButton className="xxs pdx-3 pd-15 tiny-shadow radius-20 accent-hover" onClick={createNoteAI}>
						<NotebookPen size={17} /> Generate Note
					</AwaitButton>
					<Spacing size={3} />
				</div>
			</>)}
			
         <Spacing size={7} />
      </>)}
   </>)
}