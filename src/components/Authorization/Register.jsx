import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { axiosInstance, endpoints } from '../../services/api';

const Register = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    password: '',
    iin: '',
    role: 'USER',
    isParent: false, 
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const role = formData.isParent ? 'PARENT' : 'USER';
      const response = await axiosInstance.post(endpoints.REGISTER, {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        password: formData.password,  
        iin: formData.iin,
        role: role  // Use the dynamically determined role
      });
      if (response.status === 201) {
        window.location.replace('/login')
      }
    } catch (error) {
      alert('Ошибка регистрации');
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Эл. почта
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Введите вашу эл. почту"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
              Имя
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Введите ваше имя"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
              Фамилия
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Введите вашу фамилию"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="iin">
              ИИН
            </label>
            <input
              type="text"
              id="iin"
              name="iin"
              value={formData.iin}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Введите ваш ИИН"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
              Номер телефона
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Введите ваш номер телефона"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Введите ваш пароль"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="isParent">
              Вы родитель?
            </label>
            <input
              type="checkbox"
              id="isParent"
              name="isParent"
              checked={formData.isParent}
              onChange={handleChange}
              className="mr-2 leading-tight"
            />
            <span className="text-sm">Да</span>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Зарегистрироваться
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm">
              Уже есть аккаунт? <Link to="/" className="text-indigo-500 hover:text-indigo-700">Войти</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
