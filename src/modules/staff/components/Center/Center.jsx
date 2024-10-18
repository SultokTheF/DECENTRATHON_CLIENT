import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance, endpoints } from '../../../../services/api';
import Sidebar from '../Sidebar/Sidebar';
import { FaEdit, FaSave, FaTimes, FaQrcode } from 'react-icons/fa';

const Center = () => {
  const { id } = useParams();
  const [center, setCenter] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    link: '',
  });

  useEffect(() => {
    fetchCenter();
  }, []);

  const fetchCenter = async () => {
    try {
      const response = await axiosInstance.get(`${endpoints.CENTERS}${id}/`);
      setCenter(response.data);
      setFormData({
        name: response.data.name,
        description: response.data.description,
        location: response.data.location,
        link: response.data.link,
      });
    } catch (error) {
      console.error('Failed to fetch center:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`${endpoints.CENTERS}${id}/`, formData);
      setCenter(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update center:', error);
    }
  };

  if (!center) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar />
      <div className="flex-1 p-4 sm:ml-64 mt-12">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold">{isEditing ? 'Редактировать центр' : center.name}</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <FaEdit className="mr-2" /> Редактировать
            </button>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {isEditing ? (
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Название
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Описание
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                  Местоположение
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="link">
                  Ссылка
                </label>
                <input
                  type="text"
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <FaSave className="mr-2" /> Сохранить
                </button>
                <button
                  type="button"
                  className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  onClick={() => setIsEditing(false)}
                >
                  <FaTimes className="mr-2" /> Отмена
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="mb-2"><strong>Описание:</strong> {center.description}</p>
              <p className="mb-2"><strong>Местоположение:</strong> {center.location}</p>
              {center.link && (
                <p className="mb-2">
                  <strong>Как добраться?:</strong>{' '}
                  <a href={center.link} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-700">
                    Ссылка
                  </a>
                </p>
              )}
              {center.qr_code_url && (
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="mt-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <FaQrcode className="mr-2" /> Показать QR-код
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">QR-код для {center.name}</h2>
              <button onClick={() => setIsQrModalOpen(false)}>
                <FaTimes className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex justify-center">
              <img src={center.qr_code_url} alt={`${center.name} QR Code`} className="w-64 h-64" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Center;
