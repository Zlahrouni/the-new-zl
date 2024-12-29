import { useEffect, useRef } from 'react';

const OGImageGenerator = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions (recommended OG image size)
        canvas.width = 1200;
        canvas.height = 630;

        // Background
        ctx.fillStyle = '#1a365d'; // Dark blue background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add gradient overlay
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(37, 99, 235, 0.1)');
        gradient.addColorStop(1, 'rgba(37, 99, 235, 0.4)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add name
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 72px Inter, system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('Ziad Lahrouni', canvas.width / 2, canvas.height / 2 - 40);

        // Add title
        ctx.font = '36px Inter, system-ui';
        ctx.fillText('Full Stack Developer', canvas.width / 2, canvas.height / 2 + 20);

        // Add bottom text
        ctx.font = '24px Inter, system-ui';
        ctx.fillText('Angular • Spring Boot • React', canvas.width / 2, canvas.height / 2 + 80);

        // Add website URL
        ctx.font = '20px Inter, system-ui';
        ctx.fillText('ziadlahrouni.com', canvas.width / 2, canvas.height - 40);
    }, []);

    const downloadImage = () => {
        const link = document.createElement('a');
        link.download = 'og-image.png';
        link.href = canvasRef.current.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <canvas
                ref={canvasRef}
                className="w-full max-w-2xl border border-gray-200 rounded-lg shadow-lg"
            />
            <button
                onClick={downloadImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Download OG Image
            </button>
        </div>
    );
};

export default OGImageGenerator;