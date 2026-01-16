import React from 'react';
import BackButton from "../components/BackButton";



const Contact = () => {
  return (
    <>

      <div className="container py-5">
        <BackButton to="/" label="Back to Home" />
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold">Customer Care</h2>
          <p className="text-muted w-75 mx-auto">
            We're here to help! Reach out to us for any queries or support.
          </p>
        </div>

        <div className="row g-5">
          {/* Contact Info */}
          <div className="col-md-6">
            <h4 className="fw-bold mb-4">Get in Touch</h4>
            <div className="d-flex mb-4">
              <i className="bi bi-geo-alt fs-4 me-3 text-secondary"></i>
              <div>
                <h6 className="fw-bold mb-1">Our Office</h6>
                <p className="text-muted mb-0">123 Fashion Street, New York, NY 10012, USA</p>
              </div>
            </div>
            <div className="d-flex mb-4">
              <i className="bi bi-envelope fs-4 me-3 text-secondary"></i>
              <div>
                <h6 className="fw-bold mb-1">Email Us</h6>
                <p className="text-muted mb-0">support@forever.com</p>
                <p className="text-muted mb-0">sales@forever.com</p>
              </div>
            </div>
            <div className="d-flex mb-4">
              <i className="bi bi-telephone fs-4 me-3 text-secondary"></i>
              <div>
                <h6 className="fw-bold mb-1">Call Us</h6>
                <p className="text-muted mb-0">+1-212-456-7890</p>
                <p className="text-muted mb-0">Mon - Fri, 9am - 6pm</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm p-4">
              <h4 className="fw-bold mb-4">Send us a Message</h4>
              <form>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">NAME</label>
                  <input type="text" className="form-control" placeholder="Your Name" />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">EMAIL</label>
                  <input type="email" className="form-control" placeholder="Your Email" />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">MESSAGE</label>
                  <textarea className="form-control" rows="4" placeholder="How can we help?"></textarea>
                </div>
                <button type="submit" className="btn btn-dark w-100 py-2">SEND MESSAGE</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
