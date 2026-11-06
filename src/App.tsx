import React, { useState, useRef, useEffect } from 'react';
import { toJpeg, toBlob } from 'html-to-image';
import confetti from 'canvas-confetti';
import { InvoiceData } from './types/invoice';
import { getInitialInvoiceData } from './data/defaults';
import { InvoicePreview } from './components/InvoicePreview';
import { InvoiceForm } from './components/InvoiceForm';
import { NetworkModal } from './components/NetworkModal';
import { HistoryModal } from './components/HistoryModal';
import {
  Download,
  Share2,
  Copy,
  Printer,
  Smartphone,
  History,
  Eye,
  Edit3,
  Sparkles,
  Camera,
  Check,
  RotateCcw,
  Plus
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'dorpon_invoice_current';
const HISTORY_STORAGE_KEY = 'dorpon_invoice_history';

export function App() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : getInitialInvoiceData();
    } catch {
      return getInitialInvoiceData();
    }
  });

  const [history, setHistory] = useState<InvoiceData[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Mobile View Toggle: 'edit' or 'preview'
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  // Auto-save current invoice to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(invoiceData));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [invoiceData]);

  // Save to History helper
  const saveToHistory = (dataToSave: InvoiceData) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== dataToSave.id);
      const updated = [dataToSave, ...filtered].slice(0, 50); // Keep max 50
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleDataChange = (newData: InvoiceData) => {
    setInvoiceData(newData);
    saveToHistory(newData);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all fields to a fresh template?')) {
      const fresh = getInitialInvoiceData();
      setInvoiceData(fresh);
      saveToHistory(fresh);
    }
  };

  const handleNewInvoice = () => {
    const fresh = getInitialInvoiceData();
    setInvoiceData(fresh);
    saveToHistory(fresh);
  };

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // High Resolution JPG Generation
  const exportAsJpg = async () => {
    const node = document.getElementById('invoice-capture-node');
    if (!node) {
      alert('Invoice container not found.');
      return;
    }

    try {
      setIsGenerating(true);

      // High-resolution export (2.5x pixel ratio for sharp crystal-clear typography)
      const dataUrl = await toJpeg(node, {
        quality: 0.95,
        pixelRatio: 2.5,
        backgroundColor: invoiceData.template === 'cinematic-dark' ? '#141210' : '#ffffff',
        cacheBust: true,
      });

      // Filename formatting
      const cleanClientName = (invoiceData.client.name || 'Client')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .substring(0, 25);
      const filename = `Dorpon_Invoice_${invoiceData.invoiceNumber}_${cleanClientName}.jpg`;

      // Trigger download
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#f3e5ab', '#22c55e', '#3b82f6'],
      });

      saveToHistory(invoiceData);
    } catch (err) {
      console.error('Failed to export JPG:', err);
      alert('Could not export JPG. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy Image to Clipboard or Mobile Native Share
  const handleShareOrCopy = async () => {
    const node = document.getElementById('invoice-capture-node');
    if (!node) return;

    try {
      setIsGenerating(true);

      const blob = await toBlob(node, {
        quality: 0.95,
        pixelRatio: 2.2,
        backgroundColor: invoiceData.template === 'cinematic-dark' ? '#141210' : '#ffffff',
        cacheBust: true,
      });

      if (!blob) throw new Error('Blob generation failed');

      const cleanClient = (invoiceData.client.name || 'Client').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `Dorpon_Invoice_${invoiceData.invoiceNumber}_${cleanClient}.jpg`;
      const file = new File([blob], filename, { type: 'image/jpeg' });

      // If mobile supports native file sharing (e.g. WhatsApp directly)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Dorpon Invoice #${invoiceData.invoiceNumber}`,
          text: `Invoice from Dorpon Photography & Cinematography (rajinmd.com) for ${invoiceData.client.name}`,
        });
        return;
      }

      // Fallback to Clipboard copy if supported
      if (navigator.clipboard && window.ClipboardItem) {
        // Most browsers require image/png for clipboard write
        const pngBlob = await toBlob(node, {
          pixelRatio: 2.0,
          backgroundColor: '#ffffff',
        });
        if (pngBlob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': pngBlob }),
          ]);
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 2500);
          return;
        }
      }

      // Fallback: download directly
      exportAsJpg();
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Share error:', err);
        exportAsJpg();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0f0e0d] text-slate-100 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#161412]/95 backdrop-blur border-b border-[#2b2620] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-lg shadow-lg shadow-amber-500/20">
              <Camera className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm md:text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  দর্পণ <span className="text-amber-400 font-serif">Dorpon</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Invoice Studio
                </span>
              </div>
              <a
                href="https://rajinmd.com"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                rajinmd.com
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Phone/LAN Connect Button */}
            <button
              onClick={() => setIsNetworkModalOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#221e1a] hover:bg-[#2b2620] text-amber-400 border border-[#383129] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Test on Mobile via Local Wi-Fi"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">মোবাইল টেস্ট</span>
            </button>

            {/* Saved Invoices History */}
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#221e1a] hover:bg-[#2b2620] text-slate-300 border border-[#383129] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="History"
            >
              <History className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">হিস্ট্রি</span>
              {history.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center">
                  {history.length}
                </span>
              )}
            </button>

            {/* Print / PDF */}
            <button
              onClick={handlePrint}
              className="hidden md:flex px-3 py-1.5 rounded-xl bg-[#221e1a] hover:bg-[#2b2620] text-slate-300 border border-[#383129] text-xs font-semibold items-center gap-1.5 transition-colors"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            {/* Share / WhatsApp Button */}
            <button
              onClick={handleShareOrCopy}
              disabled={isGenerating}
              className="hidden sm:flex px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold items-center gap-1.5 transition-colors"
              title="Share or Copy JPG"
            >
              {copiedImage ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedImage ? 'Copied!' : 'হোয়াটসঅ্যাপ / Share'}</span>
            </button>

            {/* PRIMARY: Download JPG */}
            <button
              onClick={exportAsJpg}
              disabled={isGenerating}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all active:scale-95 disabled:opacity-60"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4 text-black stroke-[2.5]" />
              )}
              <span>{isGenerating ? 'তৈরি হচ্ছে...' : 'JPG ডাউনলোড'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Tab Bar (Visible only on mobile/small screens) */}
      <div className="lg:hidden bg-[#161412] border-b border-[#2b2620] p-1.5 flex gap-1">
        <button
          onClick={() => setMobileTab('edit')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'edit'
              ? 'bg-amber-500 text-black font-extrabold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          ইনভয়েস এডিট করুন (Edit)
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'preview'
              ? 'bg-amber-500 text-black font-extrabold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          প্রিভিউ & JPG দেখুন (Preview)
        </button>
      </div>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-3 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: EDITOR FORM */}
        <div
          className={`lg:col-span-6 xl:col-span-5 ${
            mobileTab === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          <InvoiceForm
            data={invoiceData}
            onChange={handleDataChange}
            onReset={handleReset}
          />
        </div>

        {/* RIGHT COLUMN: LIVE PREVIEW & EXPORT ACTIONS */}
        <div
          className={`lg:col-span-6 xl:col-span-7 flex flex-col items-center ${
            mobileTab === 'edit' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Action Ribbon Above Preview */}
          <div className="w-full flex items-center justify-between pb-3 px-1 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>লাইভ প্রিভিউ (Live Preview)</span>
              <span className="opacity-40">|</span>
              <span className="capitalize">{invoiceData.template.replace('-', ' ')}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShareOrCopy}
                disabled={isGenerating}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>কপি / শেয়ার</span>
              </button>
            </div>
          </div>

          {/* Scaled Preview Wrapper */}
          <div className="w-full overflow-x-auto pb-6 flex justify-center bg-[#141210] p-3 sm:p-5 rounded-2xl border border-[#2b2620] shadow-inner">
            <div
              className="origin-top transition-transform duration-200"
              style={{
                // Responsive scaling for different screen sizes:
                // Desktop: ~0.8-0.95 scale.
                // Mobile: calculated or css scaled
                transform: 'scale(var(--invoice-scale, 0.85))',
                transformOrigin: 'top center',
                marginBottom: 'calc(-1130px * (1 - var(--invoice-scale, 0.85)))',
              }}
            >
              <style>{`
                :root {
                  --invoice-scale: 0.88;
                }
                @media (max-width: 1280px) {
                  :root { --invoice-scale: 0.72; }
                }
                @media (max-width: 1024px) {
                  :root { --invoice-scale: 0.65; }
                }
                @media (max-width: 640px) {
                  :root { --invoice-scale: 0.44; }
                }
                @media (max-width: 420px) {
                  :root { --invoice-scale: 0.38; }
                }
              `}</style>

              <InvoicePreview ref={previewRef} data={invoiceData} />
            </div>
          </div>

          {/* Mobile Bottom Float Action (for easy access on phones) */}
          <div className="w-full mt-4 flex sm:hidden flex-col gap-2">
            <button
              onClick={exportAsJpg}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-amber-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>JPG ফরমেটে ডাউনলোড করুন</span>
            </button>

            <button
              onClick={handleShareOrCopy}
              className="w-full py-2.5 rounded-xl bg-[#221e1a] border border-[#383129] text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>হোয়াটসঅ্যাপে পাঠান (Share)</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-auto border-t border-[#231f1a] py-4 px-4 text-center text-xs text-slate-500">
        <p>
          দর্পণ (Dorpon) Photography & Cinematography Invoice Studio — Crafted for{' '}
          <a
            href="https://rajinmd.com"
            target="_blank"
            rel="noreferrer"
            className="text-amber-400 hover:underline"
          >
            rajinmd.com
          </a>
        </p>
      </footer>

      {/* Network Modal (QR Code & IP) */}
      <NetworkModal
        isOpen={isNetworkModalOpen}
        onClose={() => setIsNetworkModalOpen(false)}
        localIp="192.168.10.37"
        port={5173}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        invoices={history}
        onSelect={(inv) => setInvoiceData(inv)}
        onDelete={handleDeleteHistory}
        onNew={handleNewInvoice}
      />
    </div>
  );
}

export default App;
