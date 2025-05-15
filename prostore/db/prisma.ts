import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient, Prisma } from '@prisma/client';
import ws from 'ws';

// Sets up WebSocket connections for Neon.
neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

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
        needs: { price: true },
        compute(product: ProductData) {
          return product.price.toString();
        },
      },
      rating: {
        needs: { rating: true },
        compute(product: ProductData) {
          return product.rating.toString();
        },
      },
    },
    cart: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(cart: { itemsPrice: Prisma.Decimal }) {
          return cart.itemsPrice.toString();
        },
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(cart: { shippingPrice: Prisma.Decimal }) {
          return cart.shippingPrice.toString();
        },
      },
      taxPrice: {
        needs: { taxPrice: true },
        compute(cart: { taxPrice: Prisma.Decimal }) {
          return cart.taxPrice.toString();
        },
      },
      totalPrice: {
        needs: { totalPrice: true },
        compute(cart: { totalPrice: Prisma.Decimal }) {
          return cart.totalPrice.toString();
        },
      },
    },
    order: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(order: { itemsPrice: Prisma.Decimal }) {
          return order.itemsPrice.toString();
        },
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(order: { shippingPrice: Prisma.Decimal }) {
          return order.shippingPrice.toString();
        },
      },
      taxPrice: {
        needs: { taxPrice: true },
        compute(order: { taxPrice: Prisma.Decimal }) {
          return order.taxPrice.toString();
        },
      },
      totalPrice: {
        needs: { totalPrice: true },
        compute(order: { totalPrice: Prisma.Decimal }) {
          return order.totalPrice.toString();
        },
      },
    },
    orderItem: {
      price: {
        needs: { price: true },
        compute(orderItem: { price: Prisma.Decimal }) {
          return orderItem.price.toString();
        },
      },
    },
  },
});
