import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class CategoryDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtName: '',
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({ txtID: this.props.item?._id, txtName: this.props.item?.name });
    }
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  btnAddClick = (e) => {
    e.preventDefault();
    const name = this.state.txtName;
    if (name) {
      const cate = { name };
      this.apiPostCategory(cate);
    } else {
      alert('Vui lòng nhập tên');
    }
  };

  btnUpdateClick = (e) => {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    if (id && name) {
      const cate = { name };
      this.apiPutCategory(id, cate);
    } else {
      alert('Vui lòng nhập id và tên');
    }
  };

  btnDeleteClick = (e) => {
    e.preventDefault();
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      const id = this.state.txtID;
      if (id) {
        this.apiDeleteCategory(id);
      } else {
        alert('Vui lòng nhập id');
      }
    }
  };

  apiPostCategory = (cate) => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/categories', cate, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Thêm thành công!');
        this.apiGetCategories();
      } else {
        alert('Thêm thất bại!');
      }
    });
  };

  apiPutCategory = (id, cate) => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/categories/' + id, cate, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Cập nhật thành công!');
        this.apiGetCategories();
      } else {
        alert('Cập nhật thất bại!');
      }
    });
  };

  apiDeleteCategory = (id) => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/categories/' + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Xóa thành công!');
        this.apiGetCategories();
      } else {
        alert('Xóa thất bại!');
      }
    });
  };

  apiGetCategories = () => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.props.updateCategories(result);
    });
  };

  render() {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-center text-2xl font-bold mb-4 text-gray-700">Chi Tiết Danh Mục</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">ID</label>
            <input
              disabled
              type="text"
              name="txtID"
              value={this.state.txtID}
              onChange={this.handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tên</label>
            <input
              type="text"
              name="txtName"
              value={this.state.txtName}
              onChange={this.handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={this.btnAddClick}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Thêm Mới
            </button>
            <button
              onClick={this.btnUpdateClick}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Cập Nhật
            </button>
            <button
              onClick={this.btnDeleteClick}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Xóa
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CategoryDetail;
