import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient, Prisma } from '@prisma/client';
import ws from 'ws';

// Sets up WebSocket connections for Neon.
neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

// Creates a new connection pool using the provided connection string.
const pool = new Pool({ connectionString });

// Instantiates the Prisma adapter using the Neon connection pool.
const adapter = new PrismaNeon(pool);

// Define a type for product data matching your Prisma schema.
type ProductData = {
  price: Prisma.Decimal;
  rating: Prisma.Decimal;
  name: string;
  id: string;
  slug: string;
  category: string;
  images: string[];
  brand: string;
  description: string;
  stock: number;
  numReview: number;
  isFeatured: boolean;
  banner: string | null;
  createdAt: Date;
};

export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product: ProductData): string {
          return product.price.toString();
        },
      },
      rating: {
        compute(product: ProductData): string {
          return product.rating.toString();
        },
      },
    },
    cart: {
      itemsPrice: {
        needs: {},
        compute(cart: { itemsPrice: Prisma.Decimal }): string {
          return cart.itemsPrice.toString();
        },
      },
      shippingPrice: {
        needs: {},
        compute(cart: { shippingPrice: Prisma.Decimal }): string {
          return cart.shippingPrice.toString();
        },
      },
      taxPrice: {
        needs: {},
        compute(cart: { taxPrice: Prisma.Decimal }): string {
          return cart.taxPrice.toString();
        },
      },
      totalPrice: {
        needs: {},
        compute(cart: { totalPrice: Prisma.Decimal }): string {
          return cart.totalPrice.toString();
        },
      },
    },
    order: {
      itemsPrice: {
        needs: {},
        compute(order: { itemsPrice: Prisma.Decimal }): string {
          return order.itemsPrice.toString();
        },
      },
      shippingPrice: {
        needs: {},
        compute(order: { shippingPrice: Prisma.Decimal }): string {
          return order.shippingPrice.toString();
        },
      },
      taxPrice: {
        needs: {},
        compute(order: { taxPrice: Prisma.Decimal }): string {
          return order.taxPrice.toString();
        },
      },
      totalPrice: {
        needs: {},
        compute(order: { totalPrice: Prisma.Decimal }): string {
          return order.totalPrice.toString();
        },
      },
    },
    orderItem: {
      price: {
        compute(orderItem: { price: Prisma.Decimal }): string {
          return orderItem.price.toString();
        },
      },
    },
  },
});
