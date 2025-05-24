"use client";

import { Product } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import { z } from "zod";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { productDefaultValues } from "@/lib/constants";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import slugify from "slugify";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";


const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
}) => {
  // the useRouter hook is used to get the router object
  // which is used to navigate to different pages
  const router = useRouter();
  const schema = type === "Update" ? updateProductSchema : insertProductSchema;
  type FormValues = z.infer<typeof schema>;

  const defaultFormValues: FormValues =
  type === "Update" && product
    ? {
        // pick exactly the fields your schema defines:
        name:       product.name,
        slug:       product.slug,
        category:   product.category,
        brand:      product.brand,
        description:product.description,
        stock:      product.stock,
        images:     product.images as string[],    // make sure this really is string[]
        isFeatured: product.isFeatured,
        banner:     product.banner,
        // convert number → string
        price:      String(product.price),
      }
    : {
        ...productDefaultValues,
        price: String(productDefaultValues.price),
      };
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultFormValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (values) => {
    if (type === "Create") {
      const res = await createProduct(values);

      if(!res.success) {
        toast.error(res.message);
      }else {
        router.push('/admin/products');
        toast.success(res.message);
      }
    }
    // on update
     if (type === "Update") {
      if(!productId) {
        router.push('/admin/products');
        return;
      }
      const res = await updateProduct({...values, id: productId});
      

      if(!res.success) {
        toast.error(res.message);
      }else {
        router.push('/admin/products');
        toast.success(res.message);
      }
    }
  }

  return <Form {...form}>
    <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col gap-5 md:flex-row">
            {/* name */}
            <FormField 
              control={form.control}
              name="name"
              render={({field}: {field: ControllerRenderProps<z.infer<typeof insertProductSchema>,'name'>})=> (
                <FormItem className="w-full">
                  <FormLabel>
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* slug */}
            <FormField 
              control={form.control}
              name="slug"
              render={({field}: {field: ControllerRenderProps<z.infer<typeof insertProductSchema>,'slug'>})=> (
                <FormItem className="w-full">
                  <FormLabel>
                    Slug
                  </FormLabel>
                  <FormControl>
                    <div className="relativ">
                      <Input placeholder="Enter slug" {...field} />
                      <Button type="button" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2"
                        onClick={() => {
                          form.setValue('slug', slugify(form.getValues('name'), {lower: true}))
                        }}
                      >
                        Generate
                      </Button>
                    </div>
                    
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
            {/* category */}
            <FormField 
              control={form.control}
              name="category"
              render={({field}: {field: ControllerRenderProps<z.infer<typeof insertProductSchema>,'category'>})=> (
                <FormItem className="w-full">
                  <FormLabel>
                    Category
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* brand */}
            <FormField 
              control={form.control}
              name="brand"
              render={({field}: {field: ControllerRenderProps<z.infer<typeof insertProductSchema>,'brand'>})=> (
                <FormItem className="w-full">
                  <FormLabel>
                    Brand
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product brand" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
            {/* price */}
            <FormField 
              control={form.control}
              name="price"
              render={({field}: {field: ControllerRenderProps<z.infer<typeof insertProductSchema>,'price'>})=> (
                <FormItem className="w-full">
                  <FormLabel>
                    Price
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* stock */}
            <FormField 
              control={form.control}
              name="stock"
              render={({field}: {field: ControllerRenderProps<z.infer<typeof insertProductSchema>,'stock'>})=> (
                <FormItem className="w-full">
                  <FormLabel>
                    Stock
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product stock" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div className="flex flex-col gap-5 md:flex-row upload-field">
            {/* images */}
            
        </div>
        <div className="upload-field">
            {/* isFeatured */}
        </div>
        <div>
          {/* Description */}
          <FormField 
              control={form.control}
              name="description"
              render={({field}: {field: ControllerRenderProps<z.infer<typeof insertProductSchema>,'description'>})=> (
                <FormItem className="w-full">
                  <FormLabel>
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter product description" {...field} className="resize-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div>
            <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="w-full">
              {form.formState.isSubmitting ? "Submitting..." : `${type} Product`}
            </Button>
        </div>
    </form>
  </Form>;
};

export default ProductForm;
