"use client";

// app/routes/orders/stripe-payment.tsx
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { SERVER_URL } from "@/lib/constants";

interface Props {
  priceInCents: number;
  clientSecret: string;
  orderId: string;
}

export default function StripePayment({ priceInCents, clientSecret, orderId }: Props) {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );
  const { theme, systemTheme } = useTheme();

  // show a loader while clientSecret is arriving
  if (!clientSecret) return <p>Loading payment form…</p>;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme:
            theme === "dark"
              ? "night"
              : theme === "light"
              ? "stripe"
              : systemTheme === "light"
              ? "stripe"
              : "night",
        },
      }}
    >
      <InnerForm priceInCents={priceInCents} orderId={orderId} />
    </Elements>
  );
}

function InnerForm({ priceInCents, orderId }: { priceInCents: number; orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage(undefined);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        receipt_email: email || undefined,
        return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`,
      },
    })

    if (error) setErrorMessage(error.message);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-xl font-medium">Stripe Checkout</div>

      {errorMessage && <p className="text-destructive">{errorMessage}</p>}

      <label className="block">
        <span className="sr-only">Email (optional)</span>
        <input
          type="email"
          className="input w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </label> 

      <PaymentElement />
      <div>
        <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
      </div>

      <Button
        className="w-full mt-4"
        type="submit"
        disabled={!stripe || !elements || loading}
      >
        {loading
          ? "Purchasing…"
          : `Purchase ${formatCurrency(priceInCents / 100)}`}
      </Button>
    </form>
  );
}
