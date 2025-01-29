import type { Metadata } from "next";
import LoginFormServer from "@/components/auth/login-server";
import { TransvipLogo } from "@/components/transvip/transvip-logo";

export const metadata: Metadata = {
	title: "Iniciar Sesión | Transvip Operaciones",
	description: "Portal de inicio de sesión para operaciones Transvip Chile",
};

export default function Home(): JSX.Element {
	return (
		<div className="w-full min-h-screen bg-main text-white items-center flex bg-center bg-cover backdrop-brightness-50 px-2">
			<div className="mx-auto flex flex-col items-center justify-center text-lg md:text-lg h-full bg-gray-900/70 p-2 md:p-6 py-8 text-black rounded-xl">
				<TransvipLogo colored={false} size={40} />
				<section className="flex flex-col items-center justify-center p-4 sm:px-8">
					<LoginFormServer />
				</section>
			</div>
		</div>
	);
}