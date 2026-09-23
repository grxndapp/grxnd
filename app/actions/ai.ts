"use server"
import Groq from "groq-sdk";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

export async function callChatGPT2 (prompt: string): Promise<any | false> {
   try {
      const token = process.env.AI_APIKEY!;
      const endpoint = "https://models.github.ai/inference";
      const model = "openai/gpt-4.1-mini";
   
      const client = ModelClient(
         endpoint,
         new AzureKeyCredential(token),
      );
   
      const response = await client.path("/chat/completions").post({
         body: {
            messages: [
               { role:"system", content: "" },
               { role:"user", content: prompt }
            ],
            temperature: 1,
            top_p: 1,
            model: model
         }
      });
   
      if (isUnexpected(response)) {
         console.error(response.body.error);
         return false;
      }
      const cleanedJsonResult = response.body.choices[0].message.content?.replace(/```json\s*/g, '')
         .replace(/```/g, '')
         .trim();

      // console.log(JSON.parse(cleanedJsonResult!));
      return JSON.parse(cleanedJsonResult!);
   } catch (err) {
      try {
         const url = "http://192.168.0.4:3002/prompt-gpt"
         const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
         });
         const data = await response.json();
         // console.log(data.data);
         return data.data;
      } catch (err) {
         return false;
      }
   }
}

export async function callChatGPT3 (prompt: string) {
   try {
      const groq = new Groq();
      const chatCompletion = await groq.chat.completions.create({
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
         model: "openai/gpt-oss-120b",
         temperature: 1,
         top_p: 1,
         max_completion_tokens: 9000,
         stream: false,
         reasoning_effort: "medium"
      });
      // if (chatCompletion.choices[0].message.content == "") {
      //    return await callChatGPT(prompt);
      // }

      const response = chatCompletion.choices[0].message.content;
      console.log(chatCompletion.choices)
      // const cleanedJsonResult = response?.replace(/```json\s*/g, '').replace(/```/g, '').trim();

      // console.log(cleanedJsonResult);
      // console.log(JSON.parse(cleanedJsonResult!));
      return JSON.parse(response!);
   } catch (err) {
      console.error(err)
      return false;
   }
}

export async function callChatGPT (prompt: string) {
   try {
      const response = await fetch("https://api.atria-asi.ai/v1/chat/completions", {
         method: "POST",
         headers: {
            "Authorization": `Bearer ${process.env.AI_API_KEY!}`,
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            messages: [
               {
                  role: "system",
                  content: "You are a professional scottish teacher that knows every subject in every level of secondary school study: National 5, Higher and Advanced Higher. You can also teach very well and provide amazing responses for answers"
               },
               {
                  role: "user",
                  content: prompt
               }
            ],
            model: "Atria-Dawn-Preview",
            temperature: 1.1,
            top_p: 0.95,
            stream: false,
            reasoning_effort: "medium"
         })
      })
      const result = await response.json();
      console.log(result);
      return JSON.parse(result.choices[0].message.content);
   } catch (err) {
      console.error(err)
      return false;
   }
}