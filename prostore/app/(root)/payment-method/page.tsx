import { Metadata } from "next";
// get the session and user
import { auth } from "@/auth";
// get user's payment methods
import { getUserById } from "@/lib/actions/user.actions";
import PaymentMethodForm from "./payment-method-form";
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata: Metadata = {
    title: "Select Payment Method",
    keywords: ["payment", "method", "select", "checkout"],
    description: "Payment Method",
};

const PaymentMethodPage = async() => {
    const session = await auth();
    const userId = session?.user.id;

    if(!userId) throw new Error("User not found");
    const user = await getUserById(userId);
    return ( <>
        <CheckoutSteps current={2}  />
        <PaymentMethodForm preferredPaymentMethod={user?.paymentMethod ?? null} />
    </> );
}
 
export default PaymentMethodPage;