import { issueSignedToken } from "@vercel/blob";
import { handleUploadPresigned, type HandleUploadPresignedBody } from "@vercel/blob/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Adjust path

const allowedContentTypes = [
   "application/pdf",
   "text/plain",
   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
   "application/vnd.openxmlformats-officedocument.presentationml.presentation"
]

export async function POST(request: Request) {
  try {
      const body = await request.json() as HandleUploadPresignedBody;
      console.log("Upload event type:", body?.type);
      const result = await handleUploadPresigned({
         request, body,
         getSignedToken: async (pathname) => {
            const session = await getServerSession(authOptions);
            const userId = session?.user?.email;

            if (!userId) throw new Error("Unauthorized");
            if (!pathname.startsWith(`grxnd-uploads/${userId}/`)) throw new Error("Invalid upload path");

            const token = await issueSignedToken({
               pathname,
               operations: ["put"],
               allowedContentTypes: allowedContentTypes,
               maximumSizeInBytes: 20 * 1024 * 1024,
               validUntil: Date.now() + 10 * 60 * 1000
            });

            return {
               token,
               urlOptions: {
                  allowedContentTypes: allowedContentTypes,
                  maximumSizeInBytes: 20 * 1024 * 1024,
                  addRandomSuffix: true
               }
            };
         }
      });

      return Response.json(result);

   } catch (error) {
      console.error(error);
      return Response.json({ error: (error as Error).message }, { status: 400 });
   }
}
