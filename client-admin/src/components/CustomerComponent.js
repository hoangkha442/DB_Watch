import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Customer extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      order: null,
    };
  }

  componentDidMount() {
    this.apiGetCustomers();
  }

  trCustomerClick = (item) => {
    this.setState({ orders: [], order: null });
    this.apiGetOrdersByCustID(item._id);
  };

  trOrderClick = (item) => {
    this.setState({ order: item });
  };

  lnkEmailClick = (item) => {
    this.apiGetCustomerSendmail(item._id);
  };

  lnkDeactiveClick = (item) => {
    this.apiPutCustomerDeactive(item._id, item.token);
  };

  apiGetCustomers = () => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers', config).then((res) => {
      const result = res.data;
      this.setState({ customers: result });
    });
  };

  apiGetOrdersByCustID = (cid) => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders/customer/' + cid, config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  };

  apiGetCustomerSendmail = (id) => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers/sendmail/' + id, config).then((res) => {
      const result = res.data;
      alert(result.message);
    });
  };

  apiPutCustomerDeactive = (id, token) => {
    const body = { token: token };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/customers/deactive/' + id, body, config).then((res) => {
      const result = res.data;
      if (result) {
        this.apiGetCustomers();
      } else {
        alert('Rất tiếc, có lỗi xảy ra!');
      }
    });
  };

  render() {
    const customers = this.state.customers.map((item) => (
      <tr
        key={item._id}
        className="hover:bg-gray-100 cursor-pointer"
        onClick={() => this.trCustomerClick(item)}
      >
        <td className="px-4 py-2 border">{item._id}</td>
        <td className="px-4 py-2 border">{item.username}</td>
        <td className="px-4 py-2 border">{item.password}</td>
        <td className="px-4 py-2 border">{item.name}</td>
        <td className="px-4 py-2 border">{item.phone}</td>
        <td className="px-4 py-2 border">{item.email}</td>
        <td className="px-4 py-2 border">{item.active}</td>
        <td className="px-4 py-2 border">
          {item.active === 0 ? (
            <span className="text-blue-500 cursor-pointer" onClick={() => this.lnkEmailClick(item)}>
              Gửi Email
            </span>
          ) : (
            <span className="text-red-500 cursor-pointer" onClick={() => this.lnkDeactiveClick(item)}>
              Hủy Kích Hoạt
            </span>
          )}
        </td>
      </tr>
    ));

    const orders = this.state.orders.map((item) => (
      <tr
        key={item._id}
        className="hover:bg-gray-100 cursor-pointer"
        onClick={() => this.trOrderClick(item)}
      >
        <td className="px-4 py-2 border">{item._id}</td>
        <td className="px-4 py-2 border">{new Date(item.cdate).toLocaleString()}</td>
        <td className="px-4 py-2 border">{item.customer.name}</td>
        <td className="px-4 py-2 border">{item.customer.phone}</td>
        <td className="px-4 py-2 border">{item.total}</td>
        <td className="px-4 py-2 border">{item.status}</td>
      </tr>
    ));

    const orderDetails = this.state.order ? (
      <div className="mt-8">
        <h2 className="text-center text-2xl font-bold mb-4 text-gray-700">Chi Tiết Đơn Hàng</h2>
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">STT</th>
              <th className="px-4 py-2 border">ID Sản Phẩm</th>
              <th className="px-4 py-2 border">Tên Sản Phẩm</th>
              <th className="px-4 py-2 border">Hình Ảnh</th>
              <th className="px-4 py-2 border">Giá</th>
              <th className="px-4 py-2 border">Số Lượng</th>
              <th className="px-4 py-2 border">Thành Tiền</th>
            </tr>
          </thead>
          <tbody>
            {this.state.order.items.map((item, index) => (
              <tr key={item.product._id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{item.product._id}</td>
                <td className="px-4 py-2 border">{item.product.name}</td>
                <td className="px-4 py-2 border">
                  <img
                    src={`data:image/jpg;base64,${item.product.image}`}
                    className="w-20 h-20 object-cover"
                    alt=""
                  />
                </td>
                <td className="px-4 py-2 border">{item.product.price}</td>
                <td className="px-4 py-2 border">{item.quantity}</td>
                <td className="px-4 py-2 border">{item.product.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : null;

    return (
      <div className="p-4">
        <div className="overflow-x-auto">
          <h2 className="text-center text-2xl font-bold mb-4 text-gray-700">Danh Sách Khách Hàng</h2>
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Tên Đăng Nhập</th>
                <th className="px-4 py-2 border">Mật Khẩu</th>
                <th className="px-4 py-2 border">Tên</th>
                <th className="px-4 py-2 border">Số Điện Thoại</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Trạng Thái</th>
                <th className="px-4 py-2 border">Hành Động</th>
              </tr>
            </thead>
            <tbody>{customers}</tbody>
          </table>
        </div>
        {this.state.orders.length > 0 && (
          <div className="overflow-x-auto mt-8">
            <h2 className="text-center text-2xl font-bold mb-4 text-gray-700">Danh Sách Đơn Hàng</h2>
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Ngày Tạo</th>
                  <th className="px-4 py-2 border">Tên Khách Hàng</th>
                  <th className="px-4 py-2 border">Số Điện Thoại</th>
                  <th className="px-4 py-2 border">Tổng Tiền</th>
                  <th className="px-4 py-2 border">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>{orders}</tbody>
            </table>
          </div>
        )}
        {orderDetails}
      </div>
    );
  }
}

export default Customer;
