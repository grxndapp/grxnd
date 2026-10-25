'use client'
import "katex/dist/katex.min.css";
import "./RenderMarkdown.css"
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { visit } from "unist-util-visit"
import type { Root } from "mdast";
import { normalizeText } from "@/utils/validate";

function remarkBetterInlineMath() {
   return (tree: Root) => {
      visit(tree, "inlineMath", (node) => {
         if (!node.value.trimStart().startsWith("\\displaystyle")) {
            node.value = `\\displaystyle ${node.value}`;
         }

         node.data ??= {};

         node.data.hChildren = [
            { type: "text", value: node.value }
         ];
      });
   };
}

export default function RenderMarkdown ({ content, styles }: { content: string, styles?: React.CSSProperties }) {
   return (
      <div className="math-markdown" style={styles??{}}>
         <ReactMarkdown
            remarkPlugins={[
               [remarkMath, { singleDollarTextMath: true }],
               remarkBetterInlineMath
            ]}
            rehypePlugins={[
               [rehypeKatex, { throwOnError: false, displayMode: true, strict: "ignore" }],
            ]}
         >
            {normalizeText(content)}   
         </ReactMarkdown>
      </div>
   )
}
