import React, { useEffect, useState } from "react";
import {  NavLink } from 'react-router-dom';
import './assets/dashboard.css';
import Sidebar from './layout/sidebar';
import Navbar from './layout/Navbar';
import useDashboardLogic from "./hooks/useDashboardLogic"; 
import Modal from "react-modal";
import { vendorApprove, vendorRequest } from "../../services/vendorService";
import ViewUserRequest from "./ViewUserRequest";
import moment from "moment";

const UserRequest = () => {

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

  const [vendors, setVendors] = useState([]);
  const [filteredvendors, setFilteredvendors] = useState([]);
  const [editVendor, setEditVendor] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vendorToDelete, setvendorToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const [roleFilter, setRoleFilter] = useState("all");

  const [isDeclineModalOpen, setIsDeclinModalOpen] = useState(false);
  const [declineData, setDeclineData] = useState({
      user_id: '', decline_reason: ''
  });

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
  
  // Update the filter logic to show only selected roles
  const filterAndSortUsers = () => {
      let filtered = vendors.filter((vendor) => 
          vendor?.vendor_fname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor?.vendor_lname?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredvendors(filtered);
  };

  const fetchRequest = async () => {
    try {
      const data = await vendorRequest();
      // const data = await Promise.all(roles.map((role) => UserService.getUserRole(role)));
      setVendors(data);
      setFilteredvendors(data);
      console.log("Fetching vendors:", data); // Fixed stale state issue
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setErrorMessage(error.message || "Failed to fetch vendors.");
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  useEffect(() => {
    const filterAndSortUsers = () => {
      let filtered = vendors.filter((vendor) =>
        vendor?.vendor_fname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor?.vendor_lname?.toLowerCase().includes(searchQuery.toLowerCase())
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
        setFilteredvendors(sortedUsers);
      } else {
        setFilteredvendors(filtered);
      }
    };

    filterAndSortUsers();
  }, [searchQuery, sortConfig, vendors]); // Optimized dependencies

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value || ""); // Ensures controlled input
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleApproveOpen = (vendor) => {
    setEditVendor(prevState => {
        console.log('Previous State:', prevState);
        console.log('New State:', vendor);
        return vendor;
    });

    setIsApproveModalOpen(true);
  };

  const handleApproveUser = async () => {
    try {
      const data = await vendorApprove(editVendor._id);
      setVendors((prev) =>
        prev.filter((vendor) => vendor._id !== editVendor._id)
      );
      console.log("Vendor Approved:", data);
      setEditVendor(null);
      setIsApproveModalOpen(false);
    } catch (error) {
      console.error("Error approve vendor:", error);
      setErrorMessage(error.message || "Failed to approve the vendor.");
    }
  }

  const handleDeclineOpen = (vendor) => {
      setDeclineData((prevData) => ({
          ...prevData,
          user_id: vendor._id,
      }));
      setIsDeclinModalOpen(true);
  };
  const handleChange = (e) => {
      const { name, value } = e.target;
      setDeclineData((prev) => ({
      ...prev,
      [name]: value || "", // Ensuring empty string instead of undefined
      }));
      console.log('declineData handleChange',declineData);
  };

  const handleDeclineSubmit = async (e) => {
    e.preventDefault();
    console.log('declineData',declineData);
    try {
        const res = await vendoDecline(declineData);
        if(res.success === true){
            console.log('handleDeclineSubmit',res.message);
            toast.success("Decline Done");
            navigate("/");
        }
    } catch (error) {
        toast.error(error.message || "Agent registration failed. Try again.");
    }
}

  const paginatedUsers = filteredvendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredvendors.length / itemsPerPage);
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
                              <h1>User Request</h1>
                              <ul className="breadcrumb">
                                  <li>
                                      <NavLink className="active" to="/admin/dashboard">Dashboard</NavLink>
                                  </li>
                                  <li>
                                      <i className="bx bx-chevron-right" />
                                  </li>
                                  <li>
                                      <a> User Request </a>
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
                      {/* Approve Request */}
                      <Modal
                        isOpen={isApproveModalOpen}
                        onRequestClose={() => setIsApproveModalOpen(false)}
                        shouldCloseOnOverlayClick={true}
                        shouldCloseOnEsc={true}
                        className="modal-content"
                        overlayClassName="modal-overlay"
                      >
                        <ViewUserRequest vendorData={editVendor} onApprove={handleApproveUser} setIsApproveModalOpen={setIsApproveModalOpen} />
                      </Modal>
                      {/* Decline Request */}
                      <Modal
                        isOpen={isDeclineModalOpen}
                        onRequestClose={() => setIsDeclinModalOpen(false)}
                        shouldCloseOnOverlayClick={true}
                        shouldCloseOnEsc={true}
                        className="modal-content"
                        overlayClassName="modal-overlay"
                      >
                      <div className="bg-white rounded-[20px] shadow-lg p-3">
                          <div className="relative">
                              <span className="popup-close" onClick={() => setIsDeclinModalOpen(false)}><i className="ri-close-circle-line"></i></span>
                          </div>
                          <div className="formSec m-auto">
                              <h1 className="text-2xl font-bold text-center mt-6">Reason for Decline</h1>
                              <form className="grid grid-cols-2 m-auto px-6 pb-5 gap-x-4" onSubmit={handleDeclineSubmit} encType="multipart/form-data">
                                  <div className="col-span-2 mt-3">
                                      <label className="block text-[14px] font-medium text-secondary mb-[8px]">Reason</label>
                                      <textarea
                                          name="decline_reason"
                                          placeholder="Enter Decline Reason"
                                          className="w-full p-[10px] text-[14px] border border-[#eee] rounded-[10px]"
                                          value={declineData.decline_reason}
                                          onChange={handleChange}
                                      />
                                  </div>
                                  <div className="col-span-2">
                                      <button className="bg-gradient-to-r from-logoSecondary to-logoPrimary shadow-lg mt-6 p-[9.85px] text-white rounded-lg w-full">
                                          Confirm Decline
                                      </button>
                                  </div>
                              </form>
                          </div>
                      </div>
                      </Modal>

                      <div className="mb-4 flex gap-4 justify-between">
                          <input
                          type="text"
                          placeholder="Search Vendor..."
                          className="border p-3 rounded-md text-sm"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          />
                      </div>

                      <div className="mt-8">
                          <h2 className="text-2xl font-semibold mb-4">User Request List</h2>
                          <div className="flex flex-wrap w-full mb-[-24px]">
                          <div className="w-full px-[12px] mb-[24px]">
                              <div className="bb-table border-none border-[1px] md:border-solid border-[#eee] rounded-none md:rounded-[20px] overflow-hidden max-[1399px]:overflow-y-auto aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
                              {paginatedUsers.length === 0 ? (
                              <p className="text-gray-500">No Vendors available.</p>
                              ) : (
                                <table className="w-full table-auto border-collapse">
                                  <thead className="hidden md:table-header-group">
                                    <tr className="border-b-[1px] border-solid border-[#eee]">
                                      <th
                                        className="font-Poppins p-[12px] text-left text-[16px] font-medium text-secondary leading-[26px] tracking-[0.02rem] capitalize cursor-pointer"
                                        onClick={() => handleSort("name")}
                                      >
                                        User Request Name
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
                                    {paginatedUsers.map((vendor) => (
                                      <tr key={vendor._id} className="border-b-[1px] border-solid border-[#eee]">
                                        <td data-label="User Request Name" className="p-[12px]">
                                          <div className="User Request flex justify-end md:justify-normal md:items-center">
                                            <div>
                                              <span className="ml-[10px] block font-Poppins text-[14px] font-semibold leading-[24px] tracking-[0.03rem] text-secondary">
                                                {vendor?.vendor_fname ? vendor?.vendor_fname +' '+vendor?.vendor_lname  :  "-"}
                                              </span>
                                            </div>
                                          </div>
                                        </td>
                                        <td data-label="Email" className="p-[12px]">
                                          <span className="price font-Poppins text-[15px] font-medium leading-[26px] tracking-[0.02rem] text-secondary">
                                            {vendor?.email ?? "-"}
                                          </span>
                                        </td>
                                        <td data-label="Phone" className="p-[12px]">
                                          {vendor?.mobile || "-"}
                                        </td>
                                        <td data-label="Date & Time" className="p-[12px]">
                                          {moment(vendor?.created_at).format("DD-MM-YYYY h:mm A") || "-"}
                                        </td>
                                        <td data-label="Action" className="p-[12px]">
                                          <button
                                            className="bg-yellow-500 text-white px-4 py-1 rounded-md"
                                            onClick={() => handleApproveOpen(vendor)}
                                          >
                                            View
                                          </button>
                                          {!vendor.is_decline && (
                                              <button
                                                className="bg-red-500 text-white px-4 py-1 ml-2 rounded-md"
                                                onClick={() => handleDeclineOpen(vendor)}
                                              >
                                                Decline
                                              </button>
                                          )
                                          }                                          
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

export default UserRequest;