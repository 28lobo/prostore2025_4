'use client'

import { updateUserSchema } from "@/lib/validators";
import { z } from "zod";


import { ControllerRenderProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from "@/components/ui/select";
import { USER_ROLES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { updateUser } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

const UpdateUserForm = ({ user }: {
  user: z.infer<typeof updateUserSchema>
}) => {

  const router = useRouter();
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  });

  const onSubmit = async(values: z.infer<typeof updateUserSchema>) => {
    try {
      // implement the update user logic here
      const res = await updateUser({
        ...values,
        id: user.id
      }); 

      if(!res.success){
        toast.error(res.message);
      }else {
        toast.success("User updated successfully");
      }
      form.reset();
      router.push('/admin/user');
      
    } catch (error) {
      if(error instanceof Error) {
        toast.error(error.message);
      }
      else {
        toast.error("Failed to update user");
      }
    }
  };

  return (
    <Form {...form}>
      <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
       <div>
         <FormField
          control={form.control}
          name="email"
          render={({ field }: { field: ControllerRenderProps<z.infer<typeof updateUserSchema>, "email"> }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input disabled placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       </div>
       <div>
         <FormField
          control={form.control}
          name="name"
          render={({ field }: { field: ControllerRenderProps<z.infer<typeof updateUserSchema>, "name"> }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter user name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       </div>
       {/* Role */}
       <div>
         <FormField
          control={form.control}
          name="role"
          render={({ field }: { field: ControllerRenderProps<z.infer<typeof updateUserSchema>, "role"> }) => (
            <FormItem className="w-full">
              <FormLabel>Role</FormLabel>
              <Select  onValueChange={field.onChange} value={field.value.toString()}>
                <FormControl>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {USER_ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              
              <FormMessage />
            </FormItem>
          )}
        />
       </div>
       <div className="flex-between">
        <Button type='submit' className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Updating..." : "Update User"}
        </Button>
       </div>
      </form>
    </Form>
  );
};

export default UpdateUserForm;
