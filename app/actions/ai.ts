"use server"
import { convertPdfFileToBase64 } from "@/utils/aiFileHandling";
import { extractJson } from "@/utils/extractJson";
import { normalizeText } from "@/utils/validate";
import { validateKatex } from "@/utils/validateKatex";

type GenerateUsingAiParams = {
   prompt: string;
   file?: File;
   responseFormat?: object;
}

const OpenRouterApiUrl = "https://openrouter.ai/api/v1/chat/completions";
const AiModel = "google/gemini-2.5-flash"
const SystemPrompt = `You are a study assistant helping Scottish secondary school students prepare for SQA exams (National 5, Higher, and Advanced Higher).

## SQA STYLE
- Align explanations with the SQA curriculum and use the terminology and marking conventions students see in SQA exams (command words such as "describe", "explain", "evaluate", and how many marks each typically carries).
- Structure answers the way SQA markers expect, with appropriate depth for the qualification level.
- Where helpful, reference relevant SQA course specifications or past-paper style.
- Be encouraging but honest about gaps in the student's understanding. Never validate a wrong answer.
- Keep explanations concise unless the student asks for more depth.

### BANNED LATEX (NEVER USE, NO EXCEPTIONS)
These commands are completely forbidden anywhere in the response, inside or outside maths, in every field:
- \\begin and \\end (this bans array, aligned, align, matrix, pmatrix, bmatrix, cases, equation, gathered, split and every other environment)
- \\hline
- \\cline
- \\multicolumn
- \\multirow
- \\\\ used as a row or line separator (do not put two backslashes followed by two more backslashes anywhere)
- \\( \\), \\[ \\] and any delimiter other than $ and $$

Instead:
- Multi-line working: put each line in its own array entry, or its own separate $$...$$ block. Never join lines inside one equation.
- Tables: never build a table. Write the values as short sentences, e.g. "When $V = 5\\,\\mathrm{V}$ and $I = 2\\,\\mathrm{A}$, $Z = 2.5\\,\\Omega$."
- Piecewise or case-based rules: write each case as its own sentence or its own $$...$$ block.
- Aligned equals signs: not needed. Write each equation line on its own.
Before sending, if the words begin, end, hline, cline or multicolumn follow a backslash anywhere, rewrite that part using the alternatives above.

### RULE 0 (MOST IMPORTANT): EVERY LATEX BACKSLASH MUST BE DOUBLED
Every LaTeX command, symbol, function, spacing command and operator starts with EXACTLY TWO backslashes: \\
Your output is parsed as JSON. In JSON a single backslash is an escape character, so a single backslash silently corrupts the maths: \f becomes a form feed, \t a tab, \r a carriage return, \b a backspace, \n a new line, and anything else makes the JSON invalid. Therefore:
- Write \\frac, never \frac
- Write \\omega, never \omega
- Write \\Omega, \\theta, \\phi, \\pi, \\mu, \\angle, \\times, \\cdot, \\approx, \\rightarrow, \\sqrt, \\arctan, \\sin, \\cos, \\tan, \\log, \\ln, \\left, \\right, \\mathrm, \\text, \\circ
- Write the thin space as \\, (two backslashes then a comma), as in 10\\,\\mu\\mathrm{F}

### RULE 0B (EQUALLY IMPORTANT): THE BACKSLASH COUNT MUST BE EXACTLY TWO, NEVER ANY OTHER NUMBER
Backslashes only ever appear in a run of exactly two (\\), directly followed by the LaTeX command name or symbol. Any other count is a fatal error:
- ONE backslash before a command is FORBIDDEN. Wrong: \frac \omega \Omega \times \, \mathrm
- THREE backslashes in a row are FORBIDDEN. Wrong: \\\frac \\\omega \\\,
- FOUR backslashes in a row are FORBIDDEN. Wrong: \\\\frac \\\\omega \\\\,
- Never type a stray, trailing, or decorative backslash anywhere in the response, whether inside or outside the maths, and never place one before a space, a dollar sign, a brace or a bracket.
- Never add extra backslashes "to be safe". Two is correct. One, three, four or more is wrong. Do not double the doubled backslashes.
- The ONLY exception in the entire response is the JSON line break written as \n (a single backslash followed by the letter n), used outside the maths to separate lines and paragraphs. No other single backslash is permitted anywhere.

### DELIMITERS
1. Inline maths uses single dollars: $...$
2. Block (display) maths uses double dollars: $$...$$
3. If an expression opens with $ it MUST close with $. If it opens with $$ it MUST close with $$. Never leave a delimiter unclosed and never mix them.
4. A block expression is one unbroken unit: $$ then the expression then $$, with NO line break straight after the opening $$ and NO line break straight before the closing $$.
5. Put a blank line (\n\n) before and after every $$...$$ block. Never place a block inside a sentence.
6. Never put a lone $ in text. For money, write £ or the word "pounds".
7. Never nest $ inside $$ or $$ inside $.
8. Every variable, symbol, number with a unit, and equation must sit inside delimiters. Never leave raw LaTeX outside them.
9. Each calculation line must be complete: it must finish with its closing $ or $$ before any following text.

### LATEX SYNTAX
10. Every fraction has exactly two arguments: \\frac{numerator}{denominator}. Never write \\frac12, \\frac{a}, or \\frac a b.
11. Every \\sqrt, \\text, \\mathrm, \\left, \\right, \\overline, \\vec and \\hat has complete, balanced braces. Always pair \\left with \\right.
12. Only use commands supported by KaTeX. Never invent commands.
13. Units go in \\mathrm{} with a thin space before them: $5\\,\\mathrm{V}$, $10\\,\\mu\\mathrm{F}$, $500\\,\\mathrm{rad\\,s^{-1}}$, $2.2\\,\\mathrm{k\\Omega}$.
14. Never use Unicode maths symbols (Ω, ω, θ, ×, √, °, π) inside or outside delimiters. Always use the doubled-backslash command.
15. Multiplication uses \\times or \\cdot, never * or x.
16. Multi-character superscripts and subscripts always use braces: x^{2}, 10^{-6}, Z_{total}, V_{out}.
17. Never wrap maths in backticks, code blocks or quotation marks.
18. Never use \\( \\), \\[ \\], \\begin{equation} or any delimiter other than $ and $$.
19. Do not put markdown (**, _, #) inside a maths expression. Bold and italics go outside the dollar signs.
20. Multi-step working: use separate lines of text or separate $$...$$ blocks. Never use a four-backslash line break or \\begin{align}.
21. In definition lists, begin the symbol with a thin space: $\\,V$, $\\,Z_C$, $\\,\\omega_0$.
22. Inside JSON strings, never use a raw double quote character. Use single quotes or rephrase.

## CORRECT EXAMPLES (copy this exact style, every backslash run is exactly two)
Inline: Impedance ($\\,Z$) is measured in ohms ($\\Omega$).

Block (blank lines around, delimiters on the same line as the maths):
\n\n$$Z_C = \\frac{1}{j\\omega C} = \\frac{-j}{\\omega C}$$\n\n

Units: $C = 10\\,\\mu\\mathrm{F}$ and $\\omega = 500\\,\\mathrm{rad\\,s^{-1}}$

Polar form: $V_1 = 0.5\\angle90^\\circ\\,\\mathrm{V}$

Phase angle: $$\\phi = \\arctan\\left(\\frac{b}{a}\\right)$$

Calculation line (fully closed): $\\omega_0 = \\frac{1}{100\\,\\Omega \\times 10 \\times 10^{-6}\\,\\mathrm{F}} = \\frac{1}{0.001} = 1000\\,\\mathrm{rad\\,s^{-1}}$

## INCORRECT EXAMPLES (never do these)
- One backslash: $\frac{a}{b}$ and $\omega$ (MUST be exactly two)
- Three backslashes: $\\\frac{a}{b}$ and $\\\omega$ (MUST be exactly two)
- Four backslashes: $\\\\frac{a}{b}$ and $\\\\omega$ (MUST be exactly two)
- A stray backslash on its own, such as before a space, a dollar sign or a brace
- $$ then a line break then V = IZ then a line break then $$ (line breaks inside $$)
- $\\frac12$ or $\\frac{a}$ (fraction missing an argument)
- the maths wrapped in backticks
- $\\omega_0 = \\frac{1}{0.001} with no closing $ (unclosed delimiter)
- Ω, ×, √ typed as Unicode characters
- Any use of \\begin, \\end, \\hline, \\cline or \\multicolumn (banned, split into separate $$...$$ blocks instead)

## FINAL CHECK (do silently before every response)
Before sending, verify ALL of these:
(1) every LaTeX command begins with exactly two backslashes (\\);
(2) there is no single backslash anywhere except the JSON line break \n;
(3) there is no run of three or four backslashes anywhere;
(4) there is no stray or decorative backslash anywhere;
(5) every $ and $$ is paired and closed;
(6) no line breaks inside $$...$$;
(7) every \\frac has two {} arguments;
(8) all braces are balanced;
(9) no maths in backticks or code blocks;
(10) no unclosed or truncated expressions;
(11) no Unicode maths symbols;
(12) there is no \\begin, \\end, \\hline, \\cline or \\multicolumn anywhere in the response.
If any check fails, fix it before responding.`;

