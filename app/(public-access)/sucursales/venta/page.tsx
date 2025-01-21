'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { branches } from '@/lib/config/transvip-general'
import { SalesForm } from '@/components/sales/form/sales-form'
import type { Language } from '@/lib/translations'

export default function SalesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const branchCode = searchParams.get('branch')?.toLowerCase()
  const language = (searchParams.get('lang') || 'es-CL') as Language

  useEffect(() => {
    // Validate branch code
    const validBranch = branches.some(b => b.code.toLowerCase() === branchCode)
    if (!branchCode || !validBranch) {
      router.push('/sucursales')
    }
  }, [branchCode, router])

  // If no valid branch code, show nothing while redirecting
  if (!branchCode) return null

  return (
    <SalesForm 
      branchCode={branchCode} 
      initialLanguage={language}
      onSuccess={() => router.push('/sucursales')} 
    />
  )
} 