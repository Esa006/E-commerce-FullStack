import { products } from "../assets/assets";

const AdminProducts = () => {


  
  return (
    <>
      <h3>Products</h3>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
          </tr>
        </thead>

       <tbody>
  {products && products.length > 0 ? (
    products.map((product, index) => (
      // ஒருவேளை id இல்லையென்றால் index-ஐப் பயன்படுத்தும் பாதுகாப்பான முறை
     <tr key={`${product.id || index}-${index}`}> 
          <td>{product.name}</td>
          {/* விலை தெரியவில்லை என்றால், தரவு 'price' அல்லது 'price_data' என உள்ளதா என பார்க்கவும் */}
          <td>{product.price ? `₹${product.price}` : 'N/A'}</td>
          <td>{product.category}</td>
        </tr>
    ))
  ) : (
    <tr><td colSpan="3" className="text-center">No Products Found</td></tr>
  )}
</tbody>
      </table>
    </>
  );
};

export default AdminProducts;
