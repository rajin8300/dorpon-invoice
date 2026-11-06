import React from 'react';
import { InvoiceData } from '../types/invoice';
import { History, X, Trash2, FolderOpen, Calendar, User, Plus } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: InvoiceData[];
  onSelect: (inv: InvoiceData) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  invoices,
  onSelect,
  onDelete,
  onNew,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#181614] border border-[#383129] rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between pb-4 border-b border-[#2d2822] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">সংরক্ষিত ইনভয়েস (Saved Invoices)</h3>
              <p className="text-xs text-slate-400">{invoices.length} invoices saved in local storage</p>
            </div>
          </div>

          <button
            onClick={() => {
              onNew();
              onClose();
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-colors mr-6"
          >
            <Plus className="w-3.5 h-3.5" /> নতুন ইনভয়েস
          </button>
        </div>

        <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
          {invoices.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              এখনো কোনো ইনভয়েস সেভ করা নেই। আপনি কোনো ইনভয়েস তৈরি করলে স্বয়ংক্রিয়ভাবে এখানে সেভ থাকবে।
            </div>
          ) : (
            invoices.map((inv) => {
              const subtotal = inv.items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
              const discount =
                inv.discountType === 'percentage'
                  ? (subtotal * (Number(inv.discountValue) || 0)) / 100
                  : Number(inv.discountValue) || 0;
              const total = Math.max(0, subtotal - discount);

              return (
                <div
                  key={inv.id}
                  className="p-3.5 rounded-xl bg-[#211d18] border border-[#383129] hover:border-amber-500/50 transition-all flex items-center justify-between gap-3 group"
                >
                  <div
                    onClick={() => {
                      onSelect(inv);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {inv.invoiceNumber}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-black/40 text-slate-300">
                        {inv.status}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-slate-100 mt-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {inv.client.name || 'Unnamed Client'}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {inv.issueDate}
                      </span>
                      <span className="font-mono font-semibold text-slate-200">
                        ৳{new Intl.NumberFormat('en-IN').format(total)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        onSelect(inv);
                        onClose();
                      }}
                      className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Open Invoice"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete invoice ${inv.invoiceNumber}?`)) {
                          onDelete(inv.id);
                        }
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
