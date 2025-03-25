import ProductList from '@/components/shared/product/product-list'
import { getLatestProducts } from '@/lib/actions/product.actions';
// import sampleData from '@/db/sample-data'

const HomePage = async () => {
  const latestProducts = await getLatestProducts()
  const formattedProducts = latestProducts.map(product => ({ ...product, price: product.price.toString(), rating: product.rating.toString() }))
  
  return ( <>
    <ProductList data={formattedProducts} title="Newest Arrivals" limit={4} />
  </> );
}
 
export default HomePage;