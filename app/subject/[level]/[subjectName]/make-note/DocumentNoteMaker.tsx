'use client'
import "@/styles/note-maker.css"
import { useState } from "react"
import { toast } from "sonner";
import { NotebookPen, RotateCcw, X } from "lucide-react";
import { generateUsingAi } from "@/app/actions/ai";
import { buildFileNotePrompt } from "@/prompts/subjectNoteMaker";
import { ResponseFormats } from "@/prompts/responseFormats";
import { useSplashScreen } from "@/components/SplashScreen/SplashScreenContext";
import { fullSubjectBreakDown, isAmongstDefaultSubjects } from "@/utils/subjects";
import { NoteIntensity } from "@/prompts/promptExtras";
import { noteExplanationTypeIntensityOptions } from "@/utils/intensityOptions";
import { useUser } from "@/hooks/useUser";
import { uploadPresigned } from "@vercel/blob/client";
import Spacing from "@/components/Spacing/Spacing";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import NoteViewer from "@/components/NoteViewer/NoteViewer";
import IntensityChooser from "@/components/IntensityChooser/IntensityChooser";

type FileInfo = {
   filename: string;
   fileExtension: string;
}

export default function DocumentNoteMaker ({ subjectFullName }: { subjectFullName: string }) {
	const { user } = useUser();
   const { openSplash, closeSplash } = useSplashScreen();
   const [inputFileValue, setInputFileValue] = useState<any | null>('');
   const [isDragging, setIsDragging] = useState(false);
   const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
   const [documentFile, setDocumentFile] = useState<File | null>(null);
	const [intensity, setIntensity] = useState<NoteIntensity>("high-school");
   const [noteFromAI, setNoteFromAI] = useState<NoteMaker | null>(null);

	const fullSubjectInfo = fullSubjectBreakDown(subjectFullName);
	const isDefaultSubject = isAmongstDefaultSubjects(`${fullSubjectInfo.subjectLevel} ${fullSubjectInfo.subject}`);

   const onFileUpload = async (e: any) => {
      const file = e.target.files[0];
      if (!file) {
         toast.error("No file found"); return;
      }

      // const acceptableExtensions = ['pdf','txt', 'docx', 'pptx'];
      const acceptableExtensions = ['pdf'];
      const extension = file.name.split(".").pop().toLowerCase();
      if (!acceptableExtensions.includes(extension)) {
         // toast.error("File must be a PDF, TXT, DOCX or PPTX file"); return;
         toast.error("File must be a PDF file"); return;
      }

      setInputFileValue(e.target.value);
      setDocumentFile(file);
      setFileInfo({ filename: file.name.split(`.${extension}`)[0], fileExtension: extension.toUpperCase() });
   }

   const attachNewDocument = () => {
      setInputFileValue('');
      setFileInfo(null);
   }

   const handleDrop = (e: any) => {
      e.preventDefault();
      setIsDragging(false);
      onFileUpload({ target: { files: e.dataTransfer.files } });
   };

	function handleLoadingCreateNote () {
		openSplash({
			title: <>Creating Note</>,
			description: <>Creating your note from <b>{fileInfo?.filename}</b>...</>,
			style: "note",
			actions: []
		})
	}

   const createNoteAI = async (callback: Function) => {
      if (!user) {
         toast.error("No user found")
         callback()
         return;
      }
      if (!documentFile) {
         toast.error("Please choose a file")
         callback()
         return;
      }
		handleLoadingCreateNote();

		try {
			let uploadedFile;
			if (documentFile) {
				const blob = await uploadPresigned(`grxnd-uploads/${user.email}/${documentFile.name}`, documentFile, {
					access: "private",
					handleUploadUrl: "/api/file/upload"
				});
				uploadedFile = {
					pathname: blob.pathname,
					name: documentFile.name
				};
			}
			if (!uploadedFile) {
				toast.error("Failed to upload your file");
				setInputFileValue('');
				callback()
				return;
			}

			const data = await generateUsingAi({
				prompt: buildFileNotePrompt({ fileName: fileInfo?.filename, intensity }),
				responseFormat: ResponseFormats.NoteMaker,
				file: uploadedFile
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
			console.log(data)
			setNoteFromAI(data.data.note);
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

   return (<>
      {noteFromAI !== null ? (<>
         <NoteViewer 
            subject={isDefaultSubject ? `${fullSubjectInfo.subjectLevel} ${fullSubjectInfo.subject}`.toLowerCase().replaceAll("-"," ").trim() : ''} 
            note={noteFromAI}
            customSubject={!isDefaultSubject}
				saveToDefaultFolder
				saveToSubjectFolder={isDefaultSubject ? undefined : { folderName: `${fullSubjectInfo.subject.toLowerCase().replaceAll("-"," ")}`.trim() }}
         />
         <Spacing size={4} />
      </>) : (fileInfo == null) ? (<>
         <div className="box full pd-05">
				<Spacing />
            <div className="text-m bold-600 full">Upload Document</div>
            <div className="text-xxs full grey-5">Upload the document you want to learn more about</div>
            <div 
					className="box full pd-2 dfb column gap-10"
					onDragOver={(e) => {
						e.preventDefault();
						setIsDragging(true);
					}}
					onDragLeave={() => setIsDragging(false)}
					onDrop={handleDrop}
					
				>
               <label htmlFor="drag-and-drop-file-input">
                  <div className={`drag-and-drop-media-upload-area ${isDragging && 'dragging'}`}>
							<div className="box full dfb column align-center">
                     	<div className="text-m full text-center bold-500 accent-color-gradient-text">Drag and Drop / Click to Upload</div>
                     	<div className="text-xs full text-center">Attach a PDF file</div>
							</div>
                  </div>
                  <input 
                     type="file" name="file" id="drag-and-drop-file-input" value={inputFileValue}
                     onChange={onFileUpload}
                     // accept=".pdf,.txt,.docx,.pptx"
                     accept=".pdf"
                  />
               </label>
            </div>
         </div>
      </>) : (<>
         <div className="text-xs full text-center pd-05 mb-1">
            Your document has been uploaded.
         </div>
         <div className="document-upload-status">
            <div className="file-info">
               <div className="file-name">{fileInfo?.filename}</div>
               <div className="file-extension">{fileInfo?.fileExtension}</div>
            </div>
            <div className="close-btn">
               <button onClick={attachNewDocument}><X size={17} /></button>
            </div>
         </div>
			<div className="box full pd-2">
				<IntensityChooser
					title="Explanation Type"
					options={noteExplanationTypeIntensityOptions}
					onChange={name => setIntensity(name)}
					defaultOption={2}
				/>
			</div>
			<div className="box full dfb justify-center pd-1">
				<AwaitButton className="xxs full pd-14 tiny-shadow mw-400" onClick={createNoteAI}>
					<NotebookPen size={17} /> Generate Note
				</AwaitButton>
			</div>
      </>)}
   </>)
}