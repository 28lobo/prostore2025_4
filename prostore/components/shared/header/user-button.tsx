import Link from "next/link";
import { auth } from "@/auth";
import { signOutUser } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";

const UserButton = async () => {
    const session = await auth()
    if (!session) {
    return (
      <Button asChild>
        <Link href="/sign-in">
            <UserIcon />Sign In
        </Link>
      </Button>
    );
  }
  return <>User</>;
};

export default UserButton;
