'use client'
import { titleCase } from "@/lib/str";
import { anySubjectDefIcon, customSubjectToBoldColor, customSubjectToPastelColor, fullSubjectBreakDown, isAmongstDefaultSubjects, retrieveSubjectTopic, subjectAnimatedIcons, subjectColors, subjectIcon as subjectIcons, subjectPastelBgColors } from "@/utils/subjects";
import { getSubjectPageUrl } from "./helper";

export function subjectCombinator (subject: string, subjectLevel: string) {
   const subjectFullName = titleCase(`${subjectLevel} ${subject}`);
   const subjectInfo = titleCase(`${subjectLevel} ${subject}`.trim());

   const fullSubjectInfo = fullSubjectBreakDown(subjectInfo);
   const subjectPageUrl = getSubjectPageUrl(subject, subjectLevel);

   const isDefaultSubject = isAmongstDefaultSubjects(subjectInfo);

   const subjectColor = subjectLevel ? subjectColors[titleCase(subject)] : customSubjectToBoldColor(titleCase(subject));
   const subjectPastelColor = subjectLevel ? subjectPastelBgColors[titleCase(subject)] : customSubjectToPastelColor(titleCase(subject));
   const subjectAnimatedIcon = isDefaultSubject ? subjectAnimatedIcons[titleCase(subject)] : subjectAnimatedIcons["Any"];

   const subjectTopics = isDefaultSubject ? retrieveSubjectTopic(subjectLevel, subject) : [];
   const subjectIcon = isDefaultSubject ? subjectIcons[subject] : anySubjectDefIcon;
   
   return {
      subject: titleCase(subject).trim(),
      subjectLevel: titleCase(subjectLevel).trim(),
      subjectTopics: subjectTopics ?? [],
      subjectColor,
      subjectPastelColor,
      subjectPageUrl,
      fullSubjectInfo,
      isDefaultSubject,
      subjectIcon,
      subjectFullName,
      subjectAnimatedIcon
   }
}
