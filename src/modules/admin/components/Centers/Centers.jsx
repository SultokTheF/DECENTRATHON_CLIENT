import React, { useState, useEffect } from 'react';
import { axiosInstance, endpoints } from '../../../../services/api';
import Sidebar from '../Sidebar/Sidebar';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const Centers = () => {
  const [centers, setCenters] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [sections, setSections] = useState([]);
  const [users, setUsers] = useState([]);
  const [newCenter, setNewCenter] = useState({
    name: '',
    location: '',
    description: '',
    about: '',
    image: null,
    users: [], // Field for assigned users
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCenterId, setEditingCenterId] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Preview for center image
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  useEffect(() => {
    fetchCenters();
    fetchSections();
    fetchSchedules();
    fetchUsers();
  }, [searchQuery, filterLocation]);

  const fetchCenters = async () => {
    try {
      const params = {
        page: 'all',
      };
      if (searchQuery) params.search = searchQuery;
      if (filterLocation) params.location = filterLocation;
      const response = await axiosInstance.get(endpoints.CENTERS, { params });
      setCenters(response.data);
    } catch (error) {
      console.error('Failed to fetch centers:', error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axiosInstance.get(`${endpoints.SECTIONS}?page=all`);
      setSections(response.data);
    } catch (error) {
      console.error('Failed to fetch sections:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await axiosInstance.get(endpoints.SCHEDULES, {
        params: {
          page: 'all',
        },
      });
      setSchedules(response.data);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`${endpoints.USERS}?page=all`);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const getSchedulesBySection = (sectionId) => {
    return schedules.filter((schedule) => schedule.section === sectionId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'd MMMM yyyy', { locale: ru });
  };

  const formatTime = (time) => time.slice(0, 5); // Removing seconds from time

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setNewCenter({
        ...newCenter,
        [name]: file,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === 'image') {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setNewCenter({
        ...newCenter,
        [name]: value,
      });
    }
  };

  const handleUserChange = (e) => {
    const { options } = e.target;
    const selectedUsers = [];
    for (const option of options) {
      if (option.selected) {
        selectedUsers.push(parseInt(option.value, 10));
      }
    }
    setNewCenter({
      ...newCenter,
      users: selectedUsers,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newCenter.name);
      formData.append('location', newCenter.location);
      formData.append('description', newCenter.description);
      formData.append('about', newCenter.about);
  
      if (newCenter.image) formData.append('image', newCenter.image); // Handle image upload
  
      // Append each user as a separate form field
      newCenter.users.forEach((user) => {
        formData.append('users', user); // This will append each user ID as an integer
      });
  
      if (isEditing) {
        await axiosInstance.put(`${endpoints.CENTERS}${editingCenterId}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axiosInstance.post(endpoints.CENTERS, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
  
      fetchCenters();
      setNewCenter({ name: '', location: '', description: '', about: '', image: null, users: [] });
      setImagePreview(null);
      setIsEditing(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save center:', error.response ? error.response.data : error);
    }
  };  

  const handleEdit = (center) => {
    setNewCenter({
      name: center.name,
      location: center.location,
      description: center.description,
      about: center.about,
      image: null,
      users: center.users.map((user) => user.id), // Load selected users
    });
    setImagePreview(center.image); // Show existing image preview
    setEditingCenterId(center.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (centerId) => {
    try {
      await axiosInstance.delete(`${endpoints.CENTERS}${centerId}/`);
      fetchCenters();
    } catch (error) {
      console.error('Failed to delete center:', error);
    }
  };

  const handleViewDetails = (center) => {
    setSelectedCenter(center);
  };

  const openAddModal = () => {
    setNewCenter({ name: '', location: '', description: '', about: '', image: null, users: [] });
    setImagePreview(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar />
      <div className="flex-1 p-6 sm:ml-64 mt-12">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Управление Центрами</h1>

        {/* Search and Filter UI */}
        <div className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Поиск по названию"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-3 border rounded-md w-80"
          />
          {/* <input
            type="text"
            placeholder="Фильтр по местоположению"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="px-4 py-3 border rounded-md w-80"
          /> */}
          {/* <button
            onClick={() => fetchCenters()}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md"
          >
            Применить фильтры
          </button> */}
        </div>

        <button
          onClick={openAddModal}
          className="mb-6 bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Добавить Новый Центр
        </button>

        <div className="table-responsive">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-3 text-left text-lg">Название</th>
                <th className="px-6 py-3 text-left text-lg">Местоположение</th>
                <th className="px-6 py-3 text-left text-lg">Описание</th>
                <th className="px-6 py-3 text-left text-lg">О Центре</th>
                <th className="px-6 py-3 text-left text-lg">Действия</th>
              </tr>
            </thead>
            <tbody>
              {centers.map((center) => (
                <tr key={center.id} className="hover:bg-gray-100 transition duration-150">
                  <td className="border px-6 py-4 text-lg">{center.name}</td>
                  <td className="border px-6 py-4 text-lg">{center.location}</td>
                  <td className="border px-6 py-4 text-lg">{center.description}</td>
                  <td className="border px-6 py-4 text-lg">{center.about}</td>
                  <td className="border px-6 py-4 flex space-x-4">
                    <button
                      onClick={() => handleEdit(center)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      <FaEdit /> Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(center.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      <FaTrash /> Удалить
                    </button>
                    <button
                      onClick={() => handleViewDetails(center)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Подробнее
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Viewing Center Details */}
        {selectedCenter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl h-5/6 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Детали Центра: {selectedCenter.name}</h2>
                <button onClick={() => setSelectedCenter(null)}>
                  <FaTimes className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="mb-4"><strong>Название:</strong> {selectedCenter.name}</p>
              <p className="mb-4"><strong>Местоположение:</strong> {selectedCenter.location}</p>
              <p className="mb-4"><strong>Описание:</strong> {selectedCenter.description}</p>
              <p className="mb-4"><strong>О Центре:</strong> {selectedCenter.about}</p>
              <p className="mb-4">
                <strong>Изображение:</strong>{' '}
                {selectedCenter.image ? (
                  <img
                    src={selectedCenter.image}
                    alt="Center Image"
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                ) : (
                  'N/A'
                )}
              </p>

              {/* Display sections related to the center */}
              <h3 className="text-lg font-bold mt-6">Разделы и Расписание</h3>
              <ul>
                {sections
                  .filter((section) => section.center === selectedCenter.id)
                  .map((section) => (
                    <li key={section.id} className="mt-4">
                      <div className="text-lg font-semibold">{section.name}</div>
                      <div className="bg-gray-100 p-4 rounded-lg shadow-lg mt-2">
                        {getSchedulesBySection(section.id).map((schedule) => (
                          <div key={schedule.id} className="mt-2">
                            <span className="block text-sm">
                              <strong>Дата:</strong> {formatDate(schedule.date)}
                            </span>
                            <span className="block text-sm">
                              <strong>Время:</strong> {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                            </span>
                            <span className="block text-sm">
                              <strong>Вместимость:</strong> {schedule.capacity} / Забронировано: {schedule.reserved}
                            </span>
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}

        {/* Modal for Adding/Editing Center */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg h-5/6 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">
                  {isEditing ? 'Редактировать Центр' : 'Добавить Новый Центр'}
                </h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <FaTimes className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleSave} encType="multipart/form-data">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Название
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newCenter.name}
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
                    value={newCenter.location}
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
                    value={newCenter.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="about">
                    О Центре
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    value={newCenter.about}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                {/* Image Upload */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                    Изображение
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    accept="image/*"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-4 w-full h-64 object-cover rounded-lg shadow-md"
                    />
                  )}
                </div>

                {/* User Assignment */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="users">
                    Пользователи
                  </label>
                  <select
                    id="users"
                    name="users"
                    multiple
                    value={newCenter.users}
                    onChange={handleUserChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.first_name} {user.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded"
                  >
                    {isEditing ? 'Обновить Центр' : 'Добавить Центр'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Centers;
