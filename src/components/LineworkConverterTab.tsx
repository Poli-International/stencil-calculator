import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, Download, Printer, RefreshCw, Layers, CheckCircle2, ShieldCheck } from 'lucide-react';

export const LineworkConverterTab: React.FC = () => {
  const { t, showToast } = useApp();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<number>(128);
  const [contrast, setContrast] = useState<number>(100);
  const [edgeThickness, setEdgeThickness] = useState<number>(2);
  const [invert, setInvert] = useState<boolean>(true);
  const [guideLines, setGuideLines] = useState<boolean>(true);
  const [skinProfile, setSkinProfile] = useState<number>(1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setImageSrc(src);
        const img = new Image();
        img.onload = () => {
          originalImageRef.current = img;
          processCanvas();
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    }
  };

  const processCanvas = () => {
    const canvas = canvasRef.current;
    const img = originalImageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scale to workable max dimensions
    const maxDim = 800;
    let w = img.width;
    let h = img.height;
    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = (h / w) * maxDim;
        w = maxDim;
      } else {
        w = (w / h) * maxDim;
        h = maxDim;
      }
    }

    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // Contrast calculation
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < data.length; i += 4) {
      // Grayscale
      let gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

      // Contrast
      gray = factor * (gray - 128) + 128;

      // Threshold binarization
      let val = gray < threshold ? 0 : 255;

      // Invert if needed (Black lines on white paper)
      if (invert) {
        val = 255 - val;
      }

      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }

    ctx.putImageData(imgData, 0, 0);

    // Guide crosshairs
    if (guideLines) {
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 6]);

      // Vertical centerline
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.stroke();

      // Horizontal centerline
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Target circle
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 24, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  useEffect(() => {
    if (originalImageRef.current) {
      processCanvas();
    }
  }, [threshold, contrast, edgeThickness, invert, guideLines]);

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Tattoo_Stencil_Linework_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast(t('toastLineworkDownloaded'), 'success');
  };

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <html>
          <head><title>${t('titlePrintLinework')}</title></head>
          <body style="margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;">
            <img src="${canvas.toDataURL('image/png')}" style="max-width:100%;max-height:100%;" onload="window.print();window.close();"/>
          </body>
        </html>
      `);
      win.document.close();
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base">
            3
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            {t('sec3Title')}
          </h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
          {t('sec3Subtitle')}
        </p>
      </div>

      {/* WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {t('converterSettingsTitle')}
          </h3>

          {/* Upload Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('lblUploadImage')}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-950 dark:file:text-blue-300 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          {/* Threshold Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span>{t('lblLineThreshold')}</span>
              <span className="text-blue-600">{threshold}</span>
            </div>
            <input
              type="range"
              min="1"
              max="254"
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Contrast Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span>{t('lblContrastBoost')}</span>
              <span className="text-blue-600">{contrast}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="300"
              value={contrast}
              onChange={(e) => setContrast(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Invert Checkbox */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={invert}
                onChange={(e) => setInvert(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>{t('lblInvertLinework')}</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300 cursor-pointer">
              <input
                type="checkbox"
                checked={guideLines}
                onChange={(e) => setGuideLines(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>{t('lblCrosshairs')}</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={downloadPNG}
              disabled={!imageSrc}
              className="w-full py-2.5 px-4 text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t('btnDownloadPNG')}</span>
            </button>

            <button
              onClick={handlePrint}
              disabled={!imageSrc}
              className="w-full py-2.5 px-4 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t('btnPrintLinework')}</span>
            </button>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t('clientPrivateProcessing')}</span>
          </div>
        </div>

        {/* Live Canvas Viewport (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center min-h-[420px]">
          {imageSrc ? (
            <div className="relative max-w-full max-h-[500px] overflow-auto rounded-xl border border-slate-300 dark:border-slate-700 bg-white p-2">
              <canvas ref={canvasRef} className="max-w-full h-auto block" />
            </div>
          ) : (
            <div className="text-center p-8 text-slate-400 space-y-3">
              <Upload className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {t('canvasPlaceholderText')}
              </p>
              <p className="text-xs text-slate-400">
                {t('canvasFormatSupport')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
