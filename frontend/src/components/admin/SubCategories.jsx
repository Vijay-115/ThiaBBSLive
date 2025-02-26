import React, { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom';
import './assets/dashboard.css';
import Sidebar from './layout/sidebar';
import Navbar from './layout/Navbar';
import useDashboardLogic from "./hooks/useDashboardLogic"; 
import Modal from "react-modal";
import { ProductService } from "../../services/ProductService";
import SubCategoryForm from "./SubCategoryForm";
import toast from "react-hot-toast";

const SubCategories = () => {

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

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const data = await ProductService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  
  const fetchSubCategories = async () => {
    try {
      const data = await ProductService.getSubCategories();
      setSubCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      console.error("Error fetching subCategories:", error);
      setErrorMessage(error.message || "Failed to fetch subCategories.");
    }
  };

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, [subCategories]);

  useEffect(() => {
    const filterAndSortCategories = () => {
      let filtered = subCategories.filter((subcategory) =>
        subcategory.name.toLowerCase().includes(searchQuery.toLowerCase())
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
      console.log(filtered); // Log the filtered subCategories
      setFilteredCategories(filtered);
    };
  
    filterAndSortCategories();
  }, [searchQuery, sortConfig, subCategories]); // Run when these values change

  // Update this in the search input handler:
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddCategory = async (categoryData) => {
    console.log('categoryData',categoryData);
    try {
        if (editCategory) {
            const updatedCategory = await ProductService.updateSubCategory(
                editCategory._id,
                categoryData
            );
            setSubCategories((prev) =>
                prev.map((subcategory) =>
                    subcategory._id === updatedCategory._id
                        ? updatedCategory
                        : subcategory
                )
            );
            setEditCategory(null);
            fetchCategories();
            toast.success("Category updated successfully!");
        } else {
            const newCategory = await ProductService.createSubCategory(categoryData);
            setSubCategories((prev) => [...prev, newCategory]);
            toast.success("Category created successfully!");
        }
        setErrorMessage("");
        setIsAddEditModalOpen(false);
    } catch (error) {
        console.error("Error saving subcategory:", error);
        setErrorMessage(
            error.message || "An error occurred while saving the subcategory."
        );
        toast.error("Failed to save the subcategory. Please try again.");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await ProductService.deleteSubCategory(categoryToDelete._id);
      setSubCategories((prev) =>
        prev.filter(
          (subcategory) => subcategory._id !== categoryToDelete._id
        )
      );
      setCategoryToDelete(null);
      setErrorMessage("");
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      setErrorMessage(error.message || "Failed to delete the subcategory.");
    }
  };

  const handleEditCategory = (subcategory) => {
    setEditCategory(subcategory);
    setIsAddEditModalOpen(true);
  };

  const openDeleteModal = (subcategory) => {
    setCategoryToDelete(subcategory);
    setIsDeleteModalOpen(true);
  };

  const openAddCategoryModal = () => {
    setEditCategory(null);
    setIsAddEditModalOpen(true);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

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
                                <h1>Categories</h1>
                                <ul className="breadcrumb">
                                    <li>
                                        <NavLink className="active" to="/admin/dashboard">Dashboard</NavLink>
                                    </li>
                                    <li>
                                        <i className="bx bx-chevron-right" />
                                    </li>
                                    <li>
                                        <a> Categories </a>
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
                            contentLabel="Category Form"
                            className="modal-content"
                            overlayClassName="modal-overlay"
                        >
                            <SubCategoryForm categories={categories} subcategory={editCategory} onSave={handleAddCategory} />
                        </Modal>

                        <Modal
                            isOpen={isDeleteModalOpen}
                            onRequestClose={() => setIsDeleteModalOpen(false)}
                            contentLabel="Confirm Deletion"
                            className="modal-content"
                            overlayClassName="modal-overlay"
                        >
                            <div className="p-8 bg-white rounded-lg">
                            <h3 className="text-lg">Are you sure you want to delete this subcategory?</h3>
                            <p className="mt-2">This action cannot be undone.</p>
                            <div className="mt-4">
                                <button
                                onClick={handleDeleteCategory}
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
                            onClick={openAddCategoryModal}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
                            >
                            Add New Category
                            </button>
                            <input
                            type="text"
                            placeholder="Search subCategories..."
                            className="border p-2 rounded-md text-sm"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            />
                        </div>

                        <div className="mt-8">
                            <h2 className="text-2xl font-semibold mb-4">Category List</h2>
                            <div className="flex flex-wrap w-full mb-[-24px]">
                            <div className="w-full px-[12px] mb-[24px]">
                                <div className="bb-table border-none border-[1px] md:border-solid border-[#eee] rounded-none md:rounded-[20px] overflow-hidden max-[1399px]:overflow-y-auto aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
                                {paginatedCategories.length === 0 ? (
                                <p className="text-gray-500">No subCategories available.</p>
                                ) : (
                                <table className="w-full table-auto border-collapse">
                                    <thead className="hidden md:table-header-group">
                                    <tr className="border-b-[1px] border-solid border-[#eee]">
                                        <th
                                        className="font-Poppins p-[12px] text-left text-[16px] font-medium text-secondary leading-[26px] tracking-[0.02rem] capitalize"
                                        onClick={() => handleSort("_id")}
                                        >
                                        SubCategory Name
                                        </th>
                                        <th
                                        className="font-Poppins p-[12px] text-left text-[16px] font-medium text-secondary leading-[26px] tracking-[0.02rem] capitalize"
                                        onClick={() => handleSort("_id")}
                                        >
                                        Category Name
                                        </th>
                                        <th
                                        className="font-Poppins p-[12px] text-left text-[16px] font-medium text-secondary leading-[26px] tracking-[0.02rem] capitalize"
                                        onClick={() => handleSort("name")}
                                        >
                                        Description
                                        </th>
                                        <th className="font-Poppins p-[12px] text-left text-[16px] font-medium text-secondary leading-[26px] tracking-[0.02rem] capitalize">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {paginatedCategories.map((subcategory) => (
                                        <tr key={subcategory._id} className="border-b-[1px] border-solid border-[#eee]">
                                        <td data-label="Category ID" className="p-[12px]">
                                            <div className="Category flex justify-end md:justify-normal md:items-center">
                                                <div>   
                                                    <span className="ml-[10px] block font-Poppins text-[14px] font-semibold leading-[24px] tracking-[0.03rem] text-secondary">{subcategory.name ?? ''}</span>                                                    
                                                </div>
                                            </div>
                                        </td>
                                        <td data-label="Category ID" className="p-[12px]">
                                            <div className="Category flex justify-end md:justify-normal md:items-center">
                                                <div>   
                                                    <span className="ml-[10px] block font-Poppins text-[14px] font-normal leading-[24px] tracking-[0.03rem] text-secondary">{
                                                      subcategory?.category_id?.name ?? ''  
                                                    }</span>                                                    
                                                </div>
                                            </div>
                                        </td>
                                        <td data-label="Name" className="p-[12px]">
                                          <span className="ml-[10px] block font-Poppins text-[14px] font-normal leading-[16px] tracking-[0.03rem] text-secondary">{subcategory.description ?? ''}</span>
                                        </td>
                                        <td data-label="Action" className="p-[12px]">
                                            <button
                                            className="bg-yellow-500 text-white px-4 py-1 rounded-md"
                                            onClick={() => handleEditCategory(subcategory)}
                                            >
                                            Edit
                                            </button>
                                            <button
                                            className="bg-red-500 text-white px-4 py-1 ml-2 rounded-md"
                                            onClick={() => openDeleteModal(subcategory)}
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

export default SubCategories;