"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import SplashScreen from "./SplashScreen";

interface AppShellProps {
	children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
	const [showSplash, setShowSplash] = React.useState(true);

	return (
		<div className="relative min-h-screen">
			<AnimatePresence>
				{showSplash && (
					<motion.div key="splash" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
						<SplashScreen onDone={() => setShowSplash(false)} />
					</motion.div>
				)}
			</AnimatePresence>
			<motion.div
				key="content"
				initial={{ opacity: 0, scale: 0.985 }}
				animate={{ opacity: showSplash ? 0 : 1, scale: showSplash ? 0.985 : 1 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="min-h-screen"
			>
				{children}
			</motion.div>
		</div>
	);
}