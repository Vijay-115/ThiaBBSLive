import React, { useEffect, useState } from 'react';
import SingleProductGallery from './SingleProductGallery';
import { useParams } from 'react-router-dom';
import Button from '../layout/Button';
import ProductList from './ProductList';
import { addToCart, updateQuantity } from '../../slice/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { ProductService } from '../../services/ProductService';

function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("detail");
  const [weight, setWeight] = useState("250g");
  const [quantities, setQuantities] = useState(1); // To manage quantities for each product
  const dispatch = useDispatch(); // Redux dispatch function
  // Handle increment
      const handleIncrement = (prodId) => {
          const currentQuantity = quantities || 1;
          const newQuantity = currentQuantity + 1;
          setQuantities(newQuantity);
      };
  
      // Handle decrement
      const handleDecrement = (prodId) => {
          const currentQuantity = quantities || 1;
          const newQuantity = Math.max(currentQuantity - 1, 1);
          setQuantities(newQuantity);
      };
  
    // Handle input change
    const handleInputChange = (value, prodId) => {
      if (/^\d*$/.test(value)) {
        const newQuantity = value === "" ? 1 : parseInt(value, 10);
        setQuantities(newQuantity);
      }
    };
  
    // Handle adding to cart
    const handleAddToCart = () => {
      const initialQuantity = quantities || 1;
      dispatch(addToCart({ productId: product._id, quantity: initialQuantity }));
      setQuantities(1);
      // Display toast notification
      toast.success(`${product.name} added to cart!`);
    };

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async (id) => {
      try {
        const data = await ProductService.getProductID(id);
        console.log(data.name);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct(id);
    window.scrollTo({
      top: 0, // Scroll to the top
      behavior: 'smooth', // Enables smooth scrolling
    });
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "detail":
        return <DetailContent />;
      case "information":
        return <InformationContent />;
      case "reviews":
        return <ReviewsContent />;
      default:
        return null;
    }
  };

  const DetailContent = () => (
    <div>
      <div className="tab-pro-pane" id="detail">
          <div className="bb-inner-tabs border-[1px] border-solid border-[#eee] p-[15px] rounded-[20px]">
              <div className="bb-details">
                  <p className="mb-[12px] font-Poppins text-secondary leading-[28px] tracking-[0.03rem] font-light">Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero,
                      voluptatum. Vitae dolores alias repellat eligendi, officiis, exercitationem corporis
                      quisquam delectus cum non recusandae numquam dignissimos molestiae
                      magnam hic natus. Cumque.</p>
                  <div className="details-info">
                      <ul className="list-disc pl-[20px] mb-[0]">
                          <li className="py-[5px] text-[15px] text-secondary font-Poppins leading-[28px] font-light">Any Product types that You want - Simple, Configurable</li>
                          <li className="py-[5px] text-[15px] text-secondary font-Poppins leading-[28px] font-light">Downloadable/Digital Products, Virtual Products</li>
                          <li className="py-[5px] text-[15px] text-secondary font-Poppins leading-[28px] font-light">Inventory Management with Backordered items</li>
                          <li className="py-[5px] text-[15px] text-secondary font-Poppins leading-[28px] font-light">Flatlock seams throughout.</li>
                      </ul>
                      <ul className="list-disc pl-[20px] mb-[0]">
                          <li className="py-[5px] text-[15px] text-secondary font-Poppins leading-[28px] font-light"><span className="inline-flex font-medium min-w-[150px]">Highlights</span>Form FactorWhole</li>
                          <li className="py-[5px] text-[15px] text-secondary font-Poppins leading-[28px] font-light"><span className="inline-flex font-medium min-w-[150px]">Seller</span>No Returns Allowed</li>
                          <li className="py-[5px] text-[15px] text-secondary font-Poppins leading-[28px] font-light"><span className="inline-flex font-medium min-w-[150px]">Services</span>Cash on Delivery available</li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
  
  const InformationContent = () => (
    <div>
      <div className="tab-pro-pane" id="information">
          <div className="bb-inner-tabs border-[1px] border-solid border-[#eee] p-[15px] rounded-[20px]">
              <div className="information">
                  <ul className="list-disc pl-[20px]">
                      <li className="font-Poppins text-[15px] font-light tracking-[0.03rem] leading-[28px] text-secondary py-[5px]"><span className="inline-flex min-w-[130px] font-medium">Weight</span> 500 g</li>
                      <li className="font-Poppins text-[15px] font-light tracking-[0.03rem] leading-[28px] text-secondary py-[5px]"><span className="inline-flex min-w-[130px] font-medium">Dimensions</span> 17 × 15 × 3 cm</li>
                      <li className="font-Poppins text-[15px] font-light tracking-[0.03rem] leading-[28px] text-secondary py-[5px]"><span className="inline-flex min-w-[130px] font-medium">Color</span> black,yellow,red</li>
                      <li className="font-Poppins text-[15px] font-light tracking-[0.03rem] leading-[28px] text-secondary py-[5px]"><span className="inline-flex min-w-[130px] font-medium">Brand</span> Wonder Fort</li>
                      <li className="font-Poppins text-[15px] font-light tracking-[0.03rem] leading-[28px] text-secondary py-[5px]"><span className="inline-flex min-w-[130px] font-medium">Form Factor</span>Whole</li>
                      <li className="font-Poppins text-[15px] font-light tracking-[0.03rem] leading-[28px] text-secondary py-[5px]"><span className="inline-flex min-w-[130px] font-medium">Quantity</span>1</li>
                      <li className="font-Poppins text-[15px] font-light tracking-[0.03rem] leading-[28px] text-secondary py-[5px]"><span className="inline-flex min-w-[130px] font-medium">Container Type</span>Pouch</li>
                      <li className="font-Poppins text-[15px] font-light tracking-[0.03rem] leading-[28px] text-secondary py-[5px]"><span className="inline-flex min-w-[130px] font-medium">Shelf Life</span>12 Months</li>
                      <li className="font-Poppins text-[15px] font-light tracking-[0.03rem] leading-[28px] text-secondary py-[5px]"><span className="inline-flex min-w-[130px] font-medium">Ingredients</span>Dalchini, Dhaniya, Badi Elaichi, Laung</li>
                      <li className="font-Poppins text-[15px] font-light tracking-[0.03rem] leading-[28px] text-secondary py-[5px]"><span className="inline-flex min-w-[130px] font-medium">Other Features</span>Ingredient Type: Vegetarian</li>
                  </ul>
              </div>
          </div>
      </div>
    </div>
  );
  
  const ReviewsContent = () => (
    <div>
      <div className="tab-pro-pane" id="reviews">
          <div className="bb-inner-tabs border-[1px] border-solid border-[#eee] p-[15px] rounded-[20px]">
              <div className="bb-reviews">
                  {
                    product.reviews && 
                    product.reviews.length > 0 &&
                    product.reviews.map((review,index)=>(                      
                      <div key={index} className="reviews-bb-box flex mb-[24px] max-[575px]:flex-col">
                          <div className="inner-image mr-[12px] max-[575px]:mr-[0] max-[575px]:mb-[12px]">
                              <img src={`/img/review/${index % 2 !== 0 ? '1' : '2'}.jpg`} alt="img-1" className="w-[50px] h-[50px] max-w-[50px] rounded-[10px]"/>
                          </div>
                          <div className="inner-contact">
                              <h4 className="font-quicksand leading-[1.2] tracking-[0.03rem] mb-[5px] text-[16px] font-bold text-secondary">{review.reviewerName}</h4>
                              <div className="bb-pro-rating flex">
                              {
                                Array.from({ length: 5 }).map((_, index) => (
                                  <i
                                    key={index}
                                    className={`ri-star-fill float-left text-[15px] mr-[3px] ${
                                      index < review.rating ? 'text-[#e7d52e]' : 'text-[#777]'
                                    }`}
                                  ></i>
                                ))
                              }
                              </div>
                              <p className="font-Poppins text-[14px] leading-[26px] font-light tracking-[0.03rem] text-secondary">{review.comment}</p>
                          </div>
                      </div>
                    ))
                  }
              </div>
              <div className="bb-reviews-form">
                  <h3 className="font-quicksand tracking-[0.03rem] leading-[1.2] mb-[8px] text-[20px] font-bold text-secondary">Add a Review</h3>
                  <div className="bb-review-rating flex mb-[12px]">
                      <span className="pr-[10px] font-Poppins text-[15px] font-semibold leading-[26px] tracking-[0.02rem] text-secondary">Your ratting :</span>
                      <div className="bb-pro-rating">
                          <i className="ri-star-fill float-left text-[15px] mr-[3px] text-[#e7d52e]"></i>
                          <i className="ri-star-fill float-left text-[15px] mr-[3px] text-[#e7d52e]"></i>
                          <i className="ri-star-fill float-left text-[15px] mr-[3px] text-[#e7d52e]"></i>
                          <i className="ri-star-fill float-left text-[15px] mr-[3px] text-[#e7d52e]"></i>
                          <i className="ri-star-line float-left text-[15px] mr-[3px] text-[#777]"></i>
                      </div>
                  </div>
                  <form action="#">
                      <div className="input-box mb-[24px]">
                          <input type="text" placeholder="Name" name="your-name" className="w-full h-[50px] border-[1px] border-solid border-[#eee] pl-[20px] outline-[0] text-[14px] font-normal text-[#777] rounded-[20px] p-[10px]"/>
                      </div>
                      <div className="input-box mb-[24px]">
                          <input type="email" placeholder="Email" name="your-email" className="w-full h-[50px] border-[1px] border-solid border-[#eee] pl-[20px] outline-[0] text-[14px] font-normal text-[#777] rounded-[20px] p-[10px]"/>
                      </div>
                      <div className="input-box mb-[24px]">
                          <textarea name="your-comment" placeholder="Enter Your Comment" className="w-full h-[100px] border-[1px] border-solid border-[#eee] py-[20px] pl-[20px] pr-[10px] outline-[0] text-[14px] font-normal text-[#777] rounded-[20px] p-[10px]"></textarea>
                      </div>
                      <div className="input-button">
                          <Button name="Submit"/>
                      </div>
                  </form>
              </div>
          </div>
      </div>
    </div>
  );

  return (
    <section className="section-product pt-[50px] max-[1199px]:pt-[35px]">
      <div className="flex flex-wrap justify-between relative items-center">
        <div className="flex flex-wrap w-full mb-[-24px]">
          <div className="min-[992px]:w-[100%] w-full px-[12px] mb-[24px]">
            <div className="bb-single-pro mb-[24px]">
              <div className="flex flex-wrap mx-[-12px]">
                {/* Left Section: Image Slider */}
                <div className="min-[992px]:w-[41.66%] w-full px-[12px] mb-[24px]">
                  <div className="single-pro-slider sticky top-[0] p-[15px] border-[1px] border-solid border-[#eee] rounded-[24px] max-[991px]:max-w-[500px] max-[991px]:m-auto">
                    <SingleProductGallery images={product.gallery_imgs ?? []} />
                  </div>
                </div>

                {/* Right Section: Product Details */}
                <div className="min-[992px]:w-[58.33%] w-full px-[12px] mb-[24px]">
                  <div className="bb-single-pro-contact">
                    <div className="bb-sub-title mb-[10px]">
                      <h4 className="font-quicksand text-[22px] tracking-[0.03rem] font-bold leading-[1.2] text-secondary">
                        {product.name}
                      </h4>
                    </div>
                    <div className="bb-single-rating mb-[8px]">
                      <div className='flex'>                     
                      {
                        Array.from({ length: 5 }).map((_, index) => (
                          <i
                            key={index}
                            className={`ri-star-fill float-left text-[15px] mr-[3px] ${
                              index < product.rating ? 'text-[#e7d52e]' : 'text-[#777]'
                            }`}
                          ></i>
                        ))
                      }
                      <span className="bb-pro-rating mr-[10px]"> / {product.rating}</span> 
                      </div>
                    </div>
                    <p className="font-Poppins text-[15px] font-light leading-[28px] tracking-[0.03rem]">
                      {product.description}
                    </p>

                    {/* Price Section */}
                    <div className="bb-single-price-wrap flex justify-between py-[10px]">
                      <div className="bb-single-price py-[15px]">
                        <div className="price mb-[8px]">
                          <h5 className="font-quicksand leading-[1.2] tracking-[0.03rem] text-[20px] font-extrabold text-secondary">
                            ₹ {product.price}
                          </h5>
                        </div>
                        <div className="mrp">
                          <p className="font-Poppins text-[16px] font-light text-secondary leading-[28px] tracking-[0.03rem]">
                            M.R.P.:{" "}
                            <span className="text-[15px] line-through">
                              ₹ {product.price + 2}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="bb-single-price py-[15px]">
                        <div className="sku mb-[8px]">
                          <h5 className="font-quicksand text-[18px] font-extrabold leading-[1.2] tracking-[0.03rem] text-secondary">
                            SKU#: {product.sku ?? ''}
                          </h5>
                        </div>
                        <div className="stock">
                          {product.stock > 0 ? (
                            <span className="text-[18px] text-primary">
                              In stock
                            </span>
                          ) : (
                            <span className="text-[18px] text-[#d86c6e]">
                              Out of stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Product Features */}
                    {product.dimensions && (
                      <div className="bb-single-list mb-[30px]">
                        <ul className="my-[-8px] pl-[18px]">
                          {Object.entries(product.dimensions).map(
                            ([key, value]) => (
                              <li
                                key={key}
                                className="my-[8px] font-Poppins text-[14px] font-light leading-[28px] tracking-[0.03rem] text-[#777] list-disc"
                              >
                                <span className="font-Poppins text-[#777] text-[14px] capitalize">
                                  {key}:
                                </span>{" "}
                                {value}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                    <div className="bb-single-pro-weight mb-[24px]">
                      <div className="pro-title mb-[12px]">
                          <h4 className="font-quicksand leading-[1.2] tracking-[0.03rem] text-[16px] font-bold uppercase text-secondary">Weight</h4>
                      </div>
                      <div className="bb-pro-variation-contant">
                          <ul className="flex flex-wrap m-[-2px]">
                              <li onClick={()=> setWeight('250g')} className={`my-[10px] mx-[2px] py-[2px] px-[15px] border-[1px] border-solid ${weight === '250g' ? 'border-primary bg-primary text-white' : 'border-[#eee]'} rounded-[10px] cursor-pointer`}>
                                  <span className={`font-Poppins ${weight === '250g' ? 'text-white' : 'text-secondary '} font-light text-[14px] leading-[28px] tracking-[0.03rem]`}>250g</span>
                              </li>
                              <li onClick={()=> setWeight('500g')} className={`my-[10px] mx-[2px] py-[2px] px-[15px] border-[1px] border-solid ${weight === '500g' ? 'border-primary bg-primary text-white' : 'border-[#eee]'} rounded-[10px] cursor-pointer`}>
                                  <span className={`font-Poppins ${weight === '500g' ? 'text-white' : 'text-secondary '} font-light text-[14px] leading-[28px] tracking-[0.03rem]`}>500g</span>
                              </li>
                              <li onClick={()=> setWeight('1kg')} className={`my-[10px] mx-[2px] py-[2px] px-[15px] border-[1px] border-solid ${weight === '1kg' ? 'border-primary bg-primary text-white' : 'border-[#eee]'} rounded-[10px] cursor-pointer`}>
                                  <span className={`font-Poppins ${weight === '1kg' ? 'text-white' : 'text-secondary '} font-light text-[14px] leading-[28px] tracking-[0.03rem]`}>1kg</span>
                              </li>
                              <li onClick={()=> setWeight('2kg')} className={`my-[10px] mx-[2px] py-[2px] px-[15px] border-[1px] border-solid ${weight === '2kg' ? 'border-primary bg-primary text-white' : 'border-[#eee]'} rounded-[10px] cursor-pointer`}>
                                  <span className={`font-Poppins ${weight === '2kg' ? 'text-white' : 'text-secondary '} font-light text-[14px] leading-[28px] tracking-[0.03rem]`}>2kg</span>
                              </li>
                          </ul>
                      </div>
                    </div>
                    {/* Cart */}
                    <div className="product-cart flex flex-row max-w-[250px]">
                      <div className="product-cart-qtysec flex flex-row w-[75%] md:w-[50%]">
                        <button
                          className="w-1/3"
                          onClick={() => handleIncrement(product.id)}
                        >
                          +
                        </button>
                        <input
                          className="w-1/3 appearance-none p-0 text-center"
                          type="text"
                          value={quantities || 1}
                          onChange={(e) => handleInputChange(e.target.value,product.id)}
                        />
                        <button
                          className="w-1/3"
                          onClick={() => handleDecrement(product.id)}
                        >
                          -
                        </button>
                      </div>
                      <div className="cart-btn w-[25%] md:w-[50%]">
                        <button onClick={handleAddToCart} className="hidden md:block text-xs w-[90%] float-right py-2 px-1 text-center bg-primary text-white rounded-md bg-primary hover:bg-opacity-90 transition-colors">
                          Add to Cart
                        </button>
                        <div className="w-[30px] sm:w-[50px] md:hidden mx-auto flex justify-center bg-primary p-2 px-4 rounded-md">
                          <i className="text-white text-center ri-shopping-cart-2-line"></i>
                        </div>
                      </div>
                    </div>
                    {/* Product Info */}
                    <div className="bb-single-pro-tab mt-6">
                      <div className="bb-pro-tab mb-[24px]">
                        <ul className="bb-pro-tab-nav flex flex-wrap mx-[-20px] max-[991px]:justify-center">
                          {["detail", "information", "reviews"].map((tab) => (
                            <li
                              key={tab}
                              className={`nav-item relative leading-[28px] ${
                                activeTab === tab ? "text-primary" : ""
                              }`}
                              onClick={() => setActiveTab(tab)}
                            >
                              <a
                                className={`nav-link px-[20px] font-Poppins text-[16px] text-secondary font-medium capitalize leading-[28px] tracking-[0.03rem] block ${
                                  activeTab === tab ? "text-primary" : ""
                                }`}
                              >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="tab-content">{renderTabContent()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6"><ProductList heading="Related Product" type="Grid" category={product.category}/></div>
    </section>
  );
}

export default SingleProduct;