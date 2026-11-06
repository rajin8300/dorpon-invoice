import React, { useState } from 'react';
import { PackageItem } from '../types/invoice';
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface PackageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  packages: PackageItem[];
  onAddPackageToInvoice: (pkg: PackageItem) => void;
  onSavePackage: (pkg: PackageItem) => void;
  onDeletePackage: (id: string) => void;
  isSyncing?: boolean;
}

export const PackageManagerModal: React.FC<PackageManagerModalProps> = ({
  isOpen,
  onClose,
  packages,
  onAddPackageToInvoice,
  onSavePackage,
  onDeletePackage,
  isSyncing,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rate, setRate] = useState<number>(10000);
  const [category, setCategory] = useState('Wedding');

  if (!isOpen) return null;

  const categories = ['All', 'Wedding', 'Cinematography', 'Holud', 'Reception', 'Portrait', 'Album', 'Drone', 'Custom'];

  const filtered = packages.filter((pkg) => {
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === 'All' || pkg.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setRate(10000);
    setCategory('Wedding');
    setIsCreating(false);
    setEditingId(null);
  };

  const handleStartEdit = (pkg: PackageItem) => {
    setEditingId(pkg.id);
    setTitle(pkg.title);
    setDescription(pkg.description);
    setRate(pkg.rate);
    setCategory(pkg.category || 'Custom');
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Package title is required.');
      return;
    }

    const pkgToSave: PackageItem = {
      id: editingId || `pkg_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      rate: Number(rate) || 0,
      category,
      isCustom: true,
    };

    onSavePackage(pkgToSave);
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#181614] border border-[#383129] rounded-2xl max-w-2xl w-full p-5 sm:p-6 text-slate-100 shadow-2xl relative max-h-[88vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2d2822] mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                প্যাকেজ ম্যানেজার (Package Studio)
                {isSyncing && (
                  <span className="text-[10px] text-amber-400 font-normal animate-pulse">
                    ● GitHub Syncing...
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Create, customize & save photography packages to your repo
              </p>
            </div>
          </div>

          {!isCreating && (
            <button
              onClick={() => {
                resetForm();
                setIsCreating(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-colors mr-6 shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" /> নতুন প্যাকেজ তৈরি
            </button>
          )}
        </div>

        {/* Create/Edit Form */}
        {isCreating ? (
          <form onSubmit={handleSave} className="p-4 bg-[#201d19] border border-[#3d3429] rounded-xl space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {editingId ? 'প্যাকেজ এডিট করুন' : 'নতুন প্যাকেজ যোগ করুন'}
              </h4>
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                বাতিল (Cancel)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  প্যাকেজের নাম (Package Title) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Destination Wedding 2-Day Grand"
                  className="w-full bg-[#161412] border border-[#3d3429] rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    রেট (৳ BDT) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    required
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value) || 0)}
                    className="w-full bg-[#161412] border border-[#3d3429] rounded-lg px-3 py-2 text-xs text-slate-100 font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#161412] border border-[#3d3429] rounded-lg px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                প্যাকেজের বিবরণ (Services & Deliverables)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="2 Senior Photographers, 1 Cinematographer, 100+ Edited Photos, Drone Coverage..."
                className="w-full bg-[#161412] border border-[#3d3429] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-semibold hover:bg-white/15"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-amber-500 text-black font-extrabold text-xs flex items-center gap-1.5 hover:bg-amber-400 shadow-md"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                {editingId ? 'আপডেট ও সেভ করুন' : 'সেভ ও রেপোতে সিঙ্ক করুন'}
              </button>
            </div>
          </form>
        ) : null}

        {/* Search & Categories Bar */}
        <div className="space-y-2 mb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="প্যাকেজ সার্চ করুন (Search by name or deliverables)..."
              className="w-full bg-[#201d19] border border-[#383129] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-black shadow'
                    : 'bg-[#201d19] text-slate-400 hover:text-slate-200 border border-[#383129]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Packages List */}
        <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              কোনো প্যাকেজ পাওয়া যায়নি। নতুন প্যাকেজ তৈরি করতে উপরের বাটনে ক্লিক করুন।
            </div>
          ) : (
            filtered.map((pkg) => (
              <div
                key={pkg.id}
                className="p-3.5 rounded-xl bg-[#211d18] border border-[#383129] hover:border-amber-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                      {pkg.title}
                    </span>
                    {pkg.category && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {pkg.category}
                      </span>
                    )}
                    {pkg.isCustom && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        Custom
                      </span>
                    )}
                  </div>

                  {pkg.description && (
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {pkg.description}
                    </p>
                  )}

                  <div className="text-xs font-mono font-bold text-amber-400 mt-1.5">
                    ৳{new Intl.NumberFormat('en-IN').format(pkg.rate)}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2b2620]">
                  {pkg.isCustom && (
                    <>
                      <button
                        onClick={() => handleStartEdit(pkg)}
                        className="p-2 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-colors"
                        title="Edit package"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete package "${pkg.title}"?`)) {
                            onDeletePackage(pkg.id);
                          }
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete package"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      onAddPackageToInvoice(pkg);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>ইনভয়েসে যোগ করুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
