import React, { useState } from 'react';
import PriceRangeSlider from './PriceRangeSlider';
import { useDispatch, useSelector } from "react-redux";

function ProductFilter() {
    const dispatch = useDispatch();
    const [mobileFilter,setMobileFilter] = useState(false);
    console.log('mobileFilter - ',mobileFilter);
    // category function
    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleCategoryChange = (category) => {
        setSelectedCategories((prevCategories) => {
            const updatedCategories = prevCategories.includes(category)
            ? prevCategories.filter((item) => item !== category)
            : [...prevCategories, category];
            
            // Log the updated categories
            console.log(updatedCategories);

            return updatedCategories; // Update the state
        });
    };

    // color function
    const [selectedColors, setSelectedColors] = useState([]);
    const handleColorSelect = (color) => {
    setSelectedColors((prevColors) =>
        prevColors.includes(color)
        ? prevColors.filter((item) => item !== color)
        : [...prevColors, color]
    );
    };
    // tag function
    const [selectedTags, setSelectedTags] = useState([]);
    const handleTagSelect = (tag) => {
    setSelectedTags((prevTags) =>
        prevTags.includes(tag) ? prevTags.filter((item) => item !== tag) : [...prevTags, tag]
    );
    };

  return (
    <>  
      <div className='absolute top-[190px] md:top-[140px] right-8 md:hidden' onClick={()=> {mobileFilter ? setMobileFilter(false) : setMobileFilter(true); console.log(mobileFilter);} }><i className={`text-2xl text-primary ri-filter-${mobileFilter ? 'off-fill' : 'fill'}`}></i></div>
      <div onClick={()=> {mobileFilter ? setMobileFilter(false) : setMobileFilter(true); console.log(mobileFilter);} } className={`${mobileFilter ? 'w-full h-full absolute top-0 left-0 bg-black bg-opacity-25 z-40 ease-in-out duration-300' : 'hidden'}`}></div>
      <div className={`bb-shop-wrap ${mobileFilter ? 'block absolute top-0 left-0 z-50 overflow-y-auto rounded-none ease-in-out duration-300' : 'hidden md:block sticky top-[0]'} bg-[#f8f8fb] rounded-[20px] border-[1px] border-solid border-[#eee]`}>
        {/* Category Section */}
        <div className="bb-sidebar-block p-[20px] border-b-[1px] border-solid border-[#eee]">
            <div className="bb-sidebar-title mb-[20px]">
                <h3 className="font-quicksand text-[18px] tracking-[0.03rem] leading-[1.2] font-bold text-secondary">
                Category
                </h3>
            </div>
            <div className="bb-sidebar-contact">
                <ul>
                {['Clothes', 'Bags', 'Shoes', 'Cosmetics', 'Electrics', 'Phone', 'Watch'].map((category) => (
                    <li key={category} className="relative block mb-[14px]">
                    <label className="bb-sidebar-block-item relative flex items-center cursor-pointer">
                        <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="hidden" // Hide the default checkbox style
                        />
                        <span className="checked flex-shrink-0 h-[18px] w-[18px] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] overflow-hidden mr-[12px] flex items-center justify-center">
                        <svg
                            className={`${selectedCategories.includes(category) ? '' : 'hidden'} w-[12px] h-[12px] text-[#424e82]`}
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path d="M13.485 3.657l-7.071 7.071-3.182-3.182-.707.707 3.889 3.889 7.778-7.778z" />
                        </svg>
                        </span>
                        <span className="text-[#777] text-[14px] leading-[20px] font-normal capitalize">
                        {category}
                        </span>
                    </label>
                    </li>
                ))}
                </ul>
            </div>
        </div>
    
        {/* Color Section */}
        <div className="bb-sidebar-block p-[20px] border-b-[1px] border-solid border-[#eee]">
            <div className="bb-sidebar-title mb-[20px]">
                <h3 className="font-quicksand text-[18px] tracking-[0.03rem] leading-[1.2] font-bold text-secondary">
                Color
                </h3>
            </div>
            <div className="bb-color-contact">
                <ul>
                {[
                    { color: '#c4d6f9', className: 'pro-color-1' },
                    { color: '#ff748b', className: 'pro-color-2' },
                    // Add more colors if needed
                ].map((item) => (
                    <li
                    key={item.color}
                    className="transition-all duration-[0.3s] ease-in-out inline-block p-[2px] rounded-[20px] cursor-pointer mr-[5px] w-[26px] h-[26px]">
                    <div className="bb-sidebar-block-item relative">
                        <span
                        className={`w-[22px] h-[22px] block rounded-[20px] ${item.className}`}
                        style={{
                            backgroundColor: item.color,
                            border: selectedColors.includes(item.color) ? '2px solid #6c7fd8' : 'none',
                        }}
                        onClick={() => handleColorSelect(item.color)}
                        ></span>
                    </div>
                    </li>
                ))}
                </ul>
            </div>
        </div>


        {/* Price Section */}
        <div className="bb-sidebar-block p-[20px] border-b-[1px] border-solid border-[#eee]">
        <div className="bb-sidebar-title mb-[20px]">
        <h3 className="font-quicksand text-[18px] tracking-[0.03rem] leading-[1.2] font-bold text-secondary">
            Price
        </h3>
        </div>
        <PriceRangeSlider min={0} max={2000} step={50} />
        </div>

        {/* Tags Section */}
        <div className="bb-sidebar-block p-[20px]">
            <div className="bb-sidebar-title mb-[20px]">
                <h3 className="font-quicksand text-[18px] tracking-[0.03rem] leading-[1.2] font-bold text-secondary">
                Tags
                </h3>
            </div>
            <div className="bb-tags">
                <ul className="flex flex-wrap m-[-5px]">
                {['Clothes', 'Fruits'].map((tag) => (
                    <li
                    key={tag}
                    onClick={() => handleTagSelect(tag)} // Add onClick function here
                    className={`transition-all duration-[0.3s] ease-in-out m-[5px] py-[2px] px-[15px] border-[1px] border-solid border-[#eee] rounded-[10px] cursor-pointer ${
                        selectedTags.includes(tag) ? 'bg-[#6c7fd8] text-white' : ''
                    }`}>
                    <a className={`font-Poppins text-[13px] font-light leading-[28px] tracking-[0.03rem] ${
                        selectedTags.includes(tag) ? 'text-white' : 'text-secondary'
                    } capitalize`}>
                        {tag}
                    </a>
                    </li>
                ))}
                </ul>
            </div>
        </div>


      </div>
    </>
  );
}

export default ProductFilter;