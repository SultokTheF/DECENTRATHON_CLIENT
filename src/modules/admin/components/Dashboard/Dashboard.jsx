  import React, { useEffect, useState } from 'react';
  import { axiosInstance, endpoints } from '../../../../services/api'; // Use the axios instance and endpoints
  import Sidebar from '../Sidebar/Sidebar'; 
  import './Dashboard.css';
  import { FaTrash } from 'react-icons/fa';

  const Dashboard = () => {
    const [metrics, setMetrics] = useState({});
    const [recentActivities, setRecentActivities] = useState({});
    const [notifications, setNotifications] = useState({});

    useEffect(() => {
      // Fetch metrics data
      const fetchMetrics = async () => {
        try {
          const response = await axiosInstance.get(endpoints.DASHBOARD_METRICS);
          setMetrics(response.data);
        } catch (error) {
          console.error('Error fetching metrics:', error);
        }
      };

      // Fetch recent activities
      const fetchRecentActivities = async () => {
        try {
          const response = await axiosInstance.get(endpoints.DASHBOARD_RECENT_ACTIVITIES);
          setRecentActivities(response.data);
        } catch (error) {
          console.error('Error fetching recent activities:', error);
        }
      };

      // Fetch notifications
      const fetchNotifications = async () => {
        try {
          const response = await axiosInstance.get(endpoints.DASHBOARD_NOTIFICATIONS);
          setNotifications(response.data);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchMetrics();
      fetchRecentActivities();
      fetchNotifications();
    }, []);

    return (
      <div className="flex flex-col sm:flex-row">
        <Sidebar />
        <div className="flex-1 p-4 sm:ml-64 mt-12">
          <h1 className="text-3xl font-semibold mb-4">Статистика</h1>
          
          {/* Metrics Section */}
          <section className="mb-6">
            <div className="metrics-grid">
              <div className="metric-box">
                <h3>Всего пользователей</h3>
                <p>{metrics.total_users || 0}</p>
              </div>
              <div className="metric-box">
                <h3>Активные подписки</h3>
                <p>{metrics.active_subscriptions || 0}</p>
              </div>
              <div className="metric-box">
                <h3>Кол-во центров</h3>
                <p>{metrics.total_centers || 0}</p>
              </div>
              <div className="metric-box">
                <h3>Занятия на сегодня</h3>
                <p>{metrics.lessons_today || 0}</p>
              </div>
            </div>
          </section>

          {/* Recent Activities Section */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Недавние активити</h2>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Активити</th>
                  <th className="px-4 py-2">Пользователь</th>
                  <th className="px-4 py-2">Дата</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.recent_signups?.map((activity, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">Пользователь зарегистрировался</td>
                    <td className="border px-4 py-2">{activity.email}</td>
                    <td className="border px-4 py-2">{new Date(activity.date_joined).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Notifications Section */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Занятие</th>
                  <th className="px-4 py-2">Центр</th>
                  <th className="px-4 py-2">Дата</th>
                  <th className="px-4 py-2">Статус</th>
                  <th className="px-4 py-2">Действия</th>
                </tr>
                    </thead>
                  <tbody>
                {notifications.upcoming_lessons?.map((lesson, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{lesson.section?.name || 'N/A'}</td>  {/* Accessing section name */}
                    <td className="border px-4 py-2">{lesson.center?.name || 'N/A'}</td>   {/* Accessing center name */}
                    <td className="border px-4 py-2">{lesson.date}</td>
                    <td className="border px-4 py-2">{lesson.capacity === lesson.reserved ? 'Full' : 'Available'}</td>
                    <td className="border px-4 py-2">
                      <button className="bg-red-500 text-white px-4 py-2 rounded-md">
                        <FaTrash className="mr-2" /> Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </section>
        </div>
      </div>
    );
  };

  export default Dashboard;
