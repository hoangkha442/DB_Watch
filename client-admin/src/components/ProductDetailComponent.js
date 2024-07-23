import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: 0,
      cmbCategory: '',
      imgProduct: '',
      error: '',
    };
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item?._id,
        txtName: this.props.item?.name,
        txtPrice: this.props.item?.price,
        cmbCategory: this.props.item?.category._id,
        imgProduct: `data:image/jpg;base64,${this.props.item?.image}`,
        error: '',
      });
    }
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  previewImage = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState({ imgProduct: evt.target.result, error: '' });
      };
      reader.readAsDataURL(file);
    } else {
      this.setState({ error: 'Vui lòng chọn file ảnh (jpeg, png, gif)' });
    }
  };

  btnAddClick = (e) => {
    e.preventDefault();
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, ''); // remove "data:image/...;base64,"
    if (name && price && category && image) {
      const prod = { name, price, category, image };
      this.apiPostProduct(prod);
    } else {
      alert('Vui lòng nhập tên, giá, danh mục và hình ảnh');
    }
  };

  btnUpdateClick = (e) => {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, ''); // remove "data:image/...;base64,"
    if (id && name && price && category && image) {
      const prod = { name, price, category, image };
      this.apiPutProduct(id, prod);
    } else {
      alert('Vui lòng nhập id, tên, giá, danh mục và hình ảnh');
    }
  };

  btnDeleteClick = (e) => {
    e.preventDefault();
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      const id = this.state.txtID;
      if (id) {
        this.apiDeleteProduct(id);
      } else {
        alert('Vui lòng nhập id');
      }
    }
  };

  apiGetCategories = () => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  };

  apiPostProduct = (prod) => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/products', prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Thêm thành công!');
        this.apiGetProducts();
      } else {
        alert('Thêm thất bại!');
      }
    });
  };

  apiGetProducts = () => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get(`/api/admin/products?page=${this.props.curPage}`, config).then((res) => {
      const result = res.data;
      this.props.updateProducts(result.products, result.noPages, result.curPage);
      if (result.products.length !== 0) {
        this.props.updateProducts(result.products, result.noPages, result.curPage);
      } else {
        const curPage = this.props.curPage - 1;
        axios.get(`/api/admin/products?page=${curPage}`, config).then((res) => {
          const result = res.data;
          this.props.updateProducts(result.products, result.noPages, curPage);
        });
      }
    });
  };

  apiPutProduct = (id, prod) => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put(`/api/admin/products/${id}`, prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Cập nhật thành công!');
        this.apiGetProducts();
      } else {
        alert('Cập nhật thất bại!');
      }
    });
  };

  apiDeleteProduct = (id) => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete(`/api/admin/products/${id}`, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Xóa thành công!');
        this.apiGetProducts();
      } else {
        alert('Xóa thất bại!');
      }
    });
  };

  render() {
    const cates = this.state.categories.map((cate) => {
      if (this.props.item != null) {
        return (
          <option key={cate._id} value={cate._id} selected={cate._id === this.props.item.category._id}>
            {cate.name}
          </option>
        );
      } else {
        return (
          <option key={cate._id} value={cate._id}>
            {cate.name}
          </option>
        );
      }
    });

    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-center text-2xl font-bold mb-4 text-gray-700">Chi Tiết Sản Phẩm</h2>
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
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Giá</label>
            <input
              type="text"
              name="txtPrice"
              value={this.state.txtPrice}
              onChange={this.handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Hình Ảnh</label>
            <input
              type="file"
              name="fileImage"
              accept="image/jpeg, image/png, image/gif"
              onChange={this.previewImage}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            />
            {this.state.error && <p className="text-red-500 text-xs mt-2">{this.state.error}</p>}
            {this.state.imgProduct && (
              <div className="mt-4">
                <img src={this.state.imgProduct} className="w-20 h-20 rounded" alt="Product" />
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Danh Mục</label>
            <select
              onChange={(e) => { this.setState({ cmbCategory: e.target.value }) }}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            >
              {cates}
            </select>
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

export default ProductDetail;
