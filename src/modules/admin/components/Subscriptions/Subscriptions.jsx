import React, { useState, useEffect } from 'react';
import { axiosInstance, endpoints } from '../../../../services/api';
import Sidebar from '../Sidebar/Sidebar';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaCheck, FaBan } from 'react-icons/fa';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [newSubscription, setNewSubscription] = useState({
    type: '',
    user: '',
    start_date: '',
    end_date: '',
    is_active: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSubscriptionId, setEditingSubscriptionId] = useState(null);

  const [filterType, setFilterType] = useState('');
  const [filterIIN, setFilterIIN] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchUsers(); // Загружаем пользователей
  }, []);

  useEffect(() => {
    fetchSubscriptions(); // Загружаем подписки при изменении фильтров
  }, [filterType, filterStatus]);

  const fetchSubscriptions = async () => {
    try {
      let params = {};
      console.log('Фильтрация по типу:', filterType);
      console.log('Фильтрация по ИИН:', filterIIN);
      console.log('Фильтрация по статусу:', filterStatus);

      if (filterType) {
        params.type = filterType; // Фильтрация по типу подписки
      }

      if (filterIIN) {
        // Поиск пользователя по ИИН
        const user = users.find((u) => u.iin === filterIIN);
        if (user) {
          console.log('Пользователь найден по ИИН:', user);
          params.user = user.id; // Фильтрация подписок по ID пользователя
        } else {
          console.log('Пользователь с таким ИИН не найден:', filterIIN);
          alert('Пользователь с таким ИИН не найден');
          return; // Останавливаем выполнение, если пользователь не найден
        }
      }

      if (filterStatus) {
        params.is_active = filterStatus === 'active'; // Фильтрация по статусу
      }

      const response = await axiosInstance.get(endpoints.SUBSCRIPTIONS, { params });
      console.log('Загруженные подписки:', response.data.results);
      setSubscriptions(response.data.results); // Устанавливаем подписки в состояние
    } catch (error) {
      console.error('Ошибка при получении подписок:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(endpoints.USERS);
      console.log('Загруженные пользователи:', response.data.results);
      setUsers(response.data.results);
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
    }
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Неизвестный пользователь';
  };

  const getUserIIN = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.iin : 'Нет ИИН';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'd MMMM yyyy года', { locale: ru });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSubscription({
      ...newSubscription,
      [name]: value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axiosInstance.put(`${endpoints.SUBSCRIPTIONS}${editingSubscriptionId}/`, newSubscription);
      } else {
        await axiosInstance.post(endpoints.SUBSCRIPTIONS, newSubscription);
      }
      fetchSubscriptions();
      setNewSubscription({ type: '', user: '', start_date: '', end_date: '', is_active: false });
      setIsEditing(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Ошибка при сохранении подписки:', error);
    }
  };

  const handleEdit = (subscription) => {
    setNewSubscription({
      type: subscription.type,
      user: subscription.user,
      start_date: subscription.start_date,
      end_date: subscription.end_date,
      is_active: subscription.is_active,
    });
    setEditingSubscriptionId(subscription.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (subscriptionId) => {
    try {
      await axiosInstance.delete(`${endpoints.SUBSCRIPTIONS}${subscriptionId}/`);
      fetchSubscriptions();
    } catch (error) {
      console.error('Ошибка при удалении подписки:', error);
    }
  };

  const toggleActivation = async (subscriptionId, currentStatus) => {
    try {
      await axiosInstance.post(`${endpoints.SUBSCRIPTIONS}${subscriptionId}/activate_subscription/`, {
        is_activated_by_admin: !currentStatus,
      });
      fetchSubscriptions();
    } catch (error) {
      console.error('Ошибка при изменении статуса активации:', error);
    }
  };

  const openAddModal = () => {
    setNewSubscription({ type: '', user: '', start_date: '', end_date: '', is_active: false });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar />
      <div className="flex-1 p-4 sm:ml-64 mt-12">
        <h1 className="text-3xl font-semibold mb-4">Управление подписками</h1>

        {/* UI фильтров */}
        <div className="mb-4 flex flex-wrap gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">Все типы</option>
            <option value="MONTH">Месячная</option>
            <option value="6_MONTHS">Полугодовая</option>
            <option value="YEAR">Годовая</option>
          </select>

          <input
            type="text"
            placeholder="Фильтр по ИИН"
            value={filterIIN}
            onChange={(e) => setFilterIIN(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">Все статусы</option>
            <option value="active">Активный</option>
            <option value="inactive">Неактивный</option>
          </select>

          <button
            onClick={() => fetchSubscriptions()}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Применить фильтры
          </button>
        </div>

        <div className="table-responsive">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Тип подписки</th>
                <th className="px-4 py-2">Пользователь</th>
                <th className="px-4 py-2">ИИН</th>
                <th className="px-4 py-2">Дата начала</th>
                <th className="px-4 py-2">Дата окончания</th>
                <th className="px-4 py-2">Статус</th>
                <th className="px-4 py-2">Активировать</th>
                <th className="px-4 py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length > 0 ? (
                subscriptions.map((subscription) => (
                  <tr key={subscription.id}>
                    <td className="border px-4 py-2">{subscription.type}</td>
                    <td className="border px-4 py-2">{getUserName(subscription.user)}</td>
                    <td className="border px-4 py-2">{getUserIIN(subscription.user)}</td>
                    <td className="border px-4 py-2">{formatDate(subscription.start_date)}</td>
                    <td className="border px-4 py-2">{formatDate(subscription.end_date)}</td>
                    <td className="border px-4 py-2">{subscription.is_active ? 'Активный' : 'Неактивный'}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => toggleActivation(subscription.id, subscription.is_activated_by_admin)}
                        className={`px-4 py-2 rounded-md text-white flex items-center ${
                          subscription.is_activated_by_admin
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {subscription.is_activated_by_admin ? (
                          <>
                            <FaBan className="mr-2" /> Деактивировать
                          </>
                        ) : (
                          <>
                            <FaCheck className="mr-2" /> Активировать
                          </>
                        )}
                      </button>
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEdit(subscription)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md mr-2"
                      >
                        <FaEdit className="mr-2" /> Редактировать
                      </button>
                      <button
                        onClick={() => handleDelete(subscription.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                      >
                        <FaTrash className="mr-2" /> Удалить
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    Подписки не найдены
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Модальное окно для добавления/редактирования подписки */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{isEditing ? 'Редактировать подписку' : 'Добавить новую подписку'}</h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <FaTimes className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleSave}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="is_active">
                    Статус
                  </label>
                  <select
                    id="is_active"
                    name="is_active"
                    value={newSubscription.is_active}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Выберите статус</option>
                    <option value={true}>Активный</option>
                    <option value={false}>Неактивный</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {isEditing ? 'Обновить подписку' : 'Добавить подписку'}
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

export default Subscriptions;
