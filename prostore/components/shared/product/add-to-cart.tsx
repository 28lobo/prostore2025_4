'use client'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus } from "lucide-react";
// Ensure these types are now correctly defined as shown in step 1
import { Cart, CartItem } from "@/types";
import { toast } from "@/components/ui/sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import React, { useTransition } from 'react'; // Import useTransition
import { Loader } from 'lucide-react'; // Import a loader icon


// The props definition remains the same, but the 'Cart' type it references
// should now be the corrected one from src/types/index.ts
const AddToCart = ({ cart, item }: { cart?: Cart, item: CartItem }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition(); // Add transition for loading state

  const handleAddToCart = () => {
    startTransition(async () => { // Wrap action in startTransition
      try {
        // Assuming addItemToCart handles the item structure correctly
        // (e.g., doesn't require price as a number if it's passed as string)
        await addItemToCart(item);
        router.refresh(); // Refresh server components/data

        toast.success(`${item.name} added to cart`, { // Use toast.success
          description: `Quantity: 1`, // Or adjust if quantity can be > 1 initially
          action: (
            <Button variant="outline" size="sm" onClick={() => router.push("/cart")}>
              View Cart
            </Button>
          )
        });
      } catch (error) {
        console.error("Add to cart failed:", error); // Log error for debugging
        toast.error("Failed to add item to cart", { // Use toast.error
           description: error instanceof Error ? error.message : "Please try again."
        });
      }
    });
  };

  // Handle quantity increase (essentially adding the same item again)
  const handleIncreaseQuantity = () => {
    startTransition(async () => {
      try {
        // Assuming addItemToCart correctly handles incrementing quantity
        await addItemToCart(item);
        router.refresh();
        toast.success(`Increased ${item.name} quantity`);
      } catch (error) {
         console.error("Increase quantity failed:", error);
         toast.error("Failed to increase quantity", {
            description: error instanceof Error ? error.message : "Please try again."
         });
      }
    });
  };

  // Handle quantity decrease or removal
  const handleDecreaseQuantity = () => {
    startTransition(async () => {
      try {
        // removeItemFromCart should handle decreasing quantity or removing if qty becomes 0
        const res = await removeItemFromCart(item.productId);
        router.refresh();
        if (res.success) {
            toast.success(`${item.name} quantity updated/removed`);
        } else {
            toast.error(`Failed to update ${item.name}`, {
                description: res.message || "Could not update cart item.",
            });
        }
      } catch (error) {
          console.error("Decrease quantity failed:", error);
          toast.error("Failed to update quantity", {
             description: error instanceof Error ? error.message : "Please try again."
          });
      }
    });
  };

  // Find existing item using optional chaining safely
  const existItem = cart?.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div className="flex items-center justify-center gap-2">
      <Button
        size="sm"
        type='button'
        variant='outline'
        onClick={handleDecreaseQuantity}
        disabled={isPending} // Disable during transition
        aria-label="Decrease quantity or remove item"
      >
        {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Minus className="h-4 w-4" />}
      </Button>
      <span className="px-2 min-w-[30px] text-center font-medium">{existItem.qty}</span>
      <Button
        size="sm"
        type='button'
        variant='outline'
        onClick={handleIncreaseQuantity} // Use specific handler
        disabled={isPending} // Disable during transition
        aria-label="Increase quantity"
      >
         {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full"
      type="button"
      onClick={handleAddToCart}
      disabled={isPending} // Disable during transition
    >
      {isPending ? (
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Plus className="mr-2 h-4 w-4" />
      )}
      Add To Cart
    </Button>
  );
};

export default AddToCart;