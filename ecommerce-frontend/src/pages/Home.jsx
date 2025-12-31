import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { products } from "../assets/assets";

const Home = () => {

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <h2>Latest Products</h2>

       <div className="row">
  {products.slice(0, 8).map((item) => (
    // Laravel-ல் ID என்பது 'id' ஆக இருக்கும், '_id' அல்ல
    <ProductCard key={item.id || item._id} product={item} />
  ))}
</div>
      </div>
    </>
  );
};

export default Home;
