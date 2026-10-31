export type NoteIntensity = "baby" | "toddler" | "high-school" | "uni-student";
export const NOTE_INTENSITY_OPTIONS: readonly NoteIntensity[] = [
  "baby",
  "toddler",
  "high-school",
  "uni-student",
];

const INTENSITY_DESCRIPTIONS: Record<NoteIntensity, string> = {
   "baby": "I'm a kid and I don't know anything about this note, subject or topic",
   "toddler": "I'm a toddler, make the note fun to read and easy to go through",
   "high-school": "I'm in high school, I kinda understand just guide me in the right path",
   "uni-student": "I'm in uni, I know what I'm doing I just want extra details so I don't fail",
};

const INTENSITY_RULES: Record<NoteIntensity, string> = {
   "baby": `- Assume the learner knows nothing about this topic or the words used in it. Start from the very basics and never skip a step.
- Define every term the moment it appears, including words that seem obvious. Introduce only one new idea at a time.
- Use very short sentences and everyday words. Avoid jargon. If a technical word is unavoidable, explain it in plain words straight away.
- Use simple analogies from everyday life (food, games, school, family, animals) to explain each main idea.
- Keep worked examples tiny and gentle: clean, small numbers, and every step shown with a short reason for it.
- Make "common_mistakes" kind and encouraging, and explain why the mistake is easy to make.
- Make "questions" mostly straightforward, and start with the easiest possible one.
- Use the LOWER end of every entry range, so the note is not overwhelming.`,

   "toddler": `- Make the note fun, friendly, and easy to go through. Use a warm, upbeat, playful voice, with light humour where it fits.
- Use short, punchy sentences and simple words. Keep every entry quick to read and easy to scan.
- Explain ideas with vivid, relatable analogies, little stories, and memory tricks (mnemonics, rhymes, catchy phrases) wherever they genuinely help.
- You may use a small number of emojis to add energy: at most one per entry, never in "title", and never inside mathematical expressions.
- Keep worked examples light and clear, with simple numbers and short steps.
- Make "common_mistakes" feel like friendly "watch out!" tips, not scolding.
- Keep "questions" approachable and confidence-building.
- Fun must never replace accuracy. Every fact, formula, and answer must still be fully correct.
- Use the LOWER-MIDDLE of every entry range.`,

   "high-school": `- The learner has met the basics before and partly understands the topic. Guide them along the right path instead of starting from zero.
- Define new or technical terms briefly, but do not re-explain basic ideas from earlier years.
- Explain the "why" behind each rule in one or two sentences, so the learner understands it and does not just memorise it.
- Show how ideas connect and which to learn first. Add short, practical study tips and exam-style hints where they genuinely help.
- Show worked examples with the key steps and a short reason for each important step.
- In "common_mistakes", focus on the errors students typically make in tests and exams.
- Make "questions" a balanced mix of straightforward and moderately challenging.
- Use the MIDDLE of every entry range.
- Use a clear, friendly, and respectful tone.`,

   "uni-student": `- The learner already knows the fundamentals and wants extra detail so they do not fail. Be concise, precise, and thorough.
- Use correct technical terminology without over-explaining basic concepts.
- Go deeper than a surface summary: explain the reasoning behind each rule, when it applies, its conditions and limits, special cases, and how ideas link together.
- Where it adds value, show how a formula or method is derived or justified, in a few short steps.
- Keep worked examples compact but complete, favour harder or multi-step cases, and highlight the key decision points.
- In "common_mistakes", focus on subtle errors, misapplied conditions, and the traps that cost marks in exams.
- Make "questions" more demanding, with several multi-step or synthesis questions.
- Use the UPPER end of every entry range.
- Use a direct, efficient tone with no hand-holding. Do not add filler.`,
};

export function normaliseNoteIntensity(value: unknown): NoteIntensity {
   const v = String(value ?? "").trim().toLowerCase();
   return (NOTE_INTENSITY_OPTIONS as readonly string[]).includes(v) ? (v as NoteIntensity) : "high-school";
}

export function getNoteIntensitySnippet(intensity?: NoteIntensity | string): string {
   const level = normaliseNoteIntensity(intensity);
   return `## Explanation style (CRITICAL)

The learner chose this explanation style: "${level}".
In their own words: "${INTENSITY_DESCRIPTIONS[level]}"

Frame the whole note for this learner:

${INTENSITY_RULES[level]}

How this interacts with the other rules:
- This section controls HOW things are explained: tone, vocabulary, depth of explanation, and the kind of analogies and examples. It does not change WHAT is true.
- Accuracy is never reduced. Facts, formulas, working, and answers must stay fully correct at every style.
- Stay within the content scope set by the other rules. A simpler style means simpler wording and smaller steps, not different or invented content. A more detailed style means deeper explanation of the same content, not content from a higher level than the note allows.
- The JSON structure, the data type rules (every array entry is ONE string), the entry count ranges, and the formatting rules always apply exactly as written.
- Apply this style consistently to every field: "overview", "key_concepts", "rules", "examples", "common_mistakes", "questions", and "summary". The "title" stays plain text.`;
}

