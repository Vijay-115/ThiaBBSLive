import React, { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom';
// import './dashboard.css';

const Sidebar = () => {
    const [isSidebarHidden, setSidebarHidden] = useState(window.innerWidth <= 576);
    return (
        <>

            <section id="sidebar" className={isSidebarHidden ? 'hide' : 'show'}>
                <NavLink className="brand" to="#">
                    <img src="/img/logo/favicon.png" className="bx bxs-smile bx-lg" />
                    <span className="text">BBSCart</span>
                </NavLink>
                <ul className="side-menu top">
                    <li className="active">
                        <NavLink to="/">
                            <i className="bx bxs-dashboard bx-sm" />
                            <span className="text">Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/">
                            <i className="bx bxs-shopping-bag-alt bx-sm" />
                            <span className="text">My Store</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/">
                            <i className="bx bxs-doughnut-chart bx-sm" />
                            <span className="text">Analytics</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/">
                            <i className="bx bxs-message-dots bx-sm" />
                            <span className="text">Message</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/">
                            <i className="bx bxs-group bx-sm" />
                            <span className="text">Team</span>
                        </NavLink>
                    </li>
                </ul>
                <ul className="side-menu bottom">
                    <li>
                        <NavLink className="logout" to="#">
                            <i className="bx bx-power-off bx-sm bx-burst-hover" />
                            <span className="text">Logout</span>
                        </NavLink>
                    </li>
                </ul>
            </section>
        </>
    );
};

export default Sidebar;