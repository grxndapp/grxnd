type EssayGradeReport = {
   grade: number;
   comments: string;
   strengths: string[];
   weaknesses: string[];
   improvements: string[];
}

type NoteMakerExample = {
   question: string;
   solution: string[] | string;
} | string

type NoteMakerRule = {
   title: string;
   rule: string;
   use: string;
} | string

type NoteMakerCommonMistake = {
   mistake: string;
   fix: string;
} | string

type NoteMakerPracticeQuestion = {
   question: string;
   solution: string[] | string;
} | string

type NoteMaker = {
   title: string;
   subject?: string;
   overview: string;
   key_concepts: string[];
   rules: NoteMakerRule[];
   examples: NoteMakerExample[];
   visuals: string[];
   common_mistakes: NoteMakerCommonMistake[];
   questions: NoteMakerPracticeQuestion[];
   summary: string[];
}

type QuizQuestion = {
   question: string;
   options: string[];
   answerIndex: number;
   answerExplanation: string;
   questionType: string;
}
type Quiz = QuizQuestion[];

type ImposterGame = {
   imposterIndex: number;
   word: string;
   hint: string;
}