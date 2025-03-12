import { TransvipLogo } from "@/components/transvip/transvip-logo"
import { LoginForm } from "@/components/drivers-portal/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
	return (
		<div className="pt-36">
			<Card className="w-full max-w-md">
				<CardHeader className="flex flex-col items-center gap-1">
					<TransvipLogo colored={true} size={24} />
					<CardTitle>
						<span>Inicio de Sesión</span>
					</CardTitle>
					<CardDescription className="text-center">
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