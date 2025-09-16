import { useRouteError } from 'react-router-dom';

interface RouteError {
    statusText?: string;
    data?: string;
    message?: string;
    status?: number;
}

function ErrorPage404() {
    const error = useRouteError() as RouteError;
    console.error(error);

    return (
        <div>
            <h1>Hi! It is an Error Page</h1>
            <h2>404 Not Found Error</h2>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
            <p>
                <i>{error.data}</i>
            </p>
        </div>
    );
}

export default ErrorPage404;