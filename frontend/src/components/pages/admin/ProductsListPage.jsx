import React, { useEffect, useState } from 'react';
import ProductForm from '../../admin/ProductForm';
import { ProductService } from '../../../service/ProductService';

function ProductsListPage() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getProducts();
        setProducts(data);
      } catch (error) {
        setErrorMessage("Failed to fetch products.");
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (productData) => {
    try {
      if (editProduct) {
        const updatedProduct = await ProductService.updateProduct(
          editProduct.product_id,
          productData
        );
        setProducts((prev) =>
          prev.map((product) =>
            product.product_id === updatedProduct.product_id
              ? updatedProduct
              : product
          )
        );
        setEditProduct(null);
      } else {
        const newProduct = await ProductService.createProduct(productData);
        setProducts((prev) => [...prev, newProduct]);
      }
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message || "An error occurred.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await ProductService.deleteProduct(productId);
      setProducts((prev) => prev.filter((product) => product.product_id !== productId));
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete the product.");
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
  };

  return (
    <div className="container mx-auto p-4">
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}
      <ProductForm product={editProduct} onSave={handleAddProduct} />
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Product List</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">No products available.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Product ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.product_id}>
                  <td className="border p-2">{product.product_id}</td>
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2">{product.price}</td>
                  <td className="border p-2">
                    <button
                      className="bg-yellow-500 text-white px-4 py-1 rounded-md"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-1 ml-2 rounded-md"
                      onClick={() => handleDeleteProduct(product.product_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ProductsListPage
