'use client'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus } from "lucide-react";
import { Cart, CartItem } from "@/types";
import { toast } from "@/components/ui/sonner";
// import { toast, ToastAction } from "sonner"
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";

const AddToCart = ({ cart, item }: { cart?: Cart, item: CartItem }) => {
  const router = useRouter();

  const handleAddToCart = async () => {
    try {
      await addItemToCart(item);
      
      // Trigger a success toast notification with an action button.
      toast(`${item.name} added to cart`, {
        action: (
          <Button className="bg-primary text-white hover:bg-gray-800" aria-label="View Cart" onClick={() => router.push("/cart")}>
            View Cart
          </Button>
        )
      });
    } catch {
      // Optionally, trigger an error toast notification.
      toast("Failed to add item to cart");
    }
  };
  // handle remove item from cart
  const handleRemoveFromCart = async () => {
    const res = await removeItemFromCart(item.productId);
    toast(
      res.success ? `${item.name} removed from cart` : `Failed to remove ${item.name} from the cart`,
      {
        description: res.message
      }
    );
    return;
  }
  // check if item is already in cart
  const existItem = cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
        <Minus className="h-4 w-4" /> 
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type='button' variant='outline' onClick={handleAddToCart}>
        <Plus className="h-4 w-4" /> 
      </Button>
    </div>
  ): (
    
      <Button className="w-full" type="button" onClick={handleAddToCart}>
        <Plus /> Add To Cart
      </Button>
    
  )
};

export default AddToCart;
