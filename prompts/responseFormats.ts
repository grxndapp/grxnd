
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
   },
   EssayGrader: {
      "response_format": {
         "type": "json_schema",
         "json_schema": {
            "name": "essay_grader_report",
            "strict": true,
            "schema": {
            "type": "object",
            "properties": {
               "grader_report": {
                  "type": "object",
                  "properties": {
                  "grade": {
                     "type": "integer",
                     "minimum": 1,
                     "maximum": 10
                  },
                  "comments": {
                     "type": "string",
                     "minLength": 200,
                     "maxLength": 300
                  },
                  "strengths": {
                     "type": "array",
                     "items": {
                        "type": "string"
                     },
                     "minItems": 4,
                     "maxItems": 4
                  },
                  "weaknesses": {
                     "type": "array",
                     "items": {
                        "type": "string"
                     },
                     "minItems": 4,
                     "maxItems": 4
                  },
                  "improvements": {
                     "type": "array",
                     "minItems": 1,
                     "items": {
                        "type": "object",
                        "properties": {
                        "quote": {
                           "type": "string",
                           "description": "Exact text copied verbatim from the student's essay."
                        },
                        "improvement": {
                           "type": "string",
                           "description": "Explain how the quoted text can be improved."
                        },
                        "possible_replacement": {
                           "type": "string",
                           "description": "Replacement text the student can paste into their essay."
                        }
                        },
                        "required": [
                        "quote",
                        "improvement",
                        "possible_replacement"
                        ],
                        "additionalProperties": false
                     }
                  }
                  },
                  "required": [ "grade", "comments", "strengths", "weaknesses", "improvements"],
                  "additionalProperties": false
               }
            },
            "required": ["grader_report"],
            "additionalProperties": false
            }
         }
      }
   },
   LabGrader: {
      type: "json_schema",
      json_schema: {
         name: "lab_report_grade_response",
         strict: true,
         schema: {
            type: "object",
            properties: {
               lab_report_grade: {
                  type: "object",
                  properties: {
                     overall_score: {
                        type: "integer",
                        minimum: 0,
                        maximum: 10
                     },
                     grading_basis: {
                        type: "string",
                        description:
                           "The criteria or rubric used to assess the report, adapted to the stated subject and level."
                     },
                     criteria: {
                        type: "object",
                        properties: {
                           scientific_understanding: {
                              type: "object",
                              properties: {
                                 score: {
                                    type: "integer",
                                    minimum: 0,
                                    maximum: 10
                                 },
                                 reason: {
                                    type: "string",
                                    description:
                                       "Explain the score based on the accuracy of the scientific concepts and their connection to the experiment."
                                 }
                              },
                              required: ["score", "reason"],
                              additionalProperties: false
                           },
                           method: {
                              type: "object",
                              properties: {
                                 score: {
                                    type: "integer",
                                    minimum: 0,
                                    maximum: 10
                                 },
                                 reason: {
                                    type: "string",
                                    description:
                                       "Explain the score based on the appropriateness, clarity, and reproducibility of the documented method."
                                 }
                              },
                              required: ["score", "reason"],
                              additionalProperties: false
                           },
                           results_and_analysis: {
                              type: "object",
                              properties: {
                                 score: {
                                    type: "integer",
                                    minimum: 0,
                                    maximum: 10
                                 },
                                 reason: {
                                    type: "string",
                                    description:
                                       "Explain the score based on the presentation, processing, and interpretation of results, including units, calculations, and graphs where relevant."
                                 }
                              },
                              required: ["score", "reason"],
                              additionalProperties: false
                           },
                           conclusion: {
                              type: "object",
                              properties: {
                                 score: {
                                    type: "integer",
                                    minimum: 0,
                                    maximum: 10
                                 },
                                 reason: {
                                    type: "string",
                                    description:
                                       "Explain the score based on whether the conclusion addresses the aim and is supported by the reported results."
                                 }
                              },
                              required: ["score", "reason"],
                              additionalProperties: false
                           },
                           evaluation: {
                              type: "object",
                              properties: {
                                 score: {
                                    type: "integer",
                                    minimum: 0,
                                    maximum: 10
                                 },
                                 reason: {
                                    type: "string",
                                    description:
                                       "Explain the score based on the discussion of limitations, uncertainty, reliability, and relevant improvements to the experiment."
                                 }
                              },
                              required: ["score", "reason"],
                              additionalProperties: false
                           }
                        },
                        required: [
                           "scientific_understanding",
                           "method",
                           "results_and_analysis",
                           "conclusion",
                           "evaluation"
                        ],
                        additionalProperties: false
                     },
                     comments: {
                        type: "string",
                        description:
                           "Overall feedback summarising the report's quality and the main areas to improve."
                     },
                     strengths: {
                        type: "array",
                        items: {
                           type: "string"
                        },
                        description:
                           "Specific strengths supported by the submitted report."
                     },
                     improvements: {
                        type: "array",
                        items: {
                           type: "object",
                           properties: {
                              title: {
                                 type: "string",
                                 description:
                                    "A short title identifying the improvement."
                              },
                              improvement: {
                                 type: "string",
                                 description:
                                    "A clear, specific explanation of what to improve and how to improve it."
                              }
                           },
                           required: ["title", "improvement"],
                           additionalProperties: false
                        }
                     }
                  },
                  required: [
                     "overall_score",
                     "grading_basis",
                     "criteria",
                     "comments",
                     "strengths",
                     "improvements"
                  ],
                  additionalProperties: false
               }
            },
            required: ["lab_report_grade"],
            additionalProperties: false
         }
      }
   }
}