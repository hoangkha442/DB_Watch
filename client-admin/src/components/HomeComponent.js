import React, { Component } from 'react';

class Home extends Component {
  render() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h2 className="text-center text-3xl font-bold mb-6 text-gray-700">TRANG CHỦ ADMIN</h2>
        <img
          src="https://images.unsplash.com/photo-1512061942534-3d120961f6e2"
          alt="Clock"
          className="max-w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    );
  }
}

export default Home;
