'use server'
import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { insertProductSchema, updateProductSchema } from "../validators";
import { z } from "zod";
import { Prisma } from "@prisma/client";



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

// Get single product by its id. used in the product update form
export async function getProductById(productId: string) {
    const data = await prisma.product.findFirst({
        where: {
            id: productId
        }
    });
    return convertToPlainObject(data);
}

export type GetAllProductsParams = {
  limit?: number;
  page: number;
  query?: string;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
};


// Get all products

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function getAllProducts({
  limit = PAGE_SIZE,
  page,
  query,
  category,
  price,
  rating,
  sort,
}: GetAllProductsParams) {
  // 1. Build a dynamic `where` object based on query/category:
  const whereClause: { name?: { contains: string; mode: "insensitive" }; category?: string } = {};

  if (query && query.trim().length > 0) {
    whereClause.name = {
      contains: query.trim(),
      mode: "insensitive",
    };
  }

  if (category && category.trim().length > 0) {
    whereClause.category = category.trim();
  }

  // 2. Calculate skip & take for pagination:
  const skip = (page - 1) * limit;
  const take = limit;
  // Query filter 
  const queryFilter: Prisma.ProductWhereInput = query && query !== 'all' ? {
    name: {
        contains: query,
        mode: 'insensitive'
    } as Prisma.StringFilter
  } : {};
//   Category filter
  const categoryFilter = category && category !== 'all' ? { category } : {};
//   price filter
  const priceFilter: Prisma.ProductWhereInput = price && price !== 'all' ? {
    price: {
        gte: Number(price.split('-')[0]),
        lte: Number(price.split('-')[1]),
    }
   } : {};
   const ratingFilter: Prisma.ProductWhereInput = rating && rating !== 'all' ? {
    rating: {
        gte: Number(rating)
    }
   } : {};

  // 3. Run count() and findMany() in parallel, both using the same where clause:
  const [totalCount, data] = await Promise.all([
    prisma.product.count({ where: whereClause }),
    prisma.product.findMany({
      where: {...queryFilter, ...categoryFilter, ...priceFilter,...ratingFilter},
      orderBy: 
        sort === 'lowest'
        ? {price: 'asc'}
        : sort === 'highest'
        ? {price: 'desc'}
        : sort === 'rating'
        ? {rating: 'desc'}
        : {createdAt: 'desc'},
      skip,
      take,
    }),
  ]);

  // 4. Compute totalPages and return:
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data,
    totalPages,
  };
}
/* eslint-enable @typescript-eslint/no-unused-vars */

// Delete a product
export async function deleteProduct(id: string) {
    try {
        const productExists = await prisma.product.findFirst({
            where: {id}
        })
        if(!productExists) throw new Error("Product not found")
        await prisma.product.delete({
            where: {id}
        })
        revalidatePath('/admin/products')  
        return {
            success: true,
            message: "Product deleted successfully"
        }
    }catch(error){
        return {success: false, message: formatError(error)}
    }
}


// Create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
    try {
        const product = insertProductSchema.parse(data);
        await prisma.product.create({
            data: product
        })
        revalidatePath('/admin/products')
        return {
            success: true,
            message: "Product created successfully"
        }
    }catch(error){
        return {success: false, message: formatError(error)}
    }
}
// update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
    try {
        const product = updateProductSchema.parse(data);

        const productExists = await prisma.product.findFirst({
            where: {
                id: product.id
            }
        })

        if(!productExists) throw new Error("Product not found")

        await prisma.product.update({
            where: {
                id: product.id
            },
            data: product
        })

        revalidatePath('/admin/products')
        return {
            success: true,
            message: "Product updated successfully"
        }
    }catch(error){
        return {success: false, message: formatError(error)}
    }
}

// Get all categories
export async function getAllCategories() {
    const data = await prisma.product.groupBy({
        by: ['category'],
        _count: true
    });
    return data;
}

// get featured products
export async function getFeaturedProducts() {
    const data = await prisma.product.findMany({
        where: {
            isFeatured: true
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 4
    });
    return convertToPlainObject(data);
}