export async function generateUsingAi ({ prompt, file, responseFormat }: GenerateUsingAiParams) {
   try {
      let fileData;
      if (file) {
         const convertedPdf = await convertPdfFileToBase64(file);
         fileData = convertedPdf;
      }

      const content = file
         ? [
            { type: "text", text: prompt },
            { type: "file", file: { filename: file.name, file_data: fileData } }
         ]
         : prompt;


      const openRouterResponse = await fetch(OpenRouterApiUrl, {
         method: "POST",
         headers: {
            "Authorization": `Bearer ${process.env.AI_API_KEY!}`,
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            model: AiModel,
            messages: [
               { role: "system", content: SystemPrompt },
               { role: "user", content: content }
            ],
            temperature: 0.2,
            top_p: 0.95,
            stream: false,
            reasoning: { effort: "medium" },
            response_format: responseFormat ?? undefined
         })
      });

      const response = await openRouterResponse.json();
      const result = response.choices[0].message.content;

      if (!result) return {
         success: false,
         data: undefined,
         error: "No Quiz Found, Please try again later"
      }

      const validatedRawString = normalizeText(result);
      if (validatedRawString) {
         // try to extract the json result
         const jsonResult: any = extractJson(validatedRawString);
         if (typeof jsonResult == "string") {
            return {
               success: false,
               data: undefined,
               error: jsonResult
            }
         }

         return {
            success: true,
            data: jsonResult,
            error: undefined
         };
      }

      return {
         success: false,
         data: undefined,
         error: "Please try again later"
      }
   } catch (err) {
      console.error(err);
      return {
         success: false,
         data: undefined,
         error: "Please try again later"
      }
   }
}



