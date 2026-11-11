import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size: number };

function EmojiFrame({ children, ...props }: IconProps) {
   const updatedProps: SVGProps<SVGSVGElement> = { ...props, width: props.size, height: props.size }
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width={64}
         height={64}
         viewBox="0 0 64 64"
         fill="none"
         aria-hidden="true"
         {...updatedProps}
      >
         {children}
      </svg>
   );
}

// Quiz: a checked answer sheet.
export function QuizIllustration(props: IconProps) {
   return (
      <EmojiFrame {...props}>
         <rect x="12" y="7" width="39" height="50" rx="6" fill="#E2E8F0" />
         <rect x="12" y="7" width="35" height="47" rx="6" fill="#FFFFFF" />
         <rect x="22" y="4" width="19" height="9" rx="4" fill="#64748B" />

         <path
         d="M22 23h15M22 31h11M22 39h13"
         stroke="#94A3B8"
         strokeWidth="3"
         strokeLinecap="round"
         />

         <circle cx="45" cy="45" r="14" fill="#22C55E" />
         <path
         d="m38 45 5 5 9-10"
         stroke="#FFFFFF"
         strokeWidth="4"
         strokeLinecap="round"
         strokeLinejoin="round"
         />
      </EmojiFrame>
   );
}

// Flashcards: a small stack with a lightning bolt.
export function FlashcardsIllustration(props: IconProps) {
   return (
      <EmojiFrame {...props}>
         <rect
         x="7"
         y="13"
         width="36"
         height="44"
         rx="5"
         transform="rotate(-10 7 13)"
         fill="#F59E0B"
         />
         <rect
         x="20"
         y="7"
         width="36"
         height="44"
         rx="5"
         transform="rotate(8 20 7)"
         fill="#FCD34D"
         />
         <rect x="15" y="12" width="36" height="44" rx="5" fill="#FEF3C7" />
         <path
         d="M35 20 23 35h9l-3 13 15-19h-10l1-9Z"
         fill="#F59E0B"
         stroke="#F59E0B"
         strokeWidth="2"
         strokeLinejoin="round"
         />
      </EmojiFrame>
   );
}

// Notes: a blue notebook and a pencil.
export function NotesIllustration(props: IconProps) {
   return (
      <EmojiFrame {...props}>
         <rect x="10" y="7" width="36" height="50" rx="5" fill="#2563EB" />
         <rect x="16" y="7" width="27" height="45" rx="3" fill="#60A5FA" />
         <path d="M17 53h24" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
         <rect x="22" y="17" width="15" height="12" rx="2" fill="#FFFFFF" />
         <path d="M26 23h7" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />

         <g transform="rotate(30 47 33)">
         <rect x="43" y="9" width="9" height="39" fill="#FBBF24" />
         <rect x="43" y="9" width="3" height="39" fill="#FDE68A" />
         <path d="M43 9a4.5 4.5 0 0 1 9 0v6h-9V9Z" fill="#FB7185" />
         <path d="M43 17h9" stroke="#CBD5E1" strokeWidth="4" />
         <path d="m43 48 4.5 10L52 48" fill="#FED7AA" />
         <path d="m45.7 54 1.8 4 1.8-4" fill="#334155" />
         </g>
      </EmojiFrame>
   );
}

// Study plan: a calendar with colourful study blocks.
export function StudyPlanIllustration(props: IconProps) {
   return (
      <EmojiFrame {...props}>
         <rect x="7" y="12" width="50" height="45" rx="6" fill="#E2E8F0" />
         <rect x="7" y="10" width="50" height="43" rx="6" fill="#FFFFFF" />
         <path
         d="M7 16a6 6 0 0 1 6-6h38a6 6 0 0 1 6 6v8H7v-8Z"
         fill="#EF4444"
         />
         <path
         d="M20 7v9M44 7v9"
         stroke="#475569"
         strokeWidth="4"
         strokeLinecap="round"
         />

         <rect x="15" y="30" width="8" height="7" rx="2" fill="#60A5FA" />
         <rect x="28" y="30" width="8" height="7" rx="2" fill="#FBBF24" />
         <rect x="41" y="30" width="8" height="7" rx="2" fill="#A78BFA" />
         <rect x="15" y="41" width="8" height="7" rx="2" fill="#CBD5E1" />
         <rect x="28" y="41" width="8" height="7" rx="2" fill="#4ADE80" />
         <rect x="41" y="41" width="8" height="7" rx="2" fill="#CBD5E1" />
      </EmojiFrame>
   );
}

