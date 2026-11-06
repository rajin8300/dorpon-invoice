import React, { useState } from 'react';
import {
  InvoiceData,
  InvoiceItem,
  InvoiceStatus,
  PackageItem,
  TemplateTheme
} from '../types/invoice';
import {
  SERVICE_PRESETS,
  LOGO_OPTIONS,
  DEFAULT_TERMS
} from '../data/defaults';
import {
  Plus,
  Trash2,
  Sparkles,
  User,
  Package,
  CreditCard,
  Settings,
  ChevronDown,
  Upload,
  RotateCcw,
  Palette,
  FileText,
  Landmark
} from 'lucide-react';

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  onReset: () => void;
  onOpenPackageManager: () => void;
  customPackages: PackageItem[];
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  data,
  onChange,
  onReset,
  onOpenPackageManager,
  customPackages,
}) => {
  const [activeTab, setActiveTab] = useState<'client' | 'items' | 'payment' | 'branding' | 'terms'>('client');

  const updateField = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    onChange({ ...data, [key]: value });
  };

  const updateClient = (key: keyof InvoiceData['client'], value: string) => {
    onChange({
      ...data,
      client: { ...data.client, [key]: value },
    });
  };

  const updateBusiness = (key: keyof InvoiceData['business'], value: string) => {
    onChange({
      ...data,
      business: { ...data.business, [key]: value },
    });
  };

  const updatePaymentDetails = (key: keyof InvoiceData['paymentDetails'], value: string) => {
    onChange({
      ...data,
      paymentDetails: { ...data.paymentDetails, [key]: value },
    });
  };

  // Line Items Operations
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...data.items];
    const item = { ...newItems[index], [field]: value };

    if (field === 'quantity' || field === 'rate') {
      const q = field === 'quantity' ? Number(value) || 0 : item.quantity;
      const r = field === 'rate' ? Number(value) || 0 : item.rate;
      item.total = q * r;
    }

    newItems[index] = item;
    updateField('items', newItems);
  };

  const addItem = (preset?: { title: string; desc?: string; description?: string; rate: number }) => {
    const desc = preset?.desc || preset?.description || '';
    const newItem: InvoiceItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: preset ? preset.title : 'Custom Photography / Video Service',
      description: desc,
      quantity: 1,
      rate: preset ? preset.rate : 5000,
      total: preset ? preset.rate : 5000,
    };
    updateField('items', [...data.items, newItem]);
  };

  const removeItem = (index: number) => {
    if (data.items.length <= 1) {
      alert('Invoice must have at least one line item.');
      return;
    }
    const newItems = data.items.filter((_, i) => i !== index);
    updateField('items', newItems);
  };

  // Custom Logo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange({
            ...data,
            business: {
              ...data.business,
              customLogoUrl: event.target.result as string,
            },
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#181614] border border-[#2b2620] rounded-2xl overflow-hidden shadow-xl flex flex-col h-full text-slate-200">
      {/* Tab Navigation - 5 column grid so all tabs are visible and clickable on PC & Mobile */}
      <div className="grid grid-cols-5 p-1.5 bg-[#12110f] border-b border-[#2d2822] gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('client')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-1 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'client'
              ? 'bg-amber-500 text-black shadow-md font-black'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#1f1c18]'
          }`}
          title="Client & Event Info"
        >
          <User className="w-4 h-4 shrink-0" />
          <span className="truncate text-[11px] sm:text-xs">Client</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('items')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-1 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'items'
              ? 'bg-amber-500 text-black shadow-md font-black'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#1f1c18]'
          }`}
          title="Services & Packages"
        >
          <Package className="w-4 h-4 shrink-0" />
          <span className="truncate text-[11px] sm:text-xs">Services ({data.items.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payment')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-1 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'payment'
              ? 'bg-amber-500 text-black shadow-md font-black'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#1f1c18]'
          }`}
          title="BRAC Bank & Payments"
        >
          <CreditCard className="w-4 h-4 shrink-0" />
          <span className="truncate text-[11px] sm:text-xs">Payment</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-1 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'branding'
              ? 'bg-amber-500 text-black shadow-md font-black'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#1f1c18]'
          }`}
          title="Theme & Logo"
        >
          <Palette className="w-4 h-4 shrink-0" />
          <span className="truncate text-[11px] sm:text-xs">Theme</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('terms')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-1 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'terms'
              ? 'bg-amber-500 text-black shadow-md font-black'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#1f1c18]'
          }`}
          title="Terms & Signature"
        >
          <FileText className="w-4 h-4 shrink-0" />
          <span className="truncate text-[11px] sm:text-xs">Terms</span>
        </button>
      </div>

      {/* Form Content Area */}
      <div className="p-4 md:p-6 overflow-y-auto space-y-6 flex-1 max-h-[calc(100vh-210px)]">
        {/* TAB 1: CLIENT & EVENT */}
        {activeTab === 'client' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#2d2822]">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4" /> Client & Booking Details
              </h3>
              <div className="text-xs text-slate-400">
                Invoice No: <span className="font-mono text-amber-300 font-bold">{data.invoiceNumber}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Client Name / Couple Name *
                </label>
                <input
                  type="text"
                  value={data.client.name}
                  onChange={(e) => updateClient('name', e.target.value)}
                  placeholder="e.g. Shakil & Mim Wedding"
                  className="w-full bg-[#201d1a] border border-[#383129] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Client Phone Number *
                </label>
                <input
                  type="tel"
                  value={data.client.phone}
                  onChange={(e) => updateClient('phone', e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full bg-[#201d1a] border border-[#383129] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Client Email (Optional)
                </label>
                <input
                  type="email"
                  value={data.client.email || ''}
                  onChange={(e) => updateClient('email', e.target.value)}
                  placeholder="client@gmail.com"
                  className="w-full bg-[#201d1a] border border-[#383129] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Event Type
                </label>
                <input
                  type="text"
                  value={data.client.eventType}
                  onChange={(e) => updateClient('eventType', e.target.value)}
                  placeholder="Wedding / Holud / Reception / Birthday"
                  className="w-full bg-[#201d1a] border border-[#383129] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={data.issueDate}
                  onChange={(e) => updateField('issueDate', e.target.value)}
                  className="w-full bg-[#201d1a] border border-[#383129] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Event Date / Due Date
                </label>
                <input
                  type="date"
                  value={data.dueDate}
                  onChange={(e) => updateField('dueDate', e.target.value)}
                  className="w-full bg-[#201d1a] border border-[#383129] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Event Venue / Location
              </label>
              <input
                type="text"
                value={data.client.eventVenue}
                onChange={(e) => updateClient('eventVenue', e.target.value)}
                placeholder="e.g. Officers Club Banquet Hall, Rajbari"
                className="w-full bg-[#201d1a] border border-[#383129] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Client Special Note / Request
              </label>
              <textarea
                rows={2}
                value={data.client.notes || ''}
                onChange={(e) => updateClient('notes', e.target.value)}
                placeholder="Any special remarks or specific client instructions..."
                className="w-full bg-[#201d1a] border border-[#383129] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Invoice Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['draft', 'booked', 'partial', 'paid'] as InvoiceStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => updateField('status', st)}
                    className={`px-3 py-2 text-xs font-bold uppercase rounded-lg border transition-all ${
                      data.status === st
                        ? 'bg-amber-500 text-black border-amber-400 font-black shadow'
                        : 'bg-[#201d1a] text-slate-300 border-[#383129] hover:bg-[#282420]'
                    }`}
                  >
                    {st === 'booked' ? 'Booked' : st === 'partial' ? 'Advance' : st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SERVICES & ITEMS */}
        {activeTab === 'items' && (
          <div className="space-y-4">
            {/* Top Package Manager Trigger */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Package className="w-4 h-4" /> প্যাকেজ তৈরি & ম্যানেজ করুন
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  আপনার কাস্টম প্যাকেজ তৈরি করে সরাসরি রেপোতে সেভ করুন
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenPackageManager}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-extrabold text-xs hover:bg-amber-400 transition-colors shrink-0 shadow"
              >
                প্যাকেজ স্টুডিও খুলুন
              </button>
            </div>

            {/* Quick Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> কুইক অ্যাড প্রিসেট
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[...customPackages.slice(0, 4), ...SERVICE_PRESETS.slice(0, 4)].map((preset: any, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addItem(preset)}
                    className="text-xs bg-[#24201c] hover:bg-amber-500/20 hover:border-amber-500/50 text-slate-200 border border-[#3a332a] rounded-full px-3 py-1.5 transition-all text-left flex items-center gap-1.5"
                  >
                    <Plus className="w-3 h-3 text-amber-400" />
                    <span>{preset.title.split('(')[0]}</span>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">৳{preset.rate}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#2d2822] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  ইনভয়েসের আইটেম তালিকা ({data.items.length})
                </h4>
                <button
                  type="button"
                  onClick={() => addItem()}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> কাস্টম আইটেম যোগ করুন
                </button>
              </div>

              {data.items.map((item, index) => (
                <div
                  key={item.id || index}
                  className="p-3.5 bg-[#201d1a] border border-[#383129] rounded-xl space-y-2.5 relative group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                        আইটেম #{index + 1} টাইটেল
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                        placeholder="Service name (e.g. Full Day Wedding Photography)"
                        className="w-full bg-[#181614] border border-[#383129] rounded-lg px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors mt-5"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      বিবরণ ও ডেলিভারেবলস
                    </label>
                    <textarea
                      rows={2}
                      value={item.description || ''}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="e.g. 2 Photographers, Unlimited Raw Photos, 100 Edited..."
                      className="w-full bg-[#181614] border border-[#383129] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                        পরিমাণ / দিন
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-full bg-[#181614] border border-[#383129] rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono font-bold focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                        রেট (৳ BDT)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                        className="w-full bg-[#181614] border border-[#383129] rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono font-bold focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                        মোট (Total)
                      </label>
                      <div className="w-full bg-[#141210] border border-[#383129] rounded-lg px-2.5 py-1.5 text-xs font-mono font-black text-amber-400 flex items-center justify-end">
                        ৳{new Intl.NumberFormat('en-IN').format(item.total)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT & BRAC BANK */}
        {activeTab === 'payment' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#2d2822]">
              <Landmark className="w-4 h-4" /> BRAC Bank ও পেমেন্ট বিবরণী
            </h3>

            {/* BRAC Bank Section */}
            <div className="p-4 bg-[#201d1a] border border-[#383129] rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Landmark className="w-4 h-4" /> ব্যাংক অ্যাকাউন্ট তথ্য (Bank Transfer)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">ব্যাংকের নাম</label>
                  <input
                    type="text"
                    value={data.paymentDetails.bankName}
                    onChange={(e) => updatePaymentDetails('bankName', e.target.value)}
                    placeholder="BRAC Bank"
                    className="w-full bg-[#181614] border border-[#383129] rounded-lg px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Account Name</label>
                  <input
                    type="text"
                    value={data.paymentDetails.bankAccountName}
                    onChange={(e) => updatePaymentDetails('bankAccountName', e.target.value)}
                    placeholder="Rajin Traders"
                    className="w-full bg-[#181614] border border-[#383129] rounded-lg px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Account Number</label>
                <input
                  type="text"
                  value={data.paymentDetails.bankAccountNumber}
                  onChange={(e) => updatePaymentDetails('bankAccountNumber', e.target.value)}
                  placeholder="2054833740001"
                  className="w-full bg-[#181614] border border-[#383129] rounded-lg px-3 py-2 text-xs text-slate-100 font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Branch</label>
                  <input
                    type="text"
                    value={data.paymentDetails.bankBranch}
                    onChange={(e) => updatePaymentDetails('bankBranch', e.target.value)}
                    placeholder="Rajbari"
                    className="w-full bg-[#181614] border border-[#383129] rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">District</label>
                  <input
                    type="text"
                    value={data.paymentDetails.bankDistrict}
                    onChange={(e) => updatePaymentDetails('bankDistrict', e.target.value)}
                    placeholder="Rajbari"
                    className="w-full bg-[#181614] border border-[#383129] rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Banking (bKash & Nagad) */}
            <div className="p-4 bg-[#201d1a] border border-[#383129] rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                মোবাইল ব্যাংকিং (bKash & Nagad)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-pink-400 mb-1">bKash Number</label>
                  <input
                    type="text"
                    value={data.paymentDetails.bKashNumber}
                    onChange={(e) => updatePaymentDetails('bKashNumber', e.target.value)}
                    placeholder="01740-744170 (Personal)"
                    className="w-full bg-[#181614] border border-[#383129] rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-orange-400 mb-1">Nagad Number</label>
                  <input
                    type="text"
                    value={data.paymentDetails.nagadNumber}
                    onChange={(e) => updatePaymentDetails('nagadNumber', e.target.value)}
                    placeholder="01740-744170 (Personal)"
                    className="w-full bg-[#181614] border border-[#383129] rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Instruction Note</label>
                <input
                  type="text"
                  value={data.paymentDetails.notes}
                  onChange={(e) => updatePaymentDetails('notes', e.target.value)}
                  placeholder="e.g. Please share payment screenshot on WhatsApp..."
                  className="w-full bg-[#181614] border border-[#383129] rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Financial Adjustments */}
            <div className="p-4 bg-[#201d1a] border border-[#383129] rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                ডিসকাউন্ট ও অগ্রিম জমা (Financial Adjustments)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ডিসকাউন্ট টাইপ</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateField('discountType', 'flat')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        data.discountType === 'flat'
                          ? 'bg-amber-500 text-black border-amber-400'
                          : 'bg-[#181614] text-slate-300 border-[#383129]'
                      }`}
                    >
                      Flat (৳ BDT)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('discountType', 'percentage')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        data.discountType === 'percentage'
                          ? 'bg-amber-500 text-black border-amber-400'
                          : 'bg-[#181614] text-slate-300 border-[#383129]'
                      }`}
                    >
                      Percentage (%)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ডিসকাউন্ট পরিমাণ {data.discountType === 'percentage' ? '(%)' : '(৳ BDT)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={data.discountValue}
                    onChange={(e) => updateField('discountValue', Number(e.target.value) || 0)}
                    className="w-full bg-[#181614] border border-[#383129] rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-400 mb-1">
                  অগ্রিম টাকা জমা (Advance Paid ৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.advancePaid}
                  onChange={(e) => updateField('advancePaid', Number(e.target.value) || 0)}
                  placeholder="e.g. 20000"
                  className="w-full bg-[#181614] border border-[#383129] rounded-lg px-3 py-2 text-sm text-slate-100 font-mono font-black text-emerald-400 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: THEME & LOGO */}
        {activeTab === 'branding' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#2d2822]">
              <Palette className="w-4 h-4" /> থিম, লোগো ও ঠিকানা
            </h3>

            {/* Template Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                ইনভয়েস থিম সিলেক্ট করুন
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'luxury-gold', name: 'Luxury Gold', desc: 'Champagne & dark gold elegance' },
                  { id: 'cinematic-dark', name: 'Cinematic Dark', desc: 'Sleek film director vibe' },
                  { id: 'royal-classic', name: 'Royal Classic', desc: 'Prestigious corporate style' },
                  { id: 'minimal-light', name: 'Minimal Studio', desc: 'Clean, bright white print style' },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => updateField('template', tpl.id as TemplateTheme)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      data.template === tpl.id
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                        : 'bg-[#201d1a] border-[#383129] text-slate-300 hover:bg-[#282420]'
                    }`}
                  >
                    <div className="font-bold text-xs">{tpl.name}</div>
                    <div className="text-[10px] opacity-75 mt-0.5">{tpl.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Options */}
            <div className="pt-2 border-t border-[#2d2822]">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Dorpon লোগো সিলেক্ট করুন
                </label>
                <label className="cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300">
                  <Upload className="w-3.5 h-3.5" /> Upload Custom Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {LOGO_OPTIONS.map((logo) => (
                  <button
                    key={logo.id}
                    type="button"
                    onClick={() => {
                      onChange({
                        ...data,
                        business: {
                          ...data.business,
                          logoType: logo.id,
                          customLogoUrl: undefined,
                        },
                      });
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      !data.business.customLogoUrl && data.business.logoType === logo.id
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                        : 'bg-[#201d1a] border-[#383129] text-slate-400 hover:bg-[#282420]'
                    }`}
                  >
                    <div className="h-10 w-full flex items-center justify-center bg-black/30 rounded p-1">
                      <img src={logo.src} alt={logo.label} className="max-h-full max-w-full object-contain" />
                    </div>
                    <span className="text-[10px] font-medium truncate w-full">{logo.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Business Contact Details & Address */}
            <div className="pt-2 border-t border-[#2d2822] space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Studio Contact & Address
              </label>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Studio Address *</label>
                <input
                  type="text"
                  value={data.business.address}
                  onChange={(e) => updateBusiness('address', e.target.value)}
                  placeholder="Rajbari, Faridpur, Dhaka"
                  className="w-full bg-[#201d1a] border border-[#383129] rounded-lg px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={data.business.name}
                    onChange={(e) => updateBusiness('name', e.target.value)}
                    className="w-full bg-[#201d1a] border border-[#383129] rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={data.business.tagline}
                    onChange={(e) => updateBusiness('tagline', e.target.value)}
                    className="w-full bg-[#201d1a] border border-[#383129] rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Website</label>
                  <input
                    type="text"
                    value={data.business.website}
                    onChange={(e) => updateBusiness('website', e.target.value)}
                    className="w-full bg-[#201d1a] border border-[#383129] rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Studio Phone</label>
                  <input
                    type="text"
                    value={data.business.phone}
                    onChange={(e) => updateBusiness('phone', e.target.value)}
                    className="w-full bg-[#201d1a] border border-[#383129] rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TERMS & SIGNATURE */}
        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#2d2822]">
              <FileText className="w-4 h-4" /> Terms, Conditions & Signature
            </h3>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Terms & Conditions (One per line)
                </label>
                <button
                  type="button"
                  onClick={() => updateField('terms', [...DEFAULT_TERMS])}
                  className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Terms
                </button>
              </div>

              <textarea
                rows={6}
                value={data.terms.join('\n')}
                onChange={(e) => updateField('terms', e.target.value.split('\n').filter(Boolean))}
                className="w-full bg-[#201d1a] border border-[#383129] rounded-lg p-3 text-xs text-slate-200 leading-relaxed font-sans focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="p-4 bg-[#201d1a] border border-[#383129] rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Authorized Signatory
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Signer Name</label>
                  <input
                    type="text"
                    value={data.signatureName}
                    onChange={(e) => updateField('signatureName', e.target.value)}
                    placeholder="Rajin Ahamed"
                    className="w-full bg-[#181614] border border-[#383129] rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Signer Title</label>
                  <input
                    type="text"
                    value={data.signatureTitle}
                    onChange={(e) => updateField('signatureTitle', e.target.value)}
                    placeholder="Founder & Lead Photographer"
                    className="w-full bg-[#181614] border border-[#383129] rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onReset}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset All Invoice Fields to Default
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
