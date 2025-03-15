import { z } from "zod";
import { insertProductSchema } from "@/lib/validators";

// Infer the zod schema to get the type
export type Product = z.infer<typeof insertProductSchema>&{
    id: string;
    rating: string;
    createdAt: Date;
}