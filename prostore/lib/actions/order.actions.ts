"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import type { CartItem, PaymentResult } from "@/types";
import { paypal } from "../paypal"
import { revalidatePath } from "next/cache"; 

// Create an order and the order items
export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("User not Authenticated");
    // need cart items
    const cart = await getMyCart();
    // user id
    const userId = session?.user?.id;
    // check if there is a userid
    if (!userId) throw new Error("User not found");
    // get user from database using the user id from the session. This gives us the address, payment, etc
    const user = await getUserById(userId);
    // redirect if cart is empty
    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: "/cart",
      };
    }
    if (!user || !user.address) {
      return {
        success: false,
        message: "No shipping address",
        redirectTo: "/shipping-address",
      };
    }
    if (!user.paymmentMethod) {
      return {
        success: false,
        message: "No payment method",
        redirectTo: "/payment-method",
      };
    }

    // Create the order object.
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymmentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,

    });

    // Create a transacttion that creates an order and the order items
    const insertedOrderId = await prisma.$transaction(async (tx) => {
        // create order
        const insertedOrder = await tx.order.create({ data: order });
        // create order items from the cart items
        for (const item of cart.items as CartItem[]){
            await tx.orderItem.create({
                data: {
                    ...item,
                    price: item.price,
                    orderId: insertedOrder.id
                },
            });
        }
        // clear the cart
        await tx.cart.update({
            where: {
                id: cart.id,
            },
            data: {
                items: [],
                totalPrice: 0,
                taxPrice: 0,
                shippingPrice: 0,
                itemsPrice: 0,  
            },
        });
        return insertedOrder.id
    })
    if(!insertedOrderId) throw new Error("Failed to create order");
    return { success: true, message: "Order created successfully", redirectTo: `/order/${insertedOrderId}`};
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
}

// Get order by id
export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId
    },
    include: {
        orderItems: true,
        user: {
          select: {
            name: true,
            email: true
          }
        },
      },
  });
  return convertToPlainObject(data)
}

// Create a new PayPal Order
export async function createPayPalOrder(orderId: string) {
  try{
    // Get order from the database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId
      
      }
    });
    if(order){
      // Create a PayPal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      // update the order with the paypal order id
      await prisma.order.update({
        where: {
          id: orderId
        },
        data: {
          paymentResult:{
            id: paypalOrder.id,
            email_address: '',
            status: '',
            pricePaid: 0
          }
        }
      });
      return {success: true, message: "Item order created successfully", data: paypalOrder.id}

    }else {
      throw new Error("Order not found");
    }
  }catch(error){
    return { success: false, message: formatError(error) };
  }
 }

