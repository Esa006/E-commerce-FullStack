import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { products } from "../assets/assets";

function Products() {
  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <h2 className="mb-4">All Products</h2>

        <div className="row">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Products;
