import React from "react";
import BackButton from "../components/BackButton";

const CancellationPolicy = () => {
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <BackButton to="/" />

                    <h1 className="fw-bold mb-4 text-center">Cancellation Policy</h1>
                    <p className="text-muted text-center mb-5">Last updated: January 2026</p>

                    <div className="vstack gap-5">
                        {/* Section 1 */}
                        <section>
                            <h4 className="fw-bold mb-3">1. Cancellation by Customer</h4>
                            <p className="text-secondary lh-lg mb-3">
                                You can cancel your order at any time before it has been processed or shipped by us. To cancel an order,
                                please go to the <strong>'My Orders'</strong> section, select the order, and click on <strong>'Cancel'</strong>.
                                If the order has already been shipped, we will not be able to cancel it. In such cases, you may refuse to
                                accept the delivery, and a refund will be processed once the item is returned to us.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section>
                            <h4 className="fw-bold mb-3">2. Cancellation by Forever</h4>
                            <p className="text-secondary lh-lg mb-3">
                                Please note that there may be certain orders that we are unable to accept and must cancel. We reserve the right,
                                at our sole discretion, to refuse or cancel any order for any reason. Some situations that may result in your
                                order being canceled include:
                            </p>
                            <ul className="text-secondary lh-lg">
                                <li>Limitations on quantities available for purchase.</li>
                                <li>Inaccuracies or errors in product or pricing information.</li>
                                <li>Issues identified by our credit and fraud avoidance department.</li>
                                <li>Address is incomplete or unserviceable.</li>
                            </ul>
                            <p className="text-secondary lh-lg">
                                We will contact you if all or any portion of your order is canceled or if additional information is required to accept your order.
                            </p>
                        </section>

                        {/* Section 3 */}
                        <section>
                            <h4 className="fw-bold mb-3">3. Refunds for Cancelled Orders</h4>
                            <p className="text-secondary lh-lg">
                                If your order is canceled after your credit card/bank account has been charged, the said amount will be reversed
                                back in your Card/Bank Account. The refund process generally takes 5-7 business days, depending on your bank's policy.
                            </p>
                        </section>

                        {/* Section 4 */}
                        <section>
                            <h4 className="fw-bold mb-3">4. Modification of Order</h4>
                            <p className="text-secondary lh-lg">
                                Once an order has been placed, we cannot modify the items, size, or quantity. You will need to cancel the existing
                                order (if not shipped within the cancellation window) and place a new order with the desired changes.
                            </p>
                        </section>
                    </div>

                    <div className="mt-5 p-4 bg-light rounded text-center">
                        <h5 className="fw-bold mb-2">Have more questions?</h5>
                        <p className="text-muted mb-3">We are here to help!</p>
                        <a href="/contact" className="btn btn-outline-dark px-4 py-2">Contact Support</a>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CancellationPolicy;
