import React from "react";
import { getMetrics } from '../../services/api';
import { NavLink } from 'react-router-dom';
import './assets/dashboard.css';
import Sidebar from './layout/sidebar';
import Navbar from './layout/Navbar';
import useDashboardLogic from "./hooks/useDashboardLogic"; 

const Dashboard = () => {

    // const [isSidebarHidden, setSidebarHidden] = useState(window.innerWidth <= 576);
    // const [isSearchFormShown, setSearchFormShown] = useState(false);
    // const [isDarkMode, setDarkMode] = useState(false);
    // const [isNotificationMenuOpen, setNotificationMenuOpen] = useState(false);
    // const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);

    // useEffect(() => {
    //     const handleResize = () => {
    //         setSidebarHidden(window.innerWidth <= 576);
    //     };

    //     window.addEventListener('resize', handleResize);
    //     handleResize(); // Adjust on mount

    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, []);

    // const toggleSidebar = () => {
    //     setSidebarHidden((prev) => !prev);
    // };

    // const toggleSearchForm = (e) => {
    //     e.preventDefault();
    //     setSearchFormShown((prev) => !prev);
    // };

    // const toggleDarkMode = () => {
    //     setDarkMode((prev) => !prev);
    // };

    // const toggleNotificationMenu = () => {
    //     setNotificationMenuOpen((prev) => !prev);
    //     setProfileMenuOpen(false); // Close profile menu if open
    // };

    // const toggleProfileMenu = () => {
    //     setProfileMenuOpen((prev) => !prev);
    //     setNotificationMenuOpen(false); // Close notification menu if open
    // };

    // const closeMenus = (e) => {
    //     if (!e.target.closest('.notification') && !e.target.closest('.profile')) {
    //         setNotificationMenuOpen(false);
    //         setProfileMenuOpen(false);
    //     }
    // };

    // useEffect(() => {
    //     document.addEventListener('click', closeMenus);
    //     return () => {
    //         document.removeEventListener('click', closeMenus);
    //     };
    // }, []);
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
                                <h1>Dashboard</h1>
                                {/* <ul className="breadcrumb">
                                    <li>
                                        <a href="">Admin</a>
                                    </li>
                                    <li>
                                        <i className="bx bx-chevron-right" />
                                    </li>
                                    <li>
                                        <NavLink className="active" to="/admin/dashboard"> Dashboard </NavLink>
                                    </li>
                                </ul> */}
                            </div>
                            <NavLink className="btn-download" to="#">
                                <i className="bx bxs-cloud-download bx-fade-down-hover" />
                                <span className="text">Download PDF</span>
                            </NavLink>
                        </div>
                        <ul className="box-info">
                            <li>
                                <i className="bx bxs-calendar-check" />
                                <span className="text">
                                    <h3>1020</h3>
                                    <p>New Order</p>
                                </span>
                            </li>
                            <li>
                                <i className="bx bxs-group" />
                                <span className="text">
                                    <h3>2834</h3>
                                    <p>Visitors</p>
                                </span>
                            </li>
                            <li>
                                <i className="bx bxs-dollar-circle" />
                                <span className="text">
                                    <h3>2543.00</h3>
                                    <p>Total Sales</p>
                                </span>
                            </li>
                        </ul>
                        <div className="table-data">
                            <div className="order">
                                <div className="head">
                                    <h3>Recent Orders</h3>
                                    <i className="bx bx-search" />
                                    <i className="bx bx-filter" />
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Date Order</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <img src="https://placehold.co/600x400/png" />
                                                <p>Micheal John</p>
                                            </td>
                                            <td>18-10-2021</td>
                                            <td>
                                                <span className="status completed">Completed</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <img src="https://placehold.co/600x400/png" />
                                                <p>Ryan Doe</p>
                                            </td>
                                            <td>01-06-2022</td>
                                            <td>
                                                <span className="status pending">Pending</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <img src="https://placehold.co/600x400/png" />
                                                <p>Tarry White</p>
                                            </td>
                                            <td>14-10-2021</td>
                                            <td>
                                                <span className="status process">Process</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <img src="https://placehold.co/600x400/png" />
                                                <p>Selma</p>
                                            </td>
                                            <td>01-02-2023</td>
                                            <td>
                                                <span className="status pending">Pending</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <img src="https://placehold.co/600x400/png" />
                                                <p>Andreas Doe</p>
                                            </td>
                                            <td>31-10-2021</td>
                                            <td>
                                                <span className="status completed">Completed</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="todo">
                                <div className="head">
                                    <h3>Todos</h3>
                                    <i className="bx bx-plus icon" />
                                    <i className="bx bx-filter" />
                                </div>
                                <ul className="todo-list">
                                    <li className="completed">
                                        <p>Check Inventory</p>
                                        <i className="bx bx-dots-vertical-rounded" />
                                    </li>
                                    <li className="completed">
                                        <p>Manage Delivery Team</p>
                                        <i className="bx bx-dots-vertical-rounded" />
                                    </li>
                                    <li className="not-completed">
                                        <p>Contact Selma: Confirm Delivery</p>
                                        <i className="bx bx-dots-vertical-rounded" />
                                    </li>
                                    <li className="completed">
                                        <p>Update Shop Catalogue</p>
                                        <i className="bx bx-dots-vertical-rounded" />
                                    </li>
                                    <li className="not-completed">
                                        <p>Count Profit Analytics</p>
                                        <i className="bx bx-dots-vertical-rounded" />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </main>
                </section>
            </div>


        </>
    );
};

export default Dashboard;