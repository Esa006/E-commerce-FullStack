import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

export default function OrderSuccess() {
    return (
        <div className="container mt-5 text-center">
            <div className="card shadow p-5 border-0 rounded-4">
                <FaCheckCircle size={70} className="text-success mb-3" />
                <h2 className="fw-bold">Payment Successful!</h2>
                <p className="text-muted">Your order has been placed and is currently being processed.</p>
                <Link to="/" className="btn btn-primary px-4 mt-3">Back to Shopping</Link>
            </div>
        </div>
    );
}