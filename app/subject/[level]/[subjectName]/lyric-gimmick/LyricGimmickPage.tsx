'use client'
import AppWrapper from '@/components/AppWrapper/AppWrapper'
import BackpackBreadcrumb from '@/components/BackpackBreadcrumb/BackpackBreadcrumb'
import LyricDisplay from '@/components/LyricDisplay/LyricDisplay';
import ModalSelect, { ModalCustomSelect } from '@/components/ModalSelect/ModalSelect';
import AwaitButton from '@/components/AwaitButton/AwaitButton';
import Spacing from '@/components/Spacing/Spacing';
import { subjectCombinator } from '../clientHelper';
import { anySubjectDefIcon, subjectIcon } from '@/utils/subjects';
import { titleCase } from '@/lib/str';
import { cloneElement, useState } from 'react';
import { EighthNotes, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useSplashScreen } from '@/components/SplashScreen/SplashScreenContext';
import { generateUsingAi } from '@/app/actions/ai';
import { ResponseFormats } from '@/prompts/responseFormats';
import { lyricGimmickNoteMakerPrompt, lyricGimmickSubjectMakerPrompt } from '@/prompts/aiLyricGimmickMaker';

type LyricGimmickPageProps = {
   subject: string;
   subjectLevel: string;
   notes?: Note[];
}

