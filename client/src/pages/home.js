import { Link } from "react-router-dom";
import ProductCard from "../Components/product-card";
import { useLatestProductsQuery } from "../redux/api/product-api";

const Home = () => {
  const { data, isLoading, isError, error } = useLatestProductsQuery();

  const latestProducts = data?.latestProducts;

  return (
    <div className="px-16 py-24">
      <section>
        <img
          className="h-60  object-cover w-full rounded-sm"
          src="https://images.pexels.com/photos/1787220/pexels-photo-1787220.jpeg"
          alt="background"
        ></img>
      </section>
      <main className="mt-4">
        <div className="flex justify-between">
          <h1 className="font-semibold text-xl mb-2">Latest Products</h1>
          <Link to="/search" className="text-gray-600 uppercase text-xl">
            m o r e
          </Link>
        </div>

        <div className="flex flex-wrap gap-4 justify-center items-center">
          {isLoading ? (
            <h1>Loading</h1>
          ) : isError ? (
            <h1>Failed to Fetch Products . Please Try Again</h1>
          ) : (
            latestProducts &&
            latestProducts.map((p) => {
              return (
                <ProductCard
                  key={p._id}
                  name={p.name}
                  price={p.price}
                  photo={p.photo}
                  productId={p._id}
                  stock={p.stock}
                ></ProductCard>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;

// https://images.pexels.com/photos/11953865/pexels-photo-11953865.jpeg
// https://images.pexels.com/photos/1787220/pexels-photo-1787220.jpeg
