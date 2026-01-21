import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (

        <footer className='bg-dark text-white pt-5 pb-4 mt-auto'>
            <div className='container'>
                <div className='row'>
                    {/* Column 1: Corporate / About */}
                    <div className='col-lg-3 col-md-6 mb-4'>
                        <h6 className='text-uppercase fw-bold mb-3 small' style={{ letterSpacing: '0.25em' }}>Forever</h6>
                        <ul className='list-unstyled small'>
                            <li className='mb-2'><Link to='/about' className='text-decoration-none text-white-50 hover-text-white'>Who We Are</Link></li>
                            <li className='mb-2'><Link to='/contact' className='text-decoration-none text-white-50 hover-text-white'>Join Our Team</Link></li>
                            <li className='mb-2'><Link to='/returns' className='text-decoration-none text-white-50 hover-text-white'>Terms & Conditions</Link></li>
                            <li className='mb-2'><Link to='/returns' className='text-decoration-none text-white-50 hover-text-white'>Fees & Payments</Link></li>
                            <li className='mb-2'><Link to='/returns' className='text-decoration-none text-white-50 hover-text-white'>Returns & Refunds Policy</Link></li>
                        </ul>
                    </div>

                    {/* Column 2: Help */}
                    <div className='col-lg-3 col-md-6 mb-4'>
                        <h6 className='text-uppercase fw-bold mb-3 small' style={{ letterSpacing: '0.25em' }}>Help</h6>
                        <ul className='list-unstyled small'>
                            <li className='mb-2'><Link to='/track-order' className='text-decoration-none text-white-50 hover-text-white'>Track Your Order</Link></li>
                            <li className='mb-2'><Link to='/faq' className='text-decoration-none text-white-50 hover-text-white'>Frequently Asked Questions</Link></li>
                            <li className='mb-2'><Link to='/returns' className='text-decoration-none text-white-50 hover-text-white'>Returns</Link></li>
                            <li className='mb-2'><Link to='/cancellations' className='text-decoration-none text-white-50 hover-text-white'>Cancellations</Link></li>
                            <li className='mb-2'><Link to='/contact' className='text-decoration-none text-white-50 hover-text-white'>Customer Care</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Shop By */}
                    <div className='col-lg-3 col-md-6 mb-4'>
                        <h6 className='text-uppercase fw-bold mb-3 small' style={{ letterSpacing: '0.25em' }}>Shop By</h6>
                        <ul className='list-unstyled small'>
                            <li className='mb-2'><Link to='/products' className='text-decoration-none text-white-50 hover-text-white'>New Arrivals</Link></li>
                            <li className='mb-2'><Link to='/products?category=Men' className='text-decoration-none text-white-50 hover-text-white'>Men</Link></li>
                            <li className='mb-2'><Link to='/products?category=Women' className='text-decoration-none text-white-50 hover-text-white'>Women</Link></li>
                            <li className='mb-2'><Link to='/products?category=Kids' className='text-decoration-none text-white-50 hover-text-white'>Kids</Link></li>
                            <li className='mb-2'><Link to='/products?category=Home' className='text-decoration-none text-white-50 hover-text-white'>Home </Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Follow Us */}
                    <div className='col-lg-3 col-md-6 mb-4'>
                        <h6 className='text-uppercase fw-bold mb-3 small' style={{ letterSpacing: '0.25em' }}>Contact Us</h6>
                        <ul className='list-unstyled small mb-4'>
                            <li className='mb-2 text-white-50'>+91 9858547546</li>
                            <li className='mb-2 text-white-50'>support@forever.com</li>
                        </ul>

                        <h6 className='text-uppercase fw-bold mb-3 small' style={{ letterSpacing: '0.25em' }}>Follow Us</h6>
                        <div className='d-flex gap-3'>
                            <a href='#' className='text-white fs-5 opacity-75 hover-opacity-100'><i className='bi bi-facebook'></i></a>
                            <a href='#' className='text-white fs-5 opacity-75 hover-opacity-100'><i className='bi bi-instagram'></i></a>
                            <a href='#' className='text-white fs-5 opacity-75 hover-opacity-100'><i className='bi bi-twitter-x'></i></a>
                            <a href='#' className='text-white fs-5 opacity-75 hover-opacity-100'><i className='bi bi-pinterest'></i></a>
                        </div>
                    </div>
                </div>

                <hr className='border-secondary my-4' />

                {/* Bottom Bar: Payments & Copyright */}
                <div className='d-flex flex-column flex-md-row justify-content-between align-items-center small text-white-50'>
                    <div className='d-flex align-items-center gap-3 mb-2 mb-md-0'>
                        <span>Payment Methods:</span>
                        <div className='d-flex gap-2 fs-5 text-white'>
                            <i className="bi bi-credit-card"></i>
                            <i className="bi bi-wallet2"></i>
                            <i className="bi bi-paypal"></i>
                            <i className="bi bi-bank"></i>
                        </div>
                    </div>
                    <div className='text-center text-md-end'>
                        Copyright © 2026 Forever. All Rights Reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
