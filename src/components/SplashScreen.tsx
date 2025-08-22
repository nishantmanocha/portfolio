"use client";

import { motion } from "framer-motion";
import React from "react";

interface SplashScreenProps {
	onDone?: () => void;
	/** Optional override for total splash duration */
	totalDurationMs?: number;
}

const LINES = ["cd myportfolio", "code ."]; // lines to type

function useTypewriter(lines: string[], onComplete: () => void, totalDurationMs: number) {
	const [typedText, setTypedText] = React.useState<string[]>(lines.map(() => ""));

	React.useEffect(() => {
		// Compute per-line timings to fit within totalDurationMs minus a small buffer
		const characters = lines.reduce((acc, l) => acc + l.length, 0);
		const bufferMs = 600; // reserve for idle + fade coordination
		const typeDuration = Math.max(1000, totalDurationMs - bufferMs);
		const perCharMs = Math.max(20, Math.floor(typeDuration / Math.max(1, characters)));

		let lineIndex = 0;
		let charIndex = 0;
		let interval: NodeJS.Timeout | undefined;

		const startTyping = () => {
			interval = setInterval(() => {
				if (lineIndex >= lines.length) {
					if (interval) clearInterval(interval);
					onComplete();
					return;
				}
				const currentLine = lines[lineIndex];
				const nextCharIndex = charIndex + 1;
				setTypedText((prev) => {
					const updated = [...prev];
					updated[lineIndex] = currentLine.slice(0, nextCharIndex);
					return updated;
				});
				charIndex = nextCharIndex;
				if (nextCharIndex >= currentLine.length) {
					// short pause at end of line
					if (interval) clearInterval(interval);
					setTimeout(() => {
						lineIndex += 1;
						charIndex = 0;
						startTyping();
					}, 250);
				}
			}, perCharMs);
		};

		startTyping();
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [lines, onComplete, totalDurationMs]);

	return typedText;
}

export default function SplashScreen({ onDone, totalDurationMs = 4600 }: SplashScreenProps) {
	const doneRef = React.useRef(false);
	const [readyToExit, setReadyToExit] = React.useState(false);
	const typedText = useTypewriter(LINES, () => {
		// Ensure splash lasts totalDurationMs even if typing finished early
		if (!doneRef.current) {
			doneRef.current = true;
			setReadyToExit(true);
		}
	}, totalDurationMs);

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			if (!doneRef.current) {
				doneRef.current = true;
				setReadyToExit(true);
			}
		}, totalDurationMs);
		return () => clearTimeout(timeout);
	}, [totalDurationMs]);

	return (
		<motion.div
			className="fixed inset-0 z-[1000] flex items-center justify-center bg-black"
			initial={{ opacity: 1 }}
			animate={{ opacity: readyToExit ? 0 : 1 }}
			transition={{ duration: 0.6, ease: "easeInOut" }}
			onAnimationComplete={() => {
				if (readyToExit) onDone?.();
			}}
			aria-label="Splash screen"
		>
			<div className="w-full max-w-4xl px-6">
				<div className="rounded-lg border border-neutral-700 bg-black p-6 shadow-2xl">
					{/* Terminal header */}
					<div className="flex items-center mb-4">
						<div className="flex space-x-2">
							<div className="w-3 h-3 rounded-full bg-red-500"></div>
							<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
							<div className="w-3 h-3 rounded-full bg-green-500"></div>
						</div>
						<div className="ml-4 text-neutral-400 text-sm font-mono">Terminal</div>
					</div>
					
					{/* Terminal content */}
					<div className="font-mono text-neutral-100 text-lg leading-8 whitespace-pre-wrap select-none">
						{/* Initial prompt */}
						<div className="flex mb-2">
							<span className="text-green-400 mr-2">user@portfolio</span>
							<span className="text-blue-400 mr-2">~</span>
							<span className="text-white mr-2">$</span>
						</div>
						
						{/* Typed commands */}
						{typedText.map((line, idx) => (
							<div key={idx} className="flex mb-2">
								<span className="text-green-400 mr-2">user@portfolio</span>
								<span className="text-blue-400 mr-2">~</span>
								<span className="text-white mr-2">$</span>
								<span className="text-white">{line}</span>
								{idx === typedText.length - 1 && (
									<span className="cursor-block ml-1 text-white">█</span>
								)}
							</div>
						))}
						
						{/* Final prompt after typing is complete */}
						{typedText.every(line => line.length > 0) && (
							<div className="flex">
								<span className="text-green-400 mr-2">user@portfolio</span>
								<span className="text-blue-400 mr-2">~</span>
								<span className="text-white mr-2">$</span>
								<span className="cursor-block text-white">█</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</motion.div>
	);
}