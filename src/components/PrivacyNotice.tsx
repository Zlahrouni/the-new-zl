import { useState, useEffect, useRef } from "react";

export const PrivacyNotice = () => {
    const [isVisible, setIsVisible] = useState(() => !localStorage.getItem('privacyAccepted'));
    const [isBlinking, setIsBlinking] = useState(false);
    const noticeRef = useRef(null);

    const handleAccept = () => {
        localStorage.setItem('privacyAccepted', 'true');
        setIsVisible(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (noticeRef.current && !noticeRef.current.contains(event.target)) {
                setIsBlinking(true);
                setTimeout(() => setIsBlinking(false), 1000);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isVisible) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

            <div
                ref={noticeRef}
                className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 
                    max-w-2xl w-11/12 bg-gradient-to-r from-purple-600 to-blue-500 
                    p-6 rounded-xl shadow-2xl z-50 border-4 
                    transition-colors duration-100
                    ${isBlinking ? 'border-red-500' : 'border-transparent'}`}
            >
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">
                            🔐 Privacy Notice
                        </h3>
                        <p className="text-white/90 text-sm">
                            This website uses local browser storage to enhance your browsing experience. We only collect
                            and store essential preferences (such as dark/light mode settings) directly in your browser.
                            This data never leaves your device, is not shared with third parties, and is only used to
                            remember your visual preferences for this website. You can clear this data at any time
                            through your browser settings.
                        </p>
                    </div>
                    <button
                        onClick={handleAccept}
                        className="w-full md:w-auto px-6 py-3 bg-white text-purple-600
                            rounded-lg font-semibold hover:bg-gray-100
                            focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    >
                        I Accept
                    </button>
                </div>
            </div>
        </>
    );
};