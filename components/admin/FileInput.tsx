"use client";

import { useRef } from "react";
import { FaFilePdf, FaLink, FaUpload } from "react-icons/fa";
import { getMediaUrl } from "@/lib/mediaUrl";
import { btnSecondaryClass, inputClass, labelClass } from "@/lib/admin/config";

export type FileInputMode = "upload" | "url";

type FileInputProps = {
  mode: FileInputMode;
  onModeChange: (mode: FileInputMode) => void;
  urlValue: string;
  onUrlChange: (value: string) => void;
  file: File | null;
  onFileChange: (file: File | null) => void;
  existingPath?: string;
  accept?: string;
  hint?: string;
};

export default function FileInput({
  mode,
  onModeChange,
  urlValue,
  onUrlChange,
  file,
  onFileChange,
  existingPath = "",
  accept = "application/pdf,.pdf",
  hint = "PDF up to 15 MB",
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl =
    mode === "upload" && file
      ? null
      : (urlValue.trim() || existingPath)
        ? getMediaUrl(mode === "url" ? urlValue.trim() : existingPath)
        : "";

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
          <FaUpload className="h-3.5 w-3.5" />
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
          File URL
        </button>
      </div>

      {mode === "upload" ? (
        <div className="space-y-3">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
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
              Choose PDF
            </button>
            {file ? (
              <span className="text-sm text-gray-600">{file.name}</span>
            ) : existingPath ? (
              <span className="text-sm text-gray-500">
                Current file kept unless you choose a new one
              </span>
            ) : (
              <span className="text-sm text-gray-500">{hint}</span>
            )}
          </div>
        </div>
      ) : (
        <div>
          <label className={labelClass}>File URL or path</label>
          <input
            value={urlValue}
            onChange={(event) => onUrlChange(event.target.value)}
            placeholder="https://... or /uploads/pdf/example.pdf"
            className={inputClass}
          />
        </div>
      )}

      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-4">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <FaFilePdf className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">
            {file?.name ?? (previewUrl ? "Document ready" : "No file selected")}
          </p>
          {previewUrl ? (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-700 hover:underline"
            >
              Preview / open file
            </a>
          ) : (
            <p className="text-xs text-gray-500">{hint}</p>
          )}
        </div>
      </div>
    </div>
  );
}
