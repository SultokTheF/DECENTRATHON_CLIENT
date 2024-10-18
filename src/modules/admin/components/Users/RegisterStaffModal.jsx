import React, { useState } from 'react';
import { axiosInstance, endpoints } from '../../../../services/api';

const RegisterStaffModal = ({ isOpen, onClose, fetchUsers }) => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    phone_number: '',
    iin: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      await axiosInstance.post(endpoints.CREATE_STAFF, {
        ...formData,
        role: 'STAFF' // Set the role as STAFF
      });
      setLoading(false);
      fetchUsers(); // Refresh the list of users
      onClose(); // Close the modal after successful registration
    } catch (err) {
      setLoading(false);
      setError('Ошибка при регистрации менеджера');
    }
  };
  

  if (!isOpen) return null; // Do not render the modal if it's not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Зарегистрировать нового менеджера</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Почта</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Имя</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Фамилия</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Номер телефона</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">ИИН</label>
            <input
              type="text"
              name="iin"
              value={formData.iin}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Отменить
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              disabled={loading}
            >
              {loading ? 'Регистрируем...' : 'Регистрация менеджера'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterStaffModal;
