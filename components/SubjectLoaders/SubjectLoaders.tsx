"use client";
import { useId, type ReactNode } from "react";

export type SubjectLoaderProps = {
   /** Width and height in CSS pixels. Artwork scales through its SVG viewBox. */
   size?: number;
   className?: string;
};

// No visible labels, external assets, animation libraries, or background fills.
// These illustrations are decorative. Put loading status text in the parent UI.
// Motion is opt-in: reduced-motion users see the fully drawn static artwork.
const styles = `
  .grxnd-subject-loader { display:inline-block; vertical-align:middle; flex-shrink:0; }
  .grxnd-subject-loader .gl-ground { transform-origin:80px 140px; }
  .grxnd-subject-loader .gl-book { transform-origin:80px 112px; }
  .grxnd-subject-loader .gl-page { transform-origin:80px 80px; }
  .grxnd-subject-loader .gl-star { transform-box:fill-box; transform-origin:center; }
  .grxnd-subject-loader .gl-plant { transform-origin:80px 102px; }
  .grxnd-subject-loader .gl-growth { transform-origin:80px 103px; }
  .grxnd-subject-loader .gl-leaf-left { transform-origin:79px 77px; }
  .grxnd-subject-loader .gl-leaf-right { transform-origin:81px 63px; }
  .grxnd-subject-loader .gl-board { transform-origin:80px 116px; }
  .grxnd-subject-loader .gl-flask { transform-origin:80px 129px; }
  .grxnd-subject-loader .gl-terminal { transform-origin:80px 120px; }
  .grxnd-subject-loader .gl-calculator { transform-origin:80px 125px; }
  .grxnd-subject-loader .gl-eye { transform-box:fill-box; transform-origin:center; }
  .grxnd-subject-loader .gl-moon-front { opacity:0; }
  .grxnd-subject-loader .gl-cursor { transform:translateX(47px); }
  @media (prefers-reduced-motion:no-preference) {
    .grxnd-subject-loader .gl-calculator { animation:gl-calculator-bob 3.6s ease-in-out infinite; }
    .grxnd-subject-loader .gl-math-key { animation:gl-key-press 3.6s ease-in-out infinite; }
    .grxnd-subject-loader .gl-math-key-two { animation-delay:.45s; }
    .grxnd-subject-loader .gl-math-key-three { animation-delay:.9s; }
    .grxnd-subject-loader .gl-math-key-four { animation-delay:1.35s; }
    .grxnd-subject-loader .gl-ground { animation:gl-shadow 3.6s ease-in-out infinite; }
    .grxnd-subject-loader .gl-float { animation:gl-float 3.6s ease-in-out infinite; }
    .grxnd-subject-loader .gl-book { animation:gl-book-open 4.8s ease-in-out infinite; }
    .grxnd-subject-loader .gl-page { animation:gl-page-turn 4.8s ease-in-out infinite; }
    .grxnd-subject-loader .gl-star { animation:gl-twinkle 3.6s ease-in-out infinite; }
    .grxnd-subject-loader .gl-delay { animation-delay:-1.8s; }
    .grxnd-subject-loader .gl-moon { animation:gl-orbit 4.8s linear infinite; }
    .grxnd-subject-loader .gl-moon-back { animation:gl-back 4.8s steps(1,end) infinite; }
    .grxnd-subject-loader .gl-moon-front { animation:gl-front 4.8s steps(1,end) infinite; }
    .grxnd-subject-loader .gl-plant { animation:gl-sway 3.6s ease-in-out infinite; }
    .grxnd-subject-loader .gl-growth { animation:gl-grow 5.4s ease-in-out infinite; }
    .grxnd-subject-loader .gl-leaf-left { animation:gl-leaf-left 5.4s ease-in-out infinite; }
    .grxnd-subject-loader .gl-leaf-right { animation:gl-leaf-right 5.4s ease-in-out infinite; }
    .grxnd-subject-loader .gl-board { animation:gl-board-bob 4.8s ease-in-out infinite; }
    .grxnd-subject-loader .gl-check { stroke-dasharray:1; animation:gl-check 4.8s ease-in-out infinite both; }
    .grxnd-subject-loader .gl-check-two { animation-delay:.6s; }
    .grxnd-subject-loader .gl-check-three { animation-delay:1.2s; }
    .grxnd-subject-loader .gl-flask { animation:gl-rock 3.6s ease-in-out infinite; }
    .grxnd-subject-loader .gl-wave { animation:gl-wave 2.4s linear infinite; }
    .grxnd-subject-loader .gl-bubble { animation:gl-bubble 2.4s ease-out infinite both; }
    .grxnd-subject-loader .gl-bubble-two { animation-delay:-.8s; }
    .grxnd-subject-loader .gl-bubble-three { animation-delay:-1.6s; }
    .grxnd-subject-loader .gl-air { animation:gl-air 2.8s ease-out infinite both; }
    .grxnd-subject-loader .gl-air-two { animation-delay:-1.4s; }
    .grxnd-subject-loader .gl-terminal { animation:gl-terminal-bob 3.6s ease-in-out infinite; }
    .grxnd-subject-loader .gl-code { animation:gl-type 4s steps(5,end) infinite; }
    .grxnd-subject-loader .gl-cursor { animation:gl-cursor-move 4s steps(5,end) infinite; }
    .grxnd-subject-loader .gl-cursor-mark { animation:gl-cursor-blink 1s steps(1,end) infinite; }
    .grxnd-subject-loader .gl-eye { animation:gl-blink 5.4s ease-in-out infinite; }
  }
  @keyframes gl-shadow { 0%,100%{transform:scaleX(1);opacity:.12} 50%{transform:scaleX(.8);opacity:.07} }
  @keyframes gl-calculator-bob { 0%,100%{transform:translateY(0) rotate(-4deg)} 50%{transform:translateY(-8px) rotate(4deg)} }
  @keyframes gl-key-press { 0%,8%,30%,100%{transform:translateY(0);fill:#F3EDFF} 16%,22%{transform:translateY(2px);fill:#FFD16A} }
  @keyframes gl-float { 0%,100%{transform:translateY(2px)} 50%{transform:translateY(-4px)} }
  @keyframes gl-twinkle { 0%,100%{transform:scale(.75);opacity:.55} 50%{transform:scale(1.1);opacity:1} }
  @keyframes gl-book-open { 0%,100%{transform:translateY(1px) scaleX(.86)} 20%,80%{transform:translateY(-4px) scaleX(1)} }
  @keyframes gl-page-turn { 0%,22%{transform:scaleX(1);opacity:0} 27%{opacity:1} 60%{transform:scaleX(-1);opacity:1} 70%,100%{transform:scaleX(-1);opacity:0} }
  @keyframes gl-orbit {
    0%,100%{transform:translate(23px,80px)}
    12.5%{transform:translate(40px,65px)}
    25%{transform:translate(80px,59px)}
    37.5%{transform:translate(120px,65px)}
    50%{transform:translate(137px,80px)}
    62.5%{transform:translate(120px,95px)}
    75%{transform:translate(80px,101px)}
    87.5%{transform:translate(40px,95px)}
  }
  @keyframes gl-back { 0%{opacity:1} 50%{opacity:0} 100%{opacity:1} }
  @keyframes gl-front { 0%{opacity:0} 50%{opacity:1} 100%{opacity:0} }
  @keyframes gl-sway { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(4deg)} }
  @keyframes gl-grow { 0%,100%{transform:scale(.75,.7)} 30%,78%{transform:scale(1)} }
  @keyframes gl-leaf-left { 0%,100%{transform:rotate(14deg) scale(.8)} 35%,75%{transform:rotate(0) scale(1)} }
  @keyframes gl-leaf-right { 0%,100%{transform:rotate(-14deg) scale(.75)} 42%,75%{transform:rotate(0) scale(1)} }
  @keyframes gl-board-bob { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-5px) rotate(2deg)} }
  @keyframes gl-check { 0%,10%{stroke-dashoffset:1;opacity:0} 16%{opacity:1} 30%,70%{stroke-dashoffset:0;opacity:1} 82%,100%{stroke-dashoffset:0;opacity:0} }
  @keyframes gl-rock { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg) translateY(-3px)} }
  @keyframes gl-wave { from{transform:translateX(0)} to{transform:translateX(-40px)} }
  @keyframes gl-bubble { 0%{transform:translateY(0);opacity:0} 15%{opacity:.7} 85%{opacity:.6} 100%{transform:translateY(-35px);opacity:0} }
  @keyframes gl-air { 0%{transform:translate(0,0);opacity:0} 20%{opacity:.8} 100%{transform:translate(5px,-22px);opacity:0} }
  @keyframes gl-terminal-bob { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-6px) rotate(2deg)} }
  @keyframes gl-type { 0%,12%{clip-path:inset(0 100% 0 0)} 62%,88%{clip-path:inset(0 0 0 0)} 100%{clip-path:inset(0 100% 0 0)} }
  @keyframes gl-cursor-move { 0%,12%{transform:translateX(0)} 62%,88%{transform:translateX(47px)} 100%{transform:translateX(0)} }
  @keyframes gl-cursor-blink { 0%,55%{opacity:1} 56%,100%{opacity:0} }
  @keyframes gl-blink { 0%,43%,47%,100%{transform:scaleY(1)} 45%{transform:scaleY(.12)} }
`;

