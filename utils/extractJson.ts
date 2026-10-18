/**
 * Fixes common LLM JSON mistakes, string-aware:
 *  - invalid escapes like \,  \(  \alpha  → double-escaped
 *  - LaTeX commands that collide with JSON escapes (\frac, \text, \theta, \beta, \rho, \nu...)
 *  - raw newlines/tabs inside strings
 *  - trailing commas
 */
function repairJson(src: string): string {
   // JSON escapes that are really LaTeX commands (\f = formfeed, \t = tab, etc.)
   const latexCollision =
      /^(?:b(?:eta|ar|egin|inom|oldsymbol|ig)|f(?:rac|orall|lat)|t(?:ext|imes|heta|au|ilde)|to(?![a-z])|r(?:ho|ight|angle)|nu(?![a-z])|neq|nabla)/;

   let out = "";
   let inString = false;

   for (let i = 0; i < src.length; i++) {
      const ch = src[i];

      if (!inString) {
         if (ch === '"') {
            inString = true;
            out += ch;
         } else if (ch === ",") {
            // drop trailing commas before } or ]
            let j = i + 1;
            while (j < src.length && /\s/.test(src[j])) j++;
            if (src[j] === "}" || src[j] === "]") continue;
            out += ch;
         } else {
            out += ch;
         }
         continue;
      }

      // inside a string
      if (ch === '"') {
         inString = false;
         out += ch;
      } else if (ch === "\\") {
         const next = src[i + 1];

         if (next === undefined) {
            out += "\\\\";
         } else if (next === '"' || next === "\\" || next === "/") {
            out += ch + next;
            i++;
         } else if (next === "u" && /^[0-9a-fA-F]{4}$/.test(src.slice(i + 2, i + 6))) {
            out += src.slice(i, i + 6);
            i += 5;
         } else if ("bfnrt".includes(next) && !latexCollision.test(src.slice(i + 1))) {
            out += ch + next; // genuine \n, \t, etc.
            i++;
         } else {
            out += "\\\\"; // invalid escape or LaTeX command: keep the backslash literally
         }
      } else if (ch === "\n") {
         out += "\\n";
      } else if (ch === "\r") {
         out += "\\r";
      } else if (ch === "\t") {
         out += "\\t";
      } else if (ch < " ") {
         out += "\\u" + ch.charCodeAt(0).toString(16).padStart(4, "0");
      } else {
         out += ch;
      }
   }

   return out;
}

function tryParse(candidate: string): { value: any } | null {
   for (const text of [repairJson(candidate), candidate]) {
      try {
         return { value: JSON.parse(text) };
      } catch {}
   }
   return null;
}

/** Returns index of the bracket closing the one at `start`, or -1 if unbalanced. */
function findBalancedEnd(text: string, start: number): number {
   const stack: string[] = [];
   let inString = false;
   let escaped = false;

   for (let i = start; i < text.length; i++) {
      const ch = text[i];

      if (inString) {
         if (escaped) escaped = false;
         else if (ch === "\\") escaped = true;
         else if (ch === '"') inString = false;
         continue;
      }

      if (ch === '"') inString = true;
      else if (ch === "{" || ch === "[") stack.push(ch);
      else if (ch === "}" || ch === "]") {
         const open = stack.pop();
         if ((ch === "}" && open !== "{") || (ch === "]" && open !== "[")) return -1;
         if (stack.length === 0) return i;
      }
   }
   return -1;
}

export function extractJson<T = any>(response: string): T {
   const text = response.replace(/^\uFEFF/, "").trim();

   // 1. Whole response
   const whole = tryParse(text);
   if (whole) return whole.value as T;

   // 2. Markdown code fences (```json ... ```), including an unclosed final fence
   const fenceRe = /```(?:json|JSON)?\s*\n?([\s\S]*?)(?:```|$)/g;
   for (const match of text.matchAll(fenceRe)) {
      const body = match[1].trim();
      if (!body) continue;

      const direct = tryParse(body);
      if (direct) return direct.value as T;
   }

   // 3. Scan for balanced {...} / [...] blocks anywhere in the text
   for (let i = 0; i < text.length; i++) {
      if (text[i] !== "{" && text[i] !== "[") continue;

      const end = findBalancedEnd(text, i);
      if (end === -1) continue;

      const parsed = tryParse(text.slice(i, end + 1));
      if (parsed) return parsed.value as T;

      i = end; // skip past this failed block rather than returning a fragment of it
   }

   throw new Error("No valid JSON found in response");
}

export function sanitise (object: any) {
   return JSON.parse(JSON.stringify(object));
}