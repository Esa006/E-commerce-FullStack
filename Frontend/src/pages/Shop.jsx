import apiClient from "../api/apiClient";
import axios from "axios";
import { parseImages, getImageUrl } from "../utils/imageUtils";
import Swal from "sweetalert2";

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const fetchProducts = async () => {
            try {
                const response = await apiClient.get("/products", {
                    signal: controller.signal
                });
                const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
                setProducts(data);
            } catch (error) {
                if (axios.isCancel(error)) return;
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error fetching products. Please try again later.',
                });
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
        return () => controller.abort();
    }, []);

    if (loading) return <div className="text-center mt-5"><p>Loading Shop...</p></div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4 fw-bold">Our Collection</h2>
            <div className="row">
                {products.map((product) => {
                    const images = parseImages(product.image);
                    const displayImage = images.length > 0 ? getImageUrl(images[0]) : "https://via.placeholder.com/300?text=No+Image";

                    return (
                        <div key={product.id} className="col-md-3 mb-4">
                            <div className="card h-100 shadow-sm border-0">
                                <Link to={`/product/${product.id}`} className="text-decoration-none">
                                    <img
                                        src={displayImage}
                                        className="card-img-top p-3 shop-card-img object-fit-contain"
                                        alt={product.name}
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Image+Error"; }}
                                    />
                                    <div className="card-body text-center">
                                        <h6 className="text-dark fw-bold mb-1">{product.name}</h6>
                                        <p className="text-primary mb-0">₹{product.price}</p>
                                    </div>
                                </Link>
                                <div className="card-footer bg-white border-0 pb-3">
                                    <Link
                                        to={`/product/${product.id}`}
                                        className="btn btn-outline-dark w-100 btn-sm"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Shop;