"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FaImage, FaLink } from "react-icons/fa";
import { getMediaUrl } from "@/lib/mediaUrl";
import { btnSecondaryClass, inputClass, labelClass } from "@/lib/admin/config";

export type ImageInputMode = "upload" | "url";

type ImageInputProps = {
  mode: ImageInputMode;
  onModeChange: (mode: ImageInputMode) => void;
  urlValue: string;
  onUrlChange: (value: string) => void;
  file: File | null;
  onFileChange: (file: File | null) => void;
  existingPath?: string;
};

export default function ImageInput({
  mode,
  onModeChange,
  urlValue,
  onUrlChange,
  file,
  onFileChange,
  existingPath = "",
}: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setFilePreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const previewSrc = useMemo(() => {
    if (mode === "upload") {
      if (filePreview) return filePreview;
      if (existingPath) return getMediaUrl(existingPath);
      return "";
    }

    return urlValue.trim() ? getMediaUrl(urlValue.trim()) : "";
  }, [mode, filePreview, existingPath, urlValue]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onModeChange("upload")}
          className={[
            "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
            mode === "upload"
              ? "bg-green-600 text-white"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
          ].join(" ")}
        >
          <FaImage className="h-3.5 w-3.5" />
          Upload file
        </button>
        <button
          type="button"
          onClick={() => onModeChange("url")}
          className={[
            "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
            mode === "url"
              ? "bg-green-600 text-white"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
          ].join(" ")}
        >
          <FaLink className="h-3.5 w-3.5" />
          Image URL
        </button>
      </div>

      {mode === "upload" ? (
        <div className="space-y-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(event) => {
              onFileChange(event.target.files?.[0] ?? null);
            }}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className={btnSecondaryClass}
            >
              Choose image
            </button>
            {file ? (
              <span className="text-sm text-gray-600">{file.name}</span>
            ) : existingPath ? (
              <span className="text-sm text-gray-500">Current image kept unless you pick a new file</span>
            ) : (
              <span className="text-sm text-gray-500">JPEG, PNG, WebP, or GIF up to 10 MB</span>
            )}
          </div>
        </div>
      ) : (
        <div>
          <label className={labelClass}>Image URL or path</label>
          <input
            value={urlValue}
            onChange={(event) => onUrlChange(event.target.value)}
            placeholder="https://... or /uploads/hero/example.jpg"
            className={inputClass}
          />
        </div>
      )}

      {previewSrc ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          <img
            src={previewSrc}
            alt="Preview"
            className="h-40 w-full object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}
