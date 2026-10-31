'use client'
import "@/styles/note-maker.css"
import { useState } from "react"
import { toast } from "sonner";
import { NotebookPen, RotateCcw, X } from "lucide-react";
import { generateUsingAi } from "../actions/ai";
import { buildFileNotePrompt } from "@/prompts/subjectNoteMaker";
import { ResponseFormats } from "@/prompts/responseFormats";
import { useModal } from "@/components/Modal/ModalContext";
import { useSplashScreen } from "@/components/SplashScreen/SplashScreenContext";
import { CustomSpinner } from "@/components/Spinner/Spinner";
import { titleCase } from "@/lib/str";
import Spacing from "@/components/Spacing/Spacing";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import NoteViewer from "@/components/NoteViewer/NoteViewer";
import IntensityChooser from "@/components/IntensityChooser/IntensityChooser";
import { NoteIntensity } from "@/prompts/promptExtras";
import { noteExplanationTypeIntensityOptions } from "@/utils/intensityOptions";

type FileInfo = {
   filename: string;
   fileExtension: string;
}

const testNote = {
	"title": "AC Circuit Analysis with Complex Numbers and Phasors",
	"subject": "physics",
	"overview": "This note introduces how complex numbers and phasors are used to analyse Alternating Current (AC) circuits, particularly those involving capacitors. You will learn to represent quantities like voltage, current, and impedance as complex numbers, simplifying calculations for circuits with phase shifts. This method allows you to determine the amplitude and phase relationships between signals in AC circuits, which is crucial for understanding components like filters.",
	"key_concepts": [
		"**AC Signal**: An electrical signal (voltage or current) that varies periodically over time, often sinusoidally, causing continuous changes in polarity.",
		"**Impedance ($\\,Z$)**: The total opposition to current flow in an AC circuit, including both resistance and reactance. It is a complex number, measured in Ohms ($\\,\\Omega$).",
		"**Complex Number**: A number of the form $a+jb$, where $a$ is the real part, $b$ is the imaginary part, and $j$ is the imaginary unit ($j^2 = -1$). Used to represent impedance, voltage, and current in AC circuits.",
		"**Rectangular Form ($a+jb$)**: Represents a complex number as a sum of its real and imaginary components. Useful for addition and subtraction.",
		"**Polar Form ($r\\angle\\theta$)**: Represents a complex number by its magnitude ($r$) and phase angle ($\\theta$). Useful for multiplication and division.",
		"**Phasor**: A rotating vector used to represent a sinusoidal signal (like voltage or current) by its amplitude (length of the vector) and phase angle (angle relative to a reference).",
		"**Reactance**: The opposition to current flow due to capacitance ($X_C$) or inductance ($X_L$). Unlike resistance, reactance causes a phase shift between voltage and current. Capacitive reactance has an imaginary component.",
		"**Characteristic Frequency ($\\,f_0$ or $\\,\\omega_0$)**: For an RC circuit, this is the frequency at which the magnitude of the output voltage is $1/\\sqrt{2}$ times the input voltage. It defines the circuit's operating band.",
		"**RC Low-Pass Filter**: An electronic filter circuit consisting of a resistor and a capacitor that passes low-frequency signals and attenuates (reduces the amplitude of) signals with frequencies higher than the characteristic frequency."
	],
	"rules": [
		"**Ohm's Law for AC Circuits (Complex Form)**\n\n$$V = IZ$$\n\n- $\\,V$: Complex voltage (Volts, $\\mathrm{V}$)\n- $\\,I$: Complex current (Amperes, $\\mathrm{A}$)\n- $\\,Z$: Complex impedance (Ohms, $\\Omega$)\n\n**Use it when:** Calculating voltage, current, or impedance in AC circuits where phase relationships are important.",
		"**Complex Impedance of a Capacitor ($Z_C$)**\n\n$$Z_C = \\frac{1}{j\\omega C} = \\frac{-j}{\\omega C}$$\n\n- $\\,Z_C$: Capacitive impedance (Ohms, $\\Omega$)\n- $\\,j$: Imaginary unit ($\\sqrt{-1}$)\n- $\\,\\omega$: Angular frequency (radians per second, $\\mathrm{rad\\,s^{-1}}$), where $\\omega = 2\\pi f$\n- $\\,C$: Capacitance (Farads, $\\mathrm{F}$)\n\n**Use it when:** Determining the impedance of a capacitor in an AC circuit.",
		"**Converting from Rectangular to Polar Form ($Z = a+jb \\rightarrow Z = |Z|\\angle\\phi$)**\n\n$$|Z| = \\sqrt{a^2 + b^2}$$\n\n$$\\phi = \\arctan\\left(\\frac{b}{a}\\right)$$\n\n- $\\,a$: Real part of the complex number\n- $\\,b$: Imaginary part of the complex number\n- $\\,|Z|$: Magnitude of the complex number\n- $\\,\\phi$: Phase angle (degrees or radians)\n\n**Use it when:** You need to express an impedance, voltage, or current from its real and imaginary components into its magnitude and phase.",
		"**Multiplying Complex Numbers in Polar Form**\n\n$$Z_1 Z_2 = (r_1\\angle\\theta_1)(r_2\\angle\\theta_2) = (r_1 r_2)\\angle(\\theta_1 + \\theta_2)$$\n\n- $\\,r_1, r_2$: Magnitudes of the complex numbers\n- $\\,\\theta_1, \\theta_2$: Phase angles of the complex numbers\n\n**Use it when:** Calculating the product of complex impedances, voltages, or currents, for example, to find total impedance or voltage across components in series.",
		"**Dividing Complex Numbers in Polar Form**\n\n$$\\frac{Z_1}{Z_2} = \\frac{r_1\\angle\\theta_1}{r_2\\angle\\theta_2} = \\left(\\frac{r_1}{r_2}\\right)\\angle(\\theta_1 - \\theta_2)$$\n\n- $\\,r_1, r_2$: Magnitudes of the complex numbers\n- $\\,\\theta_1, \\theta_2$: Phase angles of the complex numbers\n\n**Use it when:** Calculating the ratio of complex impedances, voltages, or currents, for example, in a voltage divider circuit or to find current given voltage and impedance.",
		"**Total Impedance of an RC Series Circuit**\n\n$$Z_{total} = R + Z_C = R - j\\frac{1}{\\omega C}$$\n\n- $\\,Z_{total}$: Total complex impedance (Ohms, $\\Omega$)\n- $\\,R$: Resistance (Ohms, $\\Omega$)\n- $\\,Z_C$: Capacitive impedance (Ohms, $\\Omega$)\n- $\\,\\omega$: Angular frequency (radians per second, $\\mathrm{rad\\,s^{-1}}$)\n- $\\,C$: Capacitance (Farads, $\\mathrm{F}$)\n\n**Use it when:** Analysing an AC circuit where a resistor and capacitor are connected in series.",
		"**Transfer Function of an RC Low-Pass Filter**\n\n$$\\frac{V_{out}}{V_{in}} = \\frac{1}{1+j\\omega RC}$$\n\n- $\\,V_{out}$: Output voltage\n- $\\,V_{in}$: Input voltage\n- $\\,j$: Imaginary unit\n- $\\,\\omega$: Angular frequency (radians per second, $\\mathrm{rad\\,s^{-1}}$)\n- $\\,R$: Resistance (Ohms, $\\Omega$)\n- $\\,C$: Capacitance (Farads, $\\mathrm{F}$)\n\n**Use it when:** Determining how an RC low-pass filter affects the magnitude and phase of a signal at different frequencies.",
		"**Characteristic Frequencies of an RC Low-Pass Filter**\n\n$$\\omega_0 = \\frac{1}{RC}$$\n\n$$f_0 = \\frac{1}{2\\pi RC}$$\n\n- $\\,\\omega_0$: Characteristic angular frequency (radians per second, $\\mathrm{rad\\,s^{-1}}$)\n- $\\,f_0$: Characteristic frequency (Hertz, $\\mathrm{Hz}$)\n- $\\,R$: Resistance (Ohms, $\\Omega$)\n- $\\,C$: Capacitance (Farads, $\\mathrm{F}$)\n\n**Use it when:** Identifying the cut-off frequency of an RC low-pass filter, where the output power drops to half its maximum (or voltage to $1/\\sqrt{2}$)."
	],
	"examples": [
		"**Situation:** A current phasor $I_1 = 1\\angle0^\\circ\\,\\mathrm{A}$ flows through an impedance $Z = 0.5\\angle90^\\circ\\,\\Omega$. Calculate the voltage $V_1$ across the impedance.\n\n**Working:**\n\n1. Use Ohm's Law for AC circuits: $V_1 = I_1 Z$.\n2. Multiply the magnitudes and add the phase angles (polar form multiplication rule):\n   $V_1 = (1\\,\\mathrm{A} \\times 0.5\\,\\Omega)\\angle(0^\\circ + 90^\\circ)$\n3. Calculate the resulting magnitude and phase.\n\n**Answer:** $V_1 = 0.5\\angle90^\\circ\\,\\mathrm{V}$",
		"**Situation:** An RC series circuit has a resistor $R = 100\\,\\Omega$ and a capacitor $C = 10\\,\\mu\\mathrm{F}$. The angular frequency of the AC source is $\\omega = 500\\,\\mathrm{rad\\,s^{-1}}$. Calculate the total impedance $Z_{total}$ in rectangular form.\n\n**Working:**\n\n1. Calculate the capacitive impedance $Z_C = \\frac{-j}{\\omega C}$.\n   $Z_C = \\frac{-j}{500\\,\\mathrm{rad\\,s^{-1}} \\times 10 \\times 10^{-6}\\,\\mathrm{F}} = \\frac{-j}{0.005} = -j200\\,\\Omega$.\n2. Add the resistance to the capacitive impedance: $Z_{total} = R + Z_C$.\n   $Z_{total} = 100\\,\\Omega - j200\\,\\Omega$.\n\n**Answer:** $Z_{total} = (100 - j200)\\,\\Omega$",
		"**Situation:** For the RC series circuit in the previous example ($R = 100\\,\\Omega$, $C = 10\\,\\mu\\mathrm{F}$), calculate the characteristic angular frequency $\\omega_0$.\n\n**Working:**\n\n1. Use the formula for characteristic angular frequency: $\\omega_0 = \\frac{1}{RC}$.\n2. Substitute the values for R and C:\n   $\\omega_0 = \\frac{1}{100\\,\\Omega \\times 10 \\times 10^{-6}\\,\\mathrm{F}} = \\frac{1}{0.001}\n3. Calculate the result.\n\n**Answer:** $\\omega_0 = 1000\\,\\mathrm{rad\\,s^{-1}}$"
	],
	"visuals": [],
	"common_mistakes": [
		"**Mistake:** Confusing angular frequency ($\\omega$) with standard frequency ($\\,f$) when using formulas.\n\n**Fix:** Remember that $\\omega = 2\\pi f$. Always check which frequency term is required by the formula and convert if necessary. Units are key: $\\mathrm{rad\\,s^{-1}}$ for $\\omega$, $\\mathrm{Hz}$ for $\\,f$.",
		"**Mistake:** Incorrectly calculating the phase angle ($\\phi$) when converting from rectangular to polar form, especially with negative real or imaginary parts.\n\n**Fix:** Use a calculator function that correctly handles the quadrant (e.g., `atan2(b, a)`). If using `arctan(b/a)`, be mindful of the signs of $a$ and $b$ to place the angle in the correct quadrant. For example, if $a$ is positive and $b$ is negative, the angle is in the 4th quadrant.",
		"**Mistake:** Forgetting that $j^2 = -1$ when performing calculations with complex numbers in rectangular form.\n\n**Fix:** Always substitute $j^2$ with $-1$. For example, when multiplying, $(a+jb)(c+jd) = ac + jad + jbc + j^2bd = (ac-bd) + j(ad+bc)$.",
		"**Mistake:** Applying the rules for series/parallel resistors directly to capacitors without considering impedance.\n\n**Fix:** For capacitors, the total impedance $Z_{total}$ in series is $Z_1 + Z_2$, which simplifies to $\\frac{1}{j\\omega C_1} + \\frac{1}{j\\omega C_2}$. For parallel capacitors, $\\frac{1}{Z_{total}} = \\frac{1}{Z_1} + \\frac{1}{Z_2}$, which simplifies to $C_{total} = C_1 + C_2$ (the opposite of resistors). Always use the complex impedance values for AC analysis."
	],
	"questions": [
		"1. An AC voltage is given by $V(t) = 10\\sin(200t + \\pi/4)\\,\\mathrm{V}$. Express this voltage as a phasor in polar form.\n\n**Answer:** $V = 10\\angle45^\\circ\\,\\mathrm{V}$ (since $\\pi/4$ radians is $45^\\circ$)",
		"2. A capacitor with capacitance $C = 20\\,\\mu\\mathrm{F}$ is connected to an AC supply with a frequency of $50\\,\\mathrm{Hz}$. Calculate the complex impedance of the capacitor in rectangular form.\n\n**Answer:**\n1. Calculate angular frequency: $\\omega = 2\\pi f = 2\\pi (50\\,\\mathrm{Hz}) = 100\\pi\\,\\mathrm{rad\\,s^{-1}}$.\n2. Calculate impedance: $Z_C = \\frac{-j}{\\omega C} = \\frac{-j}{100\\pi\\,\\mathrm{rad\\,s^{-1}} \\times 20 \\times 10^{-6}\\,\\mathrm{F}} = \\frac{-j}{0.002\\pi} \\approx -j159.15\\,\\Omega$.",
		"3. An RC low-pass filter has $R = 2.2\\,\\mathrm{k\\Omega}$ and $C = 0.1\\,\\mu\\mathrm{F}$. Calculate its characteristic frequency $f_0$.\n\n**Answer:**\n1. Use the formula: $f_0 = \\frac{1}{2\\pi RC}$.\n2. Substitute values: $f_0 = \\frac{1}{2\\pi (2.2 \\times 10^3\\,\\Omega)(0.1 \\times 10^{-6}\\,\\mathrm{F})} = \\frac{1}{2\\pi (0.00022)}\n3. Calculate: $f_0 \\approx 723.4\\,\\mathrm{Hz}$.",
		"4. For an RC low-pass filter, what is the magnitude of the ratio $\\left|\\frac{V_{out}}{V_{in}}\\right|$ when the input frequency is equal to the characteristic frequency ($\\omega = \\omega_0$)?\n\n**Answer:** At $\\omega = \\omega_0$, the magnitude ratio is $\\left|\\frac{V_{out}}{V_{in}}\\right| = \\frac{1}{\\sqrt{2}} \\approx 0.707$. This means the output voltage amplitude is about $70.7\\%$ of the input voltage amplitude."
	],
	"summary": [
		"AC circuits can be analysed effectively by representing voltages, currents, and impedances as complex numbers, simplifying calculations involving phase shifts.",
		"Impedance is the complex opposition to current flow, with capacitors exhibiting a complex impedance $Z_C = \\frac{-j}{\\omega C}$ that depends on frequency and capacitance.",
		"Phasors are visual representations of sinusoidal signals, encoding amplitude as length and phase as angle, making it easier to visualise phase relationships.",
		"Multiplication and division of complex numbers are simpler in polar form (magnitudes multiply/divide, angles add/subtract), while addition and subtraction are easier in rectangular form.",
		"RC low-pass filters attenuate high-frequency signals, with their behaviour defined by a characteristic frequency $f_0 = \\frac{1}{2\\pi RC}$ at which the output voltage drops to $1/\\sqrt{2}$ of the input."
	]
}

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

