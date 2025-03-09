import React, { useState, useRef, useEffect } from 'react';
import {useLanguage} from "../../contexts/LanguageContext.tsx";


interface ImageFile {
    id: string;
    file: File;
    originalUrl: string;
    compressedUrl: string | null;
    originalSize: number;
    compressedSize: number | null;
    width: number;
    height: number;
}

interface Translations {
    title: string;
    uploadImages: string;
    dragDrop: string;
    browse: string;
    compressionSettings: string;
    quality: string;
    maxWidth: string;
    format: string;
    originalImage: string;
    optimizedImage: string;
    fileName: string;
    originalSize: string;
    optimizedSize: string;
    reduction: string;
    dimensions: string;
    downloadAll: string;
    downloadImage: string;
    compress: string;
    compressing: string;
    dragActive: string;
    noImages: string;
    errorProcessing: string;
    kb: string;
    mb: string;
    imageOptimized: string;
}

const translations: Record<'en' | 'fr', Translations> = {
    en: {
        title: 'Image Optimizer',
        uploadImages: 'Upload Images',
        dragDrop: 'Drag & drop images here or',
        browse: 'browse files',
        compressionSettings: 'Compression Settings',
        quality: 'Quality',
        maxWidth: 'Max Width (px)',
        format: 'Format',
        originalImage: 'Original',
        optimizedImage: 'Optimized',
        fileName: 'File name',
        originalSize: 'Original size',
        optimizedSize: 'Optimized size',
        reduction: 'Reduction',
        dimensions: 'Dimensions',
        downloadAll: 'Download All',
        downloadImage: 'Download',
        compress: 'Optimize Images',
        compressing: 'Compressing...',
        dragActive: 'Drop images here',
        noImages: 'No images uploaded yet',
        errorProcessing: 'Error processing image',
        kb: 'KB',
        mb: 'MB',
        imageOptimized: 'Image optimized successfully!',
    },
    fr: {
        title: 'Optimiseur d\'Images',
        uploadImages: 'Télécharger des Images',
        dragDrop: 'Glissez et déposez des images ici ou',
        browse: 'parcourir les fichiers',
        compressionSettings: 'Paramètres de Compression',
        quality: 'Qualité',
        maxWidth: 'Largeur Max (px)',
        format: 'Format',
        originalImage: 'Original',
        optimizedImage: 'Optimisé',
        fileName: 'Nom du fichier',
        originalSize: 'Taille originale',
        optimizedSize: 'Taille optimisée',
        reduction: 'Réduction',
        dimensions: 'Dimensions',
        downloadAll: 'Tout Télécharger',
        downloadImage: 'Télécharger',
        compress: 'Optimiser les Images',
        compressing: 'Compression en cours...',
        dragActive: 'Déposez les images ici',
        noImages: 'Aucune image téléchargée',
        errorProcessing: 'Erreur lors du traitement',
        kb: 'Ko',
        mb: 'Mo',
        imageOptimized: 'Image optimisée avec succès !',
    }
};

