"use server";

import { CartItem } from "@/types";
import { cookies } from "next/headers";

import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

// calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(itemsPrice * 0.15),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    // check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // get session and user id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // get cart
    const cart = await getMyCart();

    // parse and validate item
    const item = cartItemSchema.parse(data);

    // find product in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) throw new Error("Product not found");
    if (!cart) {
      // create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });
      // add to database
      await prisma.cart.create({
        data: newCart,
      });
      // revalidate the product page
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      // check if item is already in cart
      const existItem = (cart.items as CartItem[]).find(
        (x: CartItem) => x.productId === item.productId
      );
      if (existItem) {
        // check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not enough stock");
        }
        // incease the quantity
        (cart.items as CartItem[]).find(
          (x: CartItem) => x.productId === item.productId
        )!.qty = existItem.qty + 1;
      } else {
        // if item does not exist
        // check stock
        if (product.stock < 1) {
          throw new Error("Not enough stock");
        }
        // add item to cart
        (cart.items as CartItem[]).push(item);
      }
      // save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });
      // revalidate the product page
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} ${existItem ? "updated" : "added"} to cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  // check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");

  // get session and user id
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId
      ? {
          userId: userId,
        }
      : { sessionCartId: sessionCartId },
  });
  if (!cart) return undefined;
  // convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

// remove item from cart
export async function removeItemFromCart(productId: string){
  try {
    // check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
      if (!sessionCartId) throw new Error("Cart session not found");
    // get product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");
    // get cart
    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");
    // check for item
    const exist = (cart.items as CartItem[]).find(
      (x: CartItem) => x.productId === productId);
      if (!exist) throw new Error("Item not found");

    // check if only one in qty
    if (exist.qty === 1) {
      // remove item from cart
      cart.items = (cart.items as CartItem[]).filter(
        (x: CartItem) => x.productId !== exist.productId
      );
    } else {
      // decrease the quantity
      (cart.items as CartItem[]).find(
        (x: CartItem) => x.productId === productId
      )!.qty = exist.qty - 1;
    }

    // update cart in database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    // revalidate the product page
    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} ${exist.qty === 1 ? "removed" : "updated"} from cart`,
    };

  }catch(error){
    return {
      success: false,
      message: formatError(error),
    };
  }
}
