import { Suspense } from 'react'
import { getPaymentMethods } from '@/lib/services/admin'
import { PaymentMethodConfig } from '@/components/admin/payment-config/payment-method-config'
import SuspenseLoading from '@/components/ui/suspense'

export const metadata = {
    title: "Métodos de Pago | Transvip",
    description: "Administra los estados disponibles para los vehículos",
};

export default async function PaymentMethodPage() {
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <PaymentMethodDashboard />
        </Suspense>
    )
}

async function PaymentMethodDashboard() {
    const paymentMethods = await getPaymentMethods()
    return <PaymentMethodConfig data={paymentMethods} />
}