import { dalRequireSubscriber } from "@/dal/helpers";
import { titleCase } from "@/lib/str";
import { isAmongstDefaultSubjects } from "@/utils/subjects";
import CreateNewNote from "./CreateNewNote";

type SubjectStatProps = {
   params: Promise<{
      level: string;
      subjectName: string;
   }>
}

export const dynamic = "force-dynamic";

export default async function SubjectNotesStartQuiz ({ params }: SubjectStatProps) {
   await dalRequireSubscriber();

   const { subjectName, level } = await params;
   const actualLevel = level == "none" ? "" : level.replaceAll("-"," ");

   const subjectInfo = titleCase(`${actualLevel} ${subjectName}`);
   const isDefaultSubject = isAmongstDefaultSubjects(subjectInfo);

   return (
      <CreateNewNote 
         subjectLevel={titleCase(actualLevel.replaceAll("-"," "))}
         subject={subjectName.replaceAll("-"," ")} 
         isDefaultSubject={isDefaultSubject}
      />
   );
}