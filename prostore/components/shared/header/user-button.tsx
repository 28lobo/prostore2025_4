'use client';

import { useSession } from "next-auth/react"; // or your custom hook
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";

const UserButton = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Button asChild>
        <Link href="/sign-in">
          <UserIcon /> Sign In
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200"
          >
            {firstInitial}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="font-normal px-2 py-1">
            <div className="text-sm font-medium">{session.user?.name}</div>
            <div className="text-muted-foreground text-sm">{session.user?.email}</div>
          </div>
          <DropdownMenuItem className="p-0 mb-1">
            <form action="/api/auth/signout" method="POST" className="w-full">
              <Button className="w-full justify-start py-4 px-1 h-4" variant="ghost">
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
