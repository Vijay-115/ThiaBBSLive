import React from 'react';
import { Link } from 'react-router-dom';

function FooterTop() {
  return (
    <>
        <div className="footer-top py-[50px] max-[1199px]:py-[35px]">
                <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                    <div className="flex flex-wrap w-full max-[991px]:mb-[-30px]" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                        <div className="min-[992px]:w-[25%] max-[991px]:w-full w-full px-[12px] bb-footer-toggle bb-footer-cat">
                            <div className="bb-footer-widget bb-footer-company flex flex-col max-[991px]:mb-[24px]">
                                <img src="/img/logo/thaiworldLogo.png" className="bb-footer-logo max-w-[144px] mb-[10px] max-[767px]:max-w-[100px]" alt="footer logo" />
                                <p className="bb-footer-detail max-w-[400px] mb-[30px] p-[0] font-Poppins text-[14px] leading-[27px] font-normal text-[#686e7d] inline-block relative max-[1399px]:text-[15px] max-[1199px]:text-[14px]">BSS Cart is the biggest market of grocery products. Get
                                    your daily needs from our store.</p>
                                <div className="bb-app-store m-[-7px] flex flex-wrap">
                                    <Link to="/" className="app-img">
                                        <img src="/img/app/android.png" className="adroid max-w-[140px] m-[7px] rounded-[5px] max-[1399px]:max-w-[120px]" alt="apple"/>
                                    </Link>
                                    <Link to="/" className="app-img">
                                        <img src="/img/app/apple.png" className="apple max-w-[140px] m-[7px] rounded-[5px] max-[1399px]:max-w-[120px]" alt="apple"/>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="min-[992px]:w-[16.66%] max-[991px]:w-full w-full px-[12px] bb-footer-toggle bb-footer-info">
                            <div className="bb-footer-widget">
                                <h4 className="bb-footer-heading font-quicksand leading-[1.2] text-[18px] font-bold mb-[20px] text-[#3d4750] tracking-[0] relative block w-full pb-[15px] capitalize border-b-[1px] border-solid border-[#eee] max-[991px]:text-[14px]">Category</h4>
                                <div className="bb-footer-links bb-footer-dropdown  max-[991px]:mb-[35px]">
                                    <ul className="align-items-center">
                                        <li className="bb-footer-link leading-[1.5] flex items-center mb-[16px] max-[991px]:mb-[15px]">
                                            <Link to="/product/category/groceries" className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#686e7d] hover:text-[#6c7fd8] mb-[0] inline-block break-all tracking-[0] font-normal">Groceries</Link>
                                        </li>
                                        <li className="bb-footer-link leading-[1.5] flex items-center mb-[16px] max-[991px]:mb-[15px]">
                                            <Link to="/product/category/womens-jewellery" className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#686e7d] hover:text-[#6c7fd8] mb-[0] inline-block break-all tracking-[0] font-normal">Jewellery</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="min-[992px]:w-[16.66%] max-[991px]:w-full w-full px-[12px] bb-footer-toggle bb-footer-account">
                            <div className="bb-footer-widget">
                                <h4 className="bb-footer-heading font-quicksand leading-[1.2] text-[18px] font-bold mb-[20px] text-[#3d4750] tracking-[0] relative block w-full pb-[15px] capitalize border-b-[1px] border-solid border-[#eee] max-[991px]:text-[14px]">Company</h4>
                                <div className="bb-footer-links bb-footer-dropdown  max-[991px]:mb-[35px]">
                                    <ul className="align-items-center">
                                        <li className="bb-footer-link leading-[1.5] flex items-center mb-[16px] max-[991px]:mb-[15px]">
                                            <Link to="/" className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#686e7d] hover:text-[#6c7fd8] mb-[0] inline-block break-all tracking-[0] font-normal">About us</Link>
                                        </li>
                                        <li className="bb-footer-link leading-[1.5] flex items-center mb-[16px] max-[991px]:mb-[15px]">
                                            <Link to="/" className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#686e7d] hover:text-[#6c7fd8] mb-[0] inline-block break-all tracking-[0] font-normal">Contact Us</Link>
                                        </li>
                                        <li className="bb-footer-link leading-[1.5] flex items-center mb-[16px] max-[991px]:mb-[15px]">
                                            <Link to="/" className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#686e7d] hover:text-[#6c7fd8] mb-[0] inline-block break-all tracking-[0] font-normal">FAQ</Link>
                                        </li>
                                        <li className="bb-footer-link leading-[1.5] flex items-center mb-[16px] max-[991px]:mb-[15px]">
                                            <Link to="/" className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#686e7d] hover:text-[#6c7fd8] mb-[0] inline-block break-all tracking-[0] font-normal">Delivery</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="min-[992px]:w-[16.66%] max-[991px]:w-full w-full px-[12px] bb-footer-toggle bb-footer-service">
                            <div className="bb-footer-widget">
                                <h4 className="bb-footer-heading font-quicksand leading-[1.2] text-[18px] font-bold mb-[20px] text-[#3d4750] tracking-[0] relative block w-full pb-[15px] capitalize border-b-[1px] border-solid border-[#eee] max-[991px]:text-[14px]">Account</h4>
                                <div className="bb-footer-links bb-footer-dropdown  max-[991px]:mb-[35px]">
                                    <ul className="align-items-center">
                                        <li className="bb-footer-link leading-[1.5] flex items-center mb-[16px] max-[991px]:mb-[15px]">
                                            <Link to="/" className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#686e7d] hover:text-[#6c7fd8] mb-[0] inline-block break-all tracking-[0] font-normal">Sign In</Link>
                                        </li>
                                        <li className="bb-footer-link leading-[1.5] flex items-center mb-[16px] max-[991px]:mb-[15px]">
                                            <Link to="/" className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#686e7d] hover:text-[#6c7fd8] mb-[0] inline-block break-all tracking-[0] font-normal">View Cart</Link>
                                        </li>
                                        <li className="bb-footer-link leading-[1.5] flex items-center mb-[16px] max-[991px]:mb-[15px]">
                                            <Link to="/" className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#686e7d] hover:text-[#6c7fd8] mb-[0] inline-block break-all tracking-[0] font-normal">Return Policy</Link>
                                        </li>
                                        <li className="bb-footer-link leading-[1.5] flex items-center mb-[16px] max-[991px]:mb-[15px]">
                                            <Link to="/" className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#686e7d] hover:text-[#6c7fd8] mb-[0] inline-block break-all tracking-[0] font-normal">Become a Vendor</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="min-[992px]:w-[25%] max-[991px]:w-full w-full px-[12px] bb-footer-toggle bb-footer-cont-social">
                            <div className="bb-footer-contact mb-[30px]">
                                <div className="bb-footer-widget">
                                    <h4 className="bb-footer-heading font-quicksand leading-[1.2] text-[18px] font-bold mb-[20px] text-[#3d4750] tracking-[0] relative block w-full pb-[15px] capitalize border-b-[1px] border-solid border-[#eee] max-[991px]:text-[14px]">Contact</h4>
                                    <div className="bb-footer-links bb-footer-dropdown  max-[991px]:mb-[35px]">
                                        <ul className="align-items-center">
                                            <li className="bb-footer-link bb-foo-location flex items-start max-[991px]:mb-[15px] mb-[16px]">
                                                <span className="mt-[5px] w-[25px] basis-[auto] grow-[0] shrink-[0]">
                                                    <i className="ri-map-pin-line leading-[0] text-[18px] text-[#6c7fd8]"></i>
                                                </span>
                                                <p className="m-[0] font-Poppins text-[14px] text-[#686e7d] font-normal leading-[28px] tracking-[0.03rem]">No: 20, 100 Feet Road, Ellaipillaichavady, Puducherry, 605005, India</p>
                                            </li>
                                            <li className="bb-footer-link bb-foo-call flex items-start max-[991px]:mb-[15px] mb-[16px]">
                                                <span className="w-[25px] basis-[auto] grow-[0] shrink-[0]">
                                                    <i className="ri-whatsapp-line leading-[0] text-[18px] text-[#6c7fd8]"></i>
                                                </span>
                                                <Link to="tel:+009876543210" className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#686e7d] inline-block relative break-all tracking-[0] font-normal max-[1399px]:text-[15px] max-[1199px]:text-[14px]">+91 9600729596</Link>
                                            </li>
                                            <li className="bb-footer-link bb-foo-mail flex">
                                                <span className="w-[25px] basis-[auto] grow-[0] shrink-[0]">
                                                    <i className="ri-mail-line leading-[0] text-[18px] text-[#6c7fd8]"></i>
                                                </span>
                                                <Link to="mailto:example@email.com" className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#686e7d] inline-block relative break-all tracking-[0] font-normal max-[1399px]:text-[15px] max-[1199px]:text-[14px]">info@bbscart.com</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="bb-footer-social">
                                <div className="bb-footer-widget">
                                    <div className="bb-footer-links bb-footer-dropdown  max-[991px]:mb-[35px]">
                                        <ul className="align-items-center flex flex-wrap items-center">
                                            <li className="bb-footer-link leading-[1.5] flex items-center pr-[5px]">
                                                <Link to="/" className="transition-all duration-[0.3s] ease-in-out w-[30px] h-[30px] rounded-[5px] bg-[#3d4750] hover:bg-[#6c7fd8] capitalize flex items-center justify-center text-[15px] leading-[20px] text-[#686e7d] relative break-all font-normal"><i className="ri-facebook-fill text-[16px] text-[#fff]"></i></Link>
                                            </li>
                                            <li className="bb-footer-link leading-[1.5] flex items-center pr-[5px]">
                                                <Link to="/" className="transition-all duration-[0.3s] ease-in-out w-[30px] h-[30px] rounded-[5px] bg-[#3d4750] hover:bg-[#6c7fd8] capitalize flex items-center justify-center text-[15px] leading-[20px] text-[#686e7d] relative break-all font-normal"><i className="ri-twitter-fill text-[16px] text-[#fff]"></i></Link>
                                            </li>
                                            <li className="bb-footer-link leading-[1.5] flex items-center pr-[5px]">
                                                <Link to="/" className="transition-all duration-[0.3s] ease-in-out w-[30px] h-[30px] rounded-[5px] bg-[#3d4750] hover:bg-[#6c7fd8] capitalize flex items-center justify-center text-[15px] leading-[20px] text-[#686e7d] relative break-all font-normal"><i className="ri-linkedin-fill text-[16px] text-[#fff]"></i></Link>
                                            </li>
                                            <li className="bb-footer-link leading-[1.5] flex items-center pr-[5px]">
                                                <Link to="/" className="transition-all duration-[0.3s] ease-in-out w-[30px] h-[30px] rounded-[5px] bg-[#3d4750] hover:bg-[#6c7fd8] capitalize flex items-center justify-center text-[15px] leading-[20px] text-[#686e7d] relative break-all font-normal"><i className="ri-instagram-line text-[16px] text-[#fff]"></i></Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        <div className="footer-bottom py-[10px] border-t-[1px] border-solid border-[#eee] max-[991px]:py-[15px]">
            <div className="flex flex-wrap justify-between relative items-center mx-auto">
                <div className="flex flex-wrap w-full">
                    <div className="bb-bottom-info w-full flex flex-row items-center justify-between max-[991px]:flex-col px-[12px]">
                        <div className="footer-copy w-full mb-[15px]">
                            <div className="footer-bottom-copy text-center">
                                <div className="bb-copy text-[#686e7d] text-[13px] tracking-[1px] text-center font-normal leading-[2]">Copyright © <span className="text-[#686e7d] text-[13px] tracking-[1px] text-center font-normal" id="copyright_year"></span>
                                    <Link className="site-name transition-all duration-[0.3s] ease-in-out font-medium text-[#6c7fd8] hover:text-[#3d4750] font-Poppins text-[15px] leading-[28px] tracking-[0.03rem]" to="/">BSS Cart</Link> all rights reserved.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default FooterTop