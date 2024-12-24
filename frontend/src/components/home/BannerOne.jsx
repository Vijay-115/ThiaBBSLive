import React from 'react'
import Button from '../layout/Button'

function BannerOne() {
  return (
    <>
        <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] pb-12 mt-4">
            <div className="flex flex-wrap w-full mb-[-24px]">
                <div className="min-[992px]:w-[50%] w-full px-[12px] mb-[24px]" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
                    <div className="banner-box p-[30px] rounded-[20px] relative overflow-hidden bg-box-color-one bg-[#fbf2e5]">
                        <div className="inner-banner-box relative z-[1] flex justify-between max-[480px]:flex-col">
                            <div className="side-image px-[12px] flex items-center max-[480px]:p-[0] max-[480px]:mb-[12px] max-[480px]:justify-center">
                                <img src="/img/banner-one/one.png" alt="one" className="max-w-max w-[280px] h-[280px] max-[1399px]:w-[230px] max-[1399px]:h-[230px] max-[1199px]:w-[140px] max-[1199px]:h-[140px] max-[991px]:w-[280px] max-[991px]:h-[280px] max-[767px]:h-[200px] max-[767px]:w-[200px] max-[575px]:w-full max-[575px]:h-[auto] max-[480px]:w-[calc(100%-150px)]"/>
                            </div>
                            <div className="inner-contact max-w-[250px] px-[12px] flex flex-col items-start justify-center max-[480px]:p-[0] max-[480px]:max-w-[100%] max-[480px]:text-center max-[480px]:items-center">
                                <h5 className="font-quicksand mb-[15px] text-[#3d4750] font-bold tracking-[0.03rem] text-[#3d4750] leading-[1.2] max-[480px]:mb-[2px] text-lg md:text-xl lg:text-2xl">Gold Coins & Jewellery</h5>
                                <p className="font-Poppins font-medium tracking-[0.03rem] text-[#686e7d] mb-[15px] max-[480px]:mb-[8px] text-sm md:text-md leading-2">The flavour of something special</p>
                                <Button link='/product/category/groceries' name='Shop Now'/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="min-[992px]:w-[50%] w-full px-[12px] mb-[24px]" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
                    <div className="banner-box p-[30px] rounded-[20px] relative overflow-hidden bg-box-color-two bg-[#ffe8ee]">
                        <div className="inner-banner-box relative z-[1] flex justify-between max-[480px]:flex-col">
                            <div className="side-image px-[12px] flex items-center max-[480px]:p-[0] max-[480px]:mb-[12px] max-[480px]:justify-center">
                                <img src="/img/banner-one/two.png" alt="two" className="max-w-max w-[280px] h-[280px] max-[1399px]:w-[230px] max-[1399px]:h-[230px] max-[1199px]:w-[140px] max-[1199px]:h-[140px] max-[991px]:w-[280px] max-[991px]:h-[280px] max-[767px]:h-[200px] max-[767px]:w-[200px] max-[575px]:w-full max-[575px]:h-[auto] max-[480px]:w-[calc(100%-150px)]"/>
                            </div>
                            <div className="inner-contact max-w-[250px] px-[12px] flex flex-col items-start justify-center max-[480px]:p-[0] max-[480px]:max-w-[100%] max-[480px]:text-center max-[480px]:items-center">
                                <h5 className="font-quicksand mb-[15px] text-[#3d4750] font-bold tracking-[0.03rem] text-[#3d4750] leading-[1.2] max-[480px]:mb-[2px] text-lg md:text-xl lg:text-2xl">Fresh Fruits & Vegetables</h5>
                                <p className="font-Poppins font-medium tracking-[0.03rem] text-[#686e7d] mb-[15px] max-[480px]:mb-[8px] text-sm md:text-md leading-2">A healthy meal for every one</p>
                                <Button link="/product/category/womens-jewellery" name='Shop Now'/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default BannerOne