import React, { useState, useEffect } from 'react';
import { axiosInstance, endpoints } from '../../../../services/api';
import { FaPlus, FaTimes, FaEdit, FaTrash, FaInfoCircle, FaBook } from 'react-icons/fa';
import Sidebar from '../Sidebar/Sidebar';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

const Sections = () => {
  const [sections, setSections] = useState([]);
  const [centers, setCenters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newSection, setNewSection] = useState({
    name: '',
    category: '',
    center: '',
    description: '',
    image: null,
    daysWithTimes: [],
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [selectedSection, setSelectedSection] = useState(null);

  // For syllabus management
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
  const [selectedSectionForSyllabus, setSelectedSectionForSyllabus] = useState(null);
  const [syllabusFile, setSyllabusFile] = useState(null);
  const [syllabuses, setSyllabuses] = useState([]);

  const daysOfWeek = [
    { value: 1, label: 'Понедельник' },
    { value: 2, label: 'Вторник' },
    { value: 3, label: 'Среда' },
    { value: 4, label: 'Четверг' },
    { value: 5, label: 'Пятница' },
    { value: 6, label: 'Суббота' },
    { value: 0, label: 'Воскресенье' },
  ];

  useEffect(() => {
    fetchSections();
    fetchCenters();
    fetchCategories();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await axiosInstance.get(endpoints.SECTIONS, {
        params: {
          page: 'all',
        },
      });
      setSections(response.data);
    } catch (error) {
      console.error('Failed to fetch sections:', error);
    }
  };

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get(endpoints.CENTERS, {
        params: {
          page: 'all',
        },
      });
      setCenters(response.data);
    } catch (error) {
      console.error('Failed to fetch centers:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(endpoints.CATEGORIES, {
        params: {
          page: 'all',
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setNewSection({
        ...newSection,
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
      setNewSection({
        ...newSection,
        [name]: value,
      });
    }
  };

  const handleDaySelect = (e) => {
    const dayOfWeek = parseInt(e.target.value);
    const existingDay = newSection.daysWithTimes.find((day) => day.dayOfWeek === dayOfWeek);

    if (!existingDay) {
      setNewSection({
        ...newSection,
        daysWithTimes: [
          ...newSection.daysWithTimes,
          { dayOfWeek, startTime: '15:00', endTime: '16:00' },
        ],
      });
    }
  };

  const handleTimeChange = (dayOfWeek, time, isStart) => {
    setNewSection({
      ...newSection,
      daysWithTimes: newSection.daysWithTimes.map((day) =>
        day.dayOfWeek === dayOfWeek ? { ...day, [isStart ? 'startTime' : 'endTime']: time } : day
      ),
    });
  };

  const removeDay = (dayIndex) => {
    setNewSection({
      ...newSection,
      daysWithTimes: newSection.daysWithTimes.filter((day) => day.dayOfWeek !== dayIndex),
    });
  };

  const resetForm = () => {
    setNewSection({
      name: '',
      category: '',
      center: '',
      description: '',
      image: null,
      daysWithTimes: [],
    });
    setCurrentSectionId(null);
    setImagePreview(null);
    setIsEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const weekly_pattern = newSection.daysWithTimes.map((day) => {
      const dayNames = {
        1: 'Понедельник',
        2: 'Вторник',
        3: 'Среда',
        4: 'Четверг',
        5: 'Пятница',
        6: 'Суббота',
        0: 'Воскресенье',
      };

      return {
        day: dayNames[day.dayOfWeek],
        start_time: day.startTime,
        end_time: day.endTime,
      };
    });

    const formData = new FormData();
    formData.append('name', newSection.name);
    formData.append('category', newSection.category);
    formData.append('center', newSection.center);
    formData.append('description', newSection.description);
    if (newSection.image) formData.append('image', newSection.image);
    formData.append('weekly_pattern', JSON.stringify(weekly_pattern));

    try {
      if (isEditMode) {
        await axiosInstance.put(`${endpoints.SECTIONS}${currentSectionId}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSections(
          sections.map((section) =>
            section.id === currentSectionId ? { ...section, ...newSection } : section
          )
        );
        setAlertMessage('Секция успешно обновлена!');
      } else {
        const response = await axiosInstance.post(endpoints.SECTIONS, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
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
      image: null,
      daysWithTimes: section.daysWithTimes || [],
    });
    setCurrentSectionId(section.id);
    setImagePreview(section.image);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (sectionId) => {
    try {
      await axiosInstance.delete(`${endpoints.SECTIONS}${sectionId}/`);
      setSections(sections.filter((section) => section.id !== sectionId));
      setAlertMessage('Секция успешно удалена!');
      setTimeout(() => setAlertMessage(''), 3000);
    } catch (error) {
      console.error('Failed to delete section:', error);
    }
  };

  const handleViewDetails = (section) => {
    setSelectedSection(section);
    setIsDetailModalOpen(true);
  };

  // New methods for syllabuses
  const handleAddSyllabus = (section) => {
    setSelectedSectionForSyllabus(section);
    setIsSyllabusModalOpen(true);
  };

  const handleSyllabusFileChange = (e) => {
    setSyllabusFile(e.target.files[0]);
  };

  const handleSyllabusSubmit = async (e) => {
    e.preventDefault();
    if (!syllabusFile) return;
    
    const formData = new FormData();
    formData.append('pdf', syllabusFile);
    formData.append('section_id', selectedSectionForSyllabus.id);

    try {
      await axiosInstance.post(endpoints.GENERATE_SYLLABUS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAlertMessage('Силлабус успешно добавлен!');
      setIsSyllabusModalOpen(false);
      setTimeout(() => setAlertMessage(''), 3000);
    } catch (error) {
      console.error('Failed to add syllabus:', error);
    }
  };

  const handleViewSyllabuses = async (section) => {
    try {
      const response = await axiosInstance.get(`${endpoints.GET_SYLLABUSES}${section.id}/`);
      setSyllabuses(response.data.syllabuses);
      setSelectedSection(section);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch syllabuses:', error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar />
      <div className="flex-1 p-4 sm:ml-64 mt-12">
        <h1 className="text-3xl font-semibold mb-4">Секции</h1>
        {alertMessage && (
          <div className="mb-4 p-4 text-white bg-green-500 rounded">{alertMessage}</div>
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

        <div className="table-responsive">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Название</th>
                <th className="px-4 py-2">Категория</th>
                <th className="px-4 py-2">Центр</th>
                <th className="px-4 py-2">Описание</th>
                <th className="px-4 py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr key={section.id}>
                  <td className="border px-4 py-2">{section.name}</td>
                  <td className="border px-4 py-2">
                    {categories.find((c) => c.id === section.category)?.name}
                  </td>
                  <td className="border px-4 py-2">
                    {centers.find((c) => c.id === section.center)?.name}
                  </td>
                  <td className="border px-4 py-2">{section.description}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(section)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md flex items-center"
                    >
                      <FaEdit className="mr-2" /> Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md flex items-center"
                    >
                      <FaTrash className="mr-2" /> Удалить
                    </button>
                    {/* <button
                      onClick={() => handleViewDetails(section)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
                    >
                      <FaInfoCircle className="mr-2" /> Подробнее
                    </button> */}
                    {/* New buttons for syllabus */}
                    <button
                      onClick={() => handleAddSyllabus(section)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md flex items-center"
                    >
                      <FaBook className="mr-2" /> Добавить силлабус
                    </button>
                    <button
                      onClick={() => handleViewSyllabuses(section)}
                      className="px-4 py-2 bg-purple-500 text-white rounded-md flex items-center"
                    >
                      <FaBook className="mr-2" /> Посмотреть силлабусы
                    </button>
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
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Form fields omitted for brevity */}
            </form>
          </div>
        </div>
      )}

      {/* Modal for Adding Syllabus */}
      {isSyllabusModalOpen && selectedSectionForSyllabus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Добавить силлабус для {selectedSectionForSyllabus.name}</h2>
              <button onClick={() => setIsSyllabusModalOpen(false)}>
                <FaTimes className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSyllabusSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="syllabus">
                  Загрузить силлабус (PDF)
                </label>
                <input
                  type="file"
                  id="syllabus"
                  name="syllabus"
                  onChange={handleSyllabusFileChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  accept="application/pdf"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                >
                  Добавить силлабус
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Section Details and Viewing Syllabuses */}
      {isDetailModalOpen && selectedSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg h-5/6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Детали секции: {selectedSection.name}</h2>
              <button onClick={() => setIsDetailModalOpen(false)}>
                <FaTimes className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="mb-4">
              <strong>Название:</strong> {selectedSection.name}
            </p>
            <p className="mb-4">
              <strong>Категория:</strong>{' '}
              {categories.find((c) => c.id === selectedSection.category)?.name}
            </p>
            <p className="mb-4">
              <strong>Центр:</strong> {centers.find((c) => c.id === selectedSection.center)?.name}
            </p>
            <p className="mb-4">
              <strong>Описание:</strong> {selectedSection.description}
            </p>
            {syllabuses.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Силлабусы</h3>
                {syllabuses.map((syllabus) => (
                  <div key={syllabus.id} className="mb-4">
                    <h4 className="text-lg font-semibold">{syllabus.title}</h4>
                    <p>{syllabus.content}</p>
                    <h5 className="font-semibold mt-2">Тесты:</h5>
                    {syllabus.questions.map((question, index) => (
                      <div key={index} className="mb-2">
                        <strong>Вопрос:</strong> {question.question}
                        <ul className="list-disc ml-5">
                          {question.options.map((option, i) => (
                            <li key={i} className={question.correct_answer === i ? 'font-bold text-green-600' : ''}>
                              {option}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sections;
