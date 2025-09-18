import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { type User, type LoginFormData } from '../types/auth';
import '../styles/Dashboard.css';

// Создаем интерфейс для ошибок, который допускает строковые сообщения
interface FormErrors {
  role?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  age?: string;
}

function Dashboard() {
  const { login, authState } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>('user');
  const [formData, setFormData] = useState<LoginFormData>({
    role: 'user',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    gender: '',
    age: undefined,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as 'user' | 'admin';
    setSelectedRole(role);
    setFormData(prev => ({
      ...prev,
      role,
      firstName: role === 'admin' ? '' : prev.firstName,
      lastName: role === 'admin' ? '' : prev.lastName,
      gender: role === 'admin' ? '' : prev.gender,
      age: role === 'admin' ? undefined : prev.age,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    }

    if (formData.role === 'admin' && formData.password !== 'Admin') {
      newErrors.password = 'Неверный пароль администратора';
    }

    if (formData.role === 'user') {
      if (!formData.firstName) newErrors.firstName = 'Имя обязательно';
      if (!formData.lastName) newErrors.lastName = 'Фамилия обязательна';
      if (!formData.gender) newErrors.gender = 'Пол обязателен';
      if (!formData.age || formData.age < 1) newErrors.age = 'Возраст обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const userData: User = {
        id: Date.now().toString(),
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        gender: formData.gender || '',
        age: formData.age || 0,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      login(userData);
    }
  };

  if (authState.isAuthenticated) {
    return (
      <main>
        <div className="dashboard-container">
          <h2 className="dashboard-welcome">Добро пожаловать {authState.user?.firstName}!</h2>
          <div className="dashboard-info">
            <p><strong>Роль:</strong> {authState.role}</p>
            <p><strong>Email:</strong> {authState.user?.email}</p>
            {authState.role === 'user' && (
              <>
                <p><strong>Имя:</strong> {authState.user?.firstName} {authState.user?.lastName}</p>
                <p><strong>Пол:</strong> {authState.user?.gender}</p>
                <p><strong>Возраст:</strong> {authState.user?.age}</p>
              </>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="dashboard-container">
        <h2 className="dashboard-header">Войти как:</h2>

        <div className="form-group">
          <label htmlFor="role">Роль:</label>
          <select
            id="role"
            value={selectedRole}
            onChange={handleRoleChange}
            className="role-select"
          >
            <option value="user">Пользователь</option>
            <option value="admin">Администратор</option>
          </select>
          <hr />
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {selectedRole === 'user' && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Имя"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Фамилия"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="gender"
                  placeholder="Пол"
                  value={formData.gender}
                  onChange={handleInputChange}
                />
                {errors.gender && <span className="error-message">{errors.gender}</span>}
              </div>

              <div className="form-group">
                <input
                  type="number"
                  name="age"
                  placeholder="Возраст"
                  value={formData.age || ''}
                  onChange={handleInputChange}
                />
                {errors.age && <span className="error-message">{errors.age}</span>}
              </div>
            </>
          )}

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            {selectedRole === 'admin' && (
              <span className="password-hint">Пароль администратора: "Admin"</span>
            )}
          </div>

          <button type="submit" className="auth-button">
            Авторизоваться
          </button>
        </form>
      </div>
    </main>
  );
}

export default Dashboard;