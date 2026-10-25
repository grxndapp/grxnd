
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
   }
}