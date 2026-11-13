import { titleCase } from "@/lib/str"
import { Dna, FlaskConical, GraduationCap, Lock, Monitor, NotebookPen, Orbit, Sigma } from "lucide-react"
import { JSX } from "react"
import { fullSubjectTopicsJson } from "./fullSubjectJson"

export const subjectLevels = [
	"National 5", "Higher", "Advanced Higher"
]

export const subjects = [
	"Math", "English",
	"Physics", "Biology", "Chemistry",
	"Computer Science", "Administration"
]

export const subjectTopics: SubjectTopicsList = fullSubjectTopicsJson;

export const subjectColors: Record<string, string> = {
	"Math": "#1577f8",
	"Physics": "#6A0DAD",
	"Biology": "#228B22",
	"Chemistry": "#FF4500",
	"English": "#FFD700",
	"Computer Science": "#2b8585",
	"Administration": "#5291cf"
}

export const subjectPastelBgColors: Record<string, string> = {
	"Math": "#b4d8ff",
	"Physics": "#e8d5f5",
	"Biology": "#dcf7dc",
	"Chemistry": "#fadfd7",
	"English": "#f8f4de",
	"Computer Science": "#ace6e6",
	"Administration": "#e3eef8"
}

export function isAmongstDefaultSubjects (text: string) {
	const defaultSubjects = [ "Math", "Physics", "Biology", "Chemistry", "English", "Computer Science", "Administration" ]
	const fullSubjectInfo = fullSubjectBreakDown(text);
	console.log(fullSubjectInfo)
	return (defaultSubjects.includes(fullSubjectInfo.subject));
}

export function retrieveSubjectTopic (subjectLevel: string, subject: string) {
	const subjectTopicsList = subjectTopics[subject.toLowerCase().replaceAll(" ", "_")];
	if (subjectLevel == "National 5") return subjectTopicsList.national5;
	if (subjectLevel == "Higher") return subjectTopicsList.higher;
	if (subjectLevel == "Advanced Higher") return subjectTopicsList.advancedHigher;
}

export function fullSubjectBreakDown (rawSubjectInfo: string) {
	const subjectInfo = titleCase(rawSubjectInfo);
	if (subjectInfo.startsWith("Advanced Higher")) {
		return {
			subjectLevel: "Advanced Higher",
			subject: subjectInfo.split("Advanced Higher ")[1],
		};
	} else if (subjectInfo.startsWith("Higher")) {
		return {
			subjectLevel: "Higher",
			subject: subjectInfo.split("Higher ")[1]
		}
	} else if (subjectInfo.startsWith("National 5")) {
		return {
			subjectLevel: "National 5",
			subject: subjectInfo.split("National 5 ")[1]
		};
	} else {
		return {
			subjectLevel: "",
			subject: subjectInfo
		};
	}
}

export const subjectIcon: Record<string, JSX.Element> = {
	"Math": <Sigma size={20} />,
	"Physics": <Orbit size={20} />,
	"Biology": <Dna size={20} />,
	"Chemistry": <FlaskConical size={20} />,
	"English": <NotebookPen size={20} />,
	"Computer Science": <Monitor size={20} />,
	"Administration": <Lock size={20} />,
}

export const anySubjectDefIcon = <GraduationCap size={20} />

function hslToHex(h: number, s: number, l: number): string {
	s /= 100;
	l /= 100;

	const a = s * Math.min(l, 1 - l);

	const f = (n: number): string => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(
			Math.min(k - 3, 9 - k, 1),
			-1
		);

		return Math.round(255 * color)
			.toString(16)
			.padStart(2, "0");
	};

	return `#${f(0)}${f(8)}${f(4)}`;
}


function getSubjectColor(str: string) {
   let hash = 0;

   for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
      hash |= 0;
   }

   return {
      hue: (hash >>> 0) % 360,
      saturation: 85 + ((hash >>> 8) % 16),
      lightness: 35 + ((hash >>> 16) % 16),
   };
}

function contrastAgainstWhite(hex: string): number {
   const rgb = [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
   ];

   const [r, g, b] = rgb.map(channel => {
      const value = channel / 255;

      return value <= 0.04045
         ? value / 12.92
         : ((value + 0.055) / 1.055) ** 2.4;
   });

   const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

   return 1.05 / (luminance + 0.05);
}

export function customSubjectToBoldColor(str: string): string {
   const { hue, saturation, lightness } = getSubjectColor(str);

   // Check the actual output colour, including HEX rounding.
   for (let light = lightness; light >= 0; light--) {
      const color = hslToHex(hue, saturation, light);

      if (contrastAgainstWhite(color) >= 4.5) {
         return color;
      }
   }

   return "#000000";
}

export function customSubjectToPastelColor(str: string): string {
   const { hue, saturation } = getSubjectColor(str);

   return hslToHex(hue, saturation, 88);
}