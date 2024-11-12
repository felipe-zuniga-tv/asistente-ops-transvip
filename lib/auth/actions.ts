'use server'

import { login } from '@/lib/auth'
import { Routes } from "@/utils/routes"

export async function loginAction(formData: FormData) {
  try {
    const results = await login(formData)
    
    if (results.status === 200 || results.status === 201)
        return { success: true, redirectTo: Routes.START }

    return { success: false, redirectTo: Routes.HOME, data: results }
  } catch (error) {
    return { success: false, redirectTo: Routes.HOME, error: (error as Error).message }
  }
}
