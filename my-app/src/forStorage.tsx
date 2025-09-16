import localforage from 'localforage';

// Определяем интерфейс для задачи (замените на вашу реальную структуру)
interface Task {
    id: string;
    title: string;
    completed: boolean;
    // добавьте другие поля по необходимости
}

type TaskArray = Task[];

export async function getTasks(): Promise<TaskArray> {
    await someNetwork('getTasks');
    let tasks = await localforage.getItem<TaskArray>('tasks');
    if (!tasks) tasks = [];
    return tasks;
}

// Типизируем кэш
interface Cache {
    [key: string]: boolean;
}

let someCache: Cache = {};

// Типизируем функцию someNetwork
async function someNetwork(key: string): Promise<void> {
    if (!key) {
        someCache = {};
        return;
    }

    if (someCache[key]) {
        return;
    }

    someCache[key] = true;

    return new Promise<void>((res) => {
        setTimeout(res, Math.random() * 700);
    });
}