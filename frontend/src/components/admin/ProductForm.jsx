import React, { useState } from "react";

const ProductForm = ({ product, onSave }) => {
  const [formData, setFormData] = useState({
    name: product ? product.name : "",
    description: product ? product.description : "",
    price: product ? product.price : "",
    stock: product ? product.stock : "",
    category: product ? product.category : "",
    product_img: null, // Single product image
    gallery_imgs: [], // Multiple gallery images
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle single product image upload
  const handleProductImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      product_img: e.target.files[0], // Store only one file
    }));
  };

  // Handle multiple gallery images upload
  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      gallery_imgs: files, // Store multiple files
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submissionData = new FormData();

    submissionData.append("product_id", formData.product_id);
    submissionData.append("name", formData.name);
    submissionData.append("description", formData.description);
    submissionData.append("price", formData.price);
    submissionData.append("stock", formData.stock);
    submissionData.append("category", formData.category);

    // Append single product image
    if (formData.product_img) {
      submissionData.append("product_img", formData.product_img);
    }

    // Append multiple gallery images
    formData.gallery_imgs.forEach((image) => {
      submissionData.append("gallery_imgs", image);
    });

    onSave(submissionData);

    // Reset form
    setFormData({
      product_id: "",
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      product_img: null,
      gallery_imgs: [],
    });
  };

  return (
    <div className="max-w-[50vw] w-full mx-auto bg-white border border-gray-400 p-8 shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-6">
        {product ? "Edit Product" : "Add Product"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Product Name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Product Description"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Price"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Stock Quantity"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Category"
            required
          />
        </div>

        {/* Single Product Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProductImageChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Multiple Gallery Images Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Product Gallery Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryImagesChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          {product ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
