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