import React, { useState } from "react";

const ProductForm = ({ product, categories, subcategories, sellers, onSave }) => {
  const [formData, setFormData] = useState({
    product_id: product ? product.product_id : "",
    name: product ? product.name : "",
    description: product ? product.description : "",
    price: product ? product.price : "",
    stock: product ? product.stock : "",
    SKU: product ? product.SKU : "",
    brand: product ? product.brand : "",
    weight: product ? product.weight : "",
    dimensions: {
      length: product ? product.dimensions?.length : "",
      width: product ? product.dimensions?.width : "",
      height: product ? product.dimensions?.height : ""
    },
    tags: product ? product.tags.join(", ") : "",
    category_id: product ? product.category_id : "",
    subcategory_id: product ? product.subcategory_id : "",
    seller_id: product ? product.seller_id : "",
    product_img: null,
    gallery_imgs: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [name]: value,
      },
    }));
  };

  const handleTagsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      tags: e.target.value.split(",").map(tag => tag.trim()),
    }));
  };

  const handleProductImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      product_img: e.target.files[0],
    }));
  };

  const handleGalleryImagesChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      gallery_imgs: Array.from(e.target.files),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === "gallery_imgs") {
        formData.gallery_imgs.forEach(image => submissionData.append("gallery_imgs", image));
      } else if (key === "dimensions") {
        submissionData.append("dimensions", JSON.stringify(formData.dimensions));
      } else {
        submissionData.append(key, formData[key]);
      }
    });
    onSave(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-6">{product ? "Edit Product" : "Add Product"}</h2>
      
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required className="w-full p-2 mb-4 border rounded" />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="w-full p-2 mb-4 border rounded" />
      <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required className="w-full p-2 mb-4 border rounded" />
      <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" required className="w-full p-2 mb-4 border rounded" />
      <input type="text" name="SKU" value={formData.SKU} onChange={handleChange} placeholder="SKU" required className="w-full p-2 mb-4 border rounded" />
      <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" className="w-full p-2 mb-4 border rounded" />
      <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight" className="w-full p-2 mb-4 border rounded" />
      
      <div className="flex space-x-2 mb-4">
        <input type="number" name="length" value={formData.dimensions.length} onChange={handleDimensionChange} placeholder="Length" className="p-2 border rounded w-1/3" />
        <input type="number" name="width" value={formData.dimensions.width} onChange={handleDimensionChange} placeholder="Width" className="p-2 border rounded w-1/3" />
        <input type="number" name="height" value={formData.dimensions.height} onChange={handleDimensionChange} placeholder="Height" className="p-2 border rounded w-1/3" />
      </div>
      
      <input type="text" name="tags" value={formData.tags} onChange={handleTagsChange} placeholder="Tags (comma separated)" className="w-full p-2 mb-4 border rounded" />
      
      <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full p-2 mb-4 border rounded">
        <option value="">Select Category</option>
        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
      </select>
      
      <select name="subcategory_id" value={formData.subcategory_id} onChange={handleChange} className="w-full p-2 mb-4 border rounded">
        <option value="">Select Subcategory</option>
        {subcategories.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
      </select>
      
      <select name="seller_id" value={formData.seller_id} onChange={handleChange} className="w-full p-2 mb-4 border rounded">
        <option value="">Select Seller</option>
        {sellers.map(seller => <option key={seller._id} value={seller._id}>{seller.name}</option>)}
      </select>
      
      <input type="file" accept="image/*" onChange={handleProductImageChange} className="w-full p-2 mb-4 border rounded" />
      <input type="file" accept="image/*" multiple onChange={handleGalleryImagesChange} className="w-full p-2 mb-4 border rounded" />
      
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">{product ? "Update Product" : "Add Product"}</button>
    </form>
  );
};

export default ProductForm;