import { useState, useEffect } from 'react';
import { Download, Maximize2, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PreviewSectionProps {
  previewUrl: string;
  isGeneratingHiRes: boolean;
  selectedResolution: number;
  onExport: () => Promise<void>;
}

export default function PreviewSection({
  previewUrl,
  isGeneratingHiRes,
  selectedResolution,
  onExport,
}: PreviewSectionProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!expandedImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedImage]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#ffffff', '#e4e4e7', '#a1a1aa', '#71717a']
    });
  };

  const handleDownloadClick = async () => {
    await onExport();
    triggerConfetti();
  };

  return (
    <div className="space-y-6">

      <div className="leonardo-glass rounded-2xl p-5 md:p-6 space-y-5">

        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-400 shadow-[0_0_8px_rgba(255,255,255,0.5)] inline-block" />
            预览
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-zinc-500">{selectedResolution} × {selectedResolution}</span>
            <button
              type="button"
              disabled={isGeneratingHiRes || !previewUrl}
              onClick={handleDownloadClick}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#f4f4f5] hover:bg-[#e4e4e7] text-[#09090b] text-[11px] font-bold transition-all shadow-[0_2px_12px_rgba(255,255,255,0.06)] disabled:opacity-50 select-none cursor-pointer active:scale-95 duration-300"
            >
              {isGeneratingHiRes ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#09090b]" />
                  生成中...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  下载
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="aspect-square w-full max-w-lg bg-gradient-to-tr from-[#121214]/90 to-[#09090b]/98 rounded-2xl overflow-hidden border border-white/[0.08] flex items-center justify-center relative group shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.08),_0_24px_60px_-10px_rgba(0,0,0,0.9)] transition-all duration-500 hover:border-white/20">
            {previewUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={previewUrl}
                  alt="Optical Illusion"
                  className="w-full h-full object-contain cursor-zoom-in transition-all duration-300"
                  onClick={() => setExpandedImage(previewUrl)}
                />
                <button
                  type="button"
                  onClick={() => setExpandedImage(previewUrl)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md text-white border border-white/[0.08] p-2 rounded-lg cursor-zoom-in"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-zinc-300" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
                <span className="text-xs text-zinc-500 font-mono">渲染中...</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {expandedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setExpandedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="图片预览"
        >
          <div className="relative max-w-2xl w-full aspect-square bg-[#09090b] rounded-2xl overflow-hidden border border-white/[0.08]" onClick={(e) => e.stopPropagation()}>
            <img
              src={expandedImage}
              alt="Zoomed"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1c1c1f] hover:bg-[#27272a] border border-white/[0.08] px-4 py-2 rounded-xl text-xs text-white font-bold transition-all"
            >
              关闭 (Esc)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
