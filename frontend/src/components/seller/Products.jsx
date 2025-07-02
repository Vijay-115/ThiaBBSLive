import React, { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom';
import './../admin/assets/dashboard.css';
import Sidebar from './layout/sidebar';
import Navbar from './layout/Navbar';
import useDashboardLogic from "./../admin/hooks/useDashboardLogic"; 
import Modal from "react-modal";
import ProductForm from "./ProductForm";
import { ProductService } from "../../services/ProductService";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

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

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get("page")) || 1;
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", currentPage);
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
  }, [currentPage]);
  
  // Fetch Categories
    const fetchCategories = async (id) => {
      try {
        const data = await ProductService.getCategorySellerID(id);
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    
    const fetchSubCategories = async (id) => {
      try {
        const data = await ProductService.getSubCategorySellerID(id);
        setSubCategories(data);
      } catch (error) {
        console.error("Error fetching subCategories:", error);
        setErrorMessage(error.message || "Failed to fetch subCategories.");
      }
    };

    const fetchProducts = async (id) => {
      try {
        const data = await ProductService.getProductsSellerID(id);
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setErrorMessage(error.message || "Failed to fetch products.");
      }
    };    
  
    useEffect(() => {
      if(user !== null && user._id){
        fetchSubCategories(user._id);
        fetchCategories(user._id);
        fetchProducts(user._id);
      }
    }, [user]);

    useEffect(() => {
      if(user !== null){
        fetchProducts(user._id);
      }
    }, [editProduct]);

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
      console.log('handleAddProduct',productData);
        if (editProduct) {
            const updatedProduct = await ProductService.updateProduct(
                editProduct._id,
                productData
            );
            setProducts((prev) =>
                prev.map((product) =>
                    product._id === updatedProduct._id
                        ? updatedProduct
                        : product
                )
            );
            setEditProduct(null);
            // fetchProducts();
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
      await ProductService.deleteProduct(productToDelete._id);
      setProducts((prev) =>
        prev.filter(
          (product) => product._id !== productToDelete._id
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

  const handleEditProduct = async (product) => {
      if (!product) return;
      // Using useEffect will capture when `editProduct` updates
      console.log('product', product);
      setEditProduct(product); // Update state asynchronously
      setIsAddEditModalOpen(true); // Open modal after fetching variants
  };

  // Track when `editProduct` updates
  useEffect(() => {
      console.log('Updated editProduct:', editProduct);
  }, [editProduct]);

  

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
                            <ProductForm product={editProduct} categories={categories} subCategories={subCategories} onSave={handleAddProduct} setIsAddEditModalOpen={setIsAddEditModalOpen} />
                        </Modal>

                        <Modal
                            isOpen={isDeleteModalOpen}
                            onRequestClose={() => setIsDeleteModalOpen(false)}
                            contentLabel="Confirm Deletion"
                            className="modal-content"
                            overlayClassName="modal-overlay"
                        >
                            <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-sm mx-auto">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
        <i className="bx bxs-trash-alt text-3xl text-red-600 dark:text-red-300"></i>
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">Delete Product?</h3>
      <p className="text-gray-600 dark:text-gray-300 text-center mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
      <div className="flex gap-3 w-full">
        <button
          onClick={handleDeleteProduct}
          className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 text-white font-bold shadow transition-all duration-200 border-0 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Yes, Delete
        </button>
        <button
          onClick={() => setIsDeleteModalOpen(false)}
          className="flex-1 py-2 px-4 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold shadow border border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
                        </Modal>

                        {/* Enhanced Add Product & Search Bar UI (replicated from admin) */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                              onClick={openAddProductModal}
                              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-200 text-base"
                            >
                              <i className="bx bx-plus text-xl"></i>
                              Add New Product
                            </button>
                          </div>
                          <div className="flex-1 flex items-center justify-end">
                            <div className="relative w-full md:w-80">
                              <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm transition-all"
                                value={searchQuery}
                                onChange={handleSearchChange}
                              />
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                <i className="bx bx-search text-lg"></i>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 tracking-tight">Product List</h2>
                            <div className="flex flex-wrap w-full mb-[-16px]">
                              <div className="w-full px-2 mb-4">
                                <div className="overflow-x-auto rounded-xl shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                                  {paginatedProducts.length === 0 ? (
                                    <p className="text-gray-500 p-4 text-center text-sm">No products available.</p>
                                  ) : (
                                    <table className="w-full table-auto border-collapse text-sm">
                                      <thead className="bg-gray-100 dark:bg-gray-800">
                                        <tr>
                                          <th className="font-Poppins p-2 text-left font-semibold text-gray-700 dark:text-gray-200 tracking-wide">Image</th>
                                          <th className="font-Poppins p-2 pl-6 text-left font-semibold text-gray-700 dark:text-gray-200 tracking-wide">Name</th>
                                          <th className="font-Poppins p-2 text-left font-semibold text-gray-700 dark:text-gray-200 tracking-wide">Category</th>
                                          <th className="font-Poppins p-2 text-left font-semibold text-gray-700 dark:text-gray-200 tracking-wide">Subcategory</th>
                                          <th className="font-Poppins p-2 text-left font-semibold text-gray-700 dark:text-gray-200 tracking-wide">Description</th>
                                          <th className="font-Poppins p-2 text-right font-semibold text-gray-700 dark:text-gray-200 tracking-wide pr-6">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {paginatedProducts.map((product) => (
                                          <tr key={product._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-gray-800/60 transition">
                                            <td className="p-3 align-middle">
                                              <img src={import.meta.env.VITE_API_URL + '' + product.product_img ?? ''} alt="product" className="w-12 h-12 object-cover border border-gray-200 dark:border-gray-700 rounded-md shadow-sm" />
                                            </td>
                                            <td className="p-3 pl-6 align-middle font-medium text-gray-900 dark:text-gray-100">{product.name ?? ''}</td>
                                            <td className="p-3 align-middle text-gray-700 dark:text-gray-300">{product.category_id?.name ?? '-'}</td>
                                            <td className="p-3 align-middle text-gray-700 dark:text-gray-300">{product.subcategory_id?.name ?? '-'}</td>
                                            <td className="p-3 align-middle text-gray-600 dark:text-gray-400 max-w-xs truncate">{product.description ?? ''}</td>
                                            <td className="p-3 align-middle text-right">
                                              <div className="flex justify-end gap-2">
                                                <button
                                                  className="rounded-full bg-yellow-50 hover:bg-yellow-200 text-yellow-700 hover:text-yellow-900 transition shadow border border-yellow-200 hover:border-yellow-300"
                                                  onClick={() => handleEditProduct(product)}
                                                  title="Edit"
                                                  style={{ width: '30px', height: '30px', lineHeight: '35px' }}
                                                >
                                                  <i className="bx bxs-pencil text-lg"></i>
                                                </button>
                                                <button
                                                  className="rounded-full bg-red-50 hover:bg-red-200 text-red-600 hover:text-red-800 transition shadow border border-red-200 hover:border-red-300"
                                                  onClick={() => openDeleteModal(product)}
                                                  title="Delete"
                                                  style={{ width: '30px', height: '30px', lineHeight: '35px' }}
                                                >
                                                  <i className="bx bxs-trash-alt text-lg"></i>
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Super UI Pagination */}
                            <div className="mt-6 flex flex-wrap justify-center md:justify-between items-center gap-4">
                              <button
                                className="flex items-center gap-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-lg font-medium shadow disabled:opacity-50"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                              >
                                <i className="bx bx-chevron-left"></i> Previous
                              </button>
                              <div className="flex gap-1">
                                {Array.from({ length: totalPages }).map((_, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setCurrentPage(idx + 1)}
                                    className={`w-9 h-9 rounded-full font-semibold transition border-2 ${currentPage === idx + 1 ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700'}`}
                                  >
                                    {idx + 1}
                                  </button>
                                ))}
                              </div>
                              <button
                                className="flex items-center gap-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-lg font-medium shadow disabled:opacity-50"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                              >
                                Next <i className="bx bx-chevron-right"></i>
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