import "@/styles/global.css"
import type { Metadata } from "next";
import { InterFont } from "./fonts";
import { ModalProvider } from "@/contexts/useModal";
import { Toaster } from "sonner";
import SessionWrapper from "@/components/SessionWrapper/SessionWrapper";

export const metadata: Metadata = {
  title: "Grxnd | AI Study Helper for Scottish Students | SQA Past Papers & Revision",
  description:
    "Get instant AI-powered help with SQA past papers, personalized revision plans, and essay feedback. Built for Scottish students preparing for National 5, Higher, and Advanced Higher exams.",
  keywords: [
    "SQA",
    "Scottish exams",
    "National 5",
    "Higher",
    "Advanced Higher",
    "Scottish curriculum",
    "revision planner",
    "AI tutor",
    "AI study helper",
    "past paper solutions",
    "exam preparation Scotland",
    "Scottish education",
  ],
  openGraph: {
    title: "Grxnd | AI Study Helper for Scottish Students | SQA Past Papers & Revision",
    description:
      "AI homework help, personalized revision plans, past paper solutions, and essay feedback. Tailored for Scottish students in National 5, Higher, and Advanced Higher.",
    url: "https://yourdomain.com",
    siteName: "Grxnd | AI Study Helper",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Study Helper for Scottish Students",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grxnd | AI Study Helper for Scottish Students | SQA Past Papers & Revision",
    description:
      "AI-powered revision help for National 5, Higher, and Advanced Higher exams. Get study plans, past paper solutions, and essay feedback.",
    images: ["https://yourdomain.com/og-image.png"],
  },
  alternates: {
    canonical: "https://yourdomain.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <ModalProvider>
        <html lang="en">
          <head>
            <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
            <link rel="manifest" href="/manifest.json" />
            <link rel="apple-touch-icon" href="/favicon.ico" />
            <script defer data-web-identifier="ayom" data-party="visora" data-website-id="a1367ce6-4581-4686-a061-eae57659d191" src="https://visora.vercel.app/cdn/track.js"></script>
          </head>
          <body className={InterFont.className}>
            <Toaster richColors position="top-center" />
            {children}
          </body>
        </html>
      </ModalProvider>
    </SessionWrapper>
  );
}
