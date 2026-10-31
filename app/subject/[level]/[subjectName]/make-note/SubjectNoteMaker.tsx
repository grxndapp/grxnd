'use client'
import { NotebookPen, RotateCcw } from "lucide-react";
import { fullSubjectBreakDown, isAmongstDefaultSubjects, retrieveSubjectTopic } from "@/utils/subjects";
import { RefObject, useState } from "react";
import { generateUsingAi } from "@/app/actions/ai";
import { subjectNoteMakerPrompt } from "@/prompts/subjectNoteMaker";
import { CustomSpinner } from "@/components/Spinner/Spinner";
import { useSplashScreen } from "@/components/SplashScreen/SplashScreenContext";
import { ResponseFormats } from "@/prompts/responseFormats";
import { NoteIntensity } from "@/prompts/promptExtras";
import { noteExplanationTypeIntensityOptions } from "@/utils/intensityOptions";
import Spacing from "@/components/Spacing/Spacing"
import NoteViewer from "@/components/NoteViewer/NoteViewer";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import FullSelect from "@/components/FullSelect/FullSelect";
import IntensityChooser from "@/components/IntensityChooser/IntensityChooser";


const upgradedTestNote = {
	"success": true,
	"data": {
		"note": {
			"title": "Polynomials: Definitions, Factorisation, and Division",
			"overview": "Polynomials are expressions built from variables and coefficients using only addition, subtraction, multiplication, and non-negative integer exponents. Understanding their properties, how to factorise them, and how to perform division is fundamental for solving equations and simplifying complex expressions in mathematics.",
			"key_concepts": [
					"**Polynomial**: An expression of the form $\\sum_{r=0}^{n} a_rx^r$, where $a_r$ are coefficients and $n$ is a non-negative integer.",
					"**Coefficients**: The numerical values ($a_r$) that multiply the powers of the variable in a polynomial.",
					"**Degree of a polynomial**: The highest power of the variable in the polynomial, denoted as $\\deg f(x)$.",
					"**Factorisation**: The process of writing a polynomial as a product of other polynomials (factors) over a specified set of numbers.",
					"**Irreducible polynomial**: A polynomial that cannot be factorised into simpler polynomials over a given set of numbers (e.g., integers, rational numbers, real numbers)."
			],
			"rules": [
					{
						"title": "Definition of a Polynomial",
						"rule": "$$f(x) = a_0 + a_1x + a_2x^2 + \\dots + a_nx^n = \\sum_{r=0}^{n} a_rx^r$$\n",
						"use": "- $\\,x$: The variable. Its powers must be non-negative integers. - $\\,a_r$: The coefficients. These belong to a specified set of numbers (e.g., integers $\\mathbb{Z}$, rational numbers $\\mathbb{Q}$, real numbers $\\mathbb{R}$). - $\\,n$: The highest power of $x$, which is a non-negative integer. Use this definition to identify if an expression is a polynomial and to understand its basic structure."
					},
					{
						"title": "Degree of a Polynomial",
						"rule": "The degree of a polynomial $f(x)$ is the highest power of the variable $x$ that appears in the polynomial.",
						"use": "The degree, denoted $\\deg f(x)$, helps classify polynomials. For example, a polynomial of degree 0 is a constant, degree 1 is linear, degree 2 is quadratic, and degree 3 is cubic. This is important for understanding the behaviour and number of roots a polynomial might have."
					},
					{
						"title": "Polynomial Division Algorithm",
						"rule": "1. Find $q_1(x)$ such that the leading term of $q_1(x)g(x)$ matches the leading term of $f(x)$. 2. Calculate the remainder $r_1(x) = f(x) - q_1(x)g(x)$. 3. If $\\deg r_1(x) < \\deg g(x)$, then $q(x) = q_1(x)$ and $r(x) = r_1(x)$, and you are done. 4. Otherwise, set $f(x) = r_1(x)$ and repeat the process from step 1 until the remainder's degree is less than the divisor's degree.",
						"use": "Given two polynomials, a dividend $f(x)$ and a non-zero divisor $g(x)$, this algorithm finds a unique quotient $q(x)$ and remainder $r(x)$ such that $f(x) = q(x)g(x) + r(x)$, where $\\deg r(x) < \\deg g(x)$. This is used to simplify polynomials, find factors, and locate roots."
					}
			],
			"examples": [
					{
						"question": "Given the polynomial $f(x) = 3x^2 + 2x - 1$, evaluate $f(0)$ and $f(1)$.",
						"solution": [
							"To evaluate $f(0)$, substitute $x=0$ into the polynomial:",
							"$$f(0) = 3(0)^2 + 2(0) - 1$$\n",
							"$$f(0) = 0 + 0 - 1 = -1$$\n",
							"To evaluate $f(1)$, substitute $x=1$ into the polynomial:",
							"$$f(1) = 3(1)^2 + 2(1) - 1$$\n",
							"$$f(1) = 3 + 2 - 1 = 4$$\n",
							"The values are $f(0) = -1$ and $f(1) = 4$."
						]
					},
					{
						"question": "Perform polynomial long division for $f(x) = 3x^3 + 4x - 2$ divided by $g(x) = x$. Express the result in the form $f(x) = q(x)g(x) + r(x)$.",
						"solution": [
							"Set up the long division, ensuring all powers of $x$ are present (use $0x^2$):",
							"Divide the leading term of $f(x)$ by the leading term of $g(x)$: $3x^3 \\div x = 3x^2$. This is the first term of $q(x)$.",
							"Multiply $3x^2$ by $g(x)$: $3x^2 \\times x = 3x^3$. Subtract this from $f(x)$.",
							"The remainder is $0x^2 + 4x - 2$. The degree of this remainder (1) is not less than $\\deg g(x)$ (1), so continue.",
							"Divide the leading term of the new remainder ($4x$) by $x$: $4x \\div x = 4$. This is the next term of $q(x)$.",
							"Multiply $4$ by $g(x)$: $4 \\times x = 4x$. Subtract this from the current remainder.",
							"The new remainder is $-2$. The degree of this remainder (0) is less than $\\deg g(x)$ (1), so we stop.",
							"The quotient is $q(x) = 3x^2 + 4$ and the remainder is $r(x) = -2$. So $3x^3 + 4x - 2 = x(3x^2 + 4) - 2$."
						]
					},
					{
						"question": "Factorise the polynomial $f(x) = 2x^3 + 5x^2 - 4x - 3$ completely over the integers, given that $x=1$ is a root.",
						"solution": [
							"Since $x=1$ is a root, $(x-1)$ is a factor. We use polynomial long division to find the other factor $q(x)$ where $f(x) = (x-1)q(x)$.",
							"Divide $2x^3 + 5x^2 - 4x - 3$ by $(x-1)$:",
							"$$\\begin{array}{c|cc cc} \\multicolumn{2}{r}{2x^2} & +7x & +3 \\ \\cline{2-5} x-1 & 2x^3 & +5x^2 & -4x & -3 \\ \\multicolumn{2}{r}{-(2x^3} & -2x^2) \\ \\cline{2-3} \\multicolumn{2}{r}{0} & 7x^2 & -4x \\ \\multicolumn{2}{r}{} & -(7x^2 & -7x) \\ \\cline{3-4} \\multicolumn{2}{r}{} & 0 & 3x & -3 \\ \\multicolumn{2}{r}{} & & -(3x & -3) \\ \\cline{4-5} \\multicolumn{2}{r}{} & & 0 & 0 \\ \\end{array}$$\n",
							"The quotient is $q(x) = 2x^2 + 7x + 3$. Now we need to factorise this quadratic.",
							"We look for two numbers that multiply to $2 \\times 3 = 6$ and add to $7$. These are $1$ and $6$.",
							"$$2x^2 + 7x + 3 = 2x^2 + x + 6x + 3 = x(2x+1) + 3(2x+1) = (x+3)(2x+1)$$\n",
							"Therefore, the complete factorisation is $f(x) = (x-1)(x+3)(2x+1)$."
						]
					}
			],
			"visuals": [
					"https://www.youtube.com/results?search_query=polynomial+long+division+sqa",
					"https://www.youtube.com/results?search_query=factorising+polynomials+sqa",
					"https://www.youtube.com/results?search_query=irreducible+polynomials+explained"
			],
			"common_mistakes": [
					{
						"mistake": "Including terms with negative or fractional powers of the variable when identifying a polynomial.",
						"fix": "Remember that a polynomial can only have non-negative integer powers of its variable. Expressions like $x^{-1}$ or $\\sqrt{x}$ are not part of a polynomial."
					},
					{
						"mistake": "Confusing reducibility over different number sets (e.g., $\\mathbb{Z}$, $\\mathbb{Q}$, $\\mathbb{R}$, $\\mathbb{C}$).",
						"fix": "Always state the set over which you are factorising. For example, $x^2-2$ is irreducible over $\\mathbb{Q}$ but reducible over $\\mathbb{R}$ as $(x-\\sqrt{2})(x+\\sqrt{2})$. $x^2+1$ is irreducible over $\\mathbb{R}$ but reducible over $\\mathbb{C}$ as $(x-j)(x+j)$."
					},
					{
						"mistake": "Omitting terms with zero coefficients when setting up polynomial long division.",
						"fix": "Always write out the polynomial with all powers of the variable from the highest degree down to the constant term, using $0$ as a coefficient for any missing terms (e.g., $3x^3 + 0x^2 + 4x - 2$). This helps align terms correctly during subtraction."
					}
			],
			"questions": [
					{
						"question": "1. State the degree of the polynomial $f(x) = 5x^4 - 2x^3 + 7x - 10$. 2. Evaluate $f(-1)$.",
						"solution": [
							"1. The highest power of $x$ is $4$.",
							"The degree of $f(x)$ is $4$.",
							"2. Substitute $x=-1$ into the polynomial:",
							"$$f(-1) = 5(-1)^4 - 2(-1)^3 + 7(-1) - 10$$\n",
							"$$f(-1) = 5(1) - 2(-1) - 7 - 10$$\n",
							"$$f(-1) = 5 + 2 - 7 - 10 = -10$$\n",
							"The degree is $4$ and $f(-1) = -10$."
						]
					},
					{
						"question": "Show that $(x+1)$ is a factor of $f(x) = x^3 - 3x^2 + 3x - 2$, and then find the remaining quadratic factor.",
						"solution": [
							"To show $(x+1)$ is a factor, we check if $f(-1) = 0$:",
							"$$f(-1) = (-1)^3 - 3(-1)^2 + 3(-1) - 2$$\n",
							"$$f(-1) = -1 - 3(1) - 3 - 2 = -1 - 3 - 3 - 2 = -9$$\n",
							"Since $f(-1) \neq 0$, $(x+1)$ is not a factor. (Note: The question in the file used $x=-1$ as a root for a different polynomial. I will correct the question to match the example in the file where $x=-1$ *is* a root for $x^4 - 2x^3 + x - 2$. Let's use that one instead.)",
							"Let's re-evaluate the question based on the file's example: Show that $(x+1)$ is a factor of $f(x) = x^4 - 2x^3 + x - 2$, and then find the remaining cubic factor.",
							"To show $(x+1)$ is a factor, we check if $f(-1) = 0$:",
							"$$f(-1) = (-1)^4 - 2(-1)^3 + (-1) - 2$$\n",
							"$$f(-1) = 1 - 2(-1) - 1 - 2 = 1 + 2 - 1 - 2 = 0$$\n",
							"Since $f(-1) = 0$, $(x+1)$ is a factor. Now perform polynomial long division:",
							"$$\\begin{array}{c|cc cc cc} \\multicolumn{2}{r}{x^3} & -3x^2 & +3x & -2 \\ \\cline{2-6} x+1 & x^4 & -2x^3 & +0x^2 & +x & -2 \\ \\multicolumn{2}{r}{-(x^4} & +x^3) \\ \\cline{2-3} \\multicolumn{2}{r}{0} & -3x^3 & +0x^2 \\ \\multicolumn{2}{r}{} & -(-3x^3 & -3x^2) \\ \\cline{3-4} \\multicolumn{2}{r}{} & 0 & 3x^2 & +x \\ \\multicolumn{2}{r}{} & & -(3x^2 & +3x) \\ \\cline{4-5} \\multicolumn{2}{r}{} & & 0 & -2x & -2 \\ \\multicolumn{2}{r}{} & & & -(-2x & -2) \\ \\cline{5-6} \\multicolumn{2}{r}{} & & & 0 & 0 \\ \\end{array}$$\n",
							"The remaining cubic factor is $x^3 - 3x^2 + 3x - 2$."
						]
					},
					{
						"question": "Divide $f(x) = 4x^4 + 2x^3 - x + 1$ by $g(x) = x^2 - 2x + 1$ using polynomial long division. State the quotient $q(x)$ and remainder $r(x)$.",
						"solution": [
							"Set up the long division, ensuring all powers of $x$ are present in $f(x)$ (use $0x^2$):",
							"$$\\begin{array}{c|cc cc cc} \\multicolumn{2}{r}{4x^2} & +10x & +16 \\ \\cline{2-6} x^2-2x+1 & 4x^4 & +2x^3 & +0x^2 & -x & +1 \\ \\multicolumn{2}{r}{-(4x^4} & -8x^3 & +4x^2) \\ \\cline{2-5} \\multicolumn{2}{r}{0} & 10x^3 & -4x^2 & -x \\ \\multicolumn{2}{r}{} & -(10x^3 & -20x^2 & +10x) \\ \\cline{3-5} \\multicolumn{2}{r}{} & 0 & 16x^2 & -11x & +1 \\ \\multicolumn{2}{r}{} & & -(16x^2 & -32x & +16) \\ \\cline{4-6} \\multicolumn{2}{r}{} & & 0 & 21x & -15 \\ \\end{array}$$\n",
							"The quotient is $q(x) = 4x^2 + 10x + 16$.",
							"The remainder is $r(x) = 21x - 15$."
						]
					}
			],
			"summary": [
					"Polynomials are algebraic expressions with non-negative integer powers of variables and coefficients from a specified set.",
					"The degree of a polynomial is its highest power, which helps classify it (e.g., linear, quadratic, cubic).",
					"Factorisation involves breaking down a polynomial into a product of simpler polynomials, which may be irreducible over a given number set.",
					"Polynomial long division is a systematic method to divide one polynomial by another, yielding a quotient and a remainder.",
					"This division process is crucial for finding roots and completely factorising polynomials, especially when a root is already known."
			]
		}
	}
}

