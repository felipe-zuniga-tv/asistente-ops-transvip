import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata: Metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Transvip | Operaciones Chile",
	description: "Operaciones Transvip Chile",
	viewport: "width=device-width, initial-scale=1",
	robots: "index, follow",
};

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="es" suppressHydrationWarning>
			<body className={`${inter.className} bg-white min-h-screen antialiased`}>
				<main className="w-full">
					{children}
				</main>
				<Toaster />
			</body>
		</html>
	);
} 