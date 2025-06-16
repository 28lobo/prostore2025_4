'use client'
// redirect
import { useRouter } from 'next/navigation';
import { toast } from "@/components/ui/sonner";
import { useTransition } from "react";
import { paymentMethodSchema } from '@/lib/validators';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from '@/lib/constants';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { updateUserPaymentMethod } from '@/lib/actions/user.actions';

const PaymentMethodForm = ({ preferredPaymentMethod }: {
  preferredPaymentMethod: string | null;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });
  const [isPending, startTransition] = useTransition(); 

  const onSubmit = (values: z.infer<typeof paymentMethodSchema>) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      router.push('/place-order');
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="font-bold mt-4">Payment Method</h1>
      <p className="text-sm text-muted-foreground">
        Please select a payment method.
      </p>
      <Form {...form}>
        <form
          method="post"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col md:flex-row gap-5">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                      {PAYMENT_METHODS.map((paymentMethod) => {
                        // 1. Manually create a unique ID for each radio item
                        const radioId = `payment-method-${paymentMethod.replace(/\s+/g, '-')}`;
                        return (
                          <FormItem key={paymentMethod} className="flex items-center space-y-0 space-x-3">
                            <FormControl>
                              {/* 2. Assign the ID to the radio input */}
                              <RadioGroupItem value={paymentMethod} id={radioId} />
                            </FormControl>
                            {/* 3. Replace <FormLabel> with a standard <label> */}
                            {/* 4. Use htmlFor to explicitly link the label to the input */}
                            <label
                              htmlFor={radioId}
                              className="font-normal text-sm text-muted-foreground"
                            >
                              {paymentMethod}
                            </label>
                          </FormItem>
                        )
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isPending} className="w-full" variant="default">
              {isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}{' '}
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PaymentMethodForm;