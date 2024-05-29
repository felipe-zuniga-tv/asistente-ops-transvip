import { Coins, CreditCard, ReceiptText } from "lucide-react";
import { BookingInfoOutputProps } from "@/lib/chat/types";
import { paymentMethods } from "@/lib/transvip/config";

export default function PaymentAvatar({ result } : { result : BookingInfoOutputProps }) {
    const checkPaymentMethods = Object.keys(paymentMethods).includes(result.payment.method_name || '')

    if (!checkPaymentMethods) return null
    
    return (
        <div className="payment-method-name">
            { result.payment.method_name === paymentMethods.CARD && <CreditCard className="size-4" /> }
            { result.payment.method_name === paymentMethods.CASH && <Coins className="size-4" /> }
            { result.payment.method_name === paymentMethods.FACTURA && <ReceiptText className="size-4" /> }
        </div>
    )
}