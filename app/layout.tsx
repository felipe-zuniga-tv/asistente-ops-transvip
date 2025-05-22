import React from "react";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";
import type { Metadata } from "next";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Providers } from "./providers";
import { AuthProvider } from "@/lib/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata: Metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Transvip | Operaciones Chile",
	description: "Operaciones Transvip Chile",
};

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="es" suppressHydrationWarning>
			<body className={`${inter.className} bg-white min-h-screen antialiased text-sm xl:text-base`}>
				<AuthProvider>
					<Providers>
						<main className="w-full">
							{children}
						</main>
						<Toaster />
						<SpeedInsights />
					</Providers>
				</AuthProvider>
			</body>
		</html>
	);
} 