// Fill in the blank: an answer space with an active typing cursor.
export function FillInTheBlankIllustration(props: IconProps) {
   return (
      <EmojiFrame {...props}>
         <rect x="7" y="10" width="50" height="46" rx="7" fill="#E2E8F0" />
         <rect x="7" y="7" width="50" height="46" rx="7" fill="#FFFFFF" />

         <path
         d="M16 18h23M16 25h13"
         stroke="#94A3B8"
         strokeWidth="3"
         strokeLinecap="round"
         />

         <rect
         x="15"
         y="32"
         width="34"
         height="13"
         rx="4"
         fill="#EDE9FE"
         stroke="#8B5CF6"
         strokeWidth="2"
         />

         <path
         d="M22 35v7m-2-7h4m-4 7h4"
         stroke="#7C3AED"
         strokeWidth="2"
         strokeLinecap="round"
         />

         <circle cx="51" cy="49" r="10" fill="#8B5CF6" />
         <path
         d="M46 49h10m-4-4 4 4-4 4"
         stroke="#FFFFFF"
         strokeWidth="2.5"
         strokeLinecap="round"
         strokeLinejoin="round"
         />
      </EmojiFrame>
   );
}

// 67 Way: two upturned hands in a seesaw pose.
export function SixtySevenIllustration(props: IconProps) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width={64}
         height={64}
         viewBox="0 0 160 120"
         fill="none"
         aria-hidden="true"
         {...props}
      >
         {/* Left hand: raised fingers and a closed thumb–index loop */}
         <path
         fill="#F2B38D"
         fillRule="evenodd"
         d="
            M8 83
            L29 83
            C34 75 36 65 41 54
            L57 26
            C60 21 62 17 65 14
            C67 12 71 14 70 17
            L61 36
            L72 21
            C75 17 79 20 77 24
            L65 44
            L70 39
            C73 37 76 40 74 43
            L64 53

            C70 53 74 57 78 62
            L85 70
            C88 74 86 78 82 79
            C78 87 73 92 66 94
            L48 96
            C36 101 23 108 8 114
            Z

            M62 63
            C58 64 55 68 55 73
            C55 79 59 83 64 83
            C69 83 73 79 77 74
            L71 67
            C68 64 65 62 62 63
            Z
         "
         />

         {/* Warm shading beneath the palm */}
         <path
         d="
            M8 105
            L35 92
            C43 88 48 89 54 90
            C65 93 75 85 82 79
            C77 88 72 93 65 95
            L48 97
            L8 114Z
         "
         fill="#E9A17A"
         />

         {/* Finger and palm creases */}
         <path
         d="M51 53c4-3 8-4 13-3M42 73c0 6 2 10 5 13"
         stroke="#D68C66"
         strokeWidth="2"
         strokeLinecap="round"
         />

         {/* Right hand: horizontal index, downward thumb */}
         <path
         d="
            M145 60
            L132 59
            C124 57 117 59 110 61
            L97 63
            C92 63 87 61 84 61
            C80 60 79 63 81 66
            C84 71 91 73 98 74
            L105 75

            C106 79 103 85 99 91
            L83 112
            C81 115 84 119 88 117
            L109 96

            C111 101 115 103 119 101
            C123 105 128 105 131 102
            C136 105 141 101 142 96
            L148 77
            Z
         "
         fill="#805639"
         />

         {/* Lower palm shading */}
         <path
         d="
            M105 87
            C112 91 117 96 125 97
            C132 99 138 95 143 88
            L142 96
            C141 101 136 105 131 102
            C128 105 123 105 119 101
            C115 103 111 101 109 96
            L88 117
            C84 119 81 115 83 112
            Z
         "
         fill="#70482F"
         />

         {/* Knuckle creases */}
         <path
         d="m117 88-4 8m12-6-3 9m11-8-2 8"
         stroke="#603D29"
         strokeWidth="1.8"
         strokeLinecap="round"
         />

         {/* Dark sleeve and cuff */}
         <path
         d="m139 55 16-10v41l-12-5-7-20Z"
         fill="#292C35"
         />
         <path
         d="m139 55 6-4 9 29-6 3Z"
         fill="#414550"
         />
         <path
         d="m144 58 5-3m-2 12 5-3"
         stroke="#626773"
         strokeWidth="1.5"
         strokeLinecap="round"
         />
      </svg>
   );
}