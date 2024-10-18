import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';

const PageNotFound = () => {
  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar />
      <div className="flex-1 p-4 sm:ml-64 flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <h1 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
          404 Страница не найдена 😔
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Извините, страница, которую вы ищете, не существует.
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Пожалуйста, проверьте URL или вернитесь на главную страницу.
        </p>
        <Link
          to="/"
          className="text-lg bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Вернуться на главную 🏠
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
