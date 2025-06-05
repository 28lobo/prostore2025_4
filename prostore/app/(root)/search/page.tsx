import ProductCard from "@/components/shared/product/product-card";
import { getAllProducts } from "@/lib/actions/product.actions";

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await props.searchParams;

  // Convert any “all” string into undefined so that getAllProducts
  // will not filter by that field:
  const queryParam = q !== "all" ? q : undefined;
  const categoryParam = category !== "all" ? category : undefined;
  const priceParam = price !== "all" ? price : undefined;
  const ratingParam = rating !== "all" ? rating : undefined;

  // sort: you probably always want to pass something here, so leave it as-is.
  // page: just parse to number
  const pageNumber = Number(page) || 1;

  const products = await getAllProducts({
    query: queryParam,
    category: categoryParam,
    price: priceParam,
    rating: ratingParam,
    sort,
    page: pageNumber,
  });

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/* filters */}
      </div>
      <div className="md:col-span-4 md:space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && <div>No products found</div>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;