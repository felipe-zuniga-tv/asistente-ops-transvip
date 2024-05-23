import { redirect } from 'next/navigation'
import { Routes } from "@/utils/routes"
import { getSession, login } from '@/lib/auth'
import { FormSubmit } from "../ui/form-submit"

export default async function LoginFormServer() {
    const session = await getSession()

	if (session) {
		return redirect(Routes.START)
	}

    const handleLoginFunction = async (formData) => {
        'use server'
        await login(formData)

        redirect(Routes.START)
    }

    return (
        <div className="flex flex-col w-full sm:max-w-md justify-center gap-4">
			<span className='mx-auto text-xl text-white'>Ingresa aquí</span>
            <form action={handleLoginFunction} className="auth-form auth-widths">
				<input type="email"
					name="email"
					className="auth-input-field"
					placeholder="Email"
					required
				/>
				<input type="password" 
					name="password"
					className="auth-input-field"
					placeholder="Password"
					required
				/>

                <FormSubmit pendingState={'Ingresando...'} className="auth-btn">
					Ingresar
				</FormSubmit>
            </form>
        </div>
    )
}