import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Order extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }

  componentDidMount() {
    this.apiGetOrders();
  }

  trItemClick = (item) => {
    this.setState({ order: item });
  };

  lnkApproveClick = (id) => {
    this.apiPutOrderStatus(id, 'APPROVED');
  };

  lnkCancelClick = (id) => {
    this.apiPutOrderStatus(id, 'CANCELED');
  };

  apiGetOrders = () => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    }).catch(() => {
      toast.error('Có lỗi xảy ra khi lấy danh sách đơn hàng!');
    });
  };

  apiPutOrderStatus = (id, status) => {
    const body = { status: status };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/orders/status/' + id, body, config).then((res) => {
      const result = res.data;
      if (result) {
        toast.success('Cập nhật trạng thái thành công!');
        this.apiGetOrders();
      } else {
        toast.error('Cập nhật trạng thái thất bại!');
      }
    }).catch(() => {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái!');
    });
  };

  render() {
    const orders = this.state.orders.map((item) => (
      <tr
        key={item._id}
        className="hover:bg-gray-100 cursor-pointer"
        onClick={() => this.trItemClick(item)}
      >
        <td className="px-4 py-2 border">{item._id}</td>
        <td className="px-4 py-2 border">{new Date(item.cdate).toLocaleString()}</td>
        <td className="px-4 py-2 border">{item.customer.name}</td>
        <td className="px-4 py-2 border">{item.customer.phone}</td>
        <td className="px-4 py-2 border">{item.total}</td>
        <td className="px-4 py-2 border">{item.status}</td>
        <td className="px-4 py-2 border">
          {item.status === 'PENDING' ? (
            <div>
              <span className="text-blue-500 cursor-pointer" onClick={() => this.lnkApproveClick(item._id)}>
                DUYỆT 
              </span> 
              || 
              <span className="text-red-500 cursor-pointer" onClick={() => this.lnkCancelClick(item._id)}>
                HỦY
              </span>
            </div>
          ) : (
            <div />
          )}
        </td>
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
        <ToastContainer />
        <div className="overflow-x-auto">
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
                <th className="px-4 py-2 border">Hành Động</th>
              </tr>
            </thead>
            <tbody>{orders}</tbody>
          </table>
        </div>
        {orderDetails}
      </div>
    );
  }
}

export default Order;
