import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CV from './pages/CV';
import NotFound from './pages/NotFound';
import {DarkModeProvider} from "./contexts/DarkModeContext.tsx";

const App: React.FC = () => {
    return (
        <>
            <DarkModeProvider>
                {/*<Navbar />*/}
                <Routes>
                    <Route path="/" element={<CV />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </DarkModeProvider>
        </>
    );
};

export default App;