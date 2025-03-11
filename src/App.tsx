import React, {useEffect} from 'react';
import {Routes, Route} from 'react-router-dom';
import CV from './pages/CV';
import NotFound from './pages/NotFound';
import { DarkModeProvider } from "./contexts/DarkModeContext.tsx";
import { useLanguage } from "./contexts/LanguageContext.tsx";
import './app.scss';
import Navbar from "./components/NavBar.tsx";
import PDFMetadataEditor from "./pages/tools/PdfMetadataEditor.tsx";
import ToolList from "./pages/ToolList.tsx";
import ImageOptimizer from "./pages/tools/ImageOptimizer.tsx";
import AccessibilityChecker from "./pages/tools/AccessibilityChecker.tsx";
import Footer from "./components/Footer.tsx";

const App: React.FC = () => {
    const { language } = useLanguage();
    // const location = useLocation();

    // const isToolsSection = useMemo(() => {
    //     return location.pathname.startsWith('/tools');
    // }, [location.pathname]);

    useEffect(() => {
        const description = language === 'en'
            ? "Ziad Lahrouni - Full Stack Developer specializing in Angular & Spring Boot"
            : "Ziad Lahrouni - Développeur Full Stack spécialisé en Angular & Spring Boot";

        document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }, [language]);

    return (
        <DarkModeProvider>
            <Navbar>
                {/*{isToolsSection && <SupportBanner key="support-banner" />}*/}
                <Routes>
                    <Route path="/" element={<CV />} />
                    {/*<Route path="/blogs" element={<BlogList />} />*/}
                    {/*<Route path="/blog/:filename" element={<BlogPost />} />*/}
                    <Route path="/tools" element={<ToolList />} />
                    <Route path="/tools/image-optimizer" element={<ImageOptimizer />} />
                    <Route path="/tools/pdf-metadata-editor" element={<PDFMetadataEditor />} />
                    <Route path="/tools/accessibility-checker" element={<AccessibilityChecker />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Navbar>
            <Footer />
        </DarkModeProvider>
    );
};

export default App;