export type QuizStyle = "mixture" | "theory" | "calculation" | "difficult";

export const QUIZ_STYLE_OPTIONS: readonly QuizStyle[] = [
   "mixture",
   "theory",
   "calculation",
   "difficult",
];

const QUIZ_STYLE_DESCRIPTIONS: Record<QuizStyle, string> = {
   mixture: "Mixture of everything",
   theory: "Mainly theory questions",
   calculation: "Mainly calculation questions",
   difficult: "Difficult A-type questions",
};

const QUIZ_STYLE_RULES: Record<QuizStyle, string> = {
   mixture: `- Create a balanced mix of theory questions (definitions, concepts, reasoning, spotting errors) and application questions (calculations, worked problems, using methods).
- Aim for roughly half theory and half application. If the subject has little or no calculation content (for example English or Administration), use more conceptual, applied, and scenario-based questions instead.
- Use a spread of difficulty types: roughly 30% "3", 40% "2", 30% "1", adjusted sensibly for small question counts.
- Order the questions from easier to harder where possible.`,

   theory: `- Make at least 80% of the questions theory-based: definitions, concepts, explanations, cause and effect, comparisons, classifications, "which statement is correct" reasoning, and spotting misconceptions or errors.
- Test understanding of WHY and HOW, not just recall of words. Use short scenarios or situations where they help.
- Avoid numerical calculations. Do not ask for a computed value unless a very simple one is the clearest way to test a concept.
- Use a spread of difficulty types: roughly 30% "3", 40% "2", 30% "1", adjusted sensibly for small question counts.
- If the subject is calculation-heavy (for example Math), theory means concepts such as when a method applies, why a rule works, what a result means, and spotting an error in a given step. It does not mean computing a final value.`,

   calculation: `- Make at least 80% of the questions calculation-based: numerical or algebraic problems that need working out, such as using formulas, solving, converting units, interpreting values, and multi-step problems.
- Give all the values and units needed, use clean numbers where possible, and keep the working doable without a calculator unless the level calls for one.
- Make the wrong options the results of realistic errors: wrong formula, sign error, unit or conversion error, rounding error, a skipped step, or swapping variables.
- Explanations must show the full working step by step, not just the answer.
- Use a spread of difficulty types skewed towards application: roughly 15% "3", 50% "2", 35% "1", adjusted sensibly for small question counts.
- If the subject has little or no calculation content (for example English or Administration), do not invent calculations. Use the closest practical, quantitative, or step-by-step application questions the subject supports (for example counting, ordering, applying a rule, or working through a procedure).
- Order the questions from easier to harder where possible.`,

   difficult: `- Make the quiz hard. Aim for the demanding, top-grade, "A-type" questions that separate the strongest learners from the rest.
- Make at least 70% of the questions type "1" and the rest type "2". Use no type "3" questions.
- Favour multi-step problem solving, synthesis of several ideas, unfamiliar or twisted contexts, subtle conceptual distinctions, edge cases, and questions where a common shortcut or assumption fails.
- Questions may combine two or more ideas from the topic, but they must still stay inside the Subject Level and the topics requested.
- Make the distractors strong: each wrong option should come from a realistic, tempting error, so a learner who is only half sure cannot eliminate options easily.
- Include a mix of hard theory and hard calculation questions unless the subject has no calculation content.
- Explanations must show the full reasoning, including why the most tempting wrong option fails.
- Hard means demanding, not unfair. Every question must still have exactly one clearly correct answer, all needed information must be given, and no question may be ambiguous, trick-worded, or dependent on obscure facts.`,
};

export function normaliseQuizStyle(value: unknown): QuizStyle {
   const v = String(value ?? "").trim().toLowerCase();
   return (QUIZ_STYLE_OPTIONS as readonly string[]).includes(v) ? (v as QuizStyle) : "mixture"; // default
}

export function getQuizStyleSnippet(style?: QuizStyle | string): string {
   const level = normaliseQuizStyle(style);

   return `## Question style (CRITICAL)

The learner chose this question style: "${level}".
In their own words: "${QUIZ_STYLE_DESCRIPTIONS[level]}"

Shape the whole quiz for this learner:

${QUIZ_STYLE_RULES[level]}

How this interacts with the other rules:
- This section controls WHAT KIND of questions are asked and how hard they are. It does not change WHAT is true or WHICH topics are covered.
- The Subject Level, Subject, Subject Topic(s), and Detailed Topic Focus still decide the content. Never drift outside them to fit the style.
- This section overrides the default difficulty mix in the quiz quality rules. Use the mix given above.
- The "questionType" values must honestly match each question's difficulty, as defined in the output format.
- Accuracy is never reduced. Every correct answer must be verified, and every question must still have exactly one correct option.
- The JSON structure, the 5 options per question, the answer position distribution, the KaTeX rules, and the no-code-fence rules always apply exactly as written.`;
}
