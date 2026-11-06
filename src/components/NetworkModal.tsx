import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, X, Copy, Check, Wifi, ExternalLink } from 'lucide-react';

interface NetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  localIp: string;
  port: number;
}

export const NetworkModal: React.FC<NetworkModalProps> = ({
  isOpen,
  onClose,
  localIp,
  port,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const mobileUrl = `http://${localIp}:${port}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#181614] border border-[#383129] rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">ফোন থেকে টেস্ট করুন (Mobile Test)</h3>
            <p className="text-xs text-slate-400">Scan QR Code or visit URL on same Wi-Fi</p>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-xl flex flex-col items-center justify-center my-4 mx-auto w-fit shadow-md">
          <QRCodeSVG value={mobileUrl} size={180} level="M" />
          <p className="text-[10px] text-slate-700 font-mono mt-2 font-semibold">
            {mobileUrl}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-2.5 text-xs text-slate-300 bg-[#211d18] p-3.5 rounded-xl border border-[#383129] mb-4">
          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
            <span>আপনার মোবাইল এবং কম্পিউটার একই Wi-Fi / লোকাল নেটওয়ার্কে কানেক্টেড থাকতে হবে।</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
            <span>ফোনের ক্যামেরা দিয়ে উপরের QR কোডটি স্ক্যান করুন অথবা নিচের লিংকে ঢুকুন।</span>
          </div>
        </div>

        {/* URL Box */}
        <div className="flex items-center gap-2 bg-[#12110f] border border-[#383129] rounded-xl p-2.5 mb-5">
          <Wifi className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
          <span className="font-mono text-xs text-amber-300 font-semibold truncate flex-1">
            {mobileUrl}
          </span>
          <button
            onClick={copyUrl}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors"
        >
          ঠিক আছে (Got It)
        </button>
      </div>
    </div>
  );
};
