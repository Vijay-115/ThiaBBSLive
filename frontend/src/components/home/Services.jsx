import React from 'react'

function Services() {
  return (
    <>
        <div className="flex flex-wrap justify-between relative items-center">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full mb-[-24px]">
                <div className="w-full " data-aos="flip-up" data-aos-duration="1000" data-aos-delay="200">
                    <div className="bb-services-box p-[30px] border-[1px] border-solid border-[#eee] rounded-[20px] text-center">
                        <div className="services-img mb-[20px] flex justify-center">
                            <img src="/img/services/1.png" alt="services-1" className="w-[50px]"/>
                        </div>
                        <div className="services-contact">
                            <h4 className="font-quicksand mb-[8px] text-[18px] font-bold text-secondary leading-[1.2] tracking-[0.03rem]">Free Shipping</h4>
                            <p className="font-Poppins font-light text-[14px] leading-[20px] text-secondary tracking-[0.03rem]">Free shipping on all Us order or above $200</p>
                        </div>
                    </div>
                </div>
                <div className="w-full " data-aos="flip-up" data-aos-duration="1000" data-aos-delay="400">
                    <div className="bb-services-box p-[30px] border-[1px] border-solid border-[#eee] rounded-[20px] text-center">
                        <div className="services-img mb-[20px] flex justify-center">
                            <img src="/img/services/2.png" alt="services-2" className="w-[50px]"/>
                        </div>
                        <div className="services-contact">
                            <h4 className="font-quicksand mb-[8px] text-[18px] font-bold text-secondary leading-[1.2] tracking-[0.03rem]">24x7 Support</h4>
                            <p className="font-Poppins font-light text-[14px] leading-[20px] text-secondary tracking-[0.03rem]">Contact us 24 hours a day, 7 days a week</p>
                        </div>
                    </div>
                </div>
                <div className="w-full " data-aos="flip-up" data-aos-duration="1000" data-aos-delay="600">
                    <div className="bb-services-box p-[30px] border-[1px] border-solid border-[#eee] rounded-[20px] text-center">
                        <div className="services-img mb-[20px] flex justify-center">
                            <img src="/img/services/3.png" alt="services-3" className="w-[50px]"/>
                        </div>
                        <div className="services-contact">
                            <h4 className="font-quicksand mb-[8px] text-[18px] font-bold text-secondary leading-[1.2] tracking-[0.03rem]">30 Days Return</h4>
                            <p className="font-Poppins font-light text-[14px] leading-[20px] text-secondary tracking-[0.03rem]">Simply return it within 30 days for an exchange</p>
                        </div>
                    </div>
                </div>
                <div className="w-full " data-aos="flip-up" data-aos-duration="1000" data-aos-delay="800">
                    <div className="bb-services-box p-[30px] border-[1px] border-solid border-[#eee] rounded-[20px] text-center">
                        <div className="services-img mb-[20px] flex justify-center">
                            <img src="/img/services/4.png" alt="services-4" className="w-[50px]"/>
                        </div>
                        <div className="services-contact">
                            <h4 className="font-quicksand mb-[8px] text-[18px] font-bold text-secondary leading-[1.2] tracking-[0.03rem]">Payment Secure</h4>
                            <p className="font-Poppins font-light text-[14px] leading-[20px] text-secondary tracking-[0.03rem]">Contact us 24 hours a day, 7 days a week</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Services