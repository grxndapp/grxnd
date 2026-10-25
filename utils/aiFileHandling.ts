
export async function convertPdfFileToBase64 (file: File) {
   const arrayBuffer = await file.arrayBuffer();
   const buffer = Buffer.from(arrayBuffer);
   const base64PDF = buffer.toString("base64");
   const fileData = `data:application/pdf;base64,${base64PDF}`;
   return fileData;
}