import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import { getAllCategories, getAllProducts } from "@/lib/actions/product.actions";
import Link from "next/link";


const prices = [
  {
    name: '$1 to $50',
    value: '1-50'
  },
  {
    name: '$51 to $100',
    value: '51-100'
  },
  {
    name: '$101 to $200',
    value: '101-200'
  },
  {
    name: '$201 to $500',
    value: '201-500'
  },
  {
    name: '$501 to $1000',
    value: '501-1000'
  }
]

const ratings = [4,3,2,1]
const sortOrders = ['newest', 'lowest','highest', 'rating']

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

  // Construct the filter URL
  const getFilterUrl = ({
    c,
    p,
    s,
    r,
    pg
  }: {
    c?: string
    p?: string
    s?: string
    r?: string
    pg?: string
  }) => {
    const params = {q, category, price, sort, rating, page};

    if(c) params.category = c;
    if(p) params.price = p;
    if(s) params.sort = s;
    if(r) params.rating = r;
    if(pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`
  };

  const products = await getAllProducts({
    query: queryParam,
    category: categoryParam,
    price: priceParam,
    rating: ratingParam,
    sort,
    page: pageNumber,
  });

  const categories = await getAllCategories()

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/* Category Links */}
        <div className="text-2xl mb-2 mt-3">Category</div>
        <div>
          <ul className="space-y-1">
          <li>
            <Link className={`${(category === 'all' || category === '') && 'font-bold'}`}
            href={getFilterUrl({c: 'all'})}
            >
              Any
            </Link>
          </li>
          {categories.map((x) => (
            <li key={x.category}>
              <Link className={`${category === x.category && 'font-bold'}`} href={getFilterUrl({c:x.category})}>
                {x.category}
              </Link>
            </li>
          ))}
        </ul>
        </div>
        {/* Price Links */}
        <div className="text-2xl mb-2 mt-3">Price</div>
        <div>
          <ul className="space-y-1">
          <li>
            <Link className={`${price === 'all' && 'font-bold'}`}
            href={getFilterUrl({p: 'all'})}
            >
              Any
            </Link>
          </li>
          {prices.map((p) => (
            <li key={p.value}>
              <Link className={`${price === p.value && 'font-bold'}`} href={getFilterUrl({p:p.value})}>
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
        </div>
        {/* Ratings */}
        <div className="text-2xl mb-2 mt-3">Customer Ratings</div>
        <div>
          <ul className="space-y-1">
          <li>
            <Link className={`${rating === 'all' && 'font-bold'}`}
            href={getFilterUrl({r: 'all'})}
            >
              Any
            </Link>
          </li>
          {ratings.map((r) => (
            <li key={r}>
              <Link className={`${rating === r.toString() && 'font-bold'}`} href={getFilterUrl({r:`${r}`})}>
                {`${r} Stars & Up`}
              </Link>
            </li>
          ))}
        </ul>
        </div>
      </div>
      <div className="md:col-span-4 md:space-y-4">
        <div className="flex justify-between flex-col my-4 md:flex-row">
          <div className="flex items-center">
            {q !== "all" && q !== '' && 'Query:' + q }
            {category !== "all" && category !== '' && 'Category:' + category }
            {price !== "all" && price !== '' && ' Price:' + price }
            {rating !== "all" && rating !== '' && ' Rating:' + rating + 'stars & up' }
            &nbsp;
            {(q !== 'all' && q !== '') || 
             (category !== 'all' && category !== '') || 
             rating !== 'all' ||
             price !== 'all' ? (
             <Button variant={'link'} asChild>
              <Link href="/search"> Clear</Link>
             </Button>
             ): null
            }
          </div>
          <div>
            {/* sort */}
            Sort by {' '}
            {sortOrders.map((s) => (
              <Link key={s} className={`mx-2 ${sort == s && 'font-bold'}`} href={getFilterUrl({s})}>
                {s}
              </Link>
            ))}
          </div>
        </div>
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