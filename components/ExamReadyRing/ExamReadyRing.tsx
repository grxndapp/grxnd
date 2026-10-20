"use client";
import { useEffect, useId } from "react";
import {
	motion,
	animate,
	useMotionValue,
	useTransform,
	useReducedMotion,
} from "framer-motion";
import styles from "./ExamReadyRing.module.css";

// Colour + label per score band. `from` is the light end of the ring,
// `to` is the deep end, `accent` is used for the label text.
const BANDS = [
	{ min: 90, label: "Exam ready", from: "#a8d1ff", to: "#2f80ff", accent: "#4b6b99" },
	{ min: 75, label: "Almost ready", from: "#a6ecd0", to: "#12b886", accent: "#3f7f69" },
	{ min: 50, label: "Getting there", from: "#ffe29a", to: "#f5a524", accent: "#9a7330" },
	{ min: 25, label: "Building momentum", from: "#ffc9a3", to: "#ff7a2f", accent: "#a2623a" },
	{ min: 0, label: "Just getting started", from: "#ffb3b3", to: "#f03e3e", accent: "#a04a4a" },
];

const getBand = (score: number) => BANDS.find((b) => score >= b.min) ?? BANDS[BANDS.length - 1];

const VIEW = 200;
const STROKE = 14;
const RADIUS = (VIEW - STROKE) / 2 - 2;

type ExamReadyRingProps = {
	score: number;
	size: number;
	label?: string;
	duration?: number;
	delay?: number;
}

export default function ExamReadyRing ({
	score = 0,
	size = 240, // px
	label, // optional override for the text under the number
	duration = 1.8, // seconds
	delay = 0.15,
}: ExamReadyRingProps) {
	const clamped = Math.max(0, Math.min(100, Math.round(score)));
	const band = getBand(clamped);
	const reduceMotion = useReducedMotion();
	const gradientId = `ring-${useId().replace(/:/g, "")}`;

	// Animated number that counts up in sync with the sweep
	const count = useMotionValue(0);
	const rounded = useTransform(count, (v) => Math.round(v));

	useEffect(() => {
		const controls = animate(count, clamped, {
			duration: reduceMotion ? 0 : duration,
			delay: reduceMotion ? 0 : delay,
			ease: [0.22, 1, 0.36, 1],
		});
		return () => controls.stop();
	}, [clamped, count, duration, delay, reduceMotion]);

	return (
		<div
			className={styles.wrapper}
			style={{ "--size": `${size}px`, "--accent": band.accent } as React.CSSProperties}
			role="progressbar"
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={clamped}
			aria-label={`Exam readiness ${clamped}%`}
		>
			<svg className={styles.ring} viewBox={`0 0 ${VIEW} ${VIEW}`}>
				<defs>
					<linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
						<stop offset="0%" stopColor={band.from} />
						<stop offset="100%" stopColor={band.to} />
					</linearGradient>
				</defs>

				{/* Rotate so the sweep starts at 12 o'clock and runs clockwise */}
				<g transform={`rotate(-90 ${VIEW / 2} ${VIEW / 2})`}>
					{/* Faded track */}
					<circle
						cx={VIEW / 2}
						cy={VIEW / 2}
						r={RADIUS}
						fill="none"
						stroke={`url(#${gradientId})`}
						strokeWidth={STROKE}
						strokeOpacity={0.18}
					/>

					{/* Progress arc: sweeps from 0 to score */}
					<motion.circle
						key={clamped} // replay the sweep when the score changes
						cx={VIEW / 2}
						cy={VIEW / 2}
						r={RADIUS}
						fill="none"
						stroke={`url(#${gradientId})`}
						strokeWidth={STROKE}
						strokeLinecap="round"
						initial={{ pathLength: 0, opacity: 0 }}
						animate={{ pathLength: clamped / 100, opacity: 1 }}
						transition={{
							pathLength: {
								duration: reduceMotion ? 0 : duration,
								delay: reduceMotion ? 0 : delay,
								ease: [0.22, 1, 0.36, 1],
							},
							opacity: { duration: 0.2, delay: reduceMotion ? 0 : delay },
						}}
					/>
				</g>
			</svg>

			<div className={styles.center}>
				<div className={styles.score}>
					<motion.span>{rounded}</motion.span>
					<span className={styles.percent}>%</span>
				</div>
				<div className={styles.label}>{label ?? band.label}</div>
			</div>
		</div>
	);
}