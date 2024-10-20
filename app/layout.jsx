import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/chat/panel/app-sidebar";

const inter = Inter({ subsets: ["latin"] });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Transvip | Operaciones Chile",
  description: "Operaciones Transvip Chile",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white min-h-screen`}>
        <Providers>
          
            <main className="w-full">
              {children}
            </main>
          
        </Providers>
      </body>
    </html>
  );
}