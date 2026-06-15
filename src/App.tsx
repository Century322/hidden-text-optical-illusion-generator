import { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import PreviewSection from './components/PreviewSection';
import { GeneratorParams } from './types';
import { INITIAL_PARAMS, DEFAULT_TEXT } from './utils/presets';
import { generateMask } from './utils/masks';
import { generateOpticalIllusion } from './utils/generator';
import { RefreshCw } from 'lucide-react';

const OUTPUT_SIZE = 1080;
const PREVIEW_SIZE = 540;
const DEBOUNCE_MS = 140;

function getEffectiveText(params: GeneratorParams): string {
  return params.text.trim() || DEFAULT_TEXT;
}

export default function App() {
  const [params, setParams] = useState<GeneratorParams>(INITIAL_PARAMS);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [showRenderIndicator, setShowRenderIndicator] = useState<boolean>(false);
  const [isGeneratingHiRes, setIsGeneratingHiRes] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const lastHiResCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastHiResParamsRef = useRef<GeneratorParams | null>(null);

  const renderIllusion = useCallback((currentParams: GeneratorParams, size: number) => {
    const effectiveParams = { ...currentParams, text: getEffectiveText(currentParams) };
    const maskCanvas = generateMask(size, size, effectiveParams);
    return generateOpticalIllusion(maskCanvas, effectiveParams, size, size);
  }, []);

  useEffect(() => {
    setIsRendering(true);
    setErrorMsg('');
    let indicatorTimer: ReturnType<typeof setTimeout>;
    indicatorTimer = setTimeout(() => setShowRenderIndicator(true), 300);
    const handler = setTimeout(() => {
      try {
        const canvas = renderIllusion(params, PREVIEW_SIZE);
        setPreviewUrl(canvas.toDataURL('image/png'));
      } catch (err) {
        console.error('Render error:', err);
        setErrorMsg('渲染失败，请检查参数');
      } finally {
        setIsRendering(false);
        setShowRenderIndicator(false);
        clearTimeout(indicatorTimer);
      }
    }, DEBOUNCE_MS);
    return () => { clearTimeout(handler); clearTimeout(indicatorTimer); };
  }, [params, renderIllusion]);

  const handleExport = async () => {
    setIsGeneratingHiRes(true);
    setErrorMsg('');
    try {
      let canvas: HTMLCanvasElement;

      if (lastHiResParamsRef.current
        && lastHiResParamsRef.current.text === params.text
        && lastHiResParamsRef.current.fontFamily === params.fontFamily
        && lastHiResParamsRef.current.fontSize === params.fontSize
        && lastHiResParamsRef.current.fontWeight === params.fontWeight
        && lastHiResParamsRef.current.fontSpacing === params.fontSpacing
        && lastHiResParamsRef.current.whiteBorder === params.whiteBorder
        && lastHiResParamsRef.current.colorForeground === params.colorForeground
        && lastHiResParamsRef.current.colorBackground === params.colorBackground
        && lastHiResCanvasRef.current
      ) {
        canvas = lastHiResCanvasRef.current;
      } else {
        canvas = renderIllusion(params, OUTPUT_SIZE);
        lastHiResCanvasRef.current = canvas;
        lastHiResParamsRef.current = { ...params };
      }

      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.style.display = 'none';
      downloadLink.download = `illusion-${OUTPUT_SIZE}px.png`;
      downloadLink.href = dataUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error('Export error:', err);
      setErrorMsg('导出失败，请重试');
    } finally {
      setIsGeneratingHiRes(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-200 flex flex-col selection:bg-neutral-800 selection:text-white relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#1c1917_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-[0.12]" />
      <div className="relative z-10">
        <Header />
      </div>
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-5 order-2 lg:order-1">
            <div className="lg:sticky lg:top-20 space-y-4 relative">
              {showRenderIndicator && (
                <div className="absolute -top-1 right-0 flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 z-20">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  渲染中
                </div>
              )}
              {errorMsg && (
                <div className="text-[10px] font-mono text-red-400 px-1">{errorMsg}</div>
              )}
              <ControlPanel params={params} onChange={setParams} />
            </div>
          </section>
          <section className="lg:col-span-7 order-1 lg:order-2">
            <div className="lg:sticky lg:top-20 space-y-4">
              <PreviewSection
                previewUrl={previewUrl}
                isGeneratingHiRes={isGeneratingHiRes}
                selectedResolution={OUTPUT_SIZE}
                onExport={handleExport}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
