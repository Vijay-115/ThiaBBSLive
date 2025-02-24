import React, { useEffect, useState } from "react";
import { getMetrics } from '../../services/adminService';
import { NavLink } from 'react-router-dom';
import './assets/dashboard.css';
import Sidebar from './layout/sidebar';
import Navbar from './layout/Navbar';
import useDashboardLogic from "./hooks/useDashboardLogic"; 
import Modal from "react-modal";
import toast from "react-hot-toast";
import moment from "moment";
import SellerForm from "./SellerForm";
import { UserService } from "../../services/UserService";

const Seller = () => {

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

  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [editSellers, setEditProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sellerToDelete, setSellerToDelete] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await UserService.getUserRole('seller');
        setSellers(data);
        setFilteredSellers(data);
      } catch (error) {
        console.error("Error fetching sellers:", error);
        setErrorMessage(error.message || "Failed to fetch sellers.");
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const filterAndSortUsers = () => {
      let filtered = sellers.filter((seller) =>
        seller.name.toLowerCase().includes(searchQuery.toLowerCase())
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
      console.log(filtered); // Log the filtered sellers
      setFilteredSellers(filtered);
    };
  
    filterAndSortUsers();
  }, [searchQuery, sortConfig, sellers]); // Run when these values change

  // Update this in the search input handler:
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };


  const handleDeleteProduct = async () => {
    try {
      await UserService.deleteUser(sellerToDelete._id);
      setSellers((prev) =>
        prev.filter(
          (seller) => seller._id !== sellerToDelete._id
        )
      );
      setSellerToDelete(null);
      setErrorMessage("");
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting seller:", error);
      setErrorMessage(error.message || "Failed to delete the seller.");
    }
  };

  const handleEditProduct = (seller) => {
    setEditProduct(seller);
    setIsAddEditModalOpen(true);
  };

  const openDeleteModal = (seller) => {
    setSellerToDelete(seller);
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

  const paginatedProducts = filteredSellers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSellers.length / itemsPerPage);

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
                                <h1>Seller</h1>
                                <ul className="breadcrumb">
                                    <li>
                                        <NavLink className="active" to="/admin/dashboard">Dashboard</NavLink>
                                    </li>
                                    <li>
                                        <i className="bx bx-chevron-right" />
                                    </li>
                                    <li>
                                        <a> Seller </a>
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
                            contentLabel="Seller Form"
                            className="modal-content"
                            overlayClassName="modal-overlay"
                        >
                            <SellerForm seller={editSellers} />
                        </Modal>

                        <Modal
                            isOpen={isDeleteModalOpen}
                            onRequestClose={() => setIsDeleteModalOpen(false)}
                            contentLabel="Confirm Deletion"
                            className="modal-content"
                            overlayClassName="modal-overlay"
                        >
                            <div className="p-4">
                            <h3 className="text-lg">Are you sure you want to delete this seller?</h3>
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
                            Add New Seller
                            </button>
                            <input
                            type="text"
                            placeholder="Search sellers..."
                            className="border p-2 rounded-md text-sm"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            />
                        </div>

                        <div className="mt-8">
                            <h2 className="text-2xl font-semibold mb-4">Seller List</h2>
                            <div className="flex flex-wrap w-full mb-[-24px]">
                            <div className="w-full px-[12px] mb-[24px]">
                                <div className="bb-table border-none border-[1px] md:border-solid border-[#eee] rounded-none md:rounded-[20px] overflow-hidden max-[1399px]:overflow-y-auto aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
                                {paginatedProducts.length === 0 ? (
                                <p className="text-gray-500">No sellers available.</p>
                                ) : (
                                <table className="w-full table-auto border-collapse">
                                    <thead className="hidden md:table-header-group">
                                    <tr className="border-b-[1px] border-solid border-[#eee]">
                                        <th
                                        className="font-Poppins p-[12px] text-left text-[16px] font-medium text-secondary leading-[26px] tracking-[0.02rem] capitalize"
                                        onClick={() => handleSort("_id")}
                                        >
                                        Seller ID
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
                                    {paginatedProducts.map((seller) => (
                                        <tr key={seller._id} className="border-b-[1px] border-solid border-[#eee]">
                                        <td data-label="Seller ID" className="p-[12px]">
                                            <div className="Seller flex justify-end md:justify-normal md:items-center">
                                                <img src={import.meta.env.VITE_API_URL+''+seller.product_img ?? ''} alt="new-seller-1" className="w-[70px] border-[1px] border-solid border-[#eee] rounded-[10px]"/>
                                                <div>   
                                                    <span className="ml-[10px] block font-Poppins text-[14px] font-semibold leading-[24px] tracking-[0.03rem] text-secondary">{seller.name ?? ''}</span>
                                                    <span className="ml-[10px] block font-Poppins text-[12px] font-normal leading-[16px] tracking-[0.03rem] text-secondary">{seller.description ?? ''}</span>
                                                    <div className='px-2'>
                                                    {Array.from({ length: 5 }).map((_, index) => (
                                                    <i
                                                        key={index}
                                                        className={`ri-star-fill float-left text-[15px] mr-[3px] ${
                                                        index < seller.rating ? 'text-[#e7d52e]' : 'text-[#777]'
                                                        }`}
                                                    ></i>
                                                    ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td data-label="Name" className="p-[12px]">
                                            <span className="price font-Poppins text-[15px] font-medium leading-[26px] tracking-[0.02rem] text-secondary">₹{seller.price ?? ''}</span>
                                        </td>
                                        <td data-label="Price" className="p-[12px]">{seller.price}</td>
                                        <td data-label="Action" className="p-[12px]">
                                            <button
                                            className="bg-yellow-500 text-white px-4 py-1 rounded-md"
                                            onClick={() => handleEditProduct(seller)}
                                            >
                                            Edit
                                            </button>
                                            <button
                                            className="bg-red-500 text-white px-4 py-1 ml-2 rounded-md"
                                            onClick={() => openDeleteModal(seller)}
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

export default Seller;