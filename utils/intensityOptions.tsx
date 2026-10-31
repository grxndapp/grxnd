import { Baby, Blocks, BookOpenCheck, BookUser, Brain, Calculator, GraduationCap, NotebookPen } from "lucide-react";

export const quizStyleIntensityOptions = [
   {
      icon: <BookOpenCheck />,
      description: "Mixture of everything",
      name: "mixture",
      nameLabel: "Mix"
   },
   {
      icon: <NotebookPen />,
      description: "Mainly theory questions",
      name: "theory",
      nameLabel: "Theory"
   },
   {
      icon: <Calculator />,
      description: "Mainly calculation questions",
      name: "calculation",
      nameLabel: "Calc"
   },
   {
      icon: <Brain />,
      description: "Difficult A-type questions",
      name: "difficult",
      nameLabel: "Sweat"
   },
]

export const noteExplanationTypeIntensityOptions = [
   {
      icon: <Baby />,
      description: "I'm a kid and I don't know anything about this note, subject or topic",
      name: "baby",
      nameLabel: "Baby"
   },
   {
      icon: <Blocks />,
      description: "I'm a toddler, make the note fun to read and easy to go through",
      name: "toddler",
      nameLabel: "Toddler"
   },
   {
      icon: <BookUser />,
      description: "I'm in high school, I kinda understand just guide me in the right path",
      name: "high-school",
      nameLabel: "Teen"
   },
   {
      icon: <GraduationCap />,
      description: "I'm in uni, I know what I'm doing I just want extra details so I don't fail",
      name: "uni-student",
      nameLabel: "Unc"
   },
]