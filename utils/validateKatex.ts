import katex from "katex";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import { visit } from "unist-util-visit";

interface MathError {
   expression: string;
   message: string;
}

export function validateKatex(markdown: string): { valid: boolean;  errors: MathError[]; } {
   const errors: MathError[] = [];

   const tree = unified()
      .use(remarkParse)
      .use(remarkMath)
      .parse(markdown);

   visit(tree, (node) => {
      if (node.type !== "math" && node.type !== "inlineMath") return;
      const expression = node.value as string;

      try {
         katex.renderToString(expression, {
            displayMode: node.type === "math",
            throwOnError: true,
            strict: "warn",
         });
      } catch (error) {
         errors.push({
            expression,
            message:
               error instanceof Error
                  ? error.message
                  : "Invalid LaTeX expression",
         });
      }
   });

   return { valid: errors.length === 0, errors };
}