import { z } from "zod";
import { 
    insertProductSchema, 
    insertCartSchema, 
    cartItemSchema, 
    shippingAddressSchema,
    inserOrderItemSchema,
    insertOrderSchema,
    paymentResultSchema,
    insertReviewSchema

} from "@/lib/validators";

// Infer the zod schema to get the type
export type Product = z.infer<typeof insertProductSchema>&{
    id: string;
    rating: string;
    numReviews: number;
    createdAt: Date;
}

export type Cart = z.infer<typeof insertCartSchema>

export type CartItem = z.infer<typeof cartItemSchema>

export type ShippingAddress = z.infer<typeof shippingAddressSchema>
export type OrderItem = z.infer<typeof inserOrderItemSchema>
export type Order = z.infer<typeof insertOrderSchema> & {
    id: string;
    createdAt: Date;
    isPaid: boolean;
    paidAt: Date | null;
    isDelivered: boolean;
    deliveredAt: Date | null;
    orderItems: OrderItem[];
    user: {name: string, email: string};
    updatedAt: Date;
    userId: string;
    paymentResult?: PaymentResult;
    paymentMethod?: string;
}

export type PaymentResult = z.infer<typeof paymentResultSchema>


// infering the fields from the schema?
export type Review = z.infer<typeof insertReviewSchema> & {
    id: string;
    createdAt: Date;
    user?: {name: string};
}