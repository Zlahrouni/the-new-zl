import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import CV from './pages/CV';
import NotFound from './pages/NotFound';
import { DarkModeProvider } from "./contexts/DarkModeContext.tsx";
import { useLanguage } from "./contexts/LanguageContext.tsx";
import './app.scss';
import Navbar from "./components/NavBar.tsx";
import BlogList from "./pages/BlogList.tsx";
import BlogPost from "./components/blog-component.tsx";
import PDFMetadataEditor from "./pages/tools/PdfMetadataEditor.tsx";
import ToolList from "./pages/ToolList.tsx";

const App: React.FC = () => {
    const { language } = useLanguage();

    useEffect(() => {
        const description = language === 'en'
            ? "Ziad Lahrouni - Full Stack Developer specializing in Angular & Spring Boot"
            : "Ziad Lahrouni - Développeur Full Stack spécialisé en Angular & Spring Boot";

        document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }, [language]);

    return (
        <DarkModeProvider>
            <Navbar>
                <Routes>
                    <Route path="/" element={<CV />} />
                    <Route path="/blogs" element={<BlogList />} />
                    <Route path="/blog/:filename" element={<BlogPost />} />
                    <Route path="/tools" element={<ToolList />} />
                    <Route path="/tools/pdf-metadata-editor" element={<PDFMetadataEditor />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Navbar>
        </DarkModeProvider>
    );
};

export default App;