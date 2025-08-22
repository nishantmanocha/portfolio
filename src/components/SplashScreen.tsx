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
	const [currentLineIndex, setCurrentLineIndex] = React.useState(0);
	const [currentCharIndex, setCurrentCharIndex] = React.useState(0);
	const [typedLines, setTypedLines] = React.useState<string[]>([]);

	React.useEffect(() => {
		if (currentLineIndex >= lines.length) {
			onComplete();
			return;
		}

		const currentLine = lines[currentLineIndex];
		const typingSpeed = 80; // milliseconds per character

		const timer = setTimeout(() => {
			if (currentCharIndex < currentLine.length) {
				// Type next character
				setCurrentCharIndex(prev => prev + 1);
			} else {
				// Line complete, move to next line with a small delay
				setTypedLines(prev => [...prev, currentLine]);
				setTimeout(() => {
					setCurrentLineIndex(prev => prev + 1);
					setCurrentCharIndex(0);
				}, 300); // 300ms delay between lines
			}
		}, typingSpeed);

		return () => clearTimeout(timer);
	}, [currentLineIndex, currentCharIndex, lines, onComplete]);

	// Calculate total characters typed so far
	const totalTyped = typedLines.join('').length + currentCharIndex;
	const totalCharacters = lines.join('').length;
	
	// Ensure minimum duration
	const minDuration = 3000; // 3 seconds minimum
	const actualDuration = Math.max(minDuration, totalDurationMs);
	
	// Add delay if typing finished too early
	React.useEffect(() => {
		if (totalTyped >= totalCharacters) {
			const remainingTime = actualDuration - (totalTyped * 80);
			if (remainingTime > 0) {
				const timer = setTimeout(() => {
					onComplete();
				}, remainingTime);
				return () => clearTimeout(timer);
			}
		}
	}, [totalTyped, totalCharacters, actualDuration, onComplete]);

	return {
		typedLines,
		currentLine: lines[currentLineIndex]?.slice(0, currentCharIndex) || '',
		isTyping: currentLineIndex < lines.length,
		currentLineIndex
	};
}

export default function SplashScreen({ onDone, totalDurationMs = 4600 }: SplashScreenProps) {
	const { typedLines, currentLine, isTyping, currentLineIndex } = useTypewriter(LINES, onDone || (() => {}), totalDurationMs);

	return (
		<motion.div
			className="fixed inset-0 z-[1000] flex items-center justify-center bg-black"
			initial={{ opacity: 1 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6, ease: "easeInOut" }}
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
						
						{/* Completed lines */}
						{typedLines.map((line, idx) => (
							<div key={idx} className="flex mb-2">
								<span className="text-green-400 mr-2">user@portfolio</span>
								<span className="text-blue-400 mr-2">~</span>
								<span className="text-white mr-2">$</span>
								<span className="text-white">{line}</span>
							</div>
						))}
						
						{/* Current typing line */}
						{isTyping && (
							<div className="flex mb-2">
								<span className="text-green-400 mr-2">user@portfolio</span>
								<span className="text-blue-400 mr-2">~</span>
								<span className="text-white mr-2">$</span>
								<span className="text-white">{currentLine}</span>
								<span className="cursor-block text-white">█</span>
							</div>
						)}
						
						{/* Final prompt after typing is complete */}
						{!isTyping && (
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