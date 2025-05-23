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
import CustomersForm from "./CustomersForm";
import { UserService } from "../../services/UserService";

const Customers = () => {

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
  const [editSeller, setEditSeller] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sellerToDelete, setSellerToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Fetch Sellers
  const fetchUsers = async () => {
    try {
      const data = await UserService.getUserRole("user");
      setSellers(data);
      setFilteredSellers(data);
      console.log("Fetching sellers:", data); // Fixed stale state issue
    } catch (error) {
      console.error("Error fetching sellers:", error);
      setErrorMessage(error.message || "Failed to fetch sellers.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filterAndSortUsers = () => {
      let filtered = sellers.filter((customer) =>
        customer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Sorting logic
      if (sortConfig.key) {
        const sortedUsers = [...filtered].sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        });
        setFilteredSellers(sortedUsers);
      } else {
        setFilteredSellers(filtered);
      }
    };

    filterAndSortUsers();
  }, [searchQuery, sortConfig, sellers]); // Optimized dependencies

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value || ""); // Ensures controlled input
  };

  const handleAddUser = async (sellerData) => {
    console.log("sellerData", sellerData);
    try {
      if (editSeller) {
        const updatedSeller = await UserService.updateUser(
          editSeller._id,
          sellerData
        );
        setSellers((prev) =>
          prev.map((customer) =>
            customer._id === updatedSeller._id ? updatedSeller : customer
          )
        );
        setEditSeller(null);
        toast.success("Customers updated successfully!");
      } else {
        const newSeller = await UserService.createUser(sellerData);
        setSellers((prev) => [...prev, newSeller]);
        toast.success("Customers created successfully!");
      }
      setErrorMessage("");
      setIsAddEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving customer:", error);
      setErrorMessage(
        error.message || "An error occurred while saving the customer."
      );
      toast.error("Failed to save the customer. Please try again.");
    }
  };

  const handleDeleteUser = async () => {
    try {
      await UserService.deleteUser(sellerToDelete._id);
      setSellers((prev) =>
        prev.filter((customer) => customer._id !== sellerToDelete._id)
      );
      setSellerToDelete(null);
      setErrorMessage("");
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting customer:", error);
      setErrorMessage(error.message || "Failed to delete the customer.");
    }
  };

  const handleEditUser = (customer) => {
    setEditSeller(customer);
    setIsAddEditModalOpen(true);
  };

  const openDeleteModal = (customer) => {
    setSellerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const openAddUserModal = () => {
    setEditSeller(null);
    setIsAddEditModalOpen(true);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const paginatedUsers = filteredSellers.slice(
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
                                <h1>Customers</h1>
                                <ul className="breadcrumb">
                                    <li>
                                        <NavLink className="active" to="/admin/dashboard">Dashboard</NavLink>
                                    </li>
                                    <li>
                                        <i className="bx bx-chevron-right" />
                                    </li>
                                    <li>
                                        <a> Customers </a>
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
                            contentLabel="Customers Form"
                            className="modal-content"
                            overlayClassName="modal-overlay"
                        >
                            <CustomersForm customer={editSeller} onSave={handleAddUser} setIsAddEditModalOpen={setIsAddEditModalOpen}/>
                        </Modal>

                        <Modal
                            isOpen={isDeleteModalOpen}
                            onRequestClose={() => setIsDeleteModalOpen(false)}
                            contentLabel="Confirm Deletion"
                            className="modal-content"
                            overlayClassName="modal-overlay"
                        >
                            <div className="p-8 bg-white rounded-lg">
                              <h3 className="text-lg">Are you sure you want to delete this customer?</h3>
                              <p className="mt-2">This action cannot be undone.</p>
                              <div className="mt-4">
                                  <button
                                  onClick={handleDeleteUser}
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
                            onClick={openAddUserModal}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
                            >
                            Add New Customers
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
                            <h2 className="text-2xl font-semibold mb-4">Customers List</h2>
                            <div className="flex flex-wrap w-full mb-[-24px]">
                            <div className="w-full px-[12px] mb-[24px]">
                                <div className="bb-table border-none border-[1px] md:border-solid border-[#eee] rounded-none md:rounded-[20px] overflow-hidden max-[1399px]:overflow-y-auto aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
                                {paginatedUsers.length === 0 ? (
                                <p className="text-gray-500">No sellers available.</p>
                                ) : (
                                  <table className="w-full table-auto border-collapse">
                                    <thead className="hidden md:table-header-group">
                                      <tr className="border-b-[1px] border-solid border-[#eee]">
                                        <th
                                          className="font-Poppins p-[12px] text-left text-[16px] font-medium text-secondary leading-[26px] tracking-[0.02rem] capitalize cursor-pointer"
                                          onClick={() => handleSort("name")}
                                        >
                                          Customers Name
                                        </th>
                                        <th
                                          className="font-Poppins p-[12px] text-left text-[16px] font-medium text-secondary leading-[26px] tracking-[0.02rem] capitalize cursor-pointer"
                                          onClick={() => handleSort("email")}
                                        >
                                          Email
                                        </th>
                                        <th
                                          className="font-Poppins p-[12px] text-left text-[16px] font-medium text-secondary leading-[26px] tracking-[0.02rem] capitalize cursor-pointer"
                                          onClick={() => handleSort("userdetails.phone")}
                                        >
                                          Phone
                                        </th>
                                        <th
                                          className="font-Poppins p-[12px] text-left text-[16px] font-medium text-secondary leading-[26px] tracking-[0.02rem] capitalize cursor-pointer"
                                          onClick={() => handleSort("created_at")}
                                        >
                                          Date & Time
                                        </th>
                                        <th className="font-Poppins p-[12px] text-left text-[16px] font-medium text-secondary leading-[26px] tracking-[0.02rem] capitalize">
                                          Actions
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {paginatedUsers.map((user) => (
                                        <tr key={user._id} className="border-b-[1px] border-solid border-[#eee]">
                                          <td data-label="Customers Name" className="p-[12px]">
                                            <div className="Customers flex justify-end md:justify-normal md:items-center">
                                              <div>
                                                <span className="ml-[10px] block font-Poppins text-[14px] font-semibold leading-[24px] tracking-[0.03rem] text-secondary">
                                                  {user?.name ?? "-"}
                                                </span>
                                              </div>
                                            </div>
                                          </td>
                                          <td data-label="Email" className="p-[12px]">
                                            <span className="price font-Poppins text-[15px] font-medium leading-[26px] tracking-[0.02rem] text-secondary">
                                              {user?.email ?? "-"}
                                            </span>
                                          </td>
                                          <td data-label="Phone" className="p-[12px]">
                                            {user?.userdetails?.phone || "-"}
                                          </td>
                                          <td data-label="Date & Time" className="p-[12px]">
                                            {moment(user?.created_at).format("DD-MM-YYYY h:mm A") || "-"}
                                          </td>
                                          <td data-label="Action" className="p-[12px]">
                                            <button
                                              className="bg-yellow-500 text-white px-4 py-1 rounded-md"
                                              onClick={() => handleEditUser(user)}
                                            >
                                              Edit
                                            </button>
                                            <button
                                              className="bg-red-500 text-white px-4 py-1 ml-2 rounded-md"
                                              onClick={() => openDeleteModal(user)}
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

export default Customers;