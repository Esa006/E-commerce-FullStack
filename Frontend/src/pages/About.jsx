import React from 'react';



const About = () => {
  return (
    <>

      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="section-title">About Us</h2>
        </div>

        <div className="row g-5 align-items-center">
          <div className="col-md-6">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop"
              alt="About Us"
              className="img-fluid rounded shadow-sm"
            />
          </div>
          <div className="col-md-6">
            <h3 className="fw-bold mb-4">Forever - Your Go-To Fashion Destination</h3>
            <p className="text-muted lh-lg mb-4">
              Forever was born out of a passion for fashion and a desire to bring the latest trends to your doorstep without breaking the bank.
              We believe that style should be accessible, expressive, and sustainable.
            </p>
            <p className="text-muted lh-lg mb-4">
              Our collection is curated with love, ensuring quality fabrics and timeless designs that empower you to look and feel your best every day.
              From everyday essentials to statement pieces, we have something for everyone.
            </p>

            <div className="row mt-4">
              <div className="col-6 mb-3">
                <h2 className="fw-bold">10k+</h2>
                <p className="small text-muted">Happy Customers</p>
              </div>
              <div className="col-6 mb-3">
                <h2 className="fw-bold">5k+</h2>
                <p className="small text-muted">Quality Products</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-5 py-5 border-top">
          <h4 className="fw-bold text-center mb-5">Why Choose Us</h4>
          <div className="row text-center g-4">
            <div className="col-md-4">
              <div className="p-4 border rounded h-100">
                <i className="bi bi-award fs-1 mb-3 text-dark"></i>
                <h5 className="fw-bold">Quality Assurance</h5>
                <p className="text-muted small">We verify every product to ensure it meets our high standards.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 border rounded h-100">
                <i className="bi bi-truck fs-1 mb-3 text-dark"></i>
                <h5 className="fw-bold">Fast Delivery</h5>
                <p className="text-muted small">Get your orders delivered to your doorstep in record time.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 border rounded h-100">
                <i className="bi bi-headset fs-1 mb-3 text-dark"></i>
                <h5 className="fw-bold">24/7 Support</h5>
                <p className="text-muted small">Our team is always here to assist you with any queries.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
