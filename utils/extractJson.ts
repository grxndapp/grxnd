export function extractJson(response: string): any {
   const text = response.trim();

   // 1. Attempt to parse the entire response
   try {
      return JSON.parse(text) as any;
   } catch {}

   // 2. Find the first JSON object or array
   const objectStart = text.indexOf("{");
   const arrayStart = text.indexOf("[");

   const start =
      objectStart === -1
         ? arrayStart
         : arrayStart === -1
         ? objectStart
         : Math.min(objectStart, arrayStart);

   if (start === -1) {
      throw new Error("No JSON object or array found");
   }

   // 3. Identify whether JSON starts with { or [
   const opening = text[start];
   const closing = opening === "{" ? "}" : "]";

   // 4. Find the matching closing bracket,
   // accounting for nested brackets and quoted strings
   const stack: string[] = [];
   let inString = false;
   let escaped = false;

   for (let i = start; i < text.length; i++) {
      const char = text[i];

      if (inString) {
         if (escaped) {
            escaped = false;
         } else if (char === "\\") {
            escaped = true;
         } else if (char === '"') {
            inString = false;
         }
         continue;
      }

      if (char === '"') {
         inString = true;
      } else if (char === "{" || char === "[") {
         stack.push(char);
      } else if (char === "}" || char === "]") {
         const last = stack.pop();

         if ((char === "}" && last !== "{") || (char === "]" && last !== "[")) throw new Error("Mismatched JSON brackets");

         // Found the end of the complete JSON structure
         if (stack.length === 0) {
            const jsonString = text.slice(start, i + 1);
            try {
               return JSON.parse(jsonString) as any;
            } catch {
               throw new Error("Extracted JSON is invalid");
            }
         }
      }
   }

   throw new Error("Incomplete JSON response");
}