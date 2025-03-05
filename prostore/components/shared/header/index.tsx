import {ShoppingCart, UserIcon} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'


const Header = () => {
    return ( 
        <header className="w-full border-b ">
            <div className="flex justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex-start">
                    <Link href="/" className="flex-start">
                        <Image src='/images/logo.svg' alt={`${APP_NAME}`} width={48} height={48}/>
                        <span className="hidden lg:block font-bold text-2xl ml-3"></span>
                    </Link>
                </div>
                <div className="space-x-2">
                    <Button asChild variant="ghost">
                        <Link href="/cart">
                            <ShoppingCart/> Cart
                        </Link>
                    </Button>
                    <Button asChild variant="ghost">
                        <Link href="/sign-in">
                            <UserIcon/> Sign In
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
     );
}
 
export default Header;