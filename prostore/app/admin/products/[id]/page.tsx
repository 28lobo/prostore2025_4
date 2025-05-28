import ProductForm from '@/components/admin/product-form';
import { getProductById } from '@/lib/actions/product.actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
    title:  'Update Product',
    description: 'Update product details in the admin panel',
}

const AdminProductUpdatePage = async(props: {
    params: Promise<{ id: string }>;
}) => {
    // 1. Extract the `id` from the URL params
    const { id } = await props.params;
    // 2. Fetch the product data on the server using the `id`
    const product = await getProductById(id)
    
    if(!product) return notFound();
    // 3. Render the product update form with the fetched data
    return ( <div className="space-y-8 max-w-5xl mx-auto">
        <h1 className="font-bold">Update Product</h1>
        <ProductForm type='Update' product={product} productId={product.id} />
    </div> );
}
 
export default AdminProductUpdatePage;