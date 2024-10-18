import React, { useState, useEffect } from 'react';
import { axiosInstance, endpoints } from '../../../../services/api';
import Sidebar from '../Sidebar/Sidebar';
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import RegisterStaffModal from './RegisterStaffModal'; // Import the staff registration modal

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // For staff registration modal
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false); // For user details modal

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(endpoints.USERS);
      setUsers(response.data.results);
      setFilteredUsers(response.data.results);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchSubscriptions = async (userId) => {
    try {
      const response = await axiosInstance.get(endpoints.SUBSCRIPTIONS, {
        params: { user: userId }
      });
      setSubscriptions(response.data.results);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    filterUsers(e.target.value, roleFilter, statusFilter);
  };

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
    filterUsers(search, e.target.value, statusFilter);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    filterUsers(search, roleFilter, e.target.value);
  };

  const filterUsers = (searchText, role, status) => {
    let filtered = users;
  
    // Фильтрация по имени, email, телефону и ИИН
    if (searchText) {
      filtered = filtered.filter((user) =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()) ||
        user.phone_number?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.iin?.toLowerCase().includes(searchText.toLowerCase())  // Добавляем фильтрацию по ИИН
      );
    }
  
    // Фильтрация по роли
    if (role) {
      filtered = filtered.filter((user) => user.role === role);
    }
  
    // Фильтрация по статусу
    if (status) {
      filtered = filtered.filter((user) => user.is_active === (status === 'active'));
    }
  
    setFilteredUsers(filtered);
  };
  

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    fetchSubscriptions(user.id);
    setIsUserDetailsModalOpen(true);
  };

  const handleActivateDeactivate = async (userId, isActive) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.patch(`${endpoints.USERS}${userId}/activate-deactivate/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
    } catch (error) {
      console.error('Failed to change user status:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axiosInstance.delete(`${endpoints.USERS}${userId}/`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar />
      <div className="flex-1 p-4 sm:ml-64 mt-12">
        <h1 className="text-3xl font-semibold mb-4">Управление пользователями</h1>

        <button
          onClick={() => setIsModalOpen(true)} // Open staff registration modal
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Зарегистрировать менеджера
        </button>

        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Поиск по имени, email, телефону или ИИН..."
            value={search}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
          />
          <select
            value={roleFilter}
            onChange={handleRoleChange}
            className="ml-4 px-4 py-2 border rounded-md focus:outline-none"
          >
            <option value="">Все роли</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="PARENT">Parent</option>
            <option value="CHILD">Child</option>
            <option value="STAFF">Staff</option>
          </select>
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="ml-4 px-4 py-2 border rounded-md focus:outline-none"
          >
            <option value="">Все статусы</option>
            <option value="active">Активен</option>
            <option value="inactive">Неактивен</option>
          </select>
        </div>

        <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Имя</th>
              <th className="py-2 px-4 text-left">Контакты (Email и Телефон)</th>
              <th className="py-2 px-4 text-left">ИИН</th>
              <th className="py-2 px-4 text-left">Роль</th>
              <th className="py-2 px-4 text-left">Статус</th>
              <th className="py-2 px-4 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="py-2 px-4">{`${user.first_name} ${user.last_name}`}</td>
                  <td className="py-2 px-4">
                    <div>
                      <strong>Email:</strong> {user.email ? user.email : 'Нет Email'} <br />
                      <strong>Телефон:</strong> {user.phone_number ? user.phone_number : 'Нет Телефона'}
                    </div>
                  </td>
                  <td className="py-2 px-4">{user.iin ? user.iin : 'Нет ИИН'}</td>
                  <td className="py-2 px-4">{user.role}</td>
                  <td className="py-2 px-4">{user.is_active ? 'Активен' : 'Неактивен'}</td>
                  <td className="py-2 px-4 flex justify-start">
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Подробнее
                    </button>
                    <button
                      onClick={() => handleActivateDeactivate(user.id, user.is_active)}
                      className={`px-4 py-1 rounded ${user.is_active ? 'bg-red-500' : 'bg-green-500'} text-white`}
                    >
                      {user.is_active ? <FaTimesCircle className="mr-2" /> : <FaCheckCircle className="mr-2" />}
                      {user.is_active ? 'Деактивировать' : 'Активировать'}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="ml-2 bg-red-500 text-white font-bold py-1 px-2 rounded"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                  Пользователи не найдены.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Register Staff Modal */}
      <RegisterStaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fetchUsers={fetchUsers}
      />

      {/* User Details Modal (when clicked on Подробнее) */}
      {isUserDetailsModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Детали пользователя</h2>
              <button onClick={() => setIsUserDetailsModalOpen(false)}>
                <FaTimesCircle className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <p><strong>Имя:</strong> {`${selectedUser.first_name} ${selectedUser.last_name}`}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Телефон:</strong> {selectedUser.phone_number}</p>
            <p><strong>ИИН:</strong> {selectedUser.iin || 'Нет ИИН'}</p>
            <p><strong>Роль:</strong> {selectedUser.role}</p>
            <p><strong>Дата регистрации:</strong> {new Date(selectedUser.date_joined).toLocaleDateString()}</p>

            {/* Display subscriptions */}
            <h3 className="text-xl mt-4 font-semibold">Подписки</h3>
            {subscriptions.length > 0 ? (
              subscriptions.map((sub) => (
                <div key={sub.id} className="border-t py-2">
                  <p><strong>Тип:</strong> {sub.type}</p>
                  <p><strong>Дата начала:</strong> {new Date(sub.start_date).toLocaleDateString()}</p>
                  <p><strong>Дата окончания:</strong> {new Date(sub.end_date).toLocaleDateString()}</p>
                  <p><strong>Статус:</strong> {sub.is_active ? 'Активна' : 'Неактивна'}</p>
                </div>
              ))
            ) : (
              <p>Подписки не найдены.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
