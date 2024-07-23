import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import { Link } from "react-router-dom";

class Menu extends Component {
  static contextType = MyContext;

  state = {
    isMobileMenuOpen: false,
  };

  lnkLogoutClick = () => {
    this.context.setToken("");
    this.context.setUsername("");
    localStorage.removeItem("admin_token");
  };

  toggleMobileMenu = () => {
    this.setState((prevState) => ({ isMobileMenuOpen: !prevState.isMobileMenuOpen }));
  };

  getLinkClass = (path) => {
    return this.props.location.pathname === path ? 'text-blue-600 bg-gray-200 px-4 py-1 rounded' : 'text-gray-700 hover:text-blue-600 px-4 py-1';
  };

  render() {
    const { isMobileMenuOpen } = this.state;

    return (
      <nav className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center space-x-4">
            <Link to="/admin/home" className={`${this.getLinkClass("/admin/home")} font-semibold`}>
              Trang Chủ
            </Link>
            <button
              className="md:hidden text-gray-700 hover:text-blue-600"
              onClick={this.toggleMobileMenu}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link to="/admin/category" className={`${this.getLinkClass("/admin/category")} font-semibold`}>
              Danh Mục
            </Link>
            <Link to="/admin/product" className={`${this.getLinkClass("/admin/product")} font-semibold`}>
              Sản Phẩm
            </Link>
            <Link to="/admin/order" className={`${this.getLinkClass("/admin/order")} font-semibold`}>
              Đơn Hàng
            </Link>
            <Link to="/admin/customer" className={`${this.getLinkClass("/admin/customer")} font-semibold`}>
              Khách Hàng
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-gray-700">
              <b>{this.context.username}</b>
            </span>
            <Link to="/admin/home" onClick={this.lnkLogoutClick} className="text-gray-700 hover:text-red-600 font-semibold">
              Đăng Xuất
            </Link>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md">
            <ul className="flex flex-col space-y-2 py-2 px-4">
              <li>
                <Link to="/admin/category" className={`${this.getLinkClass("/admin/category")} font-semibold`}>
                  Danh Mục
                </Link>
              </li>
              <li>
                <Link to="/admin/product" className={`${this.getLinkClass("/admin/product")} font-semibold`}>
                  Sản Phẩm
                </Link>
              </li>
              <li>
                <Link to="/admin/order" className={`${this.getLinkClass("/admin/order")} font-semibold`}>
                  Đơn Hàng
                </Link>
              </li>
              <li>
                <Link to="/admin/customer" className={`${this.getLinkClass("/admin/customer")} font-semibold`}>
                  Khách Hàng
                </Link>
              </li>
              <li>
                <span className="text-gray-700">
                  <b>{this.context.username}</b>
                </span>
              </li>
              <li>
                <Link to="/admin/home" onClick={this.lnkLogoutClick} className="text-gray-700 hover:text-red-600 font-semibold">
                  Đăng Xuất
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    );
  }
}

export default Menu;
