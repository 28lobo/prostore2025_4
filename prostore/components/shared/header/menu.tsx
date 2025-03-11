import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EllipsisVertical, ShoppingCart, User } from "lucide-react";
import Link from "next/link"; // Ensure Next.js Link is imported correctly

const Menu = () => {
  return (
    <div className="flex justify-end gap-4">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart />
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/sign-in">
            <User /> Sign In
          </Link>
        </Button>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden">
        <Sheet>
          {/* ✅ Ensure `SheetTrigger` is inside `Sheet` */}
          <SheetTrigger asChild>
            <button className="">
              <EllipsisVertical className="w-8 h-8"/>
            </button>
          </SheetTrigger>

          <SheetContent side="right" className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>

            <Button asChild variant="ghost">
              <Link href="/cart">
                <ShoppingCart />
                Cart
              </Link>
            </Button>

            <Button asChild variant="ghost">
              <Link href="/sign-in">
                <User />
                Sign In
              </Link>
            </Button>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
