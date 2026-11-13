export function normalizeText(text: string): string {
   return text
      .replace(/\\{2,4}/g, (match) => {
         if (match.length === 4) return "\\\\";
         if (match.length === 3) return "\\\\";
         return "\\";
      })
      .replace(/\\n/g, "\n")
      // 3. put every $$...$$ block on its own lines, so $$$$ can never occur
      .replace(/\$\$([\s\S]+?)\$\$/g, (_match, inner: string) => {
         // function replacer, because "$$" in a replacement string would collapse to "$"
         return `$$${inner.trim()}$$\n`;
      })
      // 4. tidy: never more than one blank line in a row
      .replace(/\n{3,}/g, "\n")
      .trim();
}

const FORBIDDEN = /\\(begin|end|hline|cline|multicolumn)\b/;

function isValidCard(card: Flashcard) {
   const { question, answer } = card;

   return [question, answer].every((text) => {
      if (!text || !text.trim()) return false;
      if (FORBIDDEN.test(text)) return false;
      if (text.startsWith("\n") || text.endsWith("\n")) return false;
      if (text.includes("\n\n\n")) return false;

      // Dollar signs must pair up (ignoring escaped \$)
      const dollars = text.replace(/\\\$/g, "").match(/\$/g) || [];
      return dollars.length % 2 === 0;
   }) && !question.includes("$$");
}

function isValidFlashcardSet(data: { flashcards: Flashcard[] }) {
   return (
      Array.isArray(data.flashcards) &&
      data.flashcards.length === 20 &&
      data.flashcards.every(isValidCard)
   );
}