type StepSection = "topic" | "detailed-create";

export default function SubjectNoteMaker ({ contentRef, subjectFullName }: { contentRef: RefObject<HTMLDivElement | null>, subjectFullName: string }) {
   const { openSplash, closeSplash } = useSplashScreen();
	
	const [stepSections, setStepSections] = useState<StepSection>("topic");
	const [topicSelected, setTopicSelected] = useState<string>('');
   const [detailedTopic, setDetailedTopic] = useState('');
	const [intensity, setIntensity] = useState<NoteIntensity>("high-school");
   const [noteFromAI, setNoteFromAI] = useState<any | null>(null);

	const fullSubjectInfo = fullSubjectBreakDown(subjectFullName);
	const isDefaultSubject = isAmongstDefaultSubjects(`${fullSubjectInfo.subjectLevel} ${fullSubjectInfo.subject}`)
	const topicChoices = retrieveSubjectTopic(fullSubjectInfo.subjectLevel, fullSubjectInfo.subject); 

	function handleLoadingCreateNote () {
		openSplash({
			title: <>Creating Note <CustomSpinner color="#000" size={20} /></>,
			description: <>Please wait while I creating a note for you about <b>{subjectFullName} {topicSelected}</b>...</>,
			style: "loading",
			actions: []
		})
	}

   const createNoteAI = async (callback: Function) => {
      handleLoadingCreateNote();
      const data = await generateUsingAi({
         prompt: subjectNoteMakerPrompt({
				subjectLevel: fullSubjectInfo.subjectLevel, 
				subject: fullSubjectInfo.subject, 
				subjectTopic: topicSelected, 
				detailedTopic, intensity
			}),
         responseFormat: ResponseFormats.NoteMaker
      })

      if (data.success == false) {
         openSplash({
            title: "Error",
            description: data.error,
            style: "error",
            actions: [
               {
                  appearance: "normal",
                  action: () => closeSplash(),
                  label: <><RotateCcw size={18} /> Try Again</>
               }
            ],
         })
         callback()
         return;
      }
      setNoteFromAI(data.data.note);
      contentRef.current?.scrollTo({ top: 0, behavior: "instant" });
      closeSplash();
   }

   return (<>
      <Spacing size={2} />

      {(noteFromAI !== null) && (<>
         <NoteViewer 
				subject={fullSubjectInfo.subject} 
				note={noteFromAI}
				saveToSubjectFolder={{
					folderName: isDefaultSubject 
						? `${fullSubjectInfo.subjectLevel} ${fullSubjectInfo.subject}`.toLowerCase().replaceAll("-"," ").trim()
						: `${fullSubjectInfo.subject.toLowerCase().replaceAll("-"," ")}`.trim()
				}}
			/>
         <Spacing size={4} />
      </>)}

      {(noteFromAI == null) && (
			<div className="box full h-full dfb column align-center">
				{(stepSections == "topic") && (
					<FullSelect
						title="Choose Topic"
						options={topicChoices?.map(topic => ({ option: topic, optionName: topic }))!}
						onSelect={(option) => {
							setTopicSelected(option.optionName)
							setStepSections("detailed-create")
						}}
					/>
				)}
				
				{(stepSections == "detailed-create") && (<>
					<div className="text-sm bold-600 full">Detailed Topic (optional)</div>
					<div className="text-xs full grey-5 pd-1">Enter the exact thing you want to learn from this</div>
					<textarea 
						className="xxs pd-15 pdx-2 full radius-20"
						value={detailedTopic} onChange={e => setDetailedTopic(e.target.value)}
					/>
					<Spacing />
					<div className="box full pd-2">
						<IntensityChooser
							title="Explanation Type"
							options={noteExplanationTypeIntensityOptions}
							onChange={name => setIntensity(name)}
							defaultOption={2}
						/>
					</div>
					<Spacing />
					<AwaitButton className="xxs full pd-15 tiny-shadow" onClick={createNoteAI}>
						<NotebookPen size={17} /> Generate Note
					</AwaitButton>
					<Spacing size={2} />
				</>)}

				<Spacing size={7} />
			</div>
      )}
   </>)
}