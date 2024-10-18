import React, { useState, useEffect } from 'react';
import { axiosInstance, endpoints } from '../../../../services/api';
import { FaPlus, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import Sidebar from '../Sidebar/Sidebar';
import { format, parseISO, addDays, isSameWeek } from 'date-fns';
import { ru } from 'date-fns/locale';

const Sections = () => {
  const [sections, setSections] = useState([]);
  const [centers, setCenters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [newSection, setNewSection] = useState({
    name: '',
    category: '',
    center: '',
    description: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  // Fetching data on component mount
  useEffect(() => {
    fetchSections();
    fetchCenters();
    fetchCategories();
    fetchSchedules();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await axiosInstance.get(`${endpoints.SECTIONS}?center=${userCenterId}`);
      setSections(response.data.results);
    } catch (error) {
      console.error('Failed to fetch sections:', error);
    }
  };
  

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get(endpoints.CENTERS);
      setCenters(response.data.results);
    } catch (error) {
      console.error('Failed to fetch centers:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(endpoints.CATEGORIES);
      setCategories(response.data.results);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await axiosInstance.get(endpoints.SCHEDULES);
      setSchedules(response.data.results);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSection({
      ...newSection,
      [name]: value,
    });
  };

  // Group schedules for upcoming week
  const getUpcomingSchedulesForSection = (sectionId) => {
    const today = new Date();
    const weekFromToday = addDays(today, 7);

    // Filter schedules within the next week
    return schedules
      .filter(
        (schedule) =>
          schedule.section === sectionId &&
          parseISO(schedule.date) >= today &&
          parseISO(schedule.date) <= weekFromToday
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Format time for better display
  const formatTime = (timeString) => {
    return timeString.slice(0, 5); // Show only hours and minutes
  };

  // Reset form state
  const resetForm = () => {
    setNewSection({
      name: '',
      category: '',
      center: '',
      description: '',
    });
    setCurrentSectionId(null);
    setIsEditMode(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const sectionData = {
      ...newSection,
      center: newSection.center,
    };

    try {
      if (isEditMode) {
        await axiosInstance.put(`${endpoints.SECTIONS}${currentSectionId}/`, sectionData);
        setSections(sections.map(section => 
          section.id === currentSectionId ? { ...section, ...sectionData } : section
        ));
        setAlertMessage('Секция успешно обновлена!');
      } else {
        const response = await axiosInstance.post(endpoints.SECTIONS, sectionData);
        setSections([...sections, response.data]);
        setAlertMessage('Секция успешно добавлена!');
      }

      resetForm();
      setIsModalOpen(false);
      setTimeout(() => setAlertMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save section:', error.response ? error.response.data : error);
    }
  };


  const handleEdit = (section) => {
    setNewSection({
      name: section.name,
      category: section.category,
      center: section.center,
      description: section.description,
    });
    setCurrentSectionId(section.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Delete section
  const handleDelete = async (sectionId) => {
    try {
      await axiosInstance.delete(`${endpoints.SECTIONS}${sectionId}/`);
      setSections(sections.filter(section => section.id !== sectionId));
      setAlertMessage('Секция успешно удалена!');
      setTimeout(() => setAlertMessage(''), 3000);
    } catch (error) {
      console.error('Failed to delete section:', error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar />
      <div className="flex-1 p-4 sm:ml-64 mt-12">
        <h1 className="text-3xl font-semibold mb-4">Секции</h1>
        {alertMessage && (
          <div className="mb-4 p-4 text-white bg-green-500 rounded">
            {alertMessage}
          </div>
        )}
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="mb-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Добавить новую секцию
        </button>

        {/* Table for displaying sections */}
        <div className="table-responsive">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Название</th>
                <th className="px-4 py-2">Категория</th>
                <th className="px-4 py-2">Центр</th>
                <th className="px-4 py-2">Описание</th>
                <th className="px-4 py-2">Действия</th>
                <th className="px-4 py-2">Предстоящие занятия</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr key={section.id}>
                  <td className="border px-4 py-2">{section.name}</td>
                  <td className="border px-4 py-2">{categories.find(c => c.id === section.category)?.name}</td>
                  <td className="border px-4 py-2">{centers.find(c => c.id === section.center)?.name}</td>
                  <td className="border px-4 py-2">{section.description}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(section)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                    >
                      <FaEdit className="mr-2" /> Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      <FaTrash className="mr-2" /> Удалить
                    </button>
                  </td>
                  <td className="border px-4 py-2">
                    {getUpcomingSchedulesForSection(section.id).length > 0 ? (
                      getUpcomingSchedulesForSection(section.id).map((schedule) => (
                        <div key={schedule.id} className="bg-gray-100 p-4 rounded-lg mb-2 shadow-sm">
                          <div>
                            <span className="block text-sm">
                              <strong>Дата:</strong>{' '}
                              {format(parseISO(schedule.date), 'd MMMM yyyy, EEEE', { locale: ru })}
                            </span>
                            <span className="block text-sm">
                              <strong>Время:</strong> {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                            </span>
                            <span className="block text-sm">
                              <strong>Вместимость:</strong> {schedule.capacity} / {schedule.reserved} забронировано
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">Нет занятий на следующей неделе</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Adding/Editing Sections */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                {isEditMode ? 'Редактировать секцию' : 'Добавить новую секцию'}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <FaTimes className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Название
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newSection.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                  Категория
                </label>
                <select
                  id="category"
                  name="category"
                  value={newSection.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="center">
                  Центр
                </label>
                <select
                  id="center"
                  name="center"
                  value={newSection.center}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Выберите центр</option>
                  {centers.map((center) => (
                    <option key={center.id} value={center.id}>
                      {center.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Описание
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newSection.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                >
                  {isEditMode ? 'Обновить секцию' : 'Добавить секцию'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sections;