export default function LyricGimmickPage ({ subject, subjectLevel, notes }: LyricGimmickPageProps) {
   const [topicSelected, setTopicSelected] = useState<string | undefined>(undefined);
   const [noteSelected, setNoteSelected] = useState<Note | undefined>(undefined);
   const [analogyWorld, setAnalogyWorld] = useState('Everyday Life');
   const [detailedTopic, setDetailedTopic] = useState('');
   const [aiLyricGimmick, setAiLyricGimmick] = useState<LyricGimmick | null>(null);

   // cosmetics
   const subjectInfo = subjectCombinator(subject, subjectLevel);
   const { openSplash, closeSplash } = useSplashScreen();
   const analogyWorlds = [
      { name: "Everyday Life", emoji: "🏠" },
      { name: "Football", emoji: "⚽" },
      { name: "Gaming", emoji: "🎮" },
      { name: "Music", emoji: "🎵" },
      { name: "Cooking", emoji: "🍳" },
      { name: "Space Exploration", emoji: "🚀" },
      { name: "Superheroes", emoji: "🦸" },
      { name: "Nature and Animals", emoji: "🌿" },
      { name: "Detective Stories", emoji: "🕵️" },
      { name: "Choose for Me", emoji: "🎲" },
   ];

	function handleLoadingCreateLyrics () {
		openSplash({
			title: <>Generating Lyrics</>,
			description: <>Generating lyrics from <b>{subjectInfo.subjectFullName} {topicSelected ? topicSelected : JSON.parse(noteSelected?.noteJson!).title}</b>...</>,
			style: "lyrics",
			actions: []
		})
	}

   async function handleGenerateLyrics (callback: Function) {
      if (!topicSelected && subjectInfo.isDefaultSubject) {
         toast.error("Please choose a topic");
         callback();
         return;
      }
      if (!noteSelected && !subjectInfo.isDefaultSubject) {
         toast.error("Please choose a note");
         callback();
         return;
      }
      if (!analogyWorld || analogyWorld == '') {
         toast.error("Please choose an analogy world");
         callback();
         return;
      }
		handleLoadingCreateLyrics();

		try {
			const data = await generateUsingAi({
				prompt: (subjectInfo.isDefaultSubject)
               ? lyricGimmickSubjectMakerPrompt({
                     subject: subjectInfo.subject, subjectLevel: subjectInfo.subjectLevel,
                     topic: topicSelected!, detailedTopic, analogyWorld 
                  })
               : lyricGimmickNoteMakerPrompt({ note: noteSelected?.noteJson!, detailedTopic, analogyWorld  }),
				responseFormat: ResponseFormats.LyricGimmick,
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

			setAiLyricGimmick(data.data.lyric);
			callback()
			closeSplash();
		} catch (err) {
			openSplash({
				title: "Error",
				description: "Something happened, an error occurred!",
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
   }

   return (
      <AppWrapper>
         <div className="box full">
            <BackpackBreadcrumb
               startingBackpack
               links={[
                  {
                     label: <>{subjectInfo.isDefaultSubject ? subjectIcon[subjectInfo.subject] : anySubjectDefIcon} {titleCase(subjectLevel)} {titleCase(subject)}</>,
                     link: subjectInfo.subjectPageUrl
                  }
               ]}
            />
            <div className="text-xl full bold-700 accent-color-gradient-dark-text">Lyric Gimmick 🎵</div>
            <div className="text-xs full bold-500" style={{ color: subjectInfo.subjectColor }}>
               {subjectInfo.subjectLevel} {subjectInfo.subject}
            </div>

            {(aiLyricGimmick == null) && (<>
               <div className="box full pd-1 dfb column gap-15">
                  {subjectInfo.isDefaultSubject ? (
                     <div className="box full dfb column gap-10 pd-1">
                        <div className="text-m full bold-600">Choose Note</div>
                        <ModalSelect
                           title="Choose Topic"
                           options={subjectInfo.subjectTopics}
                           onSelect={option => setTopicSelected(option)}
                        />
                     </div>
                  ) : (
                     <div className="box full dfb column gap-10 pd-1">
                        <div className="text-m full bold-600">Choose Note</div>
                        <ModalCustomSelect
                           title="Choose Note"
                           options={notes?.map(n => ({ option: JSON.parse(n.noteJson).title, optionName: n.noteid }))!}
                           onSelect={val => setNoteSelected(notes?.find(n => n.noteid == val.optionName)!)}
                        />
                     </div>
                  )}
               </div>
               <div className="box full pd-1 dfb column gap-15">
                     <div className="box full dfb column gap-10 pd-1">
                        <div className="text-m full bold-600">Analogy Worlds</div>
                        <div className="text-xs full">What niche do you want the lyrics to be about</div>
                        <ModalCustomSelect
                           title="Choose Analogy Worlds"
                           options={analogyWorlds.map(analogy => ({ option: `${analogy.emoji} ${analogy.name}`, optionName: analogy.name }))!}
                           onSelect={val => setAnalogyWorld(val.optionName)}
                           defaultOption={0}
                        />
                     </div>
               </div>
               <div className="box full pd-1 dfb column gap-15">
                  <div className="box full dfb column gap-10 pd-1">
                     <div className="text-m full bold-600 line-height-10">Detailed Topic (Recommended)</div>
                     <div className="box full">
                        <div className="text-xs full">It's optional but its <b className="accent-color">recommended</b> that you specify. </div>
                        <div className="text-xs full">Please enter more information on what exactly you want to understand, so we can make the best lyrics for you</div>
                     </div>
                     <textarea
                        className='xs full h-20 radius-20 pd-15 pdx-2'
                        placeholder='I want to learn...'
                        value={detailedTopic} onChange={e => setDetailedTopic(e.target.value)}
                     />
                  </div>
               </div>
               <div className="box full pd-1 dfb column gap-15">
                  <AwaitButton className="xxs full pd-14 tiny-shadow mw-300 accent-hover radius-20" onClick={handleGenerateLyrics}>
                     <EighthNotes size={17} /> Generate Lyrics
                  </AwaitButton>
               </div>
               <Spacing size={4} />
            </>)}

            {(aiLyricGimmick) && (
               <div className="box full pd-2">
                  <LyricDisplay 
                     title={topicSelected ? topicSelected : JSON.parse(noteSelected?.noteJson!).title}
                     artist={subjectInfo.subjectFullName}
                     lyrics={aiLyricGimmick} 
                     themeColor={subjectInfo.subjectColor}
                     animationLoader={cloneElement(subjectInfo.subjectAnimatedIcon, { size: 80 })}
                     backButton={() => {
                        setAnalogyWorld('Everyday Life')
                        setNoteSelected(undefined)
                        setTopicSelected(undefined)
                        setDetailedTopic('')
                        setAiLyricGimmick(null)
                     }}
                  />
               </div>
            )}
         </div>
      </AppWrapper>
   )
}