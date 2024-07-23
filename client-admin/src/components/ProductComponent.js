import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

class Product extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      noPages: 0,
      curPage: 1,
      itemSelected: null,
    };
  }

  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
  }

  trItemClick = (item) => {
    this.setState({ itemSelected: item });
  };

  apiGetProducts = (page) => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get(`/api/admin/products?page=${page}`, config).then((res) => {
      const result = res.data;
      this.setState({
        products: result.products,
        noPages: result.noPages,
        curPage: result.curPage,
      });
    });
  };

  lnkPageClick = (index) => {
    this.apiGetProducts(index);
  };

  updateProducts = (products, noPages, curPage) => {
    this.setState({ products, noPages, curPage });
  };

  render() {
    const prods = this.state.products.map((item) => {
      return (
        <tr
          key={item._id}
          className="hover:bg-gray-100 cursor-pointer"
          onClick={() => this.trItemClick(item)}
        >
          <td className="px-4 py-2 border">{item._id}</td>
          <td className="px-4 py-2 border">{item.name}</td>
          <td className="px-4 py-2 border">{item.price}</td>
          <td className="px-4 py-2 border">{new Date(item.cdate).toLocaleString()}</td>
          <td className="px-4 py-2 border">{item.category.name}</td>
          <td className="px-4 py-2 border">
            <img src={`data:image/jpg;base64,${item.image}`} className="w-24 h-24 object-cover" alt="" />
          </td>
        </tr>
      );
    });

    const pagination = Array.from({ length: this.state.noPages }, (_, index) => {
      if (index + 1 === this.state.curPage) {
        return (
          <span key={index} className="font-bold text-blue-500 px-2">
            | {index + 1} |
          </span>
        );
      } else {
        return (
          <span
            key={index}
            className="cursor-pointer text-blue-500 px-2"
            onClick={() => this.lnkPageClick(index + 1)}
          >
            | {index + 1} |
          </span>
        );
      }
    });

    return (
      <div className="flex flex-col md:flex-row items-start justify-center p-4 space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-2/3 bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-center text-2xl font-bold mb-4 text-gray-700">Danh Sách Sản Phẩm</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Tên</th>
                  <th className="px-4 py-2 border">Giá</th>
                  <th className="px-4 py-2 border">Ngày Tạo</th>
                  <th className="px-4 py-2 border">Danh Mục</th>
                  <th className="px-4 py-2 border">Hình Ảnh</th>
                </tr>
              </thead>
              <tbody>{prods}</tbody>
              <tfoot>
                <tr>
                  <td colSpan="6" className="px-4 py-2 text-center">
                    {pagination}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <ProductDetail item={this.state.itemSelected} curPage={this.state.curPage} updateProducts={this.updateProducts} />
        </div>
      </div>
    );
  }
}

export default Product;