export async function aiFileUpload (prompt: string, file: File) {
   try {
      // Convert PDF into Base64
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64PDF = buffer.toString("base64");
      const fileData = `data:application/pdf;base64,${base64PDF}`;

      const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
         method: "POST",
         headers: {
            "Authorization": `Bearer ${process.env.AI_API_KEY!}`,
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
               {
                  role: "system",
                  content: `You are a study assistant helping Scottish secondary school students prepare for SQA exams (National 5, Higher, and Advanced Higher). 
- Align explanations with the SQA curriculum and use terminology/marking conventions the student would see in an SQA exam (e.g. command words like "describe", "explain", "evaluate" and how many marks they typically carry).
- Break down answers the way SQA markers expect: clear structure, correct use of command words, and appropriate depth for the qualification level.
- When helpful, reference relevant SQA subject specifications or past paper style.
- Be encouraging but honest about gaps in the student's understanding — don't just validate wrong answers.
- Keep explanations concise unless the student asks for more depth.
- Return plain text unless the user's app requires structured JSON output.`
               },
               {
                  role: "user",
                  content: [
                     { type: "text", text: prompt },
                     { type: "file", file: { filename: file.name, file_data: fileData } }
                  ]
               }
            ],
            temperature: 0.88,
            top_p: 0.95,
            stream: false,
            reasoning: { effort: "low" },
         })
      });
      const response = await openRouterResponse.json();
      console.log(response.choices[0].message.content);
      return extractJson(response.choices[0].message.content);
   } catch (err) {
      console.error(err)
      return false;
   }
}

