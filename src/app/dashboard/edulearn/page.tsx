"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/components/session-provider";
import { Button, useToast } from "@/components/ui";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────── */
type Mode = "flowchart" | "summary" | "story" | "video";
type Step = "upload" | "choose" | "result";

type Scene = {
  scene_number: number;
  title: string;
  narration: string;
  visual_description: string;
  on_screen_text: string[];
  emoji?: string;
  type?: string;
};

type DocMeta = {
  title: string;
  subject: string;
  level: string;
  topics: string[];
  docType: string;
};

/* ─── Vector SVG Icons (Enterprise UI) ───────────────────── */
function IconFlowchart({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="6" height="5" rx="1.5" />
      <rect x="15" y="3" width="6" height="5" rx="1.5" />
      <rect x="9" y="16" width="6" height="5" rx="1.5" />
      <path d="M6 8v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8M12 13v3" />
    </svg>
  );
}

function IconSummary({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function IconStory({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M9 7h6M9 11h4" />
    </svg>
  );
}

function IconVideo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="4" width="15" height="16" rx="2" />
      <path d="m22 7-5 5 5 5V7z" />
    </svg>
  );
}

function IconUpload({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconDocument({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function IconCheck({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconDownload({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconRefresh({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function IconEdit({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

/* ─── Canvas Video Renderer (Clean Professional Aesthetic) ── */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number
): number {
  const words = text.split(" ");
  let line = "";
  let currY = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, currY);
      line = word;
      currY += lineH;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, currY);
  return currY;
}

function drawVideoFrame(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scene: Scene,
  sceneIdx: number,
  totalScenes: number,
  progress: number,
  docTitle: string
) {
  // Deep obsidian/slate studio background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#090D16");
  bg.addColorStop(1, "#0F172A");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Precision grid lines (graph/architectural texture)
  ctx.strokeStyle = "rgba(148, 163, 184, 0.04)";
  ctx.lineWidth = 1;
  for (let x = 60; x < W; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 60; y < H; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // Header Bar
  ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
  ctx.fillRect(0, 0, W, 58);
  ctx.strokeStyle = "rgba(51, 65, 85, 0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 58);
  ctx.lineTo(W, 58);
  ctx.stroke();

  // Header Brand & Metadata
  ctx.font = "600 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#F8FAFC";
  ctx.textAlign = "left";
  ctx.fillText("EDUMENTOR INTELLIGENCE", 36, 34);

  const tDoc = docTitle.length > 50 ? docTitle.slice(0, 47) + "…" : docTitle;
  ctx.font = "400 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#94A3B8";
  ctx.textAlign = "center";
  ctx.fillText(tDoc, W / 2, 34);

  ctx.font = "600 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#818CF8";
  ctx.textAlign = "right";
  ctx.fillText(`SCENE ${sceneIdx + 1} OF ${totalScenes}`, W - 36, 34);

  // Scene Title
  const ta = Math.min(1, progress * 4);
  const ty = (1 - ta) * 12;
  ctx.globalAlpha = ta;
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "700 42px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "left";
  wrapText(ctx, scene.title, 48, 140 - ty, W - 96, 52);
  ctx.globalAlpha = 1;

  // Thin architectural rule
  const lineW = Math.min(W - 96, progress * 2.8 * (W - 96));
  ctx.strokeStyle = "#4F46E5";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(48, 205);
  ctx.lineTo(48 + lineW, 205);
  ctx.stroke();

  // Bullet Points
  const maxBullets = Math.min((scene.on_screen_text ?? []).length, 4);
  for (let b = 0; b < maxBullets; b++) {
    const threshold = 0.18 + b * 0.14;
    if (progress <= threshold) continue;
    const ba = Math.min(1, (progress - threshold) / 0.08);
    ctx.globalAlpha = ba;
    const by = 250 + b * 54;

    // Clean square marker
    ctx.fillStyle = "#6366F1";
    ctx.fillRect(48, by - 12, 6, 6);

    ctx.fillStyle = "#E2E8F0";
    ctx.font = "400 21px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "left";
    const bt = scene.on_screen_text[b] ?? "";
    ctx.fillText(bt.length > 76 ? bt.slice(0, 73) + "…" : bt, 68, by);
    ctx.globalAlpha = 1;
  }

  // Subtitle Teleprompter Area
  const na = Math.min(1, progress * 2.5);
  ctx.globalAlpha = na;
  ctx.fillStyle = "rgba(11, 15, 25, 0.94)";
  ctx.fillRect(0, H - 94, W, 78);
  ctx.strokeStyle = "rgba(51, 65, 85, 0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, H - 94);
  ctx.lineTo(W, H - 94);
  ctx.stroke();

  const narr = scene.narration ?? "";
  const nTrunc = narr.length > 130 ? narr.slice(0, 127) + "…" : narr;
  ctx.fillStyle = "#CBD5E1";
  ctx.font = "400 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(nTrunc, W / 2, H - 52);
  ctx.globalAlpha = 1;

  // Timeline Progress Bar
  ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
  ctx.fillRect(0, H - 16, W, 16);

  const overallPct = (sceneIdx + progress) / totalScenes;
  ctx.fillStyle = "#4F46E5";
  ctx.fillRect(0, H - 16, W * overallPct, 16);
}

function getSceneDuration(scene: Scene): number {
  const words = (scene.narration ?? "").split(/\s+/).length;
  return Math.max(7, Math.ceil(words / 2.0));
}

async function renderVideoToBlob(
  previewCanvas: HTMLCanvasElement,
  scenes: Scene[],
  docTitle: string,
  onProgress: (pct: number, label: string) => void,
  cancelRef: React.MutableRefObject<boolean>
): Promise<{ blob: Blob; mimeType: string }> {
  const W = 1280, H = 720;
  previewCanvas.width = W;
  previewCanvas.height = H;
  const ctx = previewCanvas.getContext("2d")!;

  const mimeType =
    ["video/mp4;codecs=avc1", "video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find(
      (t) => MediaRecorder.isTypeSupported(t)
    ) ?? "video/webm";

  const stream = previewCanvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 5_000_000 });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
  recorder.start(100);

  const sceneDurations = scenes.map(getSceneDuration);

  for (let i = 0; i < scenes.length; i++) {
    if (cancelRef.current) break;
    const scene = scenes[i];
    const durMs = sceneDurations[i] * 1000;
    const overallStart = sceneDurations.slice(0, i).reduce((a, b) => a + b, 0);
    const totalSecs = sceneDurations.reduce((a, b) => a + b, 0);

    onProgress(
      Math.round((overallStart / totalSecs) * 100),
      `Rendering scene ${i + 1} of ${scenes.length}: "${scene.title}"`
    );

    await new Promise<void>((resolve) => {
      const t0 = performance.now();
      function frame() {
        if (cancelRef.current) { resolve(); return; }
        const sceneProgress = Math.min((performance.now() - t0) / durMs, 1);
        drawVideoFrame(ctx, W, H, scene, i, scenes.length, sceneProgress, docTitle);
        if (sceneProgress < 1) requestAnimationFrame(frame);
        else resolve();
      }
      requestAnimationFrame(frame);
    });

    if (i < scenes.length - 1 && !cancelRef.current) {
      await new Promise<void>((resolve) => {
        const t0 = performance.now();
        const fadeMs = 500;
        function frame() {
          const p = Math.min((performance.now() - t0) / fadeMs, 1);
          drawVideoFrame(ctx, W, H, scene, i, scenes.length, 1, docTitle);
          ctx.fillStyle = `rgba(0,0,0,${p})`;
          ctx.fillRect(0, 0, W, H);
          if (p < 1) requestAnimationFrame(frame);
          else resolve();
        }
        requestAnimationFrame(frame);
      });
    }
  }

  // Clean studio outro
  if (!cancelRef.current) {
    const t0 = performance.now();
    await new Promise<void>((resolve) => {
      function frame() {
        const p = Math.min((performance.now() - t0) / 1600, 1);
        ctx.fillStyle = "#090D16";
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = Math.min(1, p * 2.5);
        ctx.font = "600 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillStyle = "#F8FAFC";
        ctx.textAlign = "center";
        ctx.fillText("EDUMENTOR INTELLIGENCE", W / 2, H / 2 - 16);
        ctx.font = "400 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillStyle = "#94A3B8";
        ctx.fillText("Automated Document Synthesis", W / 2, H / 2 + 20);
        ctx.globalAlpha = 1;
        if (p < 1) requestAnimationFrame(frame);
        else resolve();
      }
      requestAnimationFrame(frame);
    });
  }

  recorder.stop();
  await new Promise<void>((resolve) => { recorder.onstop = () => resolve(); });
  onProgress(100, "Rendering complete");
  return { blob: new Blob(chunks, { type: mimeType }), mimeType };
}

/* ─── Video Generator Component ─────────────────────────── */
function VideoGenerator({
  initialScenes,
  meta,
  file,
  darkMode,
}: {
  initialScenes: Scene[];
  meta: DocMeta;
  file: File | null;
  darkMode: boolean;
}) {
  const { push } = useToast();
  type SubStep = "review" | "rendering" | "done";
  const [subStep, setSubStep] = useState<SubStep>("review");
  const [scenes, setScenes] = useState<Scene[]>(initialScenes);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoMime, setVideoMime] = useState("video/webm");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cancelRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSecs = scenes.reduce((sum, s) => sum + getSceneDuration(s), 0);
  const estMins = Math.ceil(totalSecs / 60);

  function saveEdit(idx: number) {
    setScenes((prev) => prev.map((s, i) => (i === idx ? { ...s, narration: editText } : s)));
    setEditingIdx(null);
  }

  async function startRender() {
    if (!canvasRef.current) return;
    cancelRef.current = false;
    setSubStep("rendering");
    setProgress(0);
    setElapsed(0);
    const t0 = Date.now();
    timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - t0) / 1000)), 1000);

    try {
      const { blob, mimeType } = await renderVideoToBlob(
        canvasRef.current,
        scenes,
        file?.name ?? meta.title,
        (pct, label) => {
          setProgress(pct);
          setProgressLabel(label);
        },
        cancelRef
      );
      if (timerRef.current) clearInterval(timerRef.current);
      if (!cancelRef.current) {
        setVideoUrl(URL.createObjectURL(blob));
        setVideoMime(mimeType);
        setSubStep("done");
      } else {
        setSubStep("review");
      }
    } catch (err) {
      if (timerRef.current) clearInterval(timerRef.current);
      push("Rendering error: " + (err instanceof Error ? err.message : "failed"), "error");
      setSubStep("review");
    }
  }

  function cancelRender() {
    cancelRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function download() {
    const ext = videoMime.includes("mp4") ? "mp4" : "webm";
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `Synthesis-${file?.name ?? "video"}.${ext}`;
    a.click();
  }

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className={cn(
          "w-full rounded-xl border bg-black shadow-sm",
          darkMode ? "border-slate-800" : "border-slate-200",
          subStep === "rendering" ? "block" : "hidden"
        )}
        style={{ aspectRatio: "16/9" }}
      />

      {subStep === "review" && (
        <div className="space-y-4">
          <div
            className={cn(
              "flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4.5 transition-colors",
              darkMode ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"
            )}
          >
            <div>
              <p className={cn("text-sm font-semibold tracking-tight", darkMode ? "text-slate-100" : "text-slate-900")}>
                {meta.title}
              </p>
              <p className={cn("mt-0.5 text-xs", darkMode ? "text-slate-400" : "text-slate-500")}>
                {meta.subject} · {scenes.length} scripted scenes · Estimated length: ~{estMins} min
              </p>
            </div>
            <Button onClick={startRender} size="sm">
              Render Presentation Video
            </Button>
          </div>

          <div className="space-y-2.5">
            {scenes.map((scene, i) => (
              <div
                key={i}
                className={cn(
                  "group rounded-xl border p-4 transition-colors",
                  darkMode
                    ? "border-slate-800/80 bg-slate-900/60 hover:border-slate-700"
                    : "border-slate-200/90 bg-white hover:border-slate-300"
                )}
              >
                <div className="flex gap-3.5">
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold font-mono",
                      darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"
                    )}
                  >
                    {String(scene.scene_number ?? i + 1).padStart(2, "0")}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-xs font-semibold tracking-tight", darkMode ? "text-slate-200" : "text-slate-800")}>
                        {scene.title}
                      </p>
                      {scene.type && (
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase",
                            darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
                          )}
                        >
                          {scene.type}
                        </span>
                      )}
                      <span className="ml-auto font-mono text-[11px] text-slate-400">~{getSceneDuration(scene)}s</span>
                    </div>

                    {editingIdx === i ? (
                      <div className="space-y-2 pt-1">
                        <textarea
                          className={cn(
                            "w-full rounded-lg border p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400",
                            darkMode
                              ? "border-slate-700 bg-slate-800 text-slate-100"
                              : "border-slate-300 bg-slate-50 text-slate-800"
                          )}
                          rows={3}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(i)}
                            className="rounded-md bg-slate-900 dark:bg-slate-100 px-3 py-1.5 text-xs font-medium text-white dark:text-slate-900 transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingIdx(null)}
                            className={cn(
                              "rounded-md border px-3 py-1.5 text-xs font-medium",
                              darkMode ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-600"
                            )}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className={cn("text-xs leading-relaxed", darkMode ? "text-slate-400" : "text-slate-600")}>
                        "{scene.narration}"
                      </p>
                    )}

                    {(scene.on_screen_text ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {scene.on_screen_text.map((t, bi) => (
                          <span
                            key={bi}
                            className={cn(
                              "rounded border px-2 py-0.5 text-[11px]",
                              darkMode
                                ? "border-slate-800 bg-slate-850 text-slate-400"
                                : "border-slate-200/80 bg-slate-50 text-slate-600"
                            )}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {editingIdx !== i && (
                    <button
                      onClick={() => {
                        setEditingIdx(i);
                        setEditText(scene.narration);
                      }}
                      className={cn(
                        "self-start rounded-md border p-1 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-slate-700 dark:hover:text-slate-200",
                        darkMode ? "border-slate-700" : "border-slate-200"
                      )}
                      title="Edit narration script"
                    >
                      <IconEdit />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={cn("flex justify-end pt-2 border-t", darkMode ? "border-slate-800" : "border-slate-200")}>
            <Button onClick={startRender}>Render Presentation Video</Button>
          </div>
        </div>
      )}

      {subStep === "rendering" && (
        <div className="space-y-4">
          <div
            className={cn(
              "rounded-xl border p-5 space-y-3",
              darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn("text-xs font-semibold tracking-wide uppercase", darkMode ? "text-slate-300" : "text-slate-800")}>
                  Generating Video Canvas
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{progressLabel}</p>
              </div>
              <div className="text-right">
                <p className={cn("font-mono text-sm font-semibold", darkMode ? "text-slate-200" : "text-slate-900")}>
                  {progress.toFixed(0)}%
                </p>
                <p className="font-mono text-[11px] text-slate-400">{fmtTime(elapsed)} elapsed</p>
              </div>
            </div>

            <div className={cn("h-1.5 w-full overflow-hidden rounded-full", darkMode ? "bg-slate-800" : "bg-slate-100")}>
              <div
                className="h-full rounded-full bg-slate-900 dark:bg-indigo-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            onClick={cancelRender}
            className={cn(
              "w-full rounded-lg border py-2 text-xs font-medium transition",
              darkMode ? "border-slate-800 text-slate-400 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            Cancel Pipeline
          </button>
        </div>
      )}

      {subStep === "done" && videoUrl && (
        <div className="space-y-4">
          <div
            className={cn(
              "flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 transition-colors",
              darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
            )}
          >
            <div>
              <p className={cn("text-sm font-semibold", darkMode ? "text-slate-100" : "text-slate-900")}>
                Rendering Complete
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {scenes.length} scenes compiled · Ready for export
              </p>
            </div>
            <Button onClick={download} size="sm">
              <span className="flex items-center gap-1.5">
                <IconDownload />
                <span>Export {videoMime.includes("mp4") ? "MP4" : "WebM"}</span>
              </span>
            </Button>
          </div>

          <video src={videoUrl} controls className="w-full rounded-xl border border-slate-800 bg-black shadow-sm" style={{ aspectRatio: "16/9" }} />

          <div className="flex gap-2.5">
            <button
              onClick={download}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-slate-900 dark:bg-slate-100 py-2.5 text-xs font-semibold text-white dark:text-slate-900 transition hover:opacity-90"
            >
              <IconDownload />
              <span>Download Video</span>
            </button>
            <button
              onClick={() => setSubStep("review")}
              className={cn(
                "rounded-lg border px-4 py-2.5 text-xs font-medium transition",
                darkMode ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              Edit Script
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Mermaid Chart ─────────────────────────────────────── */
function MermaidChart({
  code,
  onSvgReady,
  darkMode,
}: {
  code: string;
  onSvgReady?: (svg: SVGSVGElement | null) => void;
  darkMode: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    async function render() {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: darkMode ? "dark" : "neutral",
        securityLevel: "loose",
      });
      if (!ref.current || cancelled) return;
      try {
        const id = `mm-${Date.now()}`;
        const { svg } = await mermaid.render(id, code);
        if (ref.current && !cancelled) {
          ref.current.innerHTML = svg;
          onSvgReady?.(ref.current.querySelector("svg"));
        }
      } catch {
        if (ref.current && !cancelled) {
          ref.current.innerHTML = `<pre class="text-xs text-slate-500 font-mono whitespace-pre-wrap p-4">${code}</pre>`;
        }
      }
    }
    render();
    return () => {
      cancelled = true;
    };
  }, [code, onSvgReady, darkMode]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex min-h-[360px] items-center justify-center overflow-auto rounded-xl border p-6 transition-colors",
        darkMode ? "border-slate-800/80 bg-slate-900/60" : "border-slate-200 bg-white"
      )}
    />
  );
}

/* ─── Summary View (Executive Documentation Format) ──────── */
function SummaryView({
  text,
  onDownload,
  darkMode,
}: {
  text: string;
  onDownload: () => void;
  darkMode: boolean;
}) {
  const lines = text.split("\n");
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={onDownload}>
          <span className="flex items-center gap-1.5">
            <IconDownload />
            <span>Download Summary PDF</span>
          </span>
        </Button>
      </div>
      <div
        className={cn(
          "max-h-[640px] space-y-2 overflow-y-auto rounded-xl border p-7 text-xs leading-relaxed transition-colors",
          darkMode ? "border-slate-800 bg-slate-900 text-slate-300" : "border-slate-200 bg-white text-slate-700"
        )}
      >
        {lines.map((line, i) => {
          if (line.startsWith("## ")) {
            return (
              <h2
                key={i}
                className={cn(
                  "mt-6 text-sm font-semibold tracking-tight pb-2 border-b first:mt-0",
                  darkMode ? "text-slate-100 border-slate-800" : "text-slate-900 border-slate-200"
                )}
              >
                {line.slice(3)}
              </h2>
            );
          }
          if (line.startsWith("### ")) {
            return (
              <h3 key={i} className={cn("mt-4 text-xs font-semibold uppercase tracking-wider", darkMode ? "text-slate-200" : "text-slate-800")}>
                {line.slice(4)}
              </h3>
            );
          }
          if (line.startsWith("- ") || line.startsWith("• ")) {
            return <li key={i} className="ml-4 list-disc text-slate-600 dark:text-slate-300">{line.slice(2)}</li>;
          }
          if (/^\d+\./.test(line)) {
            return <li key={i} className="ml-4 list-decimal text-slate-600 dark:text-slate-300">{line.replace(/^\d+\.\s*/, "")}</li>;
          }
          if (line.trim() === "") return <div key={i} className="h-1.5" />;
          return (
            <p key={i}>
              {line.split(/\*\*(.+?)\*\*/).map((seg, j) =>
                j % 2 === 1 ? <strong key={j} className={darkMode ? "text-white font-semibold" : "text-slate-900 font-semibold"}>{seg}</strong> : seg
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Story View (Narrative Case Study Format) ────────────── */
function StoryView({
  text,
  file,
  meta,
  darkMode,
}: {
  text: string;
  file: File | null;
  meta: DocMeta;
  darkMode: boolean;
}) {
  const { push } = useToast();
  const lines = text.split("\n");
  const title = lines.find((l) => l.startsWith("# "))?.slice(2).trim() ?? `${meta.title} — Narrative Case Study`;

  const chapters: { heading: string; body: string; isSpecial: boolean }[] = [];
  let current: { heading: string; body: string; isSpecial: boolean } | null = null;
  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) chapters.push(current);
      const h = line.slice(3).trim();
      current = { heading: h, body: "", isSpecial: /prologue|epilogue/i.test(h) };
    } else if (current) {
      current.body += line + "\n";
    }
  }
  if (current) chapters.push(current);

  async function downloadStoryPdf() {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(title, 15, 20);
      let y = 30;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      for (const ch of chapters) {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(ch.heading, 15, y);
        y += 8;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);

        const bodyLines = doc.splitTextToSize(ch.body.replace(/\n+/g, " ").trim(), 180);
        for (const bl of bodyLines) {
          if (y > 275) {
            doc.addPage();
            y = 20;
          }
          doc.text(bl, 15, y);
          y += 5.5;
        }
        y += 8;
      }
      doc.save(`Narrative-Case-Study-${file?.name ?? "document"}.pdf`);
    } catch {
      push("PDF export error", "error");
    }
  }

  return (
    <div className="space-y-5">
      {/* Editorial Header */}
      <div
        className={cn(
          "rounded-xl border p-6 transition-colors",
          darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center rounded-md border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2 text-[11px] font-semibold tracking-wider uppercase text-slate-700 dark:text-slate-300">
                Narrative Case Study
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">{meta.subject}</span>
            </div>
            <h2 className={cn("mt-2 text-xl font-bold tracking-tight", darkMode ? "text-slate-100" : "text-slate-900")}>
              {title}
            </h2>
            <p className={cn("mt-1 text-xs", darkMode ? "text-slate-400" : "text-slate-500")}>
              Academic concept application framed through sequential scenario analysis.
            </p>
          </div>
          <Button size="sm" onClick={downloadStoryPdf}>
            <span className="flex items-center gap-1.5">
              <IconDownload />
              <span>Download PDF</span>
            </span>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {chapters.map((ch, idx) => (
          <div
            key={idx}
            className={cn(
              "rounded-xl border p-6 transition-colors",
              ch.isSpecial
                ? darkMode
                  ? "border-slate-800 bg-slate-900/40"
                  : "border-slate-200 bg-slate-50/50"
                : darkMode
                ? "border-slate-800 bg-slate-900"
                : "border-slate-200 bg-white"
            )}
          >
            <div className="mb-4 flex items-center gap-3">
              {!ch.isSpecial && (
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-mono font-semibold",
                    darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"
                  )}
                >
                  {String(idx + 1).padStart(2, "0")}
                </div>
              )}
              <h3 className={cn("text-sm font-semibold tracking-tight", darkMode ? "text-slate-100" : "text-slate-900")}>
                {ch.heading}
              </h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              {ch.body
                .split("\n\n")
                .filter((p) => p.trim())
                .map((para, pi) => (
                  <p key={pi} className={darkMode ? "text-slate-300" : "text-slate-700"}>
                    {para.trim().split(/\*\*(.+?)\*\*/).map((seg, si) =>
                      si % 2 === 1 ? (
                        <strong key={si} className={darkMode ? "text-white font-semibold" : "text-slate-900 font-semibold"}>
                          {seg}
                        </strong>
                      ) : (
                        seg
                      )
                    )}
                  </p>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Mode Definitions (Enterprise Grade) ─────────────────── */
const MODES: {
  id: Mode;
  IconComponent: React.ComponentType<{ className?: string }>;
  label: string;
  badge: string;
  description: string;
}[] = [
  {
    id: "flowchart",
    IconComponent: IconFlowchart,
    label: "Concept Flowchart",
    badge: "Interactive Graph",
    description: "Hierarchical vector diagram mapping entities, dependencies, and cause-and-effect relationships.",
  },
  {
    id: "summary",
    IconComponent: IconSummary,
    label: "Executive Summary",
    badge: "Documentation",
    description: "Structured academic briefing detailing core definitions, mechanisms, and exam revision points.",
  },
  {
    id: "story",
    IconComponent: IconStory,
    label: "Story Mode",
    badge: "Narrative Study",
    description: "Pedagogical narrative explaining complex principles through applied scenario-based case discovery.",
  },
  {
    id: "video",
    IconComponent: IconVideo,
    label: "AI Explainer Video",
    badge: "Multi-Scene Script",
    description: "Dynamic presentation video rendered scene-by-scene in your browser with narration and subtitles.",
  },
];

/* ─── Main EduLearn Synthesis Page ───────────────────────── */
export default function EduLearnPage() {
  const user = useSession();
  const { push } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    function check() {
      setDarkMode(document.documentElement.classList.contains("dark"));
    }
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [loading, setLoading] = useState(false);

  // Output States
  const [mermaid, setMermaid] = useState("");
  const [summary, setSummary] = useState("");
  const [story, setStory] = useState("");
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [meta, setMeta] = useState<DocMeta | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  if (user.role !== "student") {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Access Restricted</p>
        <p className="mt-1 text-xs text-slate-500">Document synthesis is configured for enrolled students.</p>
      </div>
    );
  }

  function acceptFile(f?: File) {
    if (!f) return;
    const allowed = [
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(f.type) && !f.name.match(/\.(pdf|txt|doc|docx)$/i)) {
      push("Supported formats: PDF, TXT, DOC, DOCX", "error");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      push("File size exceeds 20 MB ceiling", "error");
      return;
    }
    setFile(f);
    setStep("choose");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    acceptFile(e.target.files?.[0]);
  }

  async function generate() {
    if (!file || !mode) return;
    setLoading(true);
    setMermaid("");
    setSummary("");
    setStory("");
    setScenes([]);
    setMeta(null);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("mode", mode);

    try {
      const res = await fetch("/api/edulearn", { method: "POST", body: fd });
      let data: Record<string, unknown>;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server returned status ${res.status}`);
      }
      if (!res.ok) throw new Error((data.error as string) ?? "Processing failed");

      if (mode === "flowchart") setMermaid(data.mermaid as string);
      if (mode === "summary") setSummary(data.summary as string);
      if (mode === "story") setStory(data.story as string);
      if (mode === "video") setScenes(data.scenes as Scene[]);
      if (data.meta) setMeta(data.meta as DocMeta);

      setStep("result");
    } catch (err) {
      push(err instanceof Error ? err.message : "Synthesis failed", "error");
    } finally {
      setLoading(false);
    }
  }

  async function downloadSummaryPdf() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(summary, 180);
    let y = 20;
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text(`Academic Summary — ${file?.name ?? "Document"}`, 15, y);
    y += 12;
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "normal");
    for (const line of lines) {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      if (line.startsWith("## ")) {
        y += 4;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(line.slice(3), 15, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
      } else {
        doc.text(line, 15, y);
      }
      y += 5.5;
    }
    doc.save(`Academic-Summary-${file?.name ?? "document"}.pdf`);
  }

  function downloadFlowchartSvg() {
    const svg = svgRef.current;
    if (!svg) {
      push("Chart rendering in progress", "error");
      return;
    }
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Concept-Flowchart-${file?.name ?? "document"}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    setStep("upload");
    setFile(null);
    setMode(null);
    setMermaid("");
    setSummary("");
    setStory("");
    setScenes([]);
    setMeta(null);
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header (Enterprise Style) ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
              Academic Intelligence
            </p>
          </div>
          <h1 className={cn("mt-1 text-xl font-bold tracking-tight", darkMode ? "text-slate-100" : "text-slate-900")}>
            Document Synthesis
          </h1>
          <p className={cn("mt-0.5 text-xs", darkMode ? "text-slate-400" : "text-slate-500")}>
            Transform primary study material into structured diagrams, academic summaries, narrative cases, or presentation decks.
          </p>
        </div>

        {step !== "upload" && (
          <button
            onClick={reset}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition shadow-sm",
              darkMode
                ? "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            <IconRefresh />
            <span>New Synthesis</span>
          </button>
        )}
      </div>

      {/* ── Stepper Navigation ── */}
      <div className="flex items-center gap-3">
        {[
          { key: "upload", label: "Document Ingestion", num: "01" },
          { key: "choose", label: "Synthesis Format", num: "02" },
          { key: "result", label: "Compiled Output", num: "03" },
        ].map((s, idx) => {
          const isDone = (s.key === "upload" && step !== "upload") || (s.key === "choose" && step === "result");
          const isActive = step === s.key;
          return (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-md font-mono text-[11px] font-semibold transition",
                  isActive
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : isDone
                    ? "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    : "border border-slate-200 dark:border-slate-800 text-slate-400"
                )}
              >
                {isDone ? <IconCheck /> : s.num}
              </div>
              <span
                className={cn(
                  "text-xs font-medium tracking-tight",
                  isActive
                    ? "text-slate-950 dark:text-slate-100 font-semibold"
                    : "text-slate-400 dark:text-slate-500"
                )}
              >
                {s.label}
              </span>
              {idx < 2 && <span className="text-slate-300 dark:text-slate-700 text-xs px-1">/</span>}
            </div>
          );
        })}
      </div>

      {/* ── STEP 1: Ingestion / Dropzone ── */}
      {step === "upload" && (
        <div
          className={cn(
            "rounded-xl border p-6 transition-colors shadow-sm",
            darkMode ? "border-slate-800 bg-slate-900/60" : "border-slate-200 bg-white"
          )}
        >
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              acceptFile(e.dataTransfer.files[0]);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-3.5 rounded-lg border border-dashed px-8 py-14 text-center transition",
              darkMode
                ? "border-slate-850 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/60"
                : "border-slate-300/80 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50"
            )}
          >
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-lg border",
                darkMode ? "border-slate-800 bg-slate-900 text-slate-300" : "border-slate-200 bg-white text-slate-700"
              )}
            >
              <IconUpload />
            </div>

            <div className="space-y-1">
              <p className={cn("text-sm font-semibold tracking-tight", darkMode ? "text-slate-200" : "text-slate-800")}>
                Upload academic source document
              </p>
              <p className="text-xs text-slate-500">
                Drag and drop your syllabus, lecture notes, textbook chapters, or assignments
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
              <span className="rounded border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 font-mono">PDF</span>
              <span className="rounded border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 font-mono">TXT</span>
              <span className="rounded border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 font-mono">DOCX</span>
              <span>· Maximum 20 MB</span>
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* ── STEP 2: Synthesis Format Selection ── */}
      {step === "choose" && (
        <div className="space-y-5">
          {/* File Card */}
          <div
            className={cn(
              "flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 shadow-sm",
              darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                  darkMode ? "border-slate-800 bg-slate-800 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-700"
                )}
              >
                <IconDocument />
              </div>
              <div className="min-w-0">
                <p className={cn("text-xs font-semibold truncate", darkMode ? "text-slate-100" : "text-slate-900")}>
                  {file?.name}
                </p>
                <p className="font-mono text-[11px] text-slate-400">
                  {((file?.size ?? 0) / 1024).toFixed(1)} KB · Ready for processing
                </p>
              </div>
            </div>

            <button
              onClick={() => fileRef.current?.click()}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
            >
              Replace Document
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className={cn("text-xs font-semibold tracking-wider uppercase", darkMode ? "text-slate-400" : "text-slate-600")}>
                Select Output Format
              </p>
              <span className="text-[11px] text-slate-400">Select one format to compile</span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {MODES.map((m) => {
                const isSelected = mode === m.id;
                const Icon = m.IconComponent;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={cn(
                      "flex flex-col justify-between rounded-xl border p-4.5 text-left transition-all",
                      darkMode
                        ? isSelected
                          ? "border-indigo-500 bg-indigo-950/20 ring-1 ring-indigo-500"
                          : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
                        : isSelected
                        ? "border-slate-900 bg-slate-50/80 ring-1 ring-slate-900 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40"
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-lg border",
                            isSelected
                              ? darkMode
                                ? "border-indigo-500 bg-indigo-900/30 text-indigo-300"
                                : "border-slate-900 bg-slate-900 text-white"
                              : darkMode
                              ? "border-slate-800 bg-slate-800 text-slate-400"
                              : "border-slate-200 bg-slate-100 text-slate-600"
                          )}
                        >
                          <Icon />
                        </div>
                        <span
                          className={cn(
                            "rounded border px-1.5 py-0.5 text-[10px] font-mono",
                            isSelected
                              ? darkMode
                                ? "border-indigo-700 bg-indigo-950 text-indigo-300"
                                : "border-slate-900 bg-slate-100 text-slate-900"
                              : darkMode
                              ? "border-slate-800 text-slate-500"
                              : "border-slate-200 text-slate-500"
                          )}
                        >
                          {m.badge}
                        </span>
                      </div>
                      <p className={cn("mt-3 text-sm font-semibold tracking-tight", darkMode ? "text-slate-100" : "text-slate-900")}>
                        {m.label}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {m.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                      <span className={cn("h-1.5 w-1.5 rounded-full", isSelected ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700")} />
                      <span className={isSelected ? "font-semibold text-slate-900 dark:text-slate-100" : "text-slate-400"}>
                        {isSelected ? "Selected" : "Click to select"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={generate}
              loading={loading}
              disabled={!mode || loading}
              size="lg"
            >
              {loading ? "Processing Document…" : "Synthesize Material"}
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Compiled Output ── */}
      {step === "result" && (
        <div className="space-y-4">
          <div
            className={cn(
              "flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 shadow-sm",
              darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
            )}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <h2 className={cn("text-sm font-semibold tracking-tight", darkMode ? "text-slate-100" : "text-slate-900")}>
                {MODES.find((m) => m.id === mode)?.label}
              </h2>
              <span className="text-xs text-slate-400">·</span>
              <span className="rounded border border-slate-200 dark:border-slate-800 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300">
                {file?.name}
              </span>
              {meta && (
                <span className="rounded border border-slate-200 dark:border-slate-800 px-2 py-0.5 text-xs text-slate-500">
                  {meta.subject}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {MODES.filter((m) => m.id !== mode).map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setMode(m.id);
                    setStep("choose");
                  }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition",
                    darkMode
                      ? "border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  )}
                >
                  <m.IconComponent className="h-3.5 w-3.5" />
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mode: Flowchart */}
          {mode === "flowchart" && mermaid && (
            <div
              className={cn(
                "rounded-xl border p-5 shadow-sm space-y-4",
                darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
              )}
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <p className="text-xs text-slate-500">
                  Concept Topology · Scroll or pinch to zoom
                </p>
                <Button size="sm" variant="outline" onClick={downloadFlowchartSvg}>
                  <span className="flex items-center gap-1.5">
                    <IconDownload />
                    <span>Download SVG</span>
                  </span>
                </Button>
              </div>
              <MermaidChart
                code={mermaid}
                onSvgReady={(svg) => {
                  svgRef.current = svg;
                }}
                darkMode={darkMode}
              />
            </div>
          )}

          {/* Mode: Summary */}
          {mode === "summary" && summary && (
            <div
              className={cn(
                "rounded-xl border p-5 shadow-sm",
                darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
              )}
            >
              <SummaryView text={summary} onDownload={downloadSummaryPdf} darkMode={darkMode} />
            </div>
          )}

          {/* Mode: Story */}
          {mode === "story" && story && (
            <StoryView
              text={story}
              file={file}
              meta={meta ?? { title: file?.name ?? "Document", subject: "General", level: "Student", topics: [], docType: "document" }}
              darkMode={darkMode}
            />
          )}

          {/* Mode: Video */}
          {mode === "video" && scenes.length > 0 && (
            <div
              className={cn(
                "rounded-xl border p-5 shadow-sm",
                darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
              )}
            >
              <VideoGenerator
                initialScenes={scenes}
                meta={meta ?? { title: file?.name ?? "Document", subject: "General", level: "Student", topics: [], docType: "document" }}
                file={file}
                darkMode={darkMode}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
