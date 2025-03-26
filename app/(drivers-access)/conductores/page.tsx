import { TransvipLogo } from "@/components/transvip/transvip-logo"
import { DriverLoginForm } from "@/components/drivers-portal/driver-login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
	return (
		<div className="flex-1 flex flex-col items-center justify-center p-4">
			<Card className="w-full max-w-lg">
				<CardHeader className="flex flex-col items-center gap-1">
					<CardTitle className="w-full flex flex-row items-center justify-start gap-2">
						<TransvipLogo colored={true} size={24} />
						<span className="text-xl font-bold">Inicio de Sesión</span>
					</CardTitle>
					<CardDescription className="text-start text-sm w-full">
						Accede aquí al sistema de tickets de estacionamiento
					</CardDescription>
				</CardHeader>
				<CardContent>
					<DriverLoginForm />
				</CardContent>
			</Card>
		</div>
	)
} 