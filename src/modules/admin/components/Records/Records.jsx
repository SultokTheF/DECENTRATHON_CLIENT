import React, { useState, useEffect } from 'react';
import { axiosInstance, endpoints } from '../../../../services/api';
import Sidebar from '../Sidebar/Sidebar';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [newRecord, setNewRecord] = useState({
    user: '',
    schedule: '',
    subscription: '',
    attended: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState(null);

  // States for search and filters
  const [filterUser, setFilterUser] = useState('');
  const [filterSchedule, setFilterSchedule] = useState('');

  useEffect(() => {
    fetchRecords();
    fetchUsers();
    fetchSchedules();
    fetchSubscriptions();
  }, [filterUser, filterSchedule]);

  const fetchRecords = async () => {
    try {
      let params = {};
      if (filterUser) params.user = filterUser;
      if (filterSchedule) params.schedule = filterSchedule;

      const response = await axiosInstance.get(endpoints.RECORDS, { params });
      setRecords(response.data.results);
    } catch (error) {
      console.error('Failed to fetch records:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(endpoints.USERS);
      setUsers(response.data.results);
    } catch (error) {
      console.error('Failed to fetch users:', error);
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

  const fetchSubscriptions = async () => {
    try {
      const response = await axiosInstance.get(endpoints.SUBSCRIPTIONS);
      setSubscriptions(response.data.results);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    }
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
  };

  const getScheduleName = (scheduleId) => {
    const schedule = schedules.find((s) => s.id === scheduleId);
    return schedule ? `${schedule.section.name} on ${schedule.date}` : 'Unknown Schedule';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'd MMMM yyyy', { locale: ru });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({
      ...newRecord,
      [name]: value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axiosInstance.put(`${endpoints.RECORDS}${editingRecordId}/`, newRecord);
      } else {
        await axiosInstance.post(endpoints.RECORDS, newRecord);
      }
      fetchRecords();
      setNewRecord({ user: '', schedule: '', subscription: '', attended: false });
      setIsEditing(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save record:', error);
    }
  };

  const handleEdit = (record) => {
    setNewRecord({
      user: record.user,
      schedule: record.schedule,
      subscription: record.subscription,
      attended: record.attended,
    });
    setEditingRecordId(record.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (recordId) => {
    try {
      await axiosInstance.delete(`${endpoints.RECORDS}${recordId}/`);
      fetchRecords();
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  const openAddModal = () => {
    setNewRecord({ user: '', schedule: '', subscription: '', attended: false });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar />
      <div className="flex-1 p-4 sm:ml-64 mt-12">
        <h1 className="text-3xl font-semibold mb-4">Manage Records</h1>

        {/* Filter UI */}
        <div className="mb-4 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Filter by User"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Filter by Schedule"
            value={filterSchedule}
            onChange={(e) => setFilterSchedule(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
          <button
            onClick={() => fetchRecords()}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Apply Filters
          </button>
        </div>

        <button
          onClick={openAddModal}
          className="mb-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Add New Record
        </button>

        <div className="table-responsive">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Schedule</th>
                <th className="px-4 py-2">Subscription</th>
                <th className="px-4 py-2">Attended</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="border px-4 py-2">{getUserName(record.user)}</td>
                  <td className="border px-4 py-2">{getScheduleName(record.schedule)}</td>
                  <td className="border px-4 py-2">{record.subscription.type}</td>
                  <td className="border px-4 py-2">{record.attended ? 'Yes' : 'No'}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md mr-2"
                    >
                      <FaEdit className="mr-2" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Adding/Editing Record */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{isEditing ? 'Edit Record' : 'Add New Record'}</h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <FaTimes className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleSave}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user">
                    User
                  </label>
                  <select
                    id="user"
                    name="user"
                    value={newRecord.user}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.first_name} {user.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="schedule">
                    Schedule
                  </label>
                  <select
                    id="schedule"
                    name="schedule"
                    value={newRecord.schedule}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Schedule</option>
                    {schedules.map((schedule) => (
                      <option key={schedule.id} value={schedule.id}>
                        {schedule.section.name} on {formatDate(schedule.date)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subscription">
                    Subscription
                  </label>
                  <select
                    id="subscription"
                    name="subscription"
                    value={newRecord.subscription}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Subscription</option>
                    {subscriptions.map((subscription) => (
                      <option key={subscription.id} value={subscription.id}>
                        {subscription.type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="attended">
                    Attended
                  </label>
                  <select
                    id="attended"
                    name="attended"
                    value={newRecord.attended}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {isEditing ? 'Update Record' : 'Add Record'}
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

export default Records;
