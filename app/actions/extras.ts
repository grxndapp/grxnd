"use server"
import PDFParser from "pdf2json";

export async function extractPdfText (file: any): Promise<string | false> {
   try {
      const buffer = Buffer.from(await file.arrayBuffer());

      return new Promise((resolve, reject) => {
         const pdfParser = new PDFParser();

         pdfParser.on("pdfParser_dataError", (errData: any) => {
            reject(errData.parserError);
         });

         pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
            let extractedText = "";

            pdfData.Pages.forEach((page: any) => {
               // sort texts top-to-bottom, left-to-right
               const texts = page.Texts.sort(
                  (a: any, b: any) => a.y - b.y || a.x - b.x
               );

               let lastY: number | null = null;

               texts.forEach((text: any) => {
                  if (lastY !== null) {
                     // if Y position jumps, assume a new line
                     if (Math.abs(text.y - lastY) > 1) {
                        extractedText += "\n\n";
                     } else {
                        extractedText += "";
                     }
                  }

                  const lineText = text.R.map((run: any) =>
                     decodeURIComponent(run.T)
                  ).join("");

                  extractedText += lineText;
                  lastY = text.y;
               });

               extractedText += "\n\n";
            });

            resolve(extractedText.trim());
         });

         pdfParser.parseBuffer(buffer);
      });
   } catch (err) {
      return false;
   }
}