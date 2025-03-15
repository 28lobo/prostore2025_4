import ProductCard from "./product-card";
import type { Product } from "@/types";

const Product = ({ data, title, limit}: {data: Product[]; title?: string; limit?:number}) => {
    const limitedData = limit ? data.slice(0, limit) : data
    return ( 
        <div className="my-10">
            <h2 className="font-bold">
                {title}
            </h2>
            {data.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {limitedData.map((product: Product, index: number) =>(
                        <ProductCard key={product.slug || index} product={product} />
                    ))}
                </div>
            ) : (
                <div>
                    <p> No Products Found </p>
                </div>
            )}
        </div>
     );
}
 
export default Product;