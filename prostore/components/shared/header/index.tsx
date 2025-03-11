
import Image from 'next/image'
import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'
import Menu from './menu'


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
                <Menu />
            </div>
        </header>
     );
}
 
export default Header;