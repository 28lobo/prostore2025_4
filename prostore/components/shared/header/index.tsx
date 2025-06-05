
import Image from 'next/image'
import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'
import Menu from './menu'
import CategoryDrawer from './category-drawer'
import Search from './search'


const Header = () => {
    return ( 
        <header className="w-full border-b ">
            <div className="flex justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                
                <div className="flex flex-start justify-between items-center">
                    <CategoryDrawer/>
                    <Link href="/" className="flex flex-start items-center ml-4">
                        <Image src='/images/logo.svg' alt={`${APP_NAME}`} width={48} height={48}/>
                        <span className="hidden lg:block font-bold text-2xl ml-3">{APP_NAME}</span>
                    </Link>
                </div>
                <div className="hidden md:block">
                    <Search />
                </div>
                <Menu />
            </div>
        </header>
     );
}
 
export default Header;