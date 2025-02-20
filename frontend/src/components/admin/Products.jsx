import React, { useEffect, useState } from "react";
import { getMetrics } from '../../services/adminService';
import { NavLink } from 'react-router-dom';
import './assets/dashboard.css';
import Sidebar from './layout/sidebar';
import Navbar from './layout/Navbar';
import useDashboardLogic from "./hooks/useDashboardLogic"; 
import Modal from "react-modal";
import ProductForm from "./ProductForm";
import { ProductService } from "../../services/ProductService";
import toast from "react-hot-toast";

const Products = () => {

    const {
        isSidebarHidden,
        toggleSidebar,
        isSearchFormShown,
        toggleSearchForm,
        isDarkMode,
        toggleDarkMode,
        isNotificationMenuOpen,
        toggleNotificationMenu,
        isProfileMenuOpen,
        toggleProfileMenu,
    } = useDashboardLogic();

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
    const filterAndSortProducts = () => {
      let filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
      // Sorting logic
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
      console.log(filtered); // Log the filtered products
      setFilteredProducts(filtered);
    };
  
    filterAndSortProducts();
  }, [searchQuery, sortConfig, products]); // Run when these values change

  // Update this in the search input handler:
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

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
            toast.success("Product updated successfully!");
        } else {
            const newProduct = await ProductService.createProduct(productData);
            setProducts((prev) => [...prev, newProduct]);
            toast.success("Product created successfully!");
        }
        setErrorMessage("");
        setIsAddEditModalOpen(false);
    } catch (error) {
        console.error("Error saving product:", error);
        setErrorMessage(
            error.message || "An error occurred while saving the product."
        );
        toast.error("Failed to save the product. Please try again.");
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
        <>

            <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />

            <div className={isDarkMode ? 'dark' : ''}>

                <Sidebar isSidebarHidden={isSidebarHidden} toggleSidebar={toggleSidebar} />

                <section id="content">

                    <Navbar isDarkMode={isDarkMode}
                        toggleDarkMode={toggleDarkMode}
                        toggleSidebar={toggleSidebar}
                        isSidebarHidden={isSidebarHidden}
                        isNotificationMenuOpen={isNotificationMenuOpen}
                        toggleNotificationMenu={toggleNotificationMenu}
                        isProfileMenuOpen={isProfileMenuOpen}
                        toggleProfileMenu={toggleProfileMenu}
                        isSearchFormShown={isSearchFormShown}
                        toggleSearchForm={toggleSearchForm}
                    />

                    <main>
                        <div className="head-title">
                            <div className="left">
                                <h1>Products</h1>
                                <ul className="breadcrumb">
                                    <li>
                                        <NavLink className="active" to="/admin/dashboard">Dashboard</NavLink>
                                    </li>
                                    <li>
                                        <i className="bx bx-chevron-right" />
                                    </li>
                                    <li>
                                        <a> Products </a>
                                    </li>
                                </ul>
                            </div>
                            <NavLink className="btn-download" to="#">
                                <i className="bx bxs-cloud-download bx-fade-down-hover" />
                                <span className="text">Download PDF</span>
                            </NavLink>
                        </div>
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

                        <div className="mb-4 flex gap-4 justify-between">
                            <button
                            onClick={openAddProductModal}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
                            >
                            Add New Product
                            </button>
                            <input
                            type="text"
                            placeholder="Search products..."
                            className="border p-2 rounded-md text-sm"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            />
                        </div>

                        <div className="mt-8">
                            <h2 className="text-2xl font-semibold mb-4">Product List</h2>
                            <div className="flex flex-wrap w-full mb-[-24px]">
                            <div className="w-full px-[12px] mb-[24px]">
                                <div className="bb-table border-none border-[1px] md:border-solid border-[#eee] rounded-none md:rounded-[20px] overflow-hidden max-[1399px]:overflow-y-auto aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
                                {paginatedProducts.length === 0 ? (
                                <p className="text-gray-500">No products available.</p>
                                ) : (
                                <table className="w-full table-auto border-collapse">
                                    <thead className="hidden md:table-header-group">
                                    <tr className="border-b-[1px] border-solid border-[#eee]">
                                        <th
                                        className="font-Poppins p-[12px] text-left text-[16px] font-medium text-secondary leading-[26px] tracking-[0.02rem] capitalize"
                                        onClick={() => handleSort("product_id")}
                                        >
                                        Product ID
                                        </th>
                                        <th
                                        className="font-Poppins p-[12px] text-left text-[16px] font-medium text-secondary leading-[26px] tracking-[0.02rem] capitalize"
                                        onClick={() => handleSort("name")}
                                        >
                                        Name
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
                                    {paginatedProducts.map((product) => (
                                        <tr key={product.product_id} className="border-b-[1px] border-solid border-[#eee]">
                                        <td data-label="Product ID" className="p-[12px]">
                                            <div className="Product flex justify-end md:justify-normal md:items-center">
                                                <img src={import.meta.env.VITE_API_URL+''+product.product_img ?? ''} alt="new-product-1" className="w-[70px] border-[1px] border-solid border-[#eee] rounded-[10px]"/>
                                                <div>   
                                                    <span className="ml-[10px] block font-Poppins text-[14px] font-semibold leading-[24px] tracking-[0.03rem] text-secondary">{product.name ?? ''}</span>
                                                    <span className="ml-[10px] block font-Poppins text-[12px] font-normal leading-[16px] tracking-[0.03rem] text-secondary">{product.description ?? ''}</span>
                                                    <div className='px-2'>
                                                    {Array.from({ length: 5 }).map((_, index) => (
                                                    <i
                                                        key={index}
                                                        className={`ri-star-fill float-left text-[15px] mr-[3px] ${
                                                        index < product.rating ? 'text-[#e7d52e]' : 'text-[#777]'
                                                        }`}
                                                    ></i>
                                                    ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td data-label="Name" className="p-[12px]">
                                            <span className="price font-Poppins text-[15px] font-medium leading-[26px] tracking-[0.02rem] text-secondary">₹{product.price ?? ''}</span>
                                        </td>
                                        <td data-label="Price" className="p-[12px]">{product.price}</td>
                                        <td data-label="Action" className="p-[12px]">
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
                            </div>

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
                    </main>
                </section>
            </div>


        </>
    );
};

export default Products;