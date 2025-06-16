import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/order.actions";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const SuccessPage = async (props: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ payment_intent: string }>;
}) => {

    const { id } = await props.params;
    const { payment_intent:paymentIntentId } = await props.searchParams;

    // Fetch order by id
    const order = await getOrderById(id);
    if(!order) notFound()

    // Fetch payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // check if paymnt intent is valid
    if(paymentIntent.metadata.orderId == null || paymentIntent.metadata.orderId !== order.id.toString()){
        return notFound()
    }

    // check if payment intent is paid
    const isSuccess = paymentIntent.status === "succeeded";
    if(!isSuccess) return redirect(`/order/${id}`)

    return ( <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col items-center gap-6">
            <h1 className="font-bold">Thanks for your purchase</h1>
            <div>We are processing your order now</div>
            <Button asChild>
                <Link href={`/order/${id}`}>View Order</Link>
            </Button>
        </div>
    </div> );
}
 
export default SuccessPage;