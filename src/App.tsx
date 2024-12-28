import React, {useEffect} from 'react';
import { Routes, Route } from 'react-router-dom';
import CV from './pages/CV';
import NotFound from './pages/NotFound';
import {DarkModeProvider} from "./contexts/DarkModeContext.tsx";
import {useLanguage} from "./contexts/LanguageContext.tsx";

const App: React.FC = () => {
    const { language } = useLanguage();

    useEffect(() => {
        const description = language === 'en'
            ? "Ziad Lahrouni's professional portfolio - Full Stack Developer specializing in Angular & Spring Boot, showcasing skills, experience, and certifications."
            : "Portfolio professionnel de Ziad Lahrouni - Développeur Full Stack spécialisé en Angular & Spring Boot, présentant compétences, expériences et certifications.";

        const descriptionMeta = document.querySelector('meta[name="description"]');
        if (descriptionMeta) {
            descriptionMeta.setAttribute('content', description);
        }
    }, [language]);

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