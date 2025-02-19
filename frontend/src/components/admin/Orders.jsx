// import { getOrders, updateOrderStatus } from '../../services/adminService';
import React from "react";
import { getMetrics } from '../../services/adminService';
import { NavLink } from 'react-router-dom';
import './assets/dashboard.css';
import Sidebar from './layout/sidebar';
import Navbar from './layout/Navbar';
import useDashboardLogic from "./hooks/useDashboardLogic";

const Orders = () => {

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
                                <h1>Orders</h1>
                                <ul className="breadcrumb">
                                    <li>
                                        <NavLink className="active" to="/admin/dashboard">Dashboard</NavLink>
                                    </li>
                                    <li>
                                        <i className="bx bx-chevron-right" />
                                    </li>
                                    <li>
                                        <a> Orders </a>
                                    </li>
                                </ul>
                            </div>
                            <NavLink className="btn-download" to="#">
                                <i className="bx bxs-cloud-download bx-fade-down-hover" />
                                <span className="text">Download PDF</span>
                            </NavLink>
                        </div>
                    </main>
                </section>
            </div>


        </>
    );
};

export default Orders;