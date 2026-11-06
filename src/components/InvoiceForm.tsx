import React, { useState } from 'react';
import {
  InvoiceData,
  InvoiceItem,
  InvoiceStatus,
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
  FileText
} from 'lucide-react';

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  onReset: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  data,
  onChange,
  onReset,
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

  const addItem = (preset?: { title: string; desc: string; rate: number }) => {
    const newItem: InvoiceItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: preset ? preset.title : 'Custom Photography / Video Service',
      description: preset ? preset.desc : '',
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
      {/* Tab Navigation */}
      <div className="flex border-b border-[#2d2822] bg-[#12110f] overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('client')}
          className={`flex items-center gap-2 px-4 py-3.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'client'
              ? 'border-amber-500 text-amber-400 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          Client & Event
        </button>

        <button
          onClick={() => setActiveTab('items')}
          className={`flex items-center gap-2 px-4 py-3.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'items'
              ? 'border-amber-500 text-amber-400 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          Services ({data.items.length})
        </button>

        <button
          onClick={() => setActiveTab('payment')}
          className={`flex items-center gap-2 px-4 py-3.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'payment'
              ? 'border-amber-500 text-amber-400 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Payment & Totals
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-4 py-3.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'branding'
              ? 'border-amber-500 text-amber-400 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-4 h-4" />
          Theme & Logo
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          className={`flex items-center gap-2 px-4 py-3.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'terms'
              ? 'border-amber-500 text-amber-400 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Terms & Sign
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
                <label className="block text-xs font-medium text-slate-300 mb-1">
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
                <label className="block text-xs font-medium text-slate-300 mb-1">
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
                <label className="block text-xs font-medium text-slate-300 mb-1">
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
                <label className="block text-xs font-medium text-slate-300 mb-1">
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
                <label className="block text-xs font-medium text-slate-300 mb-1">
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
                <label className="block text-xs font-medium text-slate-300 mb-1">
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
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Event Venue / Location
              </label>
              <input
                type="text"
                value={data.client.eventVenue}
                onChange={(e) => updateClient('eventVenue', e.target.value)}
                placeholder="e.g. Rajbari Community Center / Officers Club"
                className="w-full bg-[#201d1a] border border-[#383129] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Client Special Note / Request
              </label>
              <textarea
                rows={2}
                value={data.client.notes || ''}
                onChange={(e) => updateClient('notes', e.target.value)}
                placeholder="Any special remarks, coverage timings or specific client instructions..."
                className="w-full bg-[#201d1a] border border-[#383129] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
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
                        ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow'
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
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Quick Add Service Preset
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SERVICE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addItem(preset)}
                    className="text-xs bg-[#24201c] hover:bg-amber-500/20 hover:border-amber-500/50 text-slate-200 border border-[#3a332a] rounded-full px-3 py-1.5 transition-all text-left flex items-center gap-1.5"
                  >
                    <Plus className="w-3 h-3 text-amber-400" />
                    <span>{preset.title.split('(')[0]}</span>
                    <span className="text-[10px] text-amber-400 font-mono">৳{preset.rate}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#2d2822] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Invoice Items List
                </h4>
                <button
                  type="button"
                  onClick={() => addItem()}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Custom Item
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
                        Item #{index + 1} Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                        placeholder="Service name (e.g. Wedding Photography)"
                        className="w-full bg-[#181614] border border-[#383129] rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-semibold focus:outline-none focus:border-amber-500"
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
                      Description / Package Details
                    </label>
                    <textarea
                      rows={2}
                      value={item.description || ''}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="e.g. 2 Photographers, Unlimited Raw Photos, 100 Edited..."
                      className="w-full bg-[#181614] border border-[#383129] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                        Qty / Days
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-full bg-[#181614] border border-[#383129] rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                        Rate (৳ BDT)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                        className="w-full bg-[#181614] border border-[#383129] rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                        Line Total
                      </label>
                      <div className="w-full bg-[#141210] border border-[#383129] rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-amber-400 flex items-center justify-end">
                        ৳{new Intl.NumberFormat('en-IN').format(item.total)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT & TOTALS */}
        {activeTab === 'payment' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#2d2822]">
              <CreditCard className="w-4 h-4" /> Discounts, Advance & Accounts
            </h3>

            {/* Discount & Advance */}
            <div className="p-4 bg-[#201d1a] border border-[#383129] rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Financial Adjustments
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Discount Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateField('discountType', 'flat')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        data.discountType === 'flat'
                          ? 'bg-amber-500 text-black border-amber-400 font-bold'
                          : 'bg-[#181614] text-slate-300 border-[#383129]'
                      }`}
                    >
                      Flat (৳ BDT)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('discountType', 'percentage')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        data.discountType === 'percentage'
                          ? 'bg-amber-500 text-black border-amber-400 font-bold'
                          : 'bg-[#181614] text-slate-300 border-[#383129]'
                      }`}
                    >
                      Percentage (%)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Discount Value {data.discountType === 'percentage' ? '(%)' : '(৳ BDT)'}
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
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Advance Amount Paid (৳ BDT)
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.advancePaid}
                  onChange={(e) => updateField('advancePaid', Number(e.target.value) || 0)}
                  placeholder="e.g. 15000"
                  className="w-full bg-[#181614] border border-[#383129] rounded-lg px-3 py-2 text-sm text-slate-100 font-mono font-bold text-emerald-400 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="p-4 bg-[#201d1a] border border-[#383129] rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Payment Account Details (Shown on Invoice)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-pink-400 mb-1">
                    bKash Number
                  </label>
                  <input
                    type="text"
                    value={data.paymentDetails.bKashNumber}
                    onChange={(e) => updatePaymentDetails('bKashNumber', e.target.value)}
                    placeholder="017xxxxxxxx (Personal)"
                    className="w-full bg-[#181614] border border-[#383129] rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-orange-400 mb-1">
                    Nagad Number
                  </label>
                  <input
                    type="text"
                    value={data.paymentDetails.nagadNumber}
                    onChange={(e) => updatePaymentDetails('nagadNumber', e.target.value)}
                    placeholder="017xxxxxxxx (Personal)"
                    className="w-full bg-[#181614] border border-[#383129] rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Bank Account Information
                </label>
                <input
                  type="text"
                  value={data.paymentDetails.bankDetails}
                  onChange={(e) => updatePaymentDetails('bankDetails', e.target.value)}
                  placeholder="Bank Name, Account Name, A/C Number, Branch"
                  className="w-full bg-[#181614] border border-[#383129] rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Payment Instruction Note
                </label>
                <input
                  type="text"
                  value={data.paymentDetails.notes}
                  onChange={(e) => updatePaymentDetails('notes', e.target.value)}
                  placeholder="e.g. Please share transaction screenshot on WhatsApp..."
                  className="w-full bg-[#181614] border border-[#383129] rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: THEME & LOGO */}
        {activeTab === 'branding' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#2d2822]">
              <Palette className="w-4 h-4" /> Invoice Styling & Dorpon Branding
            </h3>

            {/* Template Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Choose Invoice Aesthetic
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'luxury-gold', name: 'Luxury Gold', desc: 'Champagne & dark gold elegance' },
                  { id: 'cinematic-dark', name: 'Cinematic Dark', desc: 'Sleek film director vibe' },
                  { id: 'royal-classic', name: 'Royal Teal & Navy', desc: 'Prestigious corporate style' },
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
                  Dorpon Logo Variations
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

            {/* Business Contact Details */}
            <div className="pt-2 border-t border-[#2d2822] space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Studio Contact & Info
              </label>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={data.business.email}
                    onChange={(e) => updateBusiness('email', e.target.value)}
                    className="w-full bg-[#201d1a] border border-[#383129] rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Address</label>
                  <input
                    type="text"
                    value={data.business.address}
                    onChange={(e) => updateBusiness('address', e.target.value)}
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
