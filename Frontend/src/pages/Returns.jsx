import React from 'react';
import Navbar from '../components/Navbar';

const Returns = () => {
    return (
        <>
            <Navbar />
            <div className="container py-5">
                <div className="text-center mb-5">
                    <h2 className="section-title">Returns & Refund Policy</h2>
                </div>
                
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="mb-5">
                            <h4 className="fw-bold mb-3">Return Policy</h4>
                            <p className="text-muted lh-lg">
                                We want you to love what you ordered! If you are not completely satisfied, we accept returns for all full-priced items within 30 days of delivery. 
                                Items must be unworn, unwashed, and with all original tags attached.
                            </p>
                            <ul className="text-muted lh-lg">
                                <li><strong>Exchange:</strong> We offer free exchanges for size or color.</li>
                                <li><strong>Refund:</strong> Refunds are processed to the original payment method within 5-7 business days after we receive your return.</li>
                            </ul>
                        </div>

                        <div className="mb-5">
                            <h4 className="fw-bold mb-3">How to Return</h4>
                            <p className="text-muted lh-lg">
                                1. Log in to your account and go to "My Orders".<br/>
                                2. Select the order you wish to return.<br/>
                                3. Click "Request Return" and follow the instructions.<br/>
                                4. Pack the item securely and drop it off at the nearest shipping center.
                            </p>
                        </div>

                        <div className="mb-5">
                            <h4 className="fw-bold mb-3">Cancellation Policy</h4>
                            <p className="text-muted lh-lg">
                                You can cancel your order within 24 hours of purchase or before it has been shipped. 
                                To cancel, please contact our support team immediately at <a href="mailto:support@forever.com" className="text-dark fw-bold text-decoration-underline">support@forever.com</a>.
                            </p>
                        </div>

                        <div className="bg-light p-4 rounded text-center">
                            <p className="mb-0 fw-bold">Still have questions?</p>
                            <a href="/contact" className="btn btn-dark mt-3">Contact Support</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Returns;
