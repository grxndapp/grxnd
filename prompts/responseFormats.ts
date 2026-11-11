
export const ResponseFormats = {
   QuizMaker: {
      type: "json_schema",
      json_schema: {
         name: "quiz_response",
         strict: true,
         schema: {
            type: "object",
            properties: {
               quiz: {
                  type: "array",
                  items: {
                     type: "object",
                     properties: {
                        question: { type: "string" },
                        options: {
                           type: "array",
                           items: { type: "string" }
                        },
                        answerIndex: { type: "integer" },
                        answerExplanation: { type: "string" },
                        questionType: { type: "string"}
                     },
                     required: [ "question", "options", "answerIndex", "answerExplanation", "questionType" ],
                     additionalProperties: false
                  }
               }
            },
            required: ["quiz"],
            additionalProperties: false
         }
      }
   },
   NoteMaker: {
      type: "json_schema",
      json_schema: {
         name: "note_response",
         strict: true,
         schema: {
            type: "object",
            properties: {
               note: {
                  type: "object",
                  properties: {
                     title: { type: "string" },
                     overview: { type: "string" },
                     key_concepts: {
                        type: "array",
                        items: { type: "string" }
                     },
                     rules: {
                        type: "array",
                        items: {
                           type: "object",
                           properties: {
                              title: { type: "string" },
                              rule: { type: "string" },
                              use:  { type: "string" }
                           },
                           required: ["title", "rule", "use"],
                           additionalProperties: false
                        }
                     },
                     examples: {
                        type: "array",
                        items: {
                           type: "object",
                           properties: {
                              question:  { type: "string" },
                              solution: {
                                 type: "array",
                                 items:  { type: "string" }
                              }
                           },
                           required: ["question", "solution"],
                           additionalProperties: false
                        }
                     },
                     visuals: {
                        type: "array",
                        items: { type: "string" }
                     },
                     common_mistakes: {
                        type: "array",
                        items: {
                           type: "object",
                           properties: {
                              mistake: { type: "string" },
                              fix: { type: "string" }
                           },
                           required: ["mistake", "fix"],
                           additionalProperties: false
                        }
                     },
                     questions: {
                        type: "array",
                        items: {
                           type: "object",
                           properties: {
                              question: { type: "string" },
                              solution: {
                                 type: "array",
                                 items: { type: "string" }
                              }
                           },
                           required: ["question", "solution"],
                           additionalProperties: false
                        }
                     },
                     summary: {
                        type: "array",
                        items: { type: "string" }
                     }
                  },
                  required: [ "title", "overview", "key_concepts", "rules", "examples", "visuals", "common_mistakes", "questions", "summary" ],
                  additionalProperties: false
               }
            },
            required: ["note"],
            additionalProperties: false
         }
      }
   },
   FillInTheBlankMaker: {
      type: "json_schema",
      json_schema: {
         name: "fill_in_the_blank_response",
         strict: true,
         schema: {
            type: "object",
            properties: {
               questions: {
                  type: "array",
                  minItems: 1,
                  items: {
                     type: "object",
                     properties: {
                        sentences: {
                           type: "array",
                           description:
                              "Ordered text segments surrounding the blanks. Must contain exactly one more item than missingWords. Use an empty string for the first or last segment if the sentence starts or ends with a blank.",
                           items: { type: "string" },
                           minItems: 2,
                           maxItems: 6
                        },
                        missingWords: {
                           type: "array",
                           description:
                              "Correct answers in the exact order the blanks appear. Each answer is a word or short phrase. Prefer one single-word blank per question.",
                           items: {
                              type: "string",
                              minLength: 1
                           },
                           minItems: 1,
                           maxItems: 5
                        },
                        hint: {
                           type: "string",
                           description:
                              "A short, relevant clue that guides the learner without revealing any missing answer.",
                           minLength: 1
                        }
                     },
                     required: ["sentences", "missingWords", "hint"],
                     additionalProperties: false
                  }
               }
            },
            required: ["questions"],
            additionalProperties: false
         }
      }
   }
}