'use client';
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";


const AdminSearch = () => {
    const pathname = usePathname()
    // create a formActionUrl based on the current pathname to use in the search form
    const formActionUrl = pathname.includes('/admin/orders') 
    ? '/admin/orders' 
    : pathname.includes('/admin/user') ?
    '/admin/user' : '/admin/products'

    const searchParams = useSearchParams();
    const [queryValue, setQueryValue] = useState(searchParams.get('query') || ''); 
    
    useEffect(() => {
        setQueryValue(searchParams.get('query') || '');
    }, [searchParams]);
    return ( <form action={formActionUrl} method="GET">
        <Input 
            type="search"
            name="query"
            placeholder="Search..."
            value={queryValue}
            onChange={(e) => setQueryValue(e.target.value)}
            className="md:w-[100px] lg:w-[300px]"
        />
        <button className="sr-only" type="submit">
            Search
        </button>
    </form> );
}
 
export default AdminSearch;