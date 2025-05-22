import { IBookingInfoOutput } from "@/types/domain/booking/types";
import { paymentMethods } from "@/lib/core/config/transvip-general";

export default function PaymentAvatar({ result }: { result: IBookingInfoOutput }) {
    const checkPaymentMethods = paymentMethods.filter(pm => pm.name.toLowerCase() === result.payment.method_name?.toLowerCase()).length > 0;

    if (!checkPaymentMethods) return null;

    const paymentMethod = paymentMethods.filter(pm => pm.name.toLowerCase() === result.payment.method_name?.toLowerCase())[0]

    if (!paymentMethod) return null;

    return (
        <div className="payment-method-name hidden xs:block">
            <paymentMethod.icon className='size-4' />
        </div>
    )
}