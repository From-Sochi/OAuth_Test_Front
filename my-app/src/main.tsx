import './index.css'
import { Suspense } from 'react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import Root, { loader as rootLoader } from './routes/root.tsx';
import ErrorPage404 from './error-page-404.tsx';
import Dashboard from './routes/Dashboard.tsx';
import Tasks from './routes/Tasks.tsx';
import Timer from './routes/Timer.tsx';
import Nutrition from './routes/Nutrition.tsx';
import { LoadingSpinner } from './routes/LoadingSpinner.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <ErrorPage404 />,
        loader: rootLoader,
        HydrateFallback: LoadingSpinner, 
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <Dashboard />
                    </Suspense>
                ),
            },
            {
                path: 'dashboard/:dashboardId',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <Dashboard />
                    </Suspense>
                ),
            },
            {
                path: 'tasks/:tasksId',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <Tasks />
                    </Suspense>
                ),
            },
            {
                path: 'timer/:timerId',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <Timer />
                    </Suspense>
                ),
            },
            {
                path: 'nutrition/:nutritionId',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <Nutrition />
                    </Suspense>
                ),
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);