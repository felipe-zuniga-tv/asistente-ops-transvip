import { Suspense } from 'react'
import { getPaymentMethods } from '@/lib/services/admin'
import { PaymentMethodConfig } from '@/components/admin/payment-config/payment-method-config'
import SuspenseLoading from '@/components/ui/suspense'

export const metadata = {
    title: "Métodos de Pago | Transvip",
    description: "Administra los estados disponibles para los vehículos",
};

export const revalidate = 0; // Revalidate this page on every request

export default async function PaymentMethodPage() {
    const paymentMethods = await getPaymentMethods()

    return (
        <Suspense fallback={<SuspenseLoading />}>
            <PaymentMethodConfig data={paymentMethods} />
        </Suspense>
    )
}