function Frame({ size = 128, className = "", children }: SubjectLoaderProps & { children: ReactNode }) {
   return (
      <svg width={size} height={size} viewBox="0 0 160 160" fill="none"
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"
         className={`grxnd-subject-loader ${className}`}>
         <style>{styles}</style>
         {children}
      </svg>
   );
}

function Shadow({ width = 29 }: { width?: number }) {
   return <ellipse className="gl-ground" cx="80" cy="140" rx={width} ry="4.5" fill="#292043" opacity=".12" />;
}

function Sparkle({ x, y, color = "#F5BD4F", small = false }: { x: number; y: number; color?: string; small?: boolean }) {
   return <g transform={`translate(${x} ${y}) scale(${small ? .65 : 1})`}>
      <path className={`gl-star ${small ? "gl-delay" : ""}`} d="M0-8Q0 0 8 0Q0 0 0 8Q0 0-8 0Q0 0 0-8Z" fill={color} />
   </g>;
}

function Face({ x, y, dark = false }: { x: number; y: number; dark?: boolean }) {
   const ink = dark ? "#D6F9EC" : "#364252";
   return <g transform={`translate(${x} ${y})`}>
      <g className="gl-eye" fill={ink}>
         <rect x="-11" y="-4" width="4" height="6" rx="2" />
         <rect x="7" y="-4" width="4" height="6" rx="2" />
      </g>
      <path d="M-4 5Q0 9 4 5" stroke={ink} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="-14" cy="4" rx="3.5" ry="2" fill="#F59DAE" opacity=".8" />
      <ellipse cx="14" cy="4" rx="3.5" ry="2" fill="#F59DAE" opacity=".8" />
   </g>;
}

