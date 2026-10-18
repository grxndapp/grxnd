'use client'
import { useEffect } from "react";

export default function FontWrapper ({ children, font }: { children: React.ReactNode, font: string }) {
   useEffect (() => {
      const root = document.documentElement;
      root.style.setProperty("--font-family", `"${font}", ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"`);
   }, []);
   return (<>{children}</>)
}