export default function DocumentNoteMaker ({ saveNoteFolderName }: { saveNoteFolderName: string }) {
   const { showModal, close } = useModal();
   const { openSplash, closeSplash } = useSplashScreen();
   const [inputFileValue, setInputFileValue] = useState<any | null>('');
   const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
   const [documentFile, setDocumentFile] = useState<File | null>(null);
	const [intensity, setIntensity] = useState<NoteIntensity>("high-school");
   const [noteFromAI, setNoteFromAI] = useState<NoteMaker | null>(null);

   const onFileUpload = async (e: any) => {
      const file = e.target.files[0];
      if (!file) {
         toast.error("No file found"); return;
      }

      // const acceptableExtensions = ['pdf','txt', 'docx', 'pptx'];
      const acceptableExtensions = ['pdf'];
      const extension = file.name.split(".").pop().toLowerCase();
      if (!acceptableExtensions.includes(extension)) {
         // toast.error("File must be a PDF, TXT, DOCX or PPTX file"); return;
         toast.error("File must be a PDF file"); return;
      }

      setInputFileValue(e.target.value);
      setDocumentFile(file);
      setFileInfo({ filename: file.name.split(".")[0], fileExtension: extension.toUpperCase() });
   }

   const attachNewDocument = () => {
      setInputFileValue('');
      setFileInfo(null);
   }

	function handleLoadingCreateNote () {
		openSplash({
			title: <>Creating Note <CustomSpinner color="#000" size={20} /></>,
			description: <>Please wait while I creating a note for you from file; <b>{fileInfo?.filename}</b>...</>,
			style: "loading",
			actions: []
		})
	}

   const createNoteAI = async (callback: Function) => {
      if (!documentFile) {
         toast.error("Please choose a file")
         callback()
         return;
      }
		handleLoadingCreateNote();
      const data = await generateUsingAi({
         prompt: buildFileNotePrompt({ fileName: fileInfo?.filename, intensity }),
         responseFormat: ResponseFormats.NoteMaker,
         file: documentFile
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
      console.log(data)
      setNoteFromAI(data.data.note);
      callback()
		closeSplash();
   }

   return (<>
      <Spacing size={1} />
      {noteFromAI !== null ? (<>
         <NoteViewer 
            subject={noteFromAI.subject} 
            note={noteFromAI} 
            customSubject
				saveToSubjectFolderNew={{ folderName: saveNoteFolderName }}
         />
         <Spacing size={4} />
      </>) : (fileInfo == null) ? (<>
         <div className="box full pd-2">
            <div className="text-m bold-600 full">Upload Document for <b className="accent-color">{titleCase(saveNoteFolderName)}</b></div>
            <div className="text-xxs full grey-5">Upload the document you want to learn more about in {titleCase(saveNoteFolderName)}</div>
            <div className="box full pd-2 dfb column gap-10">
               <label htmlFor="drag-and-drop-file-input">
                  <div className="drag-and-drop-media-upload-area">
                     <div className="text-xs fit">Drag and Drop or Click to upload media asset</div>
                  </div>
                  <input 
                     type="file" name="file" id="drag-and-drop-file-input" value={inputFileValue}
                     onChange={onFileUpload}
                     // accept=".pdf,.txt,.docx,.pptx"
                     accept=".pdf"
                  />
               </label>
            </div>
         </div>
      </>) : (<>
         <div className="text-xs full text-center pd-15 mt-1 mb-1">
            Your document has been uploaded.
         </div>
         <div className="document-upload-status">
            <div className="file-info">
               <div className="file-name">{fileInfo?.filename}</div>
               <div className="file-extension">{fileInfo?.fileExtension}</div>
            </div>
            <div className="close-btn">
               <button onClick={attachNewDocument}><X size={17} /></button>
            </div>
         </div>
			<div className="box full pd-2">
				<IntensityChooser
					title="Explanation Type"
					options={noteExplanationTypeIntensityOptions}
					onChange={name => setIntensity(name)}
					defaultOption={2}
				/>
			</div>
         <AwaitButton className="xxs full pd-14 tiny-shadow mw-400 radius-20" onClick={createNoteAI}>
            <NotebookPen size={17} /> Generate Note
         </AwaitButton>
      </>)}
   </>)
}