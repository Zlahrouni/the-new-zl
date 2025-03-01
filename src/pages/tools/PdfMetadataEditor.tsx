import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';

interface MetadataValues {
    title: string;
    author: string;
    subject: string;
    keywords: string;
    creator: string;
    producer: string;
}

const PDFMetadataEditor = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [metadata, setMetadata] = useState<MetadataValues>({
        title: '',
        author: '',
        subject: '',
        keywords: '',
        creator: '',
        producer: ''
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [originalMetadata, setOriginalMetadata] = useState<MetadataValues | null>(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setSuccess(false);
            setPreviewUrl(URL.createObjectURL(selectedFile) as string);

            try {
                setIsProcessing(true);
                // Read the existing metadata
                const arrayBuffer = await selectedFile.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);

                // Get existing metadata and handle arrays for keywords
                const keywords = pdfDoc.getKeywords();
                const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : '';

                // Get creator and producer, filtering out pdf-lib default values
                const creator = pdfDoc.getCreator() || '';
                const producer = pdfDoc.getProducer() || '';

                const existingMetadata = {
                    title: pdfDoc.getTitle() || '',
                    author: pdfDoc.getAuthor() || '',
                    subject: pdfDoc.getSubject() || '',
                    keywords: keywordsString,
                    // Remove pdf-lib default values if they exist
                    creator: creator.includes('pdf-lib') ? '' : creator,
                    producer: producer.includes('pdf-lib') ? '' : producer
                };

                setMetadata(existingMetadata);
                setOriginalMetadata(existingMetadata);
                setIsProcessing(false);
            } catch (error) {
                console.error('Error reading PDF metadata:', error);
                setIsProcessing(false);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMetadata({
            ...metadata,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        try {
            setIsProcessing(true);

            // Load the PDF
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // Update the metadata
            pdfDoc.setTitle(metadata.title);
            pdfDoc.setAuthor(metadata.author);
            pdfDoc.setSubject(metadata.subject);
            // Convert comma-separated keywords string to array
            const keywordsArray = metadata.keywords.split(',').map(keyword => keyword.trim()).filter(Boolean);
            pdfDoc.setKeywords(keywordsArray);
            pdfDoc.setCreator(metadata.creator);
            pdfDoc.setProducer(metadata.producer);

            // Save the PDF
            const pdfBytes = await pdfDoc.save();

            // Create download link
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            // Create a link and trigger download
            const link = document.createElement('a');
            link.href = url;

            // Extract file name without extension
            const nameWithoutExt = fileName.replace(/\.pdf$/i, '');
            link.download = `${nameWithoutExt}-updated.pdf`;
            link.click();

            URL.revokeObjectURL(url);
            setSuccess(true);
            setIsProcessing(false);
        } catch (error) {
            console.error('Error updating PDF metadata:', error);
            setIsProcessing(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setFileName('');
        setMetadata({
            title: '',
            author: '',
            subject: '',
            keywords: '',
            creator: '',
            producer: ''
        });
        setPreviewUrl(null);
        setOriginalMetadata(null);
        setSuccess(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">PDF Metadata Editor</h1>

                <div className="mb-6">
                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Upload PDF</label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="w-full text-gray-700 dark:text-gray-300 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-100"
                        ref={fileInputRef}
                    />
                </div>

                {isProcessing && (
                    <div className="flex justify-center my-6">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400"></div>
                    </div>
                )}

                {file && !isProcessing && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <form onSubmit={handleSubmit}>
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Edit Metadata</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={metadata.title}
                                            onChange={handleInputChange}
                                            placeholder="PDF document title"
                                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
                                        <input
                                            type="text"
                                            name="author"
                                            value={metadata.author}
                                            onChange={handleInputChange}
                                            placeholder="Author name"
                                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={metadata.subject}
                                            onChange={handleInputChange}
                                            placeholder="Document subject or description"
                                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Keywords</label>
                                        <input
                                            type="text"
                                            name="keywords"
                                            value={metadata.keywords}
                                            onChange={handleInputChange}
                                            placeholder="SEO keywords (separate with commas)"
                                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Creator</label>
                                        <input
                                            type="text"
                                            name="creator"
                                            value={metadata.creator}
                                            onChange={handleInputChange}
                                            placeholder="Creating application (optional)"
                                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Producer</label>
                                        <input
                                            type="text"
                                            name="producer"
                                            value={metadata.producer}
                                            onChange={handleInputChange}
                                            placeholder="PDF producer (optional)"
                                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Save & Download
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                    >
                                        Reset
                                    </button>
                                </div>

                                {success && (
                                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg dark:bg-green-800 dark:text-green-100 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        PDF successfully updated and downloaded!
                                    </div>
                                )}
                            </form>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Preview</h2>
                            {previewUrl && (
                                <div className="h-96 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white">
                                    <iframe
                                        src={previewUrl}
                                        className="w-full h-full"
                                        title="PDF Preview"
                                    ></iframe>
                                </div>
                            )}

                            {originalMetadata && (
                                <div className="mt-4">
                                    <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-200">Original Metadata</h3>
                                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                        <p><strong className="font-semibold">Title:</strong> {originalMetadata.title || '(none)'}</p>
                                        <p><strong className="font-semibold">Author:</strong> {originalMetadata.author || '(none)'}</p>
                                        <p><strong className="font-semibold">Subject:</strong> {originalMetadata.subject || '(none)'}</p>
                                        <p><strong className="font-semibold">Keywords:</strong> {originalMetadata.keywords || '(none)'}</p>
                                        <p><strong className="font-semibold">Creator:</strong> {originalMetadata.creator || '(none)'}</p>
                                        <p><strong className="font-semibold">Producer:</strong> {originalMetadata.producer || '(none)'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PDFMetadataEditor;