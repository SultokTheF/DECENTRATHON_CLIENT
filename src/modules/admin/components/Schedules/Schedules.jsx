import React, { useState, useEffect } from 'react';
import { axiosInstance, endpoints } from '../../../../services/api';
import Sidebar from '../Sidebar/Sidebar';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    center: '',
    section: '',
    date: '',
    start_time: '',
    end_time: '',
    capacity: 0,
  });
  const [centers, setCenters] = useState([]);
  const [sections, setSections] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterCenter, setFilterCenter] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null);

  // Fetch schedules, centers, and sections
  useEffect(() => {
    fetchSchedules();
    fetchCenters();
    fetchSections();
  }, [filterDate, filterCenter, filterSection]);

  const fetchSchedules = async () => {
    try {
      let params = {
        page: 'all',
      };
      if (filterDate) params.date = filterDate;
      if (filterCenter) params.center = filterCenter;
      if (filterSection) params.section = filterSection;

      const response = await axiosInstance.get(endpoints.SCHEDULES, { params });
      setSchedules(response.data);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    }
  };

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get(endpoints.CENTERS, {
        params: { page: "all" },
      });
      setCenters(response.data);
    } catch (error) {
      console.error('Failed to fetch centers:', error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axiosInstance.get(endpoints.SECTIONS, {
        params: { page: "all" },
      });
      setSections(response.data);
    } catch (error) {
      console.error('Failed to fetch sections:', error);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule({
      ...newSchedule,
      [name]: value,
    });
  };

  // Handle creating and editing schedules
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axiosInstance.put(`${endpoints.SCHEDULES}${editingScheduleId}/`, newSchedule);
      } else {
        await axiosInstance.post(endpoints.SCHEDULES, newSchedule);
      }
      fetchSchedules();
      setNewSchedule({ center: '', section: '', date: '', start_time: '', end_time: '', capacity: 0 });
      setIsEditing(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save schedule:', error);
    }
  };

  // Handle deleting schedules
  const handleDelete = async (scheduleId) => {
    try {
      await axiosInstance.delete(`${endpoints.SCHEDULES}${scheduleId}/`);
      fetchSchedules();
    } catch (error) {
      console.error('Failed to delete schedule:', error);
    }
  };

  // Handle editing a schedule
  const handleEdit = (schedule) => {
    setNewSchedule(schedule);
    setEditingScheduleId(schedule.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Start the meeting (add the meeting link)
  const handleStartMeeting = async (scheduleId) => {
    try {
      await axiosInstance.post(`${endpoints.SCHEDULES}${scheduleId}/start/`);
      fetchSchedules(); // Refetch schedules to update the meeting link
    } catch (error) {
      console.error('Failed to start the meeting:', error);
    }
  };

  // Handle filtering
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date') setFilterDate(value);
    if (name === 'center') setFilterCenter(value);
    if (name === 'section') setFilterSection(value);
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar />
      <div className="flex-1 p-4 sm:ml-64 mt-12">
        <h1 className="text-3xl font-semibold mb-4">Управление расписанием</h1>

        {/* Filter UI */}
        <div className="mb-4 flex flex-wrap gap-4">
          <input
            type="date"
            name="date"
            placeholder="Фильтр по дате"
            value={filterDate}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-md"
          />
          <select
            name="center"
            value={filterCenter}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">Все центры</option>
            {centers.map((center) => (
              <option key={center.id} value={center.id}>{center.name}</option>
            ))}
          </select>
          <select
            name="section"
            value={filterSection}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">Все секции</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>{section.name}</option>
            ))}
          </select>
        </div>

        {/* Add new schedule button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Добавить новое расписание
        </button>

        {/* Schedule List */}
        <div className="table-responsive">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Центр</th>
                <th className="px-4 py-2">Секция</th>
                <th className="px-4 py-2">Дата</th>
                <th className="px-4 py-2">Начало</th>
                <th className="px-4 py-2">Конец</th>
                <th className="px-4 py-2">Вместимость</th>
                <th className="px-4 py-2">Зарезервировано</th>
                <th className="px-4 py-2">Статус</th>
                <th className="px-4 py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td className="border px-4 py-2">{centers.find(c => c.id === sections.find(s => s.id === schedule.section)?.center)?.name || "Не найдено"}</td>
                  <td className="border px-4 py-2">{sections.find(s => s.id === schedule.section)?.name || "Не найдено"}</td>
                  <td className="border px-4 py-2">{schedule.date}</td>
                  <td className="border px-4 py-2">{schedule.start_time}</td>
                  <td className="border px-4 py-2">{schedule.end_time}</td>
                  <td className="border px-4 py-2">{schedule.capacity}</td>
                  <td className="border px-4 py-2">{schedule.reserved}</td>
                  <td className="border px-4 py-2">{schedule.capacity === schedule.reserved ? 'Full' : 'Active'}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(schedule)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md mr-2"
                    >
                      <FaEdit className="mr-2" /> Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      <FaTrash className="mr-2" /> Удалить
                    </button>
                    {!schedule.meeting_link ? (
                      <button
                        onClick={() => handleStartMeeting(schedule.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-md ml-2"
                      >
                        Начать собрание
                      </button>
                    ) : (
                      <a
                        href={schedule.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2"
                      >
                        Собрание
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Adding/Editing Schedule */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{isEditing ? 'Редактировать расписание' : 'Добавить новое расписание'}</h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <FaTimes className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleSave}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="center">
                    Центр
                  </label>
                  <select
                    id="center"
                    name="center"
                    value={newSchedule.center}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Выберите центр</option>
                    {centers.map((center) => (
                      <option key={center.id} value={center.id}>{center.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="section">
                    Секция
                  </label>
                  <select
                    id="section"
                    name="section"
                    value={newSchedule.section}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Выберите секцию</option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>{section.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                    Дата
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={newSchedule.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start_time">
                    Время начала
                  </label>
                  <input
                    type="time"
                    id="start_time"
                    name="start_time"
                    value={newSchedule.start_time}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end_time">
                    Время окончания
                  </label>
                  <input
                    type="time"
                    id="end_time"
                    name="end_time"
                    value={newSchedule.end_time}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="capacity">
                    Вместимость
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={newSchedule.capacity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {isEditing ? 'Обновить расписание' : 'Добавить расписание'}
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

export default Schedules;
