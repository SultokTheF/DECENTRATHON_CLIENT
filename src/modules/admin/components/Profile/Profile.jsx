import React, { useState, useEffect } from 'react';
import {axiosInstance, endpoints } from '../../../../services/api';
import { useAuth } from '../../../../hooks/useAuth';
import Sidebar from '../Sidebar/Sidebar';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    role: '',
  });

  useEffect(() => {
    if (user) {
      axiosInstance.get(`${endpoints.USERS}${user.id}/`)
        .then(response => {
          setProfileData(response.data);
        })
        .catch(error => {
          console.error('Failed to fetch user data:', error);
        });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance.put(`${endpoints.USERS}${user.id}/`, profileData)
      .then(response => {
        setProfileData(response.data);
        setIsEditing(false);
      })
      .catch(error => {
        console.error('Failed to update user data:', error);
      });
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar />
      <div className="flex-1 p-4 sm:ml-64 mt-12">
        <h1 className="text-3xl font-semibold mb-4">Профиль</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Эл. почта
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">
                  Имя
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={profileData.first_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">
                  Фамилия
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={profileData.last_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone_number">
                  Номер телефона
                </label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={profileData.phone_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                  Роль
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={profileData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  disabled
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={() => setIsEditing(false)}
                >
                  Отмена
                </button>
              </div>
            </form>
          ) : (
            <div>
              <p className="mb-2"><strong>Эл. почта:</strong> {profileData.email}</p>
              <p className="mb-2"><strong>Имя:</strong> {profileData.first_name}</p>
              <p className="mb-2"><strong>Фамилия:</strong> {profileData.last_name}</p>
              <p className="mb-2"><strong>Номер телефона:</strong> {profileData.phone_number}</p>
              <p className="mb-4"><strong>Роль:</strong> {profileData.role}</p>
              <button
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setIsEditing(true)}
              >
                Редактировать
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
