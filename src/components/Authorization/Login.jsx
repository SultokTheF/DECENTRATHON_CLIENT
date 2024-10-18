import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState(''); // For email or phone number
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the identifier is an email or phone number
    const isEmail = identifier.includes('@');
    const credentials = isEmail
      ? { email: identifier, password }
      : { phone_number: identifier, password };

    login(credentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Войти в систему</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="identifier">
              Эл. почта или номер телефона
            </label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Введите вашу эл. почту или номер телефона"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Введите ваш пароль"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Войти
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm">
              Нет аккаунта?{' '}
              <Link to="/register" className="text-indigo-500 hover:text-indigo-700">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
