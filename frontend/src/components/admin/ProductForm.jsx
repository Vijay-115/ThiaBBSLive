import React, { useState } from "react";

const ProductForm = ({ product, onSave }) => {
  const [formData, setFormData] = useState({
    product_id: product ? product.product_id : "",
    name: product ? product.name : "",
    description: product ? product.description : "",
    price: product ? product.price : "",
    stock: product ? product.stock : "",
    category: product ? product.category : "",
    images: [], // To store uploaded image files
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: files, // Store the selected image files
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create FormData object to send the images with other form data
    const submissionData = new FormData();

    // Append form data fields
    submissionData.append("product_id", formData.product_id);
    submissionData.append("name", formData.name);
    submissionData.append("description", formData.description);
    submissionData.append("price", formData.price);
    submissionData.append("stock", formData.stock);
    submissionData.append("category", formData.category);

    // Append images (ensure images is an array of files)
    formData.images.forEach((image) => {
      submissionData.append("images", image); // Append images using the same key
    });

    // Trigger onSave function with FormData object
    onSave(submissionData);

    // Reset form after submission
    setFormData({
        product_id: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        images: [], // Reset image array
    });
  };


  return (
    <div className="max-w-md mx-auto bg-white p-8 shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-6">
        {product ? "Edit Product" : "Add Product"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Product ID</label>
          <input
            type="text"
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Product ID"
            required
          />
        </div>

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

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
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