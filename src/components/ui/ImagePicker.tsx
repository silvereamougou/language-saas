import React, { useRef, useState } from 'react';
import { Image as ImageIcon, UploadCloud, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ImagePickerProps {
    label?: string;
    value?: string | null;
    onChange?: (value: string | null) => void;
    className?: string;
    error?: string;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
    label,
    value,
    onChange,
    className,
    error
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleFileChange = async (file: File) => {
        if (!file) return;

        try {
            setIsUploading(true);
            setUploadError(null);

            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();

            if (onChange) {
                onChange(data.url);
            }
        } catch (err: any) {
            console.error('Upload error:', err);
            setUploadError(err.message || 'Error uploading image');
        } finally {
            setIsUploading(false);
        }
    };

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileChange(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleFileChange(file);
        }
    };

    const clearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onChange) {
            onChange(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={cn("flex flex-col gap-2 w-full", className)}>
            {label && (
                <label className="text-xs font-black text-text-secondary uppercase tracking-widest px-1">
                    {label}
                </label>
            )}

            <div
                className={cn(
                    "relative w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 overflow-hidden cursor-pointer group bg-input-bg",
                    isDragging
                        ? "border-[var(--icon-color)] bg-[var(--icon-color)]/5"
                        : "border-input-border hover:border-text-muted/50 hover:bg-surface-secondary",
                    error ? "border-red-500/50 bg-red-500/5" : "",
                    value ? "border-transparent" : ""
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileInputChange}
                    accept="image/*"
                    className="hidden"
                />

                {isUploading ? (
                    <div className="flex flex-col items-center justify-center text-text-muted">
                        <div className="w-8 h-8 border-2 border-[var(--icon-color)] border-t-transparent rounded-full animate-spin mb-2" />
                        <span className="font-bold text-[10px] uppercase tracking-widest animate-pulse">Uploading...</span>
                    </div>
                ) : value ? (
                    <div className="relative w-full h-full group/image">
                        <img
                            src={value}
                            alt="Selected"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                            <span className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                <UploadCloud size={16} /> Replace Image
                            </span>
                        </div>
                        <button
                            onClick={clearImage}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all shadow-lg z-10"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-text-muted transition-colors group-hover:text-text-primary pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-[var(--icon-color)]/10 flex items-center justify-center mb-3 group-hover:bg-[var(--icon-color)]/20 transition-colors">
                            <ImageIcon size={24} className="text-[var(--icon-color)]" />
                        </div>
                        <span className="font-bold text-sm tracking-tight">Click or drag image to upload</span>
                        <span className="text-[10px] uppercase tracking-widest mt-1 opacity-60 font-medium">SVG, PNG, JPG or GIF</span>
                    </div>
                )}
            </div>

            {(error || uploadError) && (
                <p className="text-[10px] text-red-500 font-black uppercase tracking-widest px-1 mt-1">
                    {error || uploadError}
                </p>
            )}
        </div>
    );
};

export default ImagePicker;
