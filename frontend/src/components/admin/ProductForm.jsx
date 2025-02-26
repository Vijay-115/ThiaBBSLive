import React, { useEffect, useState } from "react";
import Select from "react-select";

const ProductForm = ({ product, categories, subCategories, onSave }) => {
  console.log("categories", categories);
  console.log("subCategories", subCategories);

  const [productData, setProductData] = useState({
    product_id: product?.product_id || "",
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    stock: product?.stock || "",
    SKU: product?.SKU || "",
    brand: product?.brand || "",
    weight: product?.weight || "",
    dimensions: {
      length: product?.dimensions?.length || "",
      width: product?.dimensions?.width || "",
      height: product?.dimensions?.height || "",
    },
    tags: product?.tags || [],
    category_id: product?.category_id || "",
    subcategory_id: product?.subcategory_id || "",
    product_img: null,
    gallery_imgs: [],
    is_variant: product?.is_variant || false,
    variants: [],
  });

  const [variantData, setVariantData] = useState({
    variant_name: "",
    price: "",
    stock: "",
    SKU: "",
    attributes: { color: "", size: "", material: "" },
    variant_img: "",
  });

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("attributes.")) {
      const attrName = name.split(".")[1];
      setVariantData((prev) => ({
        ...prev,
        attributes: { ...prev.attributes, [attrName]: value },
      }));
    } else {
      setVariantData({ ...variantData, [name]: value });
    }
  };

  // Add variant to product
  const addVariant = () => {
    setProductData((prev) => ({
      ...prev,
      variants: [...prev.variants, variantData],
    }));
    setVariantData({
      variant_name: "",
      price: "",
      stock: "",
      SKU: "",
      attributes: { color: "", size: "", material: "" },
      variant_img: "",
    });
  };

  // Remove a variant
  const removeVariant = (index) => {
    setProductData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };


  const [tagInput, setTagInput] = useState("");
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [subcategoriesOptions, setSubcategoriesOptions] = useState([]);

  useEffect(() => {
    if (categories.length > 0) {
      const formattedCatOptions = categories.map((category) => ({
        value: category._id,
        label: category.name,
      }));
      setCategoriesOptions(formattedCatOptions);
    }

    if (subCategories.length > 0) {
      const formattedSubCatOptions = subCategories.map((subcategory) => ({
        value: subcategory._id,
        label: subcategory.name,
      }));
      setSubcategoriesOptions(formattedSubCatOptions);
    }
  }, [categories, subCategories]); // ✅ Add dependencies

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [name]: value,
      },
    }));
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== "" && !productData.tags.includes(tagInput.trim())) {
      setProductData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput(""); // Clear input after adding tag
    }
  };

  const handleRemoveTag = (index) => {
    setProductData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleProductImageChange = (e) => {
    if (e.target.files.length > 0) {
      setProductData((prev) => ({
        ...prev,
        product_img: e.target.files[0],
      }));
    }
  };

  const handleGalleryImagesChange = (e) => {
    if (e.target.files.length > 0) {
      setProductData((prev) => ({
        ...prev,
        gallery_imgs: Array.from(e.target.files),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = new FormData();

    Object.keys(productData).forEach((key) => {
      if (key === "gallery_imgs") {
        productData.gallery_imgs.forEach((image) => submissionData.append("gallery_imgs", image));
      } else if (key === "dimensions") {
        submissionData.append("dimensions", JSON.stringify(productData.dimensions));
      } else {
        submissionData.append(key, productData[key]);
      }
    });

    onSave(submissionData);
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta; // Extract name
    console.log("Selected:", selectedOption);

    setProductData((prevData) => {
        const updatedData = {
            ...prevData,
            [name]: selectedOption.value,
        };

        // If category is selected, filter subcategories
        if (name === "category_id") {
            const filteredSubcategories = subCategories.filter(
                (subcategory) => subcategory.category_id._id === selectedOption.value
            ).map((subcategory) => ({
                value: subcategory._id,
                label: subcategory.name,
            }));

            setSubcategoriesOptions(filteredSubcategories);
            updatedData.subcategory_id = ""; // Reset subcategory when category changes
        }

        console.log("Updated Form Data:", updatedData);
        return updatedData;
    });
  };



  return (
    <div className="formSec bg-white p-2 shadow-md rounded-lg-md h-[85%]">
      <div className="input-box-form p-3 overflow-y-auto h-full">
        <form onSubmit={handleSubmit} className="max-w-2xl p-3 mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-6">{product ? "Edit Product" : "Add Product"}</h2>
          <div className="flex flex-wrap mx-[-12px]">
              <div className="w-full">
                <div className="input-item">
                  <label className="block text-[14px] font-medium text-secondary mb-[4px]"> Product Name * </label>
                  <input type="text" name="name" value={productData.name} onChange={handleChange} placeholder="Product Name" required className="w-full p-2 mb-4 border rounded-lg" />
                </div>
              </div>
              <div className="w-full">
                <div className="input-item">
                  <label className="block text-[14px] font-medium text-secondary mb-[4px]"> Description * </label>
                  <textarea name="description" value={productData.description} onChange={handleChange} placeholder="Description" required className="w-full p-2 mb-4 border rounded-lg" />
                </div>
              </div>
              <div className="w-full">
                <div className="input-item">
                  <label className="block text-[14px] font-medium text-secondary mb-[4px]"> Price * </label>
                  <input type="number" name="price" value={productData.price} onChange={handleChange} placeholder="Price" required className="w-full p-2 mb-4 border rounded-lg" />
                </div>
              </div>
              <div className="w-full">
                <div className="input-item">
                  <label className="block text-[14px] font-medium text-secondary mb-[4px]"> Stock * </label>
                  <input type="number" name="stock" value={productData.stock} onChange={handleChange} placeholder="Stock" required className="w-full p-2 mb-4 border rounded-lg" />
                </div>
              </div>
              <div className="w-full">
                <div className="input-item">
                  <label className="block text-[14px] font-medium text-secondary mb-[4px]"> SKU * </label>
                  <input type="text" name="SKU" value={productData.SKU} onChange={handleChange} placeholder="SKU" required className="w-full p-2 mb-4 border rounded-lg" />
                </div>
              </div>
              <div className="w-full">
                <div className="input-item">
                  <label className="block text-[14px] font-medium text-secondary mb-[4px]"> Brand * </label>
                  <input type="text" name="SKU" value={productData.SKU} onChange={handleChange} placeholder="SKU" required className="w-full p-2 mb-4 border rounded-lg" />
                </div>
              </div>
              <div className="w-full">
                <div className="input-item">
                  <label className="block text-[14px] font-medium text-secondary mb-[4px]"> Weight </label>
                  <input type="number" name="weight" value={productData.weight} onChange={handleChange} placeholder="Weight" className="w-full p-2 mb-4 border rounded-lg" />
                </div>
              </div>
              <div className="flex space-x-2 mb-4">
                <div className="input-item w-1/3">
                  <label className="block text-[14px] font-medium text-secondary mb-[4px]"> Length </label>
                  <input type="number" name="length" value={productData.dimensions.length} onChange={handleDimensionChange} placeholder="Length" className="p-2 border rounded-lg"/>
                </div>
                <div className="input-item w-1/3">
                  <label className="block text-[14px] font-medium text-secondary mb-[4px]"> Width </label>
                  <input type="number" name="width" value={productData.dimensions.width} onChange={handleDimensionChange} placeholder="Width" className="p-2 border rounded-lg"/>
                </div>  
                <div className="input-item w-1/3">
                  <label className="block text-[14px] font-medium text-secondary mb-[4px]"> Height </label>
                  <input type="number" name="height" value={productData.dimensions.height} onChange={handleDimensionChange} placeholder="Height" className="p-2 border rounded-lg"/>
                </div>                
              </div>
              
              {/* Tag */}

              <div className="w-full">
                <div className="input-item">
                  <label className="block text-[14px] font-medium text-secondary mb-[4px]">
                    Tags
                  </label>
                  <div className="flex max-w-full gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      placeholder="Enter Tag"
                      className="w-[85%] px-2 py-[8px] border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-2 py-1 bg-blue-500 text-sm text-white w-[15%] rounded-lg"
                    >
                      Add Tag
                    </button>
                  </div>
                </div>

                {/* Display Added Tags */}
                <div className="my-3 flex flex-wrap gap-2">
                  {productData.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-200 px-3 pt-1 pb-[6px] rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index)}
                        className="ml-2 text-red-500 font-bold"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full">
                <div className="input-item">
                  <label className="block text-[14px] font-medium text-secondary mb-[4px]"> Select Category </label>
                  <Select
                    options={categoriesOptions}
                    value={categoriesOptions.find(option => option.value === productData.category_id) || null}
                    onChange={handleSelectChange}
                    placeholder="Select Category"
                    isSearchable
                    className="w-full"
                    name="category_id"
                  />
                </div>
              </div>
              <div className="w-full mt-3">
                <div className="input-item">
                  <label className="block text-[14px] font-medium text-secondary mb-[4px]"> Select Subcategory </label>
                  <Select
                      options={subcategoriesOptions}
                      value={subcategoriesOptions.find(option => option.value === productData.subcategory_id) || null}
                      onChange={handleSelectChange}
                      placeholder="Select Subcategories"
                      isSearchable
                      className="w-full"
                      name="subcategory_id"
                  />
                </div>
              </div>
              <div className="w-full mt-3">
                <div className="input-item">
                  <label className="block text-[14px] font-medium text-secondary mb-[4px]"> Upload Product Image </label>
                  <input type="file" accept="image/*" onChange={handleProductImageChange} className="w-full p-2 mb-4 border rounded-lg" />
                </div>
              </div>
              <div className="w-full">
                <div className="input-item">
                  <label className="block text-[14px] font-medium text-secondary mb-[4px]"> Upload Product Gallery Images </label>
                  <input type="file" accept="image/*" multiple onChange={handleGalleryImagesChange} className="w-full p-2 mb-4 border rounded-lg" />
                </div>
              </div>

              {/* Variant Toggle Checkbox */}
              <div className="w-full">
                <div className="input-item flex flex-wrap gap-3 items-center">
                  <input type="checkbox" className="w-[15px] h-[15px]" id="is_variant" name="is_variant" checked={productData.is_variant} onChange={handleChange} />
                  <label for="is_variant" className="block text-[14px] font-medium text-secondary"> This product has variants </label>
                </div>
              </div>
              
              {/* Variant Manager Section (Shown only if is_variant is true) */}
              {productData.is_variant && (
                <div className="variant-manager-sec mt-5">
                  <h3 className="text-xl font-semibold text-center mb-4">Add Variants</h3>
                  
                  <div className="w-full">
                    <div className="input-item">
                      <label className="block text-[14px] font-medium text-secondary mb-[4px]"> Variant Name* </label>
                      <input type="text" name="variant_name" placeholder="Variant Name" value={variantData.variant_name} onChange={handleVariantChange} required />
                    </div>
                  </div>

                  <div className="w-full mt-2">
                    <div className="input-item">
                      <label className="block text-[14px] font-medium text-secondary mb-[4px]"> Variant Price* </label>
                      <input type="number" name="price" placeholder="Variant Price" value={variantData.price} onChange={handleVariantChange} required />
                    </div>
                  </div>
                  
                  <div className="w-full mt-2">
                    <div className="input-item">
                      <label className="block text-[14px] font-medium text-secondary mb-[4px]"> Variant Stock* </label>
                      <input type="number" name="stock" placeholder="Stock" value={variantData.stock} onChange={handleVariantChange} required />
                    </div>
                  </div>
                  
                  <div className="w-full mt-2">
                    <div className="input-item">
                      <label className="block text-[14px] font-medium text-secondary mb-[4px]"> Variant SKU* </label>
                      <input type="text" name="SKU" placeholder="SKU" value={variantData.SKU} onChange={handleVariantChange} required />
                    </div>
                  </div>
                  
                  {/* Variants Attributes */}

                  <div className="flex space-x-2 mb-4  mt-2">
                    <div className="input-item w-1/3">
                      <label className="block text-[14px] font-medium text-secondary mb-[4px]"> Color </label>
                      <input type="text" name="attributes.color" placeholder="Color" value={variantData.attributes.color} onChange={handleVariantChange} />
                    </div>
                    <div className="input-item w-1/3">
                      <label className="block text-[14px] font-medium text-secondary mb-[4px]"> Size </label>
                      <input type="text" name="attributes.size" placeholder="Size" value={variantData.attributes.size} onChange={handleVariantChange} />
                    </div>  
                    <div className="input-item w-1/3">
                      <label className="block text-[14px] font-medium text-secondary mb-[4px]"> Height </label>
                      <input type="text" name="attributes.material" placeholder="Material" value={variantData.attributes.material} onChange={handleVariantChange} />
                    </div>     
                  </div>

                  <div className="w-full px-[12px]">
                    <div className="input-button">
                      <button type="button" className="px-4 py-2 bg-blue-500 text-sm mt-3 text-white w-auto rounded-lg" onClick={addVariant}>Add Variant</button>
                    </div>
                  </div>
                  

                  {/* Show added variants */}
                  {productData.variants.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold text-center mb-4">Variants List</h3>
                      <div className="bb-table border-none border-[1px] md:border-solid border-[#eee] rounded-none md:rounded-[20px] overflow-hidden max-[1399px]:overflow-y-auto aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
                        <table className="w-full table-auto border-collapse">
                            <thead className="hidden md:table-header-group">
                            <tr className="border-b-[1px] border-solid border-[#eee]">
                                <th
                                className="font-Poppins p-[12px] text-left text-[16px] font-medium text-secondary leading-[26px] tracking-[0.02rem] capitalize"
                                onClick={() => handleSort("product_id")}
                                >
                                Variant Name
                                </th>
                                <th
                                className="font-Poppins p-[12px] text-left text-[16px] font-medium text-secondary leading-[26px] tracking-[0.02rem] capitalize"
                                onClick={() => handleSort("name")}
                                >
                                Stock
                                </th>
                                <th
                                className="font-Poppins p-[12px] text-left text-[16px] font-medium text-secondary leading-[26px] tracking-[0.02rem] capitalize"
                                onClick={() => handleSort("price")}
                                >
                                Price
                                </th>
                                <th className="font-Poppins p-[12px] text-left text-[16px] font-medium text-secondary leading-[26px] tracking-[0.02rem] capitalize">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {productData.variants.map((variant, index) => (
                                <tr key={index} className="border-b-[1px] border-solid border-[#eee]">
                                <td data-label="Product ID" className="p-[12px]">
                                    <div className="Product flex justify-end md:justify-normal md:items-center">
                                        <div>   
                                            <span className="ml-[10px] block font-Poppins text-[14px] font-semibold leading-[24px] tracking-[0.03rem] text-secondary">{variant.variant_name ?? ''}</span>
                                            <span className="ml-[10px] block font-Poppins text-[12px] font-normal leading-[16px] tracking-[0.03rem] text-secondary">SKU - {variant.SKU ?? ''}</span>
                                        </div>
                                    </div>
                                </td>
                                <td data-label="Name" className="p-[12px]">
                                    <span className="price font-Poppins text-[15px] font-medium leading-[26px] tracking-[0.02rem] text-secondary">₹{variant.stock ?? ''}</span>
                                </td>
                                <td data-label="Price" className="p-[12px]">{variant.price}</td>
                                <td data-label="Action" className="p-[12px]">
                                  <button onClick={() => removeVariant(index)}>Remove</button>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              )}


              {/* Place Order Button */}
              <div className="w-full px-[12px]">
                  <div className="input-button">
                      <button type="submit" className="block px-6 py-3 bg-blue-500 text-sm text-white mt-6 mx-auto w-auto rounded-lg hover:bg-transparent hover:border-[#3d4750] hover:text-secondary border">
                        {product ? "Update Product" : "Add Product"}
                      </button>
                  </div>
              </div>
          </div>       
        </form>
      </div>
    </div>
  );
};

export default ProductForm;