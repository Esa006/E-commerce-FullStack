import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className='footer-container'>
            <div className='container'>
                <div className='row my-5 mt-5 py-5 pb-2'>

                    {/* Column 1: Brand & Description */}
                    <div className='col-md-5 mb-4'>
                        <Link to='/' className='footer-logo text-uppercase'>Forever</Link>
                        <p className='footer-desc mt-3 text-muted'>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        </p>
                    </div>

                    {/* Column 2: Company Links */}
                    <div className='col-md-3 mb-4'>
                        <h5 className='footer-title mb-3'>COMPANY</h5>
                        <ul className='list-unstyled footer-links'>
                            <li><Link to='/'>Home</Link></li>
                            <li><Link to='/about'>About us</Link></li>
                            <li><Link to='/track-order'>Track Order</Link></li>
                            <li><Link to='/delivery'>Delivery</Link></li>
                            <li><Link to='/privacy'>Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Get In Touch */}
                    <div className='col-md-4 mb-4'>
                        <h5 className='footer-title mb-3'>GET IN TOUCH</h5>
                        <ul className='list-unstyled footer-contact'>
                            <li className="mb-2">+1-212-456-7890</li>
                            <li className="mb-2">contact@foreveryou.com</li>
                            <li className="d-flex gap-3 mt-3">
                                <i className="bi bi-instagram fs-5"></i>
                                <i className="bi bi-twitter-x fs-5"></i>
                                <i className="bi bi-facebook fs-5"></i>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright Bar */}
                <div className='footer-bottom py-3'>
                    <hr />
                    <p className='text-center mb-0 mt-3 small text-muted'>
                        Copyright 2024 @ forever.com - All Right Reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Footer;
