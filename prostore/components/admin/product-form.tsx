"use client";

import { Product } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import { z } from "zod";
import { insertProductSchema } from "@/lib/validators"; // Removed unused updateProductSchema import
import { zodResolver } from "@hookform/resolvers/zod";
import { productDefaultValues } from "@/lib/constants";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import slugify from "slugify";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { UploadButton } from "@/lib/uploadthing";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();

  // Use insertProductSchema for validating the form fields themselves.
  // The 'id' for updates is handled separately before calling the server action.
  const formSchemaForFields = insertProductSchema;
  type FormValuesForFields = z.infer<typeof formSchemaForFields>;

  const defaultFormValues: FormValuesForFields =
    type === "Update" && product
      ? {
          name: product.name,
          slug: product.slug,
          category: product.category,
          brand: product.brand,
          description: product.description,
          stock: product.stock, // Prisma 'stock' is likely number, schema coerces
          images: product.images as string[] || [], // Ensure images is an array
          isFeatured: product.isFeatured,
          banner: product.banner || '', // Ensure banner is string, handle null/undefined
          price: String(product.price), // Schema expects string, transforms to number
        }
      : {
          ...productDefaultValues,
          price: String(productDefaultValues.price), // Ensure price is string for form
          images: productDefaultValues.images || [], // Ensure images is an array
          banner: productDefaultValues.banner || '', // Ensure banner is string
        };

  const form = useForm<FormValuesForFields>({
    resolver: zodResolver(formSchemaForFields),
    defaultValues: defaultFormValues,
  });

  const onSubmit: SubmitHandler<FormValuesForFields> = async (values) => {
    if (type === "Create") {
      try {
        const res = await createProduct(values); // `values` conform to insertProductSchema
        if (!res.success) {
          toast.error(res.message);
        } else {
          router.push("/admin/products");
          toast.success(res.message);
        }
      } catch (error) {
        console.error("Error creating product:", error);
        toast.error("Failed to create product. See console for details.");
      }
    }

    if (type === "Update") {
      if (!productId) {
        toast.error("Product ID is missing. Cannot update.");
        router.push("/admin/products");
        return;
      }

      // Construct the payload for updateProduct action, which expects data conforming to updateProductSchema
      const updatePayload = { ...values, id: productId };

      try {
        // The `updateProduct` server action will validate this payload against `updateProductSchema`
        const res = await updateProduct(updatePayload);
        if (!res.success) {
          toast.error(res.message);
        } else {
          router.push("/admin/products");
          toast.success(res.message);
        }
      } catch (error) {
        console.error("Error updating product:", error);
        toast.error("Failed to update product. See console for details.");
      }
    }
  };

  const images = form.watch("images", product?.images || []);
  const isFeatured = form.watch("isFeatured", product?.isFeatured || false);
  const banner = form.watch("banner", product?.banner || '');

  // Log form errors to console for easier debugging if there are any
  if (Object.keys(form.formState.errors).length > 0 && !form.formState.isSubmitting) {
    console.log("Form validation errors:", form.formState.errors);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col gap-5 md:flex-row">
          {/* name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: ControllerRenderProps<FormValuesForFields, "name"> }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
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
            render={({ field }: { field: ControllerRenderProps<FormValuesForFields, "slug"> }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className="relative"> {/* Corrected typo: relativ -> relative */}
                    <Input placeholder="Enter slug" {...field} />
                    <Button
                      type="button"
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2"
                      onClick={() => {
                        form.setValue("slug", slugify(form.getValues("name"), { lower: true }));
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
            render={({ field }: { field: ControllerRenderProps<FormValuesForFields, "category"> }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
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
            render={({ field }: { field: ControllerRenderProps<FormValuesForFields, "brand"> }) => (
              <FormItem className="w-full">
                <FormLabel>Brand</FormLabel>
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
            render={({ field }: { field: ControllerRenderProps<FormValuesForFields, "price"> }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Enter product price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* stock */}
          <FormField
            control={form.control}
            name="stock"
            render={({ field }: { field: ControllerRenderProps<FormValuesForFields, "stock"> }) => (
              <FormItem className="w-full">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter product stock" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row upload-field">
          {/* images */}
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex flex-start space-x-2 flex-wrap"> {/* Added flex-wrap */}
                      {Array.isArray(images) && images.map((image: string) => (
                        <Image
                          key={image}
                          src={image}
                          alt="product image"
                          className="w-20 h-20 object-center object-cover rounded-sm"
                          width={100}
                          height={100}
                        />
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => { // res type is { name: string; size: number; key: string; url: string; }[]
                            if (res && res.length > 0) {
                                const currentImages = form.getValues("images") || [];
                                form.setValue("images", [...currentImages, res[0].url]);
                            }
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(`Failed to upload image: ${error.message}`);
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field">
          Featured Product
          <Card>
            <CardContent className="space-y-2 mt-2">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2"> {/* Improved alignment */}
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-4 w-4"
                        id="isFeaturedCheckbox" // Added id for label association
                      />
                    </FormControl>
                    <FormLabel htmlFor="isFeaturedCheckbox" className="font-normal"> {/* Use htmlFor and make label normal weight */}
                      Is Featured ?
                    </FormLabel>
                  </FormItem>
                )}
              />
              {isFeatured && banner && (
                <Image
                  src={banner}
                  alt="product banner"
                  className="w-full object-cover object-center rounded-sm"
                  width={1920}
                  height={680}
                />
              )}
              {isFeatured && !banner && (
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => { // res type is { name: string; size: number; key: string; url: string; }[]
                    if (res && res.length > 0) {
                        form.setValue("banner", res[0].url);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Failed to upload banner image: ${error.message}`);
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }: { field: ControllerRenderProps<FormValuesForFields, "description"> }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
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
    </Form>
  );
};

export default ProductForm;