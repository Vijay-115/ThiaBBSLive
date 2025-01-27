import React, { useEffect, useState } from "react";
import Modal from "react-modal"; // Import the Modal component
import ProductForm from "../../admin/ProductForm";
import { ProductService } from "../../../service/ProductService";

Modal.setAppElement("#root"); // To avoid accessibility issues

function ProductsListPage() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false); // Modal state for add/edit
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal state for delete confirmation
  const [productToDelete, setProductToDelete] = useState(null); // Product selected for deletion

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setErrorMessage(error.message || "Failed to fetch products.");
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
      setIsAddEditModalOpen(false); // Close the modal after saving
    } catch (error) {
      console.error("Error saving product:", error);
      setErrorMessage(error.message || "An error occurred while saving the product.");
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await ProductService.deleteProduct(productToDelete.product_id);
      setProducts((prev) =>
        prev.filter((product) => product.product_id !== productToDelete.product_id)
      );
      setProductToDelete(null);
      setErrorMessage("");
      setIsDeleteModalOpen(false); // Close the delete modal after deleting
    } catch (error) {
      console.error("Error deleting product:", error);
      setErrorMessage(error.message || "Failed to delete the product.");
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setIsAddEditModalOpen(true); // Open the modal for editing
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  const openAddProductModal = () => {
    setEditProduct(null); // Ensure no product is selected for editing
    setIsAddEditModalOpen(true); // Open the modal for adding a new product
  };

  return (
    <div className="container mx-auto p-4">
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isAddEditModalOpen}
        onRequestClose={() => setIsAddEditModalOpen(false)}
        contentLabel="Product Form"
        className="modal-content"
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={true} // Allow closing when clicking overlay
      >
        <ProductForm product={editProduct} onSave={handleAddProduct} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        contentLabel="Confirm Deletion"
        className="modal-content"
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={true} // Allow closing when clicking overlay
      >
        <div className="p-4">
          <h3 className="text-lg">Are you sure you want to delete this product?</h3>
          <p className="mt-2">This action cannot be undone.</p>
          <div className="mt-4">
            <button
              onClick={handleDeleteProduct}
              className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Create Product Button */}
      <div className="mb-4">
        <button
          onClick={openAddProductModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add New Product
        </button>
      </div>

      {/* Product List */}
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
                      onClick={() => openDeleteModal(product)}
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

export default ProductsListPage;
