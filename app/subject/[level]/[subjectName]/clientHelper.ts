'use client'
import { titleCase } from "@/lib/str";
import { anySubjectDefIcon, customSubjectToBoldColor, customSubjectToPastelColor, fullSubjectBreakDown, isAmongstDefaultSubjects, retrieveSubjectTopic, subjectColors, subjectIcon as subjectIcons, subjectPastelBgColors } from "@/utils/subjects";
import { getSubjectPageUrl } from "./helper";

export function subjectCombinator (subject: string, subjectLevel: string) {
   const subjectInfo = titleCase(`${subjectLevel} ${subject}`.trim());

   const subjectColor = subjectLevel ? subjectColors[titleCase(subject)] : customSubjectToBoldColor(titleCase(subject));
   const subjectPastelColor = subjectLevel ? subjectPastelBgColors[titleCase(subject)] : customSubjectToPastelColor(titleCase(subject));
   const subjectPageUrl = getSubjectPageUrl(subject, subjectLevel);
   const fullSubjectInfo = fullSubjectBreakDown(subjectInfo);
   const isDefaultSubject = isAmongstDefaultSubjects(subjectInfo);
   const subjectTopics = isDefaultSubject ? retrieveSubjectTopic(subjectLevel, subject) : [];
   const subjectIcon = isDefaultSubject ? subjectIcons[subject] : anySubjectDefIcon;
   const subjectFullName = titleCase(`${subjectLevel} ${subject}`);

   return {
      subject: titleCase(subject),
      subjectLevel: titleCase(subjectLevel),
      subjectTopics: subjectTopics ?? [],
      subjectColor,
      subjectPastelColor,
      subjectPageUrl,
      fullSubjectInfo,
      isDefaultSubject,
      subjectIcon,
      subjectFullName
   }
}