/** A smiling calculator bounces as its keys light up in sequence. */
export function MathLoader(props: SubjectLoaderProps) {
   return <Frame {...props}>
      <Shadow />
      <g className="gl-float">
         <path d="M24 42V56M17 49H31" stroke="#F5BD4F" strokeWidth="4.5" strokeLinecap="round" />
      </g>
      <g className="gl-float gl-delay">
         <path d="M130 70L140 80M140 70L130 80" stroke="#F08FA9" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g className="gl-float">
         <path d="M21 110H32M21 117H32" stroke="#65BFA8" strokeWidth="3.5" strokeLinecap="round" />
      </g>
      <Sparkle x={124} y={30} small />
      <g className="gl-calculator">
         <rect x="44" y="31" width="76" height="103" rx="18" fill="#7858B3" />
         <rect x="40" y="26" width="76" height="103" rx="18" fill="#A18AD6" />
         <path d="M51 43Q51 35 59 35H94" stroke="#D0BEF1" strokeWidth="4" strokeLinecap="round" />
         <rect x="50" y="42" width="56" height="33" rx="10" fill="#806AAE" />
         <rect x="50" y="39" width="56" height="33" rx="10" fill="#E5F8EE" />
         <path d="M57 46H65" stroke="white" strokeWidth="3" strokeLinecap="round" />
         <Face x={78} y={54} />
         {[
         { x: 51, y: 83, className: "" },
         { x: 71, y: 83, className: "gl-math-key-two" },
         { x: 51, y: 103, className: "gl-math-key-three" },
         { x: 71, y: 103, className: "gl-math-key-four" },
         ].map(({ x, y, className }) => <g key={`${x}-${y}`}>
         <rect x={x} y={y + 2} width="15" height="14" rx="5" fill="#785EAA" />
         <rect className={`gl-math-key ${className}`} x={x} y={y} width="15" height="14" rx="5" fill="#F3EDFF" />
         </g>)}
         <rect x="91" y="85" width="15" height="34" rx="6" fill="#785EAA" />
         <rect x="91" y="83" width="15" height="34" rx="6" fill="#FFD16A" />
         <path d="M95.5 97H101.5M95.5 103H101.5" stroke="#8C6429" strokeWidth="2.5" strokeLinecap="round" />
      </g>
   </Frame>;
}

/** An opening book with a page turning from right to left. */
export function EnglishLoader(props: SubjectLoaderProps) {
   return <Frame {...props}>
      <Shadow width={35} />
      <Sparkle x={27} y={40} />
      <Sparkle x={133} y={55} color="#AA92ED" small />
      <g className="gl-book">
         <path d="M23 54Q50 44 80 57Q110 44 137 54V121Q109 111 80 124Q51 111 23 121Z" fill="#C75270" />
         <path d="M23 49Q50 39 80 52Q110 39 137 49V115Q109 105 80 118Q51 105 23 115Z" fill="#F28199" />
         <path d="M29 46Q53 39 80 52V111Q54 100 29 108Z" fill="#FFF8E7" />
         <path d="M80 52Q107 39 131 46V108Q106 100 80 111Z" fill="#FFFCF3" />
         <path d="M80 53V111" stroke="#E3CBA9" strokeWidth="3" strokeLinecap="round" />
         <path d="M38 57Q53 54 69 59M38 65Q53 62 69 67M38 73Q49 71 59 74" stroke="#D9BC9C" strokeWidth="3" strokeLinecap="round" />
         <path d="M92 59Q107 54 121 57M92 67Q107 62 121 65M101 74Q112 71 121 73" stroke="#D9BC9C" strokeWidth="3" strokeLinecap="round" />
         <path d="M111 44V64L116 60L121 63V44" fill="#F7C45B" />
         <g className="gl-page" opacity="0">
         <path d="M80 52Q105 34 130 43V105Q105 96 80 111Z" fill="#FFF2D5" stroke="#EAD9B9" strokeWidth="1.5" />
         <path d="M91 57Q105 50 120 52M91 65Q105 58 120 60M91 73Q103 67 113 68" stroke="#D9BC9C" strokeWidth="3" strokeLinecap="round" />
         </g>
         <Face x={80} y={89} />
      </g>
   </Frame>;
}

