'use client'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { CartItem } from "@/types";
import { toast } from "@/components/ui/sonner";
// import { toast, ToastAction } from "sonner"
import { addItemToCart } from "@/lib/actions/cart.actions";

const AddToCart = ({ item }: { item: CartItem }) => {
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

  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus /> Add To Cart
    </Button>
  );
};

export default AddToCart;
