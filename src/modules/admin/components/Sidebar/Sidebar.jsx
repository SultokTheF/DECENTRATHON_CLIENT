import React, { useState, useEffect } from 'react';
import {
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaUsers,
  FaLayerGroup,
  FaBuilding,
  FaBars,
  FaTachometerAlt, // Icon for dashboard
  FaCalendarAlt, // Icon for schedule
  FaClipboardList // Icon for subscriptions
} from 'react-icons/fa';
import { logo } from '../../../../assets/images';
import { useAuth } from '../../../../hooks/useAuth';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  return (
    <>
      {!isOpen && (
        <button
          className="sm:hidden fixed top-4 left-4 z-50 text-gray-500 dark:text-white"
          onClick={toggleSidebar}
        >
          <FaBars className="w-6 h-6 text-black" />
        </button>
      )}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 sm:hidden"
          onClick={closeSidebar}
        ></div>
      )}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center ps-2.5 mb-5">
            <img src={logo} className="h-12 sm:h-12" alt="Uiten Logo" />
          </div>
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/dashboard"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaTachometerAlt className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Статистика</span>
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaUser className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Профиль</span>
              </a>
            </li>
            <li>
              <a
                href="/sections"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaLayerGroup className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Секции</span>
              </a>
            </li>
            <li>
              <a
                href="/centers"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaBuilding className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Центры</span>
              </a>
            </li>
            <li>
              <a
                href="/users"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaUsers className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Пользователи</span>
              </a>
            </li>
            <li>
              <a
                href="/subscriptions"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <FaClipboardList className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Подписки</span>
              </a>
            </li>
            <li>
              <a
                href="/schedules"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <FaCalendarAlt className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Расписание</span>
              </a>
            </li>
            <li>
            </li>
            <li>
              <button
                onClick={logout}
                className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaSignOutAlt className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Выход</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