const ImageOptimizer: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language];

    const [images, setImages] = useState<ImageFile[]>([]);
    const [quality, setQuality] = useState<number>(80);
    const [maxWidth, setMaxWidth] = useState<number>(1920);
    const [format, setFormat] = useState<string>('jpeg');
    const [isCompressing, setIsCompressing] = useState<boolean>(false);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            handleFiles(Array.from(event.target.files));
        }
    };

    const handleFiles = async (files: File[]) => {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        const newImageFiles = await Promise.all(
            imageFiles.map(async (file) => {
                const originalUrl = URL.createObjectURL(file);
                const dimensions = await getImageDimensions(originalUrl);

                return {
                    id: Math.random().toString(36).substring(2, 11),
                    file,
                    originalUrl,
                    compressedUrl: null,
                    originalSize: file.size,
                    compressedSize: null,
                    width: dimensions.width,
                    height: dimensions.height
                };
            })
        );

        setImages(prev => [...prev, ...newImageFiles]);
    };

    const getImageDimensions = (url: string): Promise<{width: number, height: number}> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };
            img.src = url;
        });
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleCompression = async () => {
        if (images.length === 0) return;

        setIsCompressing(true);

        const updatedImages = await Promise.all(
            images.map(async (image) => {
                if (image.compressedUrl) {
                    // Skip if already compressed
                    return image;
                }

                try {
                    const { compressedUrl, compressedSize } = await compressImage(
                        image.file,
                        quality,
                        maxWidth,
                        format
                    );

                    return {
                        ...image,
                        compressedUrl,
                        compressedSize
                    };
                } catch (error) {
                    console.error('Error compressing image:', error);
                    return image;
                }
            })
        );

        setImages(updatedImages);
        setIsCompressing(false);
        setShowSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };

    const compressImage = async (
        file: File,
        quality: number,
        maxWidth: number,
        format: string
    ): Promise<{ compressedUrl: string; compressedSize: number }> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                // Calculate new dimensions while maintaining aspect ratio
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    const ratio = maxWidth / width;
                    width = maxWidth;
                    height = Math.round(height * ratio);
                }

                // Create canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                // Draw image on canvas
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                // Use better quality settings
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to specified format
                const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
                const qualityValue = format === 'png' ? undefined : quality / 100;

                // Get compressed image as blob
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Could not create blob'));
                            return;
                        }

                        const compressedUrl = URL.createObjectURL(blob);
                        const compressedSize = blob.size;

                        resolve({ compressedUrl, compressedSize });
                    },
                    mimeType,
                    qualityValue
                );
            };

            img.onerror = () => {
                reject(new Error('Error loading image'));
            };

            img.src = URL.createObjectURL(file);
        });
    };

    const downloadImage = (image: ImageFile) => {
        if (!image.compressedUrl) return;

        const link = document.createElement('a');
        link.href = image.compressedUrl;

        // Create filename with format extension
        const originalName = image.file.name;
        const extension = format === 'jpeg' ? 'jpg' : format;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        const newFilename = `${nameWithoutExt}-optimized.${extension}`;

        link.download = newFilename;
        link.click();
    };

    const downloadAllImages = () => {
        images.forEach(image => {
            if (image.compressedUrl) {
                downloadImage(image);
            }
        });
    };

    const removeImage = (id: string) => {
        setImages(prevImages => {
            const updatedImages = prevImages.filter(image => image.id !== id);

            // Revoke object URLs to prevent memory leaks
            const imageToRemove = prevImages.find(image => image.id === id);
            if (imageToRemove) {
                URL.revokeObjectURL(imageToRemove.originalUrl);
                if (imageToRemove.compressedUrl) {
                    URL.revokeObjectURL(imageToRemove.compressedUrl);
                }
            }

            return updatedImages;
        });
    };

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            images.forEach(image => {
                URL.revokeObjectURL(image.originalUrl);
                if (image.compressedUrl) {
                    URL.revokeObjectURL(image.compressedUrl);
                }
            });
        };
    }, []);

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(2)} ${t.kb}`;
        }
        return `${(bytes / (1024 * 1024)).toFixed(2)} ${t.mb}`;
    };

    const calculateReduction = (original: number, compressed: number | null): string => {
        if (compressed === null) return '-';
        const reduction = ((original - compressed) / original) * 100;
        return `${reduction.toFixed(1)}%`;
    };

    return (
        <main className="min-h-screen pt-16 sm:pt-20 pb-16 sm:pb-20 bg-gray-100 dark:bg-gray-900 transition-colors">
            <div className="container mx-auto px-3 sm:px-4">
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-xl shadow-lg">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center dark:text-white">
                        {t.title}
                    </h1>

                    {/* File Upload Area */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center cursor-pointer transition-colors ${
                            dragActive
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
                        }`}
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <div className="text-lg dark:text-white">
                            {dragActive ? t.dragActive : (
                                <>
                                    <p>{t.dragDrop}</p>
                                    <span className="text-blue-600 dark:text-blue-400 font-medium ml-1">
                    {t.browse}
                  </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Compression Settings */}
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 dark:text-white">
                            {t.compressionSettings}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium dark:text-gray-300">
                                    {t.quality}: {quality}%
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={quality}
                                    onChange={(e) => setQuality(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium dark:text-gray-300">
                                    {t.maxWidth}
                                </label>
                                <input
                                    type="number"
                                    min="100"
                                    max="8000"
                                    value={maxWidth}
                                    onChange={(e) => setMaxWidth(Number(e.target.value))}
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium dark:text-gray-300">
                                    {t.format}
                                </label>
                                <select
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="jpeg">JPEG</option>
                                    <option value="png">PNG</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3">
                            <button
                                onClick={handleCompression}
                                disabled={images.length === 0 || isCompressing}
                                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                                    images.length === 0 || isCompressing
                                        ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {isCompressing ? t.compressing : t.compress}
                            </button>

                            {images.some(img => img.compressedUrl) && (
                                <button
                                    onClick={downloadAllImages}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    {t.downloadAll}
                                </button>
                            )}
                        </div>

                        {showSuccess && (
                            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg dark:bg-green-800 dark:text-green-100 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {t.imageOptimized}
                            </div>
                        )}
                    </div>

                    {/* Results */}
                    <div>
                        {images.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                {t.noImages}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {images.map((image) => (
                                    <div key={image.id} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                                        <div className="p-3 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                                            <h3 className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-md">
                                                {image.file.name}
                                            </h3>
                                            <button
                                                onClick={() => removeImage(image.id)}
                                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                aria-label="Remove image"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4 p-4">
                                            <div>
                                                <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                    {t.originalImage}
                                                </h4>
                                                <div className="rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-600 border dark:border-gray-500">
                                                    <img
                                                        src={image.originalUrl}
                                                        alt={`Original ${image.file.name}`}
                                                        className="w-full h-auto object-contain"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                    {t.optimizedImage}
                                                </h4>
                                                <div className="rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-600 border dark:border-gray-500 min-h-32">
                                                    {image.compressedUrl ? (
                                                        <img
                                                            src={image.compressedUrl}
                                                            alt={`Compressed ${image.file.name}`}
                                                            className="w-full h-auto object-contain"
                                                        />
                                                    ) : (
                                                        <div className="h-full min-h-32 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                                            {isCompressing ? t.compressing : t.compress}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gray-50 dark:bg-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <h5 className="text-gray-500 dark:text-gray-400 mb-1">{t.originalSize}</h5>
                                                <p className="font-medium dark:text-gray-200">{formatFileSize(image.originalSize)}</p>
                                            </div>
                                            <div>
                                                <h5 className="text-gray-500 dark:text-gray-400 mb-1">{t.optimizedSize}</h5>
                                                <p className="font-medium dark:text-gray-200">
                                                    {image.compressedSize ? formatFileSize(image.compressedSize) : '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <h5 className="text-gray-500 dark:text-gray-400 mb-1">{t.reduction}</h5>
                                                <p className="font-medium dark:text-gray-200">
                                                    {calculateReduction(image.originalSize, image.compressedSize)}
                                                </p>
                                            </div>
                                            <div>
                                                <h5 className="text-gray-500 dark:text-gray-400 mb-1">{t.dimensions}</h5>
                                                <p className="font-medium dark:text-gray-200">{image.width} × {image.height}</p>
                                            </div>
                                        </div>

                                        {image.compressedUrl && (
                                            <div className="p-3 bg-gray-100 dark:bg-gray-800 flex justify-end">
                                                <button
                                                    onClick={() => downloadImage(image)}
                                                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                    {t.downloadImage}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ImageOptimizer;