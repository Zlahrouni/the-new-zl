import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ComingSoon from './pages/ComingSoon';
import CV from './pages/CV';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<CV />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

export default App;