import { Link } from 'react-router-dom';

const NotFound = () => (
    <div className="min-h-screen flex flex-col items-center justify-center dark:bg-gray-900">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
        <Link to="/" className="mt-4 text-blue-600 dark:text-blue-400 hover:underline">
            Go Home
        </Link>
    </div>
);

export default NotFound;