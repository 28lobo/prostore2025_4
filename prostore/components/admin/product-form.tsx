"use client";

import { Product } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import { z } from "zod";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { productDefaultValues } from "@/lib/constants";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";


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
  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver:
      type === "Update"
        ? zodResolver(updateProductSchema)
        : zodResolver(insertProductSchema),
    defaultValues:
      product && type === "Update" ? product : productDefaultValues,
  });

  return <Form {...form}>
    <form className="space-y-8">
        <div className="flex flex-col gap-5 md:flex-row">
            {/* name */}
            {/* slug */}
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
            {/* category */}
            {/* brand */}
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
            {/* price */}
            {/* stock */}
        </div>
        <div className="flex flex-col gap-5 md:flex-row upload-field">
            {/* images */}
            
        </div>
        <div className="upload-field">
            {/* isFeatured */}
        </div>
        <div>
            {/* description */}
        </div>
        <div>
            {/* submit button */}
        </div>
    </form>
  </Form>;
};

export default ProductForm;
