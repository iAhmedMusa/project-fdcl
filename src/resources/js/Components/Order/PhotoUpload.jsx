import { useRef } from 'react';

const ACCEPT = '.jpg,.jpeg,.png,.webp,.heic';
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function PhotoUpload({ files = [], onChange, multiple = false }) {
    const inputRef = useRef(null);

    function handleFiles(incoming) {
        const valid = Array.from(incoming).filter((f) => {
            if (f.size > MAX_SIZE) {
                alert(`${f.name} exceeds 10 MB limit.`);
                return false;
            }
            return true;
        });

        if (!valid.length) return;

        if (multiple) {
            onChange([...files, ...valid]);
        } else {
            onChange(valid.slice(0, 1));
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    }

    function remove(index) {
        onChange(files.filter((_, i) => i !== index));
    }

    return (
        <div>
            {/* Drop Zone */}
            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className="cursor-pointer rounded-lg border-2 border-dashed border-white/20 p-4 text-center transition-colors hover:border-gold/40 sm:p-6"
            >
                <svg className="mx-auto h-8 w-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                <p className="mt-2 text-xs text-white/50 sm:text-sm">
                    Drag & drop or <span className="text-gold">browse</span>
                </p>
                <p className="mt-1 text-[10px] text-white/30 sm:text-xs">
                    JPG, PNG, WebP, HEIC — max 10 MB
                </p>
                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPT}
                    multiple={multiple}
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                />
            </div>

            {/* Previews */}
            {files.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {files.map((file, i) => (
                        <div
                            key={i}
                            className="group relative rounded-lg border border-white/10 bg-white/[0.03] p-2"
                        >
                            <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="h-20 w-full rounded object-cover sm:h-24"
                            />
                            <p className="mt-1 truncate text-[10px] text-white/50">
                                {file.name}
                            </p>
                            <p className="text-[10px] text-white/30">
                                {formatSize(file.size)}
                            </p>
                            <button
                                onClick={() => remove(i)}
                                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