function Moon() {
   return <g className="gl-moon" transform="translate(23 80)">
      <circle r="9" fill="#E9E2FA" />
      <path d="M3-8A9 9 0 0 1 3 8A9 9 0 0 0 3-8Z" fill="#C6B6E6" />
      <circle cx="-3" cy="-2" r="2.1" fill="#C6B6E6" />
      <circle cx="3" cy="3" r="1.5" fill="#C6B6E6" />
   </g>;
}

/** The moon goes behind the planet, then crosses in front. */
export function PhysicsLoader(props: SubjectLoaderProps) {
   return <Frame {...props}>
      <Shadow />
      <Sparkle x={31} y={35} />
      <Sparkle x={127} y={31} color="#B5A0EE" small />
      <circle cx="134" cy="118" r="2.5" fill="#F4C865" />
      <circle cx="23" cy="110" r="2" fill="#B5A0EE" />
      <g className="gl-float">
         <ellipse cx="80" cy="80" rx="57" ry="21" stroke="#CFBDEB" strokeWidth="2.5" strokeDasharray="3 6" />
         <g className="gl-moon-back"><Moon /></g>
         <circle cx="80" cy="78" r="34" fill="#9B7BE2" />
         <path d="M96 48A34 34 0 0 1 58 104A34 34 0 0 0 96 48Z" fill="#7D5BC7" />
         <path d="M52 60Q77 69 108 64M47 75Q73 84 112 78M53 93Q78 99 106 94" stroke="#B89AEC" strokeWidth="6" strokeLinecap="round" />
         <path d="M62 53Q67 49 74 48" stroke="#D9C6FA" strokeWidth="4" strokeLinecap="round" />
         <Face x={80} y={77} />
         <path d="M23 80C23 91.6 48.5 101 80 101S137 91.6 137 80" stroke="#E7D8FA" strokeWidth="2.5" strokeDasharray="3 6" />
         <g className="gl-moon-front"><Moon /></g>
      </g>
   </Frame>;
}

/** A seedling unfurls and sways above a smiling terracotta pot. */
export function BiologyLoader(props: SubjectLoaderProps) {
   return <Frame {...props}>
      <Shadow width={26} />
      <Sparkle x={33} y={61} color="#EFC25A" small />
      <Sparkle x={126} y={42} color="#95D4AC" />
      <g className="gl-plant">
         <g className="gl-growth">
         <path d="M80 105Q77 81 83 52" stroke="#379B70" strokeWidth="5" strokeLinecap="round" />
         <g className="gl-leaf-left">
            <path d="M79 77C57 82 41 66 43 47C65 44 80 57 79 77Z" fill="#66C88D" />
            <path d="M49 54Q63 63 78 76" stroke="#379B70" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M50 50Q59 50 65 55" stroke="#A0E4B1" strokeWidth="3" strokeLinecap="round" />
         </g>
         <g className="gl-leaf-right">
            <path d="M81 63C80 41 96 30 117 33C116 54 103 67 81 63Z" fill="#8DDB9D" />
            <path d="M83 61Q98 46 110 40" stroke="#45A875" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M97 39Q104 36 111 37" stroke="#C2EFC3" strokeWidth="3" strokeLinecap="round" />
         </g>
         </g>
      </g>
      <path d="M53 100H107L101 126Q100 133 93 133H67Q60 133 59 126Z" fill="#DD886D" />
      <path d="M94 101H107L101 126Q100 133 93 133H86Q94 124 94 101Z" fill="#C8725C" />
      <rect x="49" y="94" width="62" height="13" rx="6.5" fill="#F1AA89" />
      <ellipse cx="80" cy="96" rx="25" ry="3.5" fill="#805845" />
      <path d="M80 96V90" stroke="#379B70" strokeWidth="5" strokeLinecap="round" />
      <path d="M57 99H68" stroke="#FFD0AF" strokeWidth="3" strokeLinecap="round" />
      <Face x={80} y={116} />
   </Frame>;
}

/** Three checkmarks draw themselves one after another. */
export function AdministrationLoader(props: SubjectLoaderProps) {
   return <Frame {...props}>
      <Shadow />
      <Sparkle x={28} y={57} color="#F4C35C" />
      <Sparkle x={132} y={113} color="#8DCFB8" small />
      <g className="gl-board">
         <rect x="42" y="30" width="79" height="102" rx="16" fill="#358F85" />
         <rect x="38" y="26" width="79" height="102" rx="16" fill="#69BCAF" />
         <rect x="46" y="35" width="63" height="83" rx="10" fill="#FFFAEF" />
         <rect x="61" y="24" width="34" height="16" rx="6" fill="#DCA64C" />
         <rect x="61" y="21" width="34" height="15" rx="6" fill="#F5CD76" />
         <rect x="72" y="25" width="12" height="4" rx="2" fill="#FFF1CC" />
         {[53, 75, 97].map((y, index) => <g key={y}>
         <rect x="54" y={y} width="13" height="13" rx="4" fill="#DFF0E5" />
         <path className={`gl-check ${index === 1 ? "gl-check-two" : index === 2 ? "gl-check-three" : ""}`}
            d={`M57 ${y + 6}l3 3 6-7`} pathLength="1" stroke="#359780" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
         <path d={`M76 ${y + 4}h23M76 ${y + 10}h${index === 1 ? 15 : 19}`}
            stroke="#C9D4CE" strokeWidth="3" strokeLinecap="round" />
         </g>)}
      </g>
   </Frame>;
}

