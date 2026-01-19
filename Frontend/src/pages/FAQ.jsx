import React, { useState } from 'react';
import BackButton from "../components/BackButton";



const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-bottom py-3">
      <button
        className="d-flex justify-content-between align-items-center w-100 bg-transparent border-0 text-start p-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="fw-bold fs-6">{question}</span>
        <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </button>
      {isOpen && (
        <p className="text-muted mt-2 mb-0 small lh-lg">
          {answer}
        </p>
      )}
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      q: "How can I track my order?",
      a: "You can track your order by clicking on 'Track Order' in the footer or navigation menu and entering your order ID."
    },
    {
      q: "What is your return policy?",
      a: "We accept returns within 30 days of purchase. The item must be unused and in its original packaging. Visit our Returns page for more details."
    },
    {
      q: "Do you ship internationally?",
      a: "Yes, we ship globally! Shipping fees may vary depending on your location."
    },
    {
      q: "Can I cancel my order?",
      a: "You can cancel your order within 24 hours of placing it. After that, it may have already been processed."
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept Visa, MasterCard, PayPal, and Cash on Delivery (COD) in select locations."
    }
  ];



  return (
    <>

      <div className="container py-5 text-center">
        <div className="text-start"><BackButton to="/" label="Back to Home" /></div>
        <h2 className="section-title mb-4">Frequently Asked Questions</h2>
        <div className="row justify-content-center">
          <div className="col-lg-8 text-start">
            {faqs.map((item, index) => (
              <FAQItem key={index} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
