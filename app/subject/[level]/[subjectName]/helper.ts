export function getSubjectPageUrl (subject: string, subjectLevel?: string) {
   let formattedSubjectLevel = subjectLevel ? subjectLevel.replaceAll(" ", "-").toLowerCase() : 'none'
   let formattedSubject = subject.toLowerCase().replaceAll(" ", "-")
   return `/subject/${formattedSubjectLevel}/${formattedSubject}`
}