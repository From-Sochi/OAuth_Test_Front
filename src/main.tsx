import './index.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { createHashRouter } from 'react-router-dom';
import Root from './routes/root.tsx';
// import ErrorPage404 from './error-page-404.tsx';
import Dashboard from './routes/Dashboard.tsx';
import Tasks from './routes/Tasks.tsx';
import Timer from './routes/Timer.tsx';
import Nutrition from './routes/Nutrition.tsx';
// import { LoadingSpinner } from './routes/LoadingSpinner.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { ProtectedRoute } from './components/ProtectedRoute';

// const router = createBrowserRouter([
//     {
//         path: '/',
//         element: <Root />,
//         errorElement: <ErrorPage404 />,
//         loader: rootLoader,
//         HydrateFallback: LoadingSpinner,
//         children: [
//             {
//                 index: true,
//                 element: <Dashboard />,
//             },
//             {
//                 path: 'dashboard/:dashboardId',
//                 element: <Dashboard />,
//             },
//             {
//                 path: 'tasks/:tasksId',
//                 element: (
//                     <ProtectedRoute>
//                         <Tasks />
//                     </ProtectedRoute>
//                 ),
//             },
//             {
//                 path: 'timer/:timerId',
//                 element: (
//                     <ProtectedRoute>
//                         <Timer />
//                     </ProtectedRoute>
//                 ),
//             },
//             {
//                 path: 'nutrition/:nutritionId',
//                 element: (
//                     <ProtectedRoute>
//                         <Nutrition />
//                     </ProtectedRoute>
//                 ),
//             },
//         ],
//     },
// ]);

const router = createHashRouter([
    {
        path: "/*",
        element: <Root />,
        children: [
            {
                path: "dashboard/1",
                element: <Dashboard />,
            },
            {
                path: "tasks/:tabId",
                element: (
                    <ProtectedRoute>
                        <Tasks />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'timer/:tabId',
                element: (
                    <ProtectedRoute>
                        <Timer />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'nutrition/:tabId',
                element: (
                    <ProtectedRoute>
                        <Nutrition />
                    </ProtectedRoute>
                ),
            },
        ],
    },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </React.StrictMode>
);