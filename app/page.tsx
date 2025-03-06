import type { Metadata } from "next";
import LoginFormServer from "@/components/auth/login-server";
import { TransvipLogo } from "@/components/transvip/transvip-logo";

export const metadata: Metadata = {
	title: "Iniciar Sesión | Transvip Operaciones",
	description: "Portal de inicio de sesión para operaciones Transvip Chile",
};

export default function Home(): JSX.Element {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4 bg-main rounded-lg">
			<div className="w-full max-w-lg bg-white rounded-lg">
				<div className="flex flex-col gap-1 items-center p-6 pb-0 text-center">
					<TransvipLogo colored={true} size={28} />
					<h1 className="text-xl font-semibold tracking-tight">
						Portal de Operaciones
					</h1>
					<p className="text-sm text-muted-foreground">
						Ingresa tus credenciales para continuar
					</p>
				</div>

				<div className="p-6">
					<LoginFormServer />
				</div>
			</div>
		</div>
	);
}