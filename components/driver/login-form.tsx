'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { validateDriverWithTransvip, createDriverSession } from "@/lib/driver/auth"

export function LoginForm() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string>()
	const router = useRouter()

	async function onSubmit(formData: FormData) {
		setIsLoading(true)
		setError(undefined)

		try {
			const email = formData.get('email') as string
			const password = formData.get('password') as string

			if (!email || !email.includes('@')) {
				throw new Error('Please enter a valid email address')
			}

			if (!password || password.length < 6) {
				throw new Error('Please enter a valid password')
			}

			const driver = await validateDriverWithTransvip(email, password)

			if (!driver.active) {
				throw new Error('This driver account is not active')
			}

			await createDriverSession(driver)
			router.push('/drivers/tickets/parking/dashboard')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred')
			setIsLoading(false)
		}
	}

	return (
		<div className="space-y-4">
			{error && (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			<form action={onSubmit} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="conductor@email.com"
						required
						disabled={isLoading}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="password">Contraseña</Label>
					<Input
						id="password"
						name="password"
						type="password"
						placeholder="••••••••"
						required
						disabled={isLoading}
					/>
				</div>
				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? "Verificando..." : "Continuar"}
				</Button>
			</form>
		</div>
	)
} 