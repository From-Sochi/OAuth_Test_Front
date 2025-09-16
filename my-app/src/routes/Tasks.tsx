import { useState, useRef } from 'react';
import '../index.css';

const initialState = [
    { id: '1', name: 'Work', done: false },
    { id: '2', name: 'Study', done: false },
    { id: '3', name: 'Shop', done: false },
];

type TaskProps = {
    id: string;
    name: string;
    done: boolean;
}

type FilterOption = 'all' | 'completed' | 'active' | 'alphabet';

function Tasks() {
    const [taskList, setTaskList] = useState<TaskProps[]>(initialState);
    const [newTask, setNewTask] = useState('');
    const [filter, setFilter] = useState<FilterOption>('all');
    const nextId = useRef(4);

    // Функция для фильтрации и сортировки задач
    const getFilteredAndSortedTasks = () => {
        let filteredTasks = [...taskList];
        
        // Фильтрация
        switch (filter) {
            case 'completed':
                filteredTasks = filteredTasks.filter(task => task.done);
                break;
            case 'active':
                filteredTasks = filteredTasks.filter(task => !task.done);
                break;
            case 'alphabet':
                filteredTasks = filteredTasks.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // 'all' - без фильтрации
                break;
        }
        
        return filteredTasks;
    };

    function checkTask(id: string) {
        setTaskList(tasks => 
            tasks.map(task => 
                task.id === id ? { ...task, done: !task.done } : task
            )
        );
    }

    function handleFilterChange(option: FilterOption) {
        setFilter(option);
    }

    function handleChange(id: string, newName: string) {
        setTaskList(tasks => 
            tasks.map(task => 
                task.id === id ? { ...task, name: newName } : task
            )
        );
    }

    function deleteTask(id: string) {
        setTaskList(tasks => tasks.filter(task => task.id !== id));
    }

    function addTask() {
        if (!newTask.trim()) return;
        setTaskList(prev => [...prev, {
            id: nextId.current.toString(),
            name: newTask,
            done: false,
        }]);
        nextId.current += 1;
        setNewTask('');
    }

    // Получаем отфильтрованные и отсортированные задачи
    const filteredTasks = getFilteredAndSortedTasks();

    const items = filteredTasks.map((task) => {
        return (
            <div key={task.id} className="task-item">
                <input
                    type="text"
                    value={task.name}
                    className="task-input"
                    onChange={(e) => handleChange(task.id, e.target.value)}
                />
                <input 
                    type="checkbox" 
                    onChange={() => checkTask(task.id)} 
                    checked={task.done} 
                />
                <button
                    className="delete-button"
                    onClick={() => deleteTask(task.id)}
                >
                    Delete ✕
                </button>
            </div>
        )
    });

    return (
        <div className="todo-container">
            <h1 className="todo-header">
                {taskList.length > 0 ? 'Может хватит?' : 'Накидай-ка себе задач, лентяй...'}
            </h1>

            <div className="add-task-container">
                <input
                    type="text"
                    placeholder='Add new task...'
                    value={newTask}
                    className="add-task-input"
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                />
                <button className="add-task-button" onClick={addTask}>
                    Add
                </button>
            </div>

            {taskList.length > 0 && (
                <>
                    <div className="filter-task-container">
                        <select 
                            className='filter-task-input'
                            value={filter}
                            onChange={(e) => handleFilterChange(e.target.value as FilterOption)}
                        >
                            <option value="all">Все задачи</option>
                            <option value="alphabet">По алфавиту</option>
                            <option value="completed">Выполненные</option>
                            <option value="active">Не выполненные</option>
                        </select>
                    </div>
                    <hr style={{ marginBottom: '20px' }} />
                </>
            )}

            <div className="tasks-list">
                {items.length > 0 ? items : (
                    <div className="empty-state">
                        {taskList.length === 0 
                            ? 'Ты всё сделал, дурачок... 🎉' 
                            : 'Нет задач по выбранному фильтру...'
                        }
                    </div>
                )}
            </div>
        </div>
    )
}

export default Tasks;