import { useState } from 'react';
import { GeneratorParams, FontWeight } from '../types';
import { DEFAULT_TEXT } from '../utils/presets';
import { Sliders, Grid } from 'lucide-react';

interface ControlPanelProps {
  params: GeneratorParams;
  onChange: (newParams: GeneratorParams) => void;
}

const fonts = [
  'Space Grotesk',
  'Lilita One',
  'Playfair Display',
  'Montserrat',
  'Alumni Sans',
  'Rubik Mono One',
  'Cinzel',
  'Inter',
  'Courier Prime',
  'Impact'
];

const fontWeightOptions: { value: FontWeight; label: string }[] = [
  { value: '100', label: '极细' },
  { value: '200', label: '特细' },
  { value: '300', label: '细体' },
  { value: '400', label: '常规' },
  { value: '500', label: '中等' },
  { value: '600', label: '半粗' },
  { value: '700', label: '粗体' },
  { value: '800', label: '特粗' },
  { value: '900', label: '极粗' },
];

export default function ControlPanel({
  params,
  onChange,
}: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'pattern'>('text');

  const updateParam = <K extends keyof GeneratorParams>(key: K, value: GeneratorParams[K]) => {
    onChange({
      ...params,
      [key]: value
    });
  };

  return (
    <div className="leonardo-glass border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl leonardo-card-glow flex flex-col h-full bg-[#121214]/50 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.010] to-transparent pointer-events-none" />

      <div className="flex border-b border-white/[0.08] bg-black/40 p-1.5 gap-1.5 relative z-10">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold rounded-xl transition-all duration-300 relative ${
            activeTab === 'text'
              ? 'bg-white/[0.12] border border-white/[0.22] text-white shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.2),_0_4px_16px_rgba(0,0,0,0.5)]'
              : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 border border-transparent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'
          }`}
        >
          <Sliders className={`w-3.5 h-3.5 transition-colors ${activeTab === 'text' ? 'text-white' : 'text-zinc-400'}`} />
          文字
          {activeTab === 'text' && <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-white glow-indicator animate-pulse" />}
        </button>
        <button
          onClick={() => setActiveTab('pattern')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold rounded-xl transition-all duration-300 relative ${
            activeTab === 'pattern'
              ? 'bg-white/[0.12] border border-white/[0.22] text-white shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.2),_0_4px_16px_rgba(0,0,0,0.5)]'
              : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 border border-transparent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'
          }`}
        >
          <Grid className={`w-3.5 h-3.5 transition-colors ${activeTab === 'pattern' ? 'text-white' : 'text-zinc-400'}`} />
          条纹
          {activeTab === 'pattern' && <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-white glow-indicator animate-pulse" />}
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto max-h-[640px] space-y-6 relative z-10">

        {activeTab === 'text' && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="input-hide-text">
                  隐藏文字
                </label>
                <textarea
                  id="input-hide-text"
                  rows={2}
                  value={params.text}
                  onChange={(e) => updateParam('text', e.target.value)}
                  placeholder={DEFAULT_TEXT}
                  className="w-full bg-[#08070d]/60 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/[0.08] font-sans tracking-wide transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="font-family-select">字体</label>
                  <select
                    id="font-family-select"
                    value={params.fontFamily}
                    onChange={(e) => updateParam('fontFamily', e.target.value)}
                    className="w-full bg-[#08070d]/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/40 font-medium"
                  >
                    {fonts.map((f) => (
                      <option key={f} value={f} style={{ fontFamily: `"${f}", sans-serif` }} className="bg-[#0f0c1b]">{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="font-weight-select">粗细</label>
                  <select
                    id="font-weight-select"
                    value={params.fontWeight}
                    onChange={(e) => updateParam('fontWeight', e.target.value as FontWeight)}
                    className="w-full bg-[#08070d]/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/40"
                  >
                    {fontWeightOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#0f0c1b]">{opt.label} ({opt.value})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <label className="text-zinc-300" htmlFor="font-size-slider">大小</label>
                    <span className="text-zinc-300 font-mono font-bold">{params.fontSize}%</span>
                  </div>
                  <input id="font-size-slider" type="range" min={40} max={200} value={params.fontSize} onChange={(e) => updateParam('fontSize', Number(e.target.value))} className="w-full accent-zinc-400 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <label className="text-zinc-300" htmlFor="font-spacing-slider">间距</label>
                    <span className="text-zinc-300 font-mono font-bold">{params.fontSpacing}px</span>
                  </div>
                  <input id="font-spacing-slider" type="range" min={-15} max={30} value={params.fontSpacing} onChange={(e) => updateParam('fontSpacing', Number(e.target.value))} className="w-full accent-zinc-400 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pattern' && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5 font-bold">图案样式</label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  className="py-3 px-3 rounded-xl border text-[11px] font-bold bg-white/[0.08] border-white/30 text-white shadow-[0_0_12px_rgba(255,255,255,0.05)] cursor-default"
                >
                  垂直折线
                </button>
                <button
                  disabled
                  className="py-3 px-3 rounded-xl border text-[11px] font-bold bg-black/30 border-white/[0.04] text-zinc-600 cursor-not-allowed relative overflow-hidden"
                >
                  更多样式
                  <span className="ml-1.5 text-[9px] font-medium text-zinc-500 bg-white/[0.04] px-1.5 py-0.5 rounded-md">即将推出</span>
                </button>
              </div>
            </div>

            <hr className="border-white/[0.06]" />

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <label className="text-zinc-300" htmlFor="white-border-slider">白边宽度</label>
                <span className="text-zinc-300 font-mono font-bold">{params.whiteBorder}px</span>
              </div>
              <input id="white-border-slider" type="range" min={0} max={5} step={0.5} value={params.whiteBorder} onChange={(e) => updateParam('whiteBorder', Number(e.target.value))} className="w-full accent-zinc-400 cursor-pointer" />
            </div>

            <hr className="border-white/[0.06]" />

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">配色</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 font-bold">前景</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={params.colorForeground} onChange={(e) => updateParam('colorForeground', e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0" />
                    <input type="text" value={params.colorForeground} onChange={(e) => updateParam('colorForeground', e.target.value)} className="w-full bg-[#08070d]/60 border border-white/10 rounded-lg px-2 py-1 text-xs font-mono text-slate-200 uppercase" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 font-bold">背景</label>
                  <div className="flex items-center gap-2 flex-grow">
                    <input type="color" value={params.colorBackground} onChange={(e) => updateParam('colorBackground', e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0" />
                    <input type="text" value={params.colorBackground} onChange={(e) => updateParam('colorBackground', e.target.value)} className="w-full bg-[#08070d]/60 border border-white/10 rounded-lg px-2 py-1 text-xs font-mono text-slate-200 uppercase" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
