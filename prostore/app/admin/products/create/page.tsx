import { Metadata } from "next";
import ProductForm from "@/components/admin/product-form";


export const metadata: Metadata = {
    title: "Create Product",
    description: "Create Product Page"
}

const CreateProductPage = () => {
    return ( <>
        <h2 className="font">Create Product</h2>
        <div className="my-8">
            <ProductForm type="Create" />
        </div>
    </> );
}
 
export default CreateProductPage;