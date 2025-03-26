'use server'
import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

// create a function that fetches the latest products in the form of a prisma object. convert to a js object.
export async function getLatestProducts() {
    
    const data = await prisma.product.findMany({
       take: LATEST_PRODUCTS_LIMIT,
       orderBy: {
           createdAt: 'desc' 
       }
    });
    return convertToPlainObject(data);
}

// Get single product by its slug
export async function getProductBySlug(slug: string) {
    const data = await prisma.product.findFirst({
        where: {
            slug: slug
        }
    });
    return convertToPlainObject(data);
}