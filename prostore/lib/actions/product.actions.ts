'use server'
import { PrismaClient } from "@prisma/client";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

// create a function that fetches the latest products in the form of a prisma object. convert to a js object.
export async function getLatestProducts() {
    const prisma = new PrismaClient();
    const data = await prisma.product.findMany({
       take: LATEST_PRODUCTS_LIMIT,
       orderBy: {
           createdAt: 'desc'
       }
    });
    return convertToPlainObject(data);
}