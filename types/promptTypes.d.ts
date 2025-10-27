type EssayGradeReport = {
   grade: number;
   comments: string;
   strengths: string[];
   weaknesses: string[];
   improvements: string[];
}

type NoteMaker = {
   title: string;
   overview: string;
   key_concepts: string[];
   rules: string[];
   examples: string[];
   visuals: string[];
   common_mistakes: string[];
   questions: string[];
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