/** Moving liquid and rising bubbles stay clipped inside the glass. */
export function ChemistryLoader(props: SubjectLoaderProps) {
   const clipId = `gl-flask-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
   const flask = "M68 42H92V69L115 111Q122 128 106 129H54Q38 128 45 111L68 69Z";
   return <Frame {...props}>
      <defs><clipPath id={clipId}><path d={flask} /></clipPath></defs>
      <Shadow />
      <Sparkle x={29} y={89} color="#B59ADD" small />
      <Sparkle x={130} y={68} color="#F0C55E" />
      <g className="gl-flask">
         <circle className="gl-air" cx="78" cy="29" r="4" fill="#8FDCC7" />
         <circle className="gl-air gl-air-two" cx="89" cy="29" r="3" fill="#B59AE7" />
         <path d={flask} fill="#E3F5F2" fillOpacity=".62" />
         <g clipPath={`url(#${clipId})`}>
         <path className="gl-wave" d="M20 91Q30 85 40 91T60 91T80 91T100 91T120 91T140 91T160 91V139H20Z" fill="#8BD7BA" />
         <path className="gl-wave" d="M20 99Q30 105 40 99T60 99T80 99T100 99T120 99T140 99T160 99V139H20Z" fill="#55BCA3" />
         <circle className="gl-bubble" cx="62" cy="120" r="4" fill="#D4F8D9" />
         <circle className="gl-bubble gl-bubble-two" cx="95" cy="116" r="3" fill="#D4F8D9" />
         <circle className="gl-bubble gl-bubble-three" cx="80" cy="125" r="3.5" fill="#D4F8D9" />
         </g>
         <path d={flask} stroke="#83BBB9" strokeWidth="3.5" strokeLinejoin="round" />
         <path d="M74 51V71L57 101" stroke="white" strokeOpacity=".8" strokeWidth="4" strokeLinecap="round" />
         <path d="M52 114L51 118" stroke="white" strokeOpacity=".7" strokeWidth="4" strokeLinecap="round" />
         <rect x="63" y="36" width="34" height="9" rx="4.5" fill="#B5DFD9" />
         <path d="M69 39H82" stroke="#ECFCF6" strokeWidth="2.5" strokeLinecap="round" />
         <Face x={80} y={106} />
      </g>
   </Frame>;
}

/** A tiny terminal types a command with a blinking cursor. */
export function ComputerScienceLoader(props: SubjectLoaderProps) {
   return <Frame {...props}>
      <Shadow width={33} />
      <Sparkle x={132} y={38} color="#F4C462" />
      <g className="gl-float" stroke="#A78DD6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
         <path d="M25 96L19 102L25 108M135 112L141 118L135 124" />
      </g>
      <g className="gl-terminal">
         <path d="M72 111H90L93 128H69Z" fill="#8F83BA" />
         <rect x="58" y="126" width="46" height="7" rx="3.5" fill="#B2A3D6" />
         <rect x="29" y="38" width="106" height="81" rx="15" fill="#8978B3" />
         <rect x="25" y="33" width="106" height="81" rx="15" fill="#B7A5DF" />
         <rect x="33" y="41" width="90" height="65" rx="9" fill="#30354C" />
         <path d="M33 50Q33 41 42 41H114Q123 41 123 50V55H33Z" fill="#444A64" />
         <circle cx="43" cy="48" r="2.5" fill="#F29DAB" />
         <circle cx="52" cy="48" r="2.5" fill="#F4CC73" />
         <circle cx="61" cy="48" r="2.5" fill="#8AD5B6" />
         <path d="M42 66L47 70L42 74" stroke="#91DEC0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
         <g className="gl-code" fill="#B9ACE5">
         <rect x="54" y="67" width="7" height="5" rx="1.5" />
         <rect x="64" y="67" width="7" height="5" rx="1.5" />
         <rect x="74" y="67" width="7" height="5" rx="1.5" />
         <rect x="84" y="67" width="7" height="5" rx="1.5" />
         <rect x="94" y="67" width="5" height="5" rx="1.5" />
         </g>
         <g className="gl-cursor"><rect className="gl-cursor-mark" x="55" y="65" width="3" height="10" rx="1" fill="#A5E9C8" /></g>
         <Face x={78} y={89} dark />
      </g>
   </Frame>;
}

const activityStyles = `
  .grxnd-subject-loader .al-sheet {
    transform-origin: 80px 115px;
  }

  .grxnd-subject-loader .al-pencil {
    transform-origin: 108px 85px;
  }

  .grxnd-subject-loader .al-card {
    transform-origin: 80px 80px;
  }

  .grxnd-subject-loader .al-hand-left {
    transform-origin: 43px 105px;
  }

  .grxnd-subject-loader .al-hand-right {
    transform-origin: 117px 105px;
  }

  .grxnd-subject-loader .al-number {
    transform-origin: 80px 58px;
  }

  @media (prefers-reduced-motion: no-preference) {
    .grxnd-subject-loader .al-sheet {
      animation: al-sheet-float 3.6s ease-in-out infinite;
    }

    .grxnd-subject-loader .al-answer {
      animation: al-answer-glow 3.6s ease-in-out infinite;
    }

    .grxnd-subject-loader .al-check {
      stroke-dasharray: 1;
      animation: al-check-draw 3.6s ease-in-out infinite;
    }

    .grxnd-subject-loader .al-writing {
      stroke-dasharray: 1;
      animation: al-write 4.8s ease-in-out infinite both;
    }

    .grxnd-subject-loader .al-writing-two {
      animation-delay: .5s;
    }

    .grxnd-subject-loader .al-writing-three {
      animation-delay: 1s;
    }

    .grxnd-subject-loader .al-pencil {
      animation: al-pencil-write 4.8s ease-in-out infinite;
    }

    .grxnd-subject-loader .al-card {
      animation: al-card-turn 4.2s ease-in-out infinite;
    }

    .grxnd-subject-loader .al-day {
      animation: al-day-fill 4.2s ease-in-out infinite;
    }

    .grxnd-subject-loader .al-day-two {
      animation-delay: .45s;
    }

    .grxnd-subject-loader .al-day-three {
      animation-delay: .9s;
    }

    .grxnd-subject-loader .al-hand-left {
      animation: al-left-hand 1.8s ease-in-out infinite;
    }

    .grxnd-subject-loader .al-hand-right {
      animation: al-right-hand 1.8s ease-in-out infinite;
    }

    .grxnd-subject-loader .al-number {
      animation: al-number-bob 1.8s ease-in-out infinite;
    }
  }

  @keyframes al-sheet-float {
    0%, 100% { transform: translateY(0) rotate(-3deg); }
    50% { transform: translateY(-6px) rotate(3deg); }
  }

  @keyframes al-answer-glow {
    0%, 18%, 100% { fill: #E9E2F5; }
    35%, 78% { fill: #C8EDD9; }
  }

  @keyframes al-check-draw {
    0%, 20% { stroke-dashoffset: 1; opacity: 0; }
    28% { opacity: 1; }
    45%, 78% { stroke-dashoffset: 0; opacity: 1; }
    95%, 100% { stroke-dashoffset: 0; opacity: 0; }
  }

  @keyframes al-write {
    0%, 10% { stroke-dashoffset: 1; opacity: 0; }
    15% { opacity: 1; }
    40%, 72% { stroke-dashoffset: 0; opacity: 1; }
    88%, 100% { stroke-dashoffset: 0; opacity: 0; }
  }

  @keyframes al-pencil-write {
    0%, 100% { transform: translate(0, -5px) rotate(-5deg); }
    15% { transform: translate(-4px, 0) rotate(0deg); }
    28% { transform: translate(5px, 2px) rotate(4deg); }
    40% { transform: translate(-3px, 8px) rotate(-3deg); }
    53% { transform: translate(5px, 10px) rotate(3deg); }
    65% { transform: translate(-2px, 16px) rotate(-2deg); }
    80% { transform: translate(8px, 0) rotate(8deg); }
  }

  @keyframes al-card-turn {
    0%, 16%, 100% { transform: translateY(0) scaleX(1); }
    38% { transform: translateY(-5px) scaleX(.08); }
    60%, 80% { transform: translateY(-7px) scaleX(1); }
  }

  @keyframes al-day-fill {
    0%, 12%, 100% { fill: #E9E5F1; }
    28%, 72% { fill: #A7DEC5; }
  }

  @keyframes al-left-hand {
    0%, 100% { transform: translateY(-8px) rotate(-8deg); }
    50% { transform: translateY(8px) rotate(5deg); }
  }

  @keyframes al-right-hand {
    0%, 100% { transform: translateY(8px) rotate(-5deg); }
    50% { transform: translateY(-8px) rotate(8deg); }
  }

  @keyframes al-number-bob {
    0%, 100% { transform: translateY(0) rotate(-5deg); }
    50% { transform: translateY(-4px) rotate(5deg); }
  }
`;

/* ── QUIZ ─────────────────────────────────────────────── */

export function QuizLoader(props: SubjectLoaderProps) {
   return (
      <Frame {...props}>
         <style>{activityStyles}</style>

         <Shadow />
         <Sparkle x={27} y={46} />
         <Sparkle x={133} y={101} color="#93CEB6" small />

         <g className="al-sheet">
         <rect
            x="44" y="30" width="76" height="103"
            rx="17" fill="#8266AF"
         />
         <rect
            x="40" y="26" width="76" height="103"
            rx="17" fill="#B19AD9"
         />
         <rect
            x="48" y="35" width="60" height="85"
            rx="11" fill="#FFFBF2"
         />

         {/* Question mark */}
         <path
            d="M70 51C70 40 88 40 88 51C88 58 79 58 79 64"
            stroke="#9C7BCB"
            strokeWidth="5"
            strokeLinecap="round"
         />
         <circle cx="79" cy="72" r="2.7" fill="#9C7BCB" />

         {/* Unselected answer */}
         <rect
            x="56" y="82" width="44" height="11"
            rx="5.5" fill="#EEE8F5"
         />
         <circle cx="63" cy="87.5" r="2.5" fill="#C7B6DC" />
         <path
            d="M71 87.5H91"
            stroke="#C7B6DC"
            strokeWidth="3"
            strokeLinecap="round"
         />

         {/* Correct answer */}
         <rect
            className="al-answer"
            x="56" y="99" width="44" height="12"
            rx="6" fill="#C8EDD9"
         />
         <path
            className="al-check"
            d="M61 105L64 108L69 102"
            pathLength="1"
            stroke="#398E71"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M76 105H91"
            stroke="#73AC93"
            strokeWidth="3"
            strokeLinecap="round"
         />
         </g>
      </Frame>
   );
}

/* ── NOTE MAKING ──────────────────────────────────────── */

export function NoteMakingLoader(props: SubjectLoaderProps) {
   return (
      <Frame {...props}>
         <style>{activityStyles}</style>

         <Shadow />
         <Sparkle x={28} y={59} color="#A98BD5" small />
         <Sparkle x={130} y={34} />

         <g className="al-sheet">
         <rect
            x="40" y="30" width="77" height="101"
            rx="15" fill="#D8AC63"
         />
         <rect
            x="36" y="26" width="77" height="101"
            rx="15" fill="#F2CE85"
         />
         <rect
            x="45" y="34" width="60" height="85"
            rx="9" fill="#FFFBF0"
         />

         <path
            d="M53 48H72"
            stroke="#D4AA62"
            strokeWidth="5"
            strokeLinecap="round"
         />

         {/* Faint ruled lines */}
         <path
            d="M53 64H94M53 78H94M53 92H87"
            stroke="#EFE5D1"
            strokeWidth="3"
            strokeLinecap="round"
         />

         {/* Handwritten strokes */}
         <g
            stroke="#A899C5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
         >
            <path
               className="al-writing"
               d="M53 64L60 62L65 65L72 62L79 64L91 63"
               pathLength="1"
            />
            <path
               className="al-writing al-writing-two"
               d="M53 78L61 76L67 79L75 76L83 78L92 77"
               pathLength="1"
            />
            <path
               className="al-writing al-writing-three"
               d="M53 92L60 90L67 93L74 90L83 91"
               pathLength="1"
            />
         </g>

         <path
            d="M54 108H68"
            stroke="#E6D7BA"
            strokeWidth="3"
            strokeLinecap="round"
         />

         {/* Pencil angled down toward the paper */}
         <g className="al-pencil">
            <g transform="translate(111 75) rotate(32)">
               <rect
               x="-6" y="-29" width="12" height="43"
               rx="3" fill="#A78BD5"
               />
               <path d="M2-26V13H6V-26Z" fill="#8768B6" />
               <path
               d="M-3-24V7"
               stroke="#D7C5F2"
               strokeWidth="2"
               strokeLinecap="round"
               />
               <rect
               x="-6" y="-35" width="12" height="10"
               rx="4" fill="#EF9CAE"
               />
               <path d="M-6-25H6" stroke="#E9D8EF" strokeWidth="4" />
               <path d="M-6 14H6L0 27Z" fill="#EDC895" />
               <path d="M-2.5 21.5L0 27L2.5 21.5Z" fill="#4E425E" />
            </g>
         </g>
         </g>
      </Frame>
   );
}

/* ── FLASHCARD MAKING ─────────────────────────────────── */

export function FlashcardMakingLoader(props: SubjectLoaderProps) {
   return (
      <Frame {...props}>
         <style>{activityStyles}</style>

         <Shadow width={33} />
         <Sparkle x={28} y={43} color="#EDBA5C" />
         <Sparkle x={135} y={109} color="#9ACFB9" small />

         <g className="gl-float">
         {/* Back cards */}
         <g transform="rotate(-13 80 83)">
            <rect
               x="40" y="37" width="76" height="91"
               rx="15" fill="#D6BCEB"
            />
            <path
               d="M51 48H82"
               stroke="#EEE0F8"
               strokeWidth="4"
               strokeLinecap="round"
            />
         </g>

         <g transform="rotate(9 80 83)">
            <rect
               x="40" y="36" width="76" height="91"
               rx="15" fill="#A6D9C3"
            />
         </g>

         {/* Front card */}
         <g className="al-card">
            <rect
               x="43" y="38" width="76" height="91"
               rx="15" fill="#C79953"
            />
            <rect
               x="39" y="33" width="76" height="91"
               rx="15" fill="#F6D48C"
            />
            <rect
               x="47" y="41" width="60" height="75"
               rx="10" fill="#FFFBEF"
            />

            {/* Little idea star */}
            <path
               d="M77 49L81 57L90 58L83 64L85 73L77 68L69 73L71 64L64 58L73 57Z"
               fill="#EABC62"
               strokeLinejoin="round"
            />

            <Face x={77} y={86} />

            <path
               d="M65 105H89"
               stroke="#E9D7B2"
               strokeWidth="3"
               strokeLinecap="round"
            />
         </g>
         </g>
      </Frame>
   );
}

/* ── STUDY PLANNER ────────────────────────────────────── */

export function StudyPlannerLoader(props: SubjectLoaderProps) {
   const days = [
      { x: 49, y: 69 },
      { x: 71, y: 69, active: "al-day" },
      { x: 93, y: 69 },
      { x: 49, y: 91, active: "al-day al-day-two" },
      { x: 71, y: 91 },
      { x: 93, y: 91, active: "al-day al-day-three" },
   ];

   return (
      <Frame {...props}>
         <style>{activityStyles}</style>

         <Shadow width={33} />
         <Sparkle x={26} y={57} color="#F0BE5C" small />
         <Sparkle x={133} y={37} color="#A790D6" />

         <g className="al-sheet">
         <rect
            x="35" y="35" width="94" height="95"
            rx="17" fill="#5A9D94"
         />
         <rect
            x="31" y="30" width="94" height="95"
            rx="17" fill="#FFFBF2"
         />

         {/* Calendar header */}
         <path
            d="M48 30H108Q125 30 125 47V57H31V47Q31 30 48 30Z"
            fill="#8BC9BB"
         />
         <path
            d="M41 54H115"
            stroke="#75B4A6"
            strokeWidth="2"
            strokeLinecap="round"
         />

         {/* Binding loops */}
         <path
            d="M53 26V39M103 26V39"
            stroke="#527F7B"
            strokeWidth="7"
            strokeLinecap="round"
         />
         <path
            d="M52 26V34M102 26V34"
            stroke="#C8E9DB"
            strokeWidth="2"
            strokeLinecap="round"
         />

         {days.map(({ x, y, active }) => (
            <g key={`${x}-${y}`}>
               <rect
               className={active}
               x={x} y={y} width="16" height="16"
               rx="5"
               fill={active ? "#A7DEC5" : "#E9E5F1"}
               />

               {active ? (
               <path
                  d={`M${x + 4} ${y + 8}l3 3 5-6`}
                  stroke="#488F76"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
               />
               ) : (
               <path
                  d={`M${x + 5} ${y + 8}h6`}
                  stroke="#C2B7D2"
                  strokeWidth="2"
                  strokeLinecap="round"
               />
               )}
            </g>
         ))}
         </g>
      </Frame>
   );
}

/* ── 67 METHOD ────────────────────────────────────────── */

/**
 * Stylised palms facing upward, alternating up and down
 * like the 67 balancing gesture.
 */
function SixtySevenPalm() {
   return (
      <g>
         {/* Sleeve and cuff */}
         <path
         d="M35 112H51L54 135H31Z"
         fill="#A98ED4"
         />
         <rect
         x="33" y="108" width="20" height="9"
         rx="4.5" fill="#CEB9ED"
         />

         {/* Open hand, viewed at an angle */}
         <path
         d="
            M35 109
            L31 102
            L20 98
            Q15 96 17 92
            Q18 89 23 91
            L34 94
            L24 86
            Q20 83 23 80
            Q25 78 29 81
            L40 89
            L32 79
            Q29 75 32 73
            Q35 71 38 75
            L47 87
            L43 78
            Q41 74 44 73
            Q48 72 50 77
            L56 90
            L62 86
            Q66 83 69 86
            Q71 89 67 92
            L59 100
            Q56 105 51 109
            Z
         "
         fill="#F2C59E"
         stroke="#D9A67F"
         strokeWidth="1.5"
         strokeLinejoin="round"
         />

         {/* Palm crease */}
         <path
         d="M37 98Q44 94 52 97M50 91Q47 95 49 101"
         stroke="#D59D76"
         strokeWidth="2"
         strokeLinecap="round"
         />

         <path
         d="M36 103L39 107"
         stroke="#FFE0BF"
         strokeWidth="3"
         strokeLinecap="round"
         />
      </g>
   );
}

export function SixtySevenLoader(props: SubjectLoaderProps) {
   return (
      <Frame {...props}>
         <style>{activityStyles}</style>

         <Shadow width={38} />

         <Sparkle x={24} y={46} color="#8CCDB6" small />
         <Sparkle x={137} y={52} color="#EEC166" small />

         {/* Rounded, font-independent 6 and 7 */}
         <g className="al-number">
         <g
            stroke="#8667B5"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
         >
            <path d="M69 35C54 35 50 48 50 58C50 71 70 72 70 59C70 47 51 48 51 58" />
            <path d="M85 35H107L91 68" />
         </g>

         <g
            transform="translate(-1 -2)"
            stroke="#B69ADD"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
         >
            <path d="M69 35C54 35 50 48 50 58C50 71 70 72 70 59C70 47 51 48 51 58" />
            <path d="M85 35H107L91 68" />
         </g>
         </g>

         <g className="al-hand-left">
         <SixtySevenPalm />
         </g>

         <g className="al-hand-right">
         <g transform="translate(160 0) scale(-1 1)">
            <SixtySevenPalm />
         </g>
         </g>
      </Frame>
   );
}