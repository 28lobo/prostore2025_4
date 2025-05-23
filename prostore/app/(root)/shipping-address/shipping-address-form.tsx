"use client";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import { useTransition } from "react";
import { ShippingAddress } from "@/types";
import { shippingAddressSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { updateUserAddress } from "@/lib/actions/user.actions";

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit:SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (values) => {
    startTransition(async () => {
      try {
        const res = await updateUserAddress(values);
        if (res.success) {
          toast.success("Shipping address updated successfully");
          router.push("/payment-method");
        } else {
          toast.error(res.message);
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    });
  }
  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="font-bold mt-4">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">
          Please enter your shipping address.
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
                name="fullName"
                render={({ field }: {field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'fullName'>}) => (
                  <FormItem className="w-full">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Full Name" {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                control={form.control}
                name="address"
                render={({ field }: {field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'address'>}) => (
                  <FormItem className="w-full">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                control={form.control}
                name="city"
                render={({ field }: {field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'city'>}) => (
                  <FormItem className="w-full">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter City" {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }: {field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'postalCode'>}) => (
                  <FormItem className="w-full">
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter postal code" {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                control={form.control}
                name="country"
                render={({ field }: {field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'country'>}) => (
                  <FormItem className="w-full">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter country" {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
                <Button type='submit' disabled={isPending} className="w-full" variant="default">
                    {isPending ? (
                        <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                        <ArrowRight className="w-4 h-4" />
                    )} {' '} Continue
                </Button>
            </div>

          </form>
        </Form>
      </div>
    </>
  );
};

export default ShippingAddressForm;
