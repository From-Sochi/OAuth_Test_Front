import { Link, Outlet, useLocation } from 'react-router-dom';
import { getTasks } from '../forStorage';
import '../index.css';

export async function loader() {
	const tasks = await getTasks();
	return { tasks };
}

function Root() {
	const location = useLocation();

	// Функция для проверки активной ссылки
	const isActive = (path: string) => {
		return location.pathname.includes(path);
	};

	return (
		<>
			<nav>
				<Link to={`/dashboard/1`} className={isActive('dashboard') ? 'active' : ''}>Авторизация / аутентификация</Link>
				<Link to={`/tasks/2`} className={isActive('tasks') ? 'active' : ''}>Tasks</Link> 
				<Link to={`/timer/3`} className={isActive('timer') ? 'active' : ''}>Timer</Link>
				<Link to={`/nutrition/4`} className={isActive('nutrition') ? 'active' : ''}>Nutrition</Link>
			</nav>
			<main>
				<Outlet />
			</main>
		</>
	);
}

export default Root;