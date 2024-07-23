import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent';

class Category extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null,
    };
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  trItemClick = (item) => {
    this.setState({ itemSelected: item });
  };

  apiGetCategories = () => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  };

  updateCategories = (categories) => {
    this.setState({ categories });
  };

  render() {
    const cates = this.state.categories.map((item) => {
      return (
        <tr
          key={item._id}
          className="hover:bg-gray-100 cursor-pointer"
          onClick={() => this.trItemClick(item)}
        >
          <td className="px-4 py-2 border">{item._id}</td>
          <td className="px-4 py-2 border">{item.name}</td>
        </tr>
      );
    });

    return (
      <div className="flex flex-col md:flex-row items-start justify-center p-4 space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-center text-2xl font-bold mb-4 text-gray-700">Danh Sách Danh Mục</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Tên</th>
                </tr>
              </thead>
              <tbody>{cates}</tbody>
            </table>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <CategoryDetail
            item={this.state.itemSelected}
            updateCategories={this.updateCategories}
          />
        </div>
      </div>
    );
  }
}

export default Category;
