import type { Metadata } from "next";
import LoginFormServer from "@/components/auth/login-server";
import { TransvipLogo } from "@/components/transvip/transvip-logo";

export const metadata: Metadata = {
	title: "Transvip | Operaciones | Iniciar Sesión",
	description: "Transvip Chile | Portal de operaciones",
}

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4 bg-main bg-cover bg-top">
			<div className="w-full max-w-lg bg-white rounded-lg">
				<div className="flex flex-col gap-1 items-center p-6 pb-0 text-center">
					<TransvipLogo colored={true} size={28} />
					<span className="text-xl font-semibold tracking-tight">
						Portal de Operaciones
					</span>
					<span className="text-sm text-muted-foreground">
						Ingresa tus credenciales para continuar
					</span>
				</div>

				<div className="p-6">
					<LoginFormServer />
				</div>
			</div>
		</div>
	);
}