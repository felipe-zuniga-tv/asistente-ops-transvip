import { getPaymentMethods } from '@/lib/features/admin'
import { PaymentMethodConfig } from '@/components/admin/payment-config/payment-method-config'

export const metadata = {
    title: "Métodos de Pago | Transvip",
    description: "Administra los estados disponibles para los vehículos",
};


export default async function PaymentMethodPage() {
    const paymentMethods = await getPaymentMethods()
    return <PaymentMethodConfig data={paymentMethods} />
}
