"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

export function ImageUploader({
  value,
  onChange,
  label = "Image",
  required = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">(value.startsWith("http") ? "url" : "upload");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (file: File) => {
    setError(null);

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowed.includes(file.type)) {
      setError("Please select a JPEG, PNG, WebP, or AVIF image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size cannot exceed 5MB.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-300">
          {label} {required && <span className="text-amber-400">*</span>}
        </label>
        <div className="flex items-center gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`cursor-pointer px-2 py-0.5 rounded transition ${
              mode === "upload"
                ? "bg-amber-500/20 text-amber-300 font-medium"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Upload File
          </button>
          <span className="text-stone-600">|</span>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`cursor-pointer px-2 py-0.5 rounded transition ${
              mode === "url"
                ? "bg-amber-500/20 text-amber-300 font-medium"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Direct URL
          </button>
        </div>
      </div>

      {error && (
        <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-rose-300 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Preview if image exists */}
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-stone-700 bg-stone-900 group aspect-video max-h-48 w-full flex items-center justify-center">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-cover transition group-hover:opacity-75"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <div className="absolute inset-0 bg-stone-950/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-stone-900/90 text-stone-100 text-xs rounded-lg border border-stone-600 hover:bg-stone-800 transition cursor-pointer"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-3 py-1.5 bg-rose-600/90 text-white text-xs rounded-lg hover:bg-rose-500 transition cursor-pointer"
            >
              Remove
            </button>
          </div>
          <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-stone-950/80 backdrop-blur rounded text-[10px] text-stone-400 truncate border border-stone-800">
            {value}
          </div>
        </div>
      ) : mode === "upload" ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
            isDragOver
              ? "border-amber-400 bg-amber-500/10"
              : "border-stone-700 hover:border-stone-500 bg-stone-900/40 hover:bg-stone-900/80"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-3">
              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-stone-300">Uploading media to server...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-stone-200">
                  <span className="text-amber-400 underline decoration-amber-400/50">Click to upload</span> or drag and drop
                </p>
                <p className="text-[10px] text-stone-500 mt-0.5">JPEG, PNG, WebP, AVIF (Max 5MB)</p>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/... or /uploads/..."
            className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
          />
          <p className="text-[10px] text-stone-500">Paste external CDN or existing hosted URL directly.</p>
        </div>
      )}
    </div>
  );
}
