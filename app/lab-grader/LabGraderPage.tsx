'use client'
import "@/styles/note-maker.css"
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import Spacing from "@/components/Spacing/Spacing";
import LabReport from "./LabReport";
import { useSplashScreen } from "@/components/SplashScreen/SplashScreenContext";
import { useUser } from "@/hooks/useUser";
import { FlaskConical, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateUsingAi } from "../actions/ai";
import { gradeLabReportPrompt } from "@/prompts/aiLabReportGrader";
import { ResponseFormats } from "@/prompts/responseFormats";
import { uploadPresigned } from "@vercel/blob/client";

type FileInfo = {
   filename: string;
   fileExtension: string;
}

export default function LabGraderPage () {
   const { user } = useUser();
   const { openSplash, closeSplash } = useSplashScreen();

   const [isDragging, setIsDragging] = useState(false);
   const [inputFileValue, setInputFileValue] = useState<any | null>('');
   const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
   const [documentFile, setDocumentFile] = useState<File | null>(null);

   const [labReportTopic, setLabReportTopic] = useState("");
   const [labGradeReport, setLabGradeReport] = useState<LabGradeReport | null>(null);

   function handleGradeNewReport () {
      setIsDragging(false);
      setInputFileValue('');
      setFileInfo(null);
      setDocumentFile(null);
      setLabReportTopic('');
      setLabGradeReport(null);
   }

   const onFileUpload = async (e: any) => {
      const file = e.target.files[0];
      if (!file) {
         toast.error("No file found"); return;
      }

      // const acceptableExtensions = ['pdf'];
      const acceptableExtensions = ['pdf','txt', 'docx', 'pptx'];
      const extension = file.name.split(".").pop().toLowerCase();
      if (!acceptableExtensions.includes(extension)) {
         // toast.error("File must be a PDF, TXT, DOCX or PPTX file"); return;
         toast.error("File must be a PDF, TXT, DOCX or PPTX file"); return;
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

   function handleLoadingCreateLabGrade () {
		openSplash({
			title: <>Grading Lab Report</>,
			description: <>{user?.name}, your lab report is being graded...</>,
			style: "chemistry",
			actions: []
		})
   }

   async function handleCreateLabGradingReport (callback: Function) {
      if (!user) {
         toast.error("User not found. Please try again")
         callback();
         return;
      }
      if (labReportTopic.trim() == "") {
         toast.error("Please enter an essay")
         callback();
         return;
      }
      if (!documentFile) {
         toast.error("Please choose a file")
         callback()
         return;
      }
		handleLoadingCreateLabGrade();

		try {
			let uploadedFile;
			if (documentFile) {
				const blob = await uploadPresigned(`grxnd-uploads/${user?.email}/${documentFile.name}`, documentFile, {
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
				prompt: gradeLabReportPrompt({ topic: labReportTopic }),
				responseFormat: ResponseFormats.LabGrader,
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
         setLabGradeReport(data.data.lab_report_grade);
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
            {labGradeReport && (<>
               <div className="text-xxl bold-800 full accent-color-gradient-dark-text mb-1">Lab Graded</div>
               <div className="box full dfb justify-end">
                  <button className="xxs pd-13 pdx-2 radius-20" onClick={handleGradeNewReport}><FlaskConical size={17} /> Grade Another</button>
               </div>
               <div className="box full pd-1">
                  <LabReport labReportGrade={labGradeReport} />
               </div>
            </>)}
         
            {(labGradeReport == null) && (<>
               <div className="text-xxl bold-800 full accent-color-gradient-dark-text">Lab Grader</div>
               <div className="text-xs mb-1">Enter what your lab report is about and attach the lab report document as pdf</div>
               <div className="box full h-fit mt-1">
                  <div className="box full pd-1">
                     <textarea 
                        className="xs pd-2 pdx-2 full h-15 radius-20"
                        placeholder="Enter Lab Report Topic"
                        onChange={(e) => setLabReportTopic(e.target.value)}
                        value={labReportTopic}
                     />
                  </div>

                  <div className="box full pd-1">
                     {(fileInfo == null) ? (<>
                        <div className="box full pd-05">
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
                                       <div className="text-xs full text-center">Attach a PDF, TXT, DOCX or PPTX file</div>
                                    </div>
                                 </div>
                                 <input 
                                    type="file" name="file" id="drag-and-drop-file-input" value={inputFileValue}
                                    onChange={onFileUpload}
                                    // accept=".pdf"
                                    accept=".pdf,.txt,.docx,.pptx"
                                 />
                              </label>
                           </div>
                        </div>
                     </>) : (<>
                        <div className="text-xs full text-center pd-05 mb-1">Your document has been uploaded.</div>
                        <div className="document-upload-status">
                           <div className="file-info">
                              <div className="file-name">{fileInfo?.filename}</div>
                              <div className="file-extension">{fileInfo?.fileExtension}</div>
                           </div>
                           <div className="close-btn">
                              <button onClick={attachNewDocument}><X size={17} /></button>
                           </div>
                        </div>
                     </>)}
                  </div>

                  <AwaitButton className="xxs pd-14 pdx-3 radius-20" onClick={handleCreateLabGradingReport}>
                     <FlaskConical size={17} /> Grade Lab Report
                  </AwaitButton>
                  <Spacing size={4} />
               </div>
            </>)}
         </div>
      </AppWrapper>
   )
}
