"use client";
import { useRef, useState } from "react";

interface FileUploadProps {
  onUpload: (fileUrl: string, fileName: string) => void;
  context?: string;
  accept?: string;
  label?: string;
  existingFileName?: string | null;
}

export function FileUpload({
  onUpload,
  context = "general",
  accept = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.png,.jpg,.jpeg",
  label = "Attach file",
  existingFileName,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [uploadedName, setUploadedName] = useState<string | null>(existingFileName ?? null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("uploading");
    setErrorMsg("");
    try {
      // 1. Get presigned URL from our server
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, contentType: file.type || "application/octet-stream", context }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to get upload URL");

      // 2. PUT file bytes directly to S3
      const s3Res = await fetch(data.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!s3Res.ok) throw new Error("Upload to storage failed");

      setUploadedName(file.name);
      setStatus("done");
      onUpload(data.fileUrl, file.name);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Upload failed");
    }
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={status === "uploading"}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
        {status === "uploading" ? "Uploading…" : label}
      </button>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
      {status === "done" && uploadedName && (
        <p className="text-xs text-emerald-600">✓ {uploadedName}</p>
      )}
      {status === "idle" && uploadedName && (
        <p className="text-xs text-slate-500">📎 {uploadedName}</p>
      )}
      {status === "error" && (
        <p className="text-xs text-rose-600">⚠️ {errorMsg}</p>
      )}
    </div>
  );
}

interface FileDownloadButtonProps {
  fileUrl: string;
  fileName: string;
  variant?: "button" | "link";
}

export function FileDownloadButton({ fileUrl, fileName, variant = "button" }: FileDownloadButtonProps) {
  function handleDownload() {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  if (variant === "link") {
    return (
      <button
        type="button"
        onClick={handleDownload}
        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline"
      >
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {fileName}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
    >
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      📎 {fileName}
    </button>
  );
}
