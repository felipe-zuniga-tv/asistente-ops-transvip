import { TransvipLogo } from "@/components/transvip/transvip-logo"
import { LoginForm } from "@/components/drivers-portal/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
	return (
		<div className="pt-24 md:pt-36">
			<Card className="w-full max-w-[460px]">
				<CardHeader className="flex flex-col items-center gap-1">
					<CardTitle className="w-full flex flex-row items-center justify-start gap-2">
						<TransvipLogo colored={true} size={24} />
						<span className="text-xl font-bold">Inicio de Sesión</span>
					</CardTitle>
					<CardDescription className="text-start text-xs">
						Ingresa tu correo para acceder al sistema de tickets de estacionamiento
					</CardDescription>
				</CardHeader>
				<CardContent>
					<LoginForm />
				</CardContent>
			</Card>
		</div>
	)
} 