import ProductList from '@/components/shared/product/product-list'
import { getLatestProducts, getFeaturedProducts } from '@/lib/actions/product.actions';
// import sampleData from '@/db/sample-data'
import ProductCarousel from '@/components/shared/product/product-carousel';
import ViewAllProductsButton from '@/components/view-all-products-button';

const HomePage = async () => {
  const latestProducts = await getLatestProducts()
  const formattedProducts = latestProducts.map(product => ({ ...product, price: product.price.toString(), rating: product.rating.toString() }))
  const featuredProducts = await getFeaturedProducts()
  console.log("featuredProducts:", featuredProducts);
  
  return ( <>
    {featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}
    <ProductList data={formattedProducts} title="Newest Arrivals" limit={4} />
    <ViewAllProductsButton />
  </> );
}
 
export default HomePage;