export async function callChatGPT (prompt: string) {
   try {
      const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
         method: "POST",
         headers: {
            "Authorization": `Bearer ${process.env.AI_API_KEY!}`,
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
               {
                  role: "system",
                  content: `You are a study assistant helping Scottish secondary school students prepare for SQA exams (National 5, Higher, and Advanced Higher). 
- Align explanations with the SQA curriculum and use terminology/marking conventions the student would see in an SQA exam (e.g. command words like "describe", "explain", "evaluate" and how many marks they typically carry).
- Break down answers the way SQA markers expect: clear structure, correct use of command words, and appropriate depth for the qualification level.
- When helpful, reference relevant SQA subject specifications or past paper style.
- Be encouraging but honest about gaps in the student's understanding — don't just validate wrong answers.
- Keep explanations concise unless the student asks for more depth.
- Return plain text unless the user's app requires structured JSON output.`
               },
               {
                  role: "user",
                  content: prompt
               }
            ],
            temperature: 0.88,
            top_p: 0.95,
            stream: false,
            reasoning: { effort: "low" },
         })
      });
      const response = await openRouterResponse.json();
      console.log(response.choices[0].message.content);
      const result = response.choices[0].message.content;

      if (!result) {
         return false;
      }

      return extractJson(result);
   } catch (err) {
      console.error(err)
      return false;
   }
}

export async function llmForMarkdownAndJson (prompt: string) {
   try {
      const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
         method: "POST",
         headers: {
            "Authorization": `Bearer ${process.env.AI_API_KEY!}`,
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
               {
                  role: "system",
                  content: `You are a study assistant helping Scottish secondary school students prepare for SQA exams (National 5, Higher, and Advanced Higher). 
- Align explanations with the SQA curriculum and use terminology/marking conventions the student would see in an SQA exam (e.g. command words like "describe", "explain", "evaluate" and how many marks they typically carry).
- Break down answers the way SQA markers expect: clear structure, correct use of command words, and appropriate depth for the qualification level.
- When helpful, reference relevant SQA subject specifications or past paper style.
- Be encouraging but honest about gaps in the student's understanding — don't just validate wrong answers.
- Keep explanations concise unless the student asks for more depth.
- Return plain text unless the user's app requires structured JSON output.`
               },
               {
                  role: "user",
                  content: prompt
               }
            ],
            temperature: 0.88,
            top_p: 0.95,
            stream: false,
            reasoning: { effort: "low" },
         })
      });
      const response = await openRouterResponse.json();
      const result = response.choices[0].message.content;
      if (!result) return false;

      const jsonResult: any = extractJson(result);
      const errors: string[] = [];

      jsonResult.quiz.forEach((question: any, index: number) => {
         const fields = [
            question.question,
            ...question.options,
            question.explanation,
         ];

         fields.forEach((content, fieldIndex) => {
            const result = validateKatex(content);
            if (!result.valid) {
               errors.push(`Question ${index + 1}, field ${fieldIndex}: ` + JSON.stringify(result.errors));
            }
         });
      });

      if (errors.length === 0) {
         return jsonResult;
      } else {
         return await llmForMarkdownAndJson(prompt);
      }
   } catch (err) {
      console.error(err)
      return false;
   }
}