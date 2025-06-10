'use server'

import { z } from "zod";
import { insertReviewSchema } from "../validators";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

// create and update reviews
export async function createUpdateReview(data: z.infer<typeof insertReviewSchema>) {
    try {
     const session = await auth()  

     if(!session)  throw new Error("Unauthorized")
    // validate and store review
    const review = insertReviewSchema.parse({
        ...data,
        userId: session?.user.id,
    });
    // get product that is being reviewed
    const product = await prisma.product.findFirst({
        where: {
            id: review.productId,
        },
    });

    if(!product) throw new Error("Product not found");

    // check if user has already reviewed this product
    const reviewExists = await prisma.review.findFirst({
        where: {
            productId: review.productId,
            userId: review.userId,
            
        },
    });

    await prisma.$transaction(async (tx) =>{
        if(reviewExists){
            // update reivew
            await tx.review.update({
                where: {id: reviewExists.id},
                data: {
                    Title: review.title,
                    description: review.description,
                    rating: review.rating
                }
            })
        } else {
            // create review
            await tx.review.create({
                data: {
                    Title: review.title,
                    description: review.description,
                    productId: review.productId,
                    userId: review.userId,
                    rating: review.rating,
                    isVerifiedPurchase: false,
                    // 'createdAt' will be automatically set if not provided
                }
            })
        }
        // get average rating
        const averageRating = await tx.review.aggregate({
            _avg: {
                rating: true,
            },
            where: {
                productId: review.productId,
            },
        });
        // get number of reviews
        const numReviews = await tx.review.count({
            where: {
                productId: review.productId,
            },
        });
        // update ratings and number of reviews in the product table.
        await tx.product.update({
            where: {
                id: review.productId,
            },
            data: {
                rating: averageRating._avg.rating || 0,
                numReview: numReviews,
            },
        });
    });
    // revalidate the path
    revalidatePath(`/product/${product.slug}`)

    return {success: true, message: "Review updated successfully"}

    } catch (error) {
       return {success: false, message: formatError(error)} 
    }
}

// Get all reviews
export async function getReviews({productId}: {productId: string}) {
    const data = await prisma.review.findMany({
        where: {
            productId: productId
        },
        include: {
            user: {
                select: {
                    name: true,
                    
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return {data}
}

// get a review written by the current user.
export async function getMyReviewByProductId({productId}: {productId: string, userId: string}) {
    const session = await auth();
    if(!session) throw new Error("Unauthorized");
    return await prisma.review.findFirst({
        where: {
            productId: productId,
            userId: session?.user?.id,
        }
    });
    
}