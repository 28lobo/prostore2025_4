// app/routes/orders/[id]/page.tsx
import { Metadata } from "next";
import { getOrderById, updateOrderPaymentIntentId } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { ShippingAddress } from "@/types";
import { auth } from "@/auth";
import Stripe from "stripe";

export const metadata: Metadata = {
  title: "Order Details",
  description: "Order Details",
};

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getOrderById(params.id);
  if (!order) notFound();

  const session = await auth();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-05-28.basil",
  });

  let client_secret: string | null = null;
  if (order.paymentMethod === "Stripe" && !order.isPaid) {
    if (order.paymentIntentId) {
      const existing = await stripe.paymentIntents.retrieve(order.paymentIntentId);
      client_secret = existing.client_secret;
    } else {
      const created = await stripe.paymentIntents.create({
        amount: Math.round(Number(order.totalPrice) * 100),
        currency: "usd",
        metadata: { orderId: order.id },
      });
      await updateOrderPaymentIntentId(order.id, created.id);
      client_secret = created.client_secret;
    }
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
        paymentMethod: order.paymentMethod ?? "",
        updatedAt: order.createdAt ?? new Date(),
      }}
      stripeClientSecret={client_secret}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
      isAdmin={session?.user?.role === "admin"}
    />
  );
}
