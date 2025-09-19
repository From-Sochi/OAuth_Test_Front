import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getTasks } from '../forStorage';
import '../styles/Root.css'
import { useAuth } from '../context/AuthContext';

export async function loader() {
	const tasks = await getTasks();
	return { tasks };
}

function Root() {
	const location = useLocation();
	const navigate = useNavigate();
	const { authState, logout } = useAuth();

	const isActive = (path: string) => {
		return location.pathname.includes(path);
	};

	const handleLogout = async () => {
		await logout();
		navigate('/');
	};

	return (
		<>
			<nav>
				<Link to={`/dashboard/1`} className={isActive('dashboard') ? 'active' : ''}>
					Авторизация
				</Link>

				{/* Делаем ссылки неактивными если не авторизован */}
				<Link
					to={authState.isAuthenticated ? `/tasks/2` : '#'}
					className={`${isActive('tasks') ? 'active' : ''} ${!authState.isAuthenticated ? 'disabled' : ''}`}
					style={{ pointerEvents: !authState.isAuthenticated ? 'none' : 'auto', opacity: !authState.isAuthenticated ? 0.5 : 1 }}
				>
					Задачи
				</Link>

				<Link
					to={authState.isAuthenticated ? `/timer/3` : '#'}
					className={`${isActive('timer') ? 'active' : ''} ${!authState.isAuthenticated ? 'disabled' : ''}`}
					style={{ pointerEvents: !authState.isAuthenticated ? 'none' : 'auto', opacity: !authState.isAuthenticated ? 0.5 : 1 }}
				>
					Секундомер
				</Link>

				<Link
					to={authState.isAuthenticated ? `/nutrition/4` : '#'}
					className={`${isActive('nutrition') ? 'active' : ''} ${!authState.isAuthenticated ? 'disabled' : ''}`}
					style={{ pointerEvents: !authState.isAuthenticated ? 'none' : 'auto', opacity: !authState.isAuthenticated ? 0.5 : 1 }}
				>
					Питание
				</Link>

				{authState.isAuthenticated && (
					<button onClick={handleLogout} style={{ marginLeft: 'auto' }}>
						Выйти ({authState.role})
					</button>
				)}
			</nav>
			<main>
				<Outlet />
			</main>
		</>
	);
}

export default Root;