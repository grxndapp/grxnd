"use server"
import { extractJson } from "@/utils/extractJson";
import { validateKatex } from "@/utils/validateKatex";

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