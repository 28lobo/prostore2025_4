"use client";
import { useRouter } from "next/navigation";
import { Check, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { createOrder } from "@/lib/actions/order.actions";
import { toast } from "sonner"; // Use the sonner package for toast notifications

const PlaceOrderForm = () => {
  const router = useRouter();

  // 1. This is the new wrapper function for our server action.
  //    It will be called by the form's `action` prop.
  const handleSubmitAction = async () => {
    const res = await createOrder();
    if (!res.success) {
      // If the action fails, show an error message.
      toast.error(res.message);
      // If the action specifies a redirect on failure (e.g., cart is empty), do it.
      if (res.redirectTo) {
        router.push(res.redirectTo);
      }
      return;
    }
    // If the action succeeds, redirect to the final order page.
    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  // 2. This button component is now correct and will work because
  //    useFormStatus is monitoring the form's `action`.
  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full">
        {pending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}{" "}
        Place Order
      </Button>
    );
  };

  // 3. We removed the `onSubmit` handler and now use the `action` prop.
  return (
    <form action={handleSubmitAction} className="w-full">
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;