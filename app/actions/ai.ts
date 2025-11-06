"use server"
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

export async function callChatGPT (prompt: string): Promise<any | false> {
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