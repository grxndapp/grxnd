'use client'
import { titleCase } from "@/lib/str";
import { customSubjectToBoldColor, customSubjectToPastelColor, fullSubjectBreakDown, isAmongstDefaultSubjects, retrieveSubjectTopic, subjectColors, subjectPastelBgColors } from "@/utils/subjects";
import { getSubjectPageUrl } from "./helper";

export function subjectCombinator (subject: string, subjectLevel: string) {
   const subjectInfo = titleCase(`${subjectLevel} ${subject}`.trim());
   const subjectColor = subjectLevel ? subjectColors[titleCase(subject)] : customSubjectToBoldColor(titleCase(subject));
   const subjectPastelColor = subjectLevel ? subjectPastelBgColors[titleCase(subject)] : customSubjectToPastelColor(titleCase(subject));
   const subjectPageUrl = getSubjectPageUrl(subject, subjectLevel);
   const fullSubjectInfo = fullSubjectBreakDown(subjectInfo);
   const isDefaultSubject = isAmongstDefaultSubjects(subjectInfo);
   const subjectTopics = retrieveSubjectTopic(subjectLevel, subject);
   return {
      subject: titleCase(subject),
      subjectLevel: titleCase(subjectLevel),
      subjectTopics: subjectTopics ?? [],
      subjectColor,
      subjectPastelColor,
      subjectPageUrl,
      fullSubjectInfo,
      isDefaultSubject
   }
}
