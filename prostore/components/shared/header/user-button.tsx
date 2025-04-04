import Link from "next/link";
import { auth } from "@/auth";
import { signOutUser } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";

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
  const fistInitial = session.user?.name?.charAt(0).toUpperCase() ?? 'U'
  return <div className="flex gap-2 items-center">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center">
          <Button variant='ghost' className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200">
            {fistInitial}
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align='end' forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-medium leading-none">
              {session.user?.name}
            </div>
            <div className="text-muted-foreground font-medium leading-none">
              {session.user?.email}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem className="p-0 mb-1">
          <form action={signOutUser} className="w-full">
            <Button  className="w-full justify-start py-4 px-1 h-4" variant="ghost">
              Sign Out
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>;
};

export default UserButton;
