import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import ProductForm from "../../admin/ProductForm";
import { ProductService } from "../../../service/ProductService";

Modal.setAppElement("#root");

function ProductsListPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setErrorMessage(error.message || "Failed to fetch products.");
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to the first page when filters or sorting change
  }, [searchQuery, sortConfig, products]);

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
      setIsAddEditModalOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
      setErrorMessage(
        error.message || "An error occurred while saving the product."
      );
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await ProductService.deleteProduct(productToDelete.product_id);
      setProducts((prev) =>
        prev.filter(
          (product) => product.product_id !== productToDelete.product_id
        )
      );
      setProductToDelete(null);
      setErrorMessage("");
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      setErrorMessage(error.message || "Failed to delete the product.");
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setIsAddEditModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const openAddProductModal = () => {
    setEditProduct(null);
    setIsAddEditModalOpen(true);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="container mx-auto p-4">
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      <Modal
        isOpen={isAddEditModalOpen}
        onRequestClose={() => setIsAddEditModalOpen(false)}
        contentLabel="Product Form"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <ProductForm product={editProduct} onSave={handleAddProduct} />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        contentLabel="Confirm Deletion"
        className="modal-content"
        overlayClassName="modal-overlay"
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

      <div className="mb-4 flex justify-between">
        <button
          onClick={openAddProductModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add New Product
        </button>
        <input
          type="text"
          placeholder="Search products..."
          className="border p-2 rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Product List</h2>
        {paginatedProducts.length === 0 ? (
          <p className="text-gray-500">No products available.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th
                  className="border p-2 cursor-pointer"
                  onClick={() => handleSort("product_id")}
                >
                  Product ID
                </th>
                <th
                  className="border p-2 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name
                </th>
                <th
                  className="border p-2 cursor-pointer"
                  onClick={() => handleSort("price")}
                >
                  Price
                </th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
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

        <div className="mt-4 flex justify-between items-center">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductsListPage;
