import React, { forwardRef } from 'react';
import { InvoiceData } from '../types/invoice';
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Building2,
  CheckCircle2,
  AlertCircle,
  Landmark,
  Sparkles
} from 'lucide-react';

interface InvoicePreviewProps {
  data: InvoiceData;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ data }, ref) => {
    const {
      invoiceNumber,
      issueDate,
      dueDate,
      status,
      template,
      business,
      client,
      items,
      discountType,
      discountValue,
      advancePaid,
      terms,
      signatureName,
      signatureTitle,
      paymentDetails,
      showWatermark,
    } = data;

    // Financial calculations
    const subtotal = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    const discountAmount =
      discountType === 'percentage'
        ? (subtotal * (Number(discountValue) || 0)) / 100
        : Number(discountValue) || 0;
    const grandTotal = Math.max(0, subtotal - discountAmount);
    const balanceDue = Math.max(0, grandTotal - (Number(advancePaid) || 0));

    const formatMoney = (val: number) => {
      return new Intl.NumberFormat('en-IN').format(Math.round(val));
    };

    // Theme Styles
    const isDark = template === 'cinematic-dark';
    const isLuxury = template === 'luxury-gold';
    const isRoyal = template === 'royal-classic';

    let containerBg = 'bg-[#ffffff] text-slate-900 border-2 border-slate-300';
    let accentColor = '#b8860b';
    let headerBorder = 'border-b-2 border-amber-500/30';
    let tableHeadBg = 'bg-amber-100/80 text-amber-950 font-bold';
    let summaryBg = 'bg-amber-50/80 border-2 border-amber-300';
    let dueBadgeBg = 'bg-amber-500 text-black';

    if (isLuxury) {
      containerBg = 'bg-[#fffdf9] text-[#1c1917] border-2 border-[#d8be8d] shadow-2xl';
      accentColor = '#b3822a';
      headerBorder = 'border-b-2 border-[#d4af37]/60';
      tableHeadBg = 'bg-[#1e1b18] text-[#f7e7ce]';
      summaryBg = 'bg-[#fcf7ee] border-2 border-[#e2cba0]';
      dueBadgeBg = 'bg-[#b3822a] text-white';
    } else if (isDark) {
      containerBg = 'bg-[#141210] text-[#f4efe8] border-2 border-[#383025] shadow-2xl';
      accentColor = '#f0c27b';
      headerBorder = 'border-b-2 border-[#473c2c]';
      tableHeadBg = 'bg-[#24201a] text-[#f0c27b]';
      summaryBg = 'bg-[#1b1814] border-2 border-[#3d3326]';
      dueBadgeBg = 'bg-[#f0c27b] text-black font-extrabold';
    } else if (isRoyal) {
      containerBg = 'bg-[#ffffff] text-[#0f172a] border-2 border-teal-300 shadow-2xl';
      accentColor = '#0f766e';
      headerBorder = 'border-b-2 border-teal-700';
      tableHeadBg = 'bg-teal-900 text-teal-50';
      summaryBg = 'bg-teal-50 border-2 border-teal-300';
      dueBadgeBg = 'bg-teal-800 text-white';
    } else {
      // Minimal Light
      containerBg = 'bg-white text-slate-900 border-2 border-slate-300 shadow-xl';
      accentColor = '#1d4ed8';
      headerBorder = 'border-b-2 border-slate-300';
      tableHeadBg = 'bg-slate-200 text-slate-900';
      summaryBg = 'bg-slate-100 border-2 border-slate-300';
      dueBadgeBg = 'bg-slate-900 text-white';
    }

    // Logo source resolution
    let logoSrc = business.customLogoUrl || `/logo/${business.logoType}`;
    if (isDark && business.logoType === 'logo-black.png') {
      logoSrc = '/logo/logo-cream.png';
    }

    const getStatusBadge = () => {
      switch (status) {
        case 'paid':
          return (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> PAID IN FULL
            </span>
          );
        case 'partial':
          return (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/40">
              PARTIAL ADVANCE RECEIVED
            </span>
          );
        case 'booked':
          return (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/50">
              <Sparkles className="w-4 h-4" /> DATE BOOKED / CONFIRMED
            </span>
          );
        case 'overdue':
          return (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/40">
              <AlertCircle className="w-4 h-4" /> PAYMENT OVERDUE
            </span>
          );
        default:
          return (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase bg-slate-500/20 text-slate-700 dark:text-slate-400 border border-slate-500/40">
              DRAFT ESTIMATE
            </span>
          );
      }
    };

    return (
      <div
        ref={ref}
        id="invoice-capture-node"
        className={`relative w-[880px] min-h-[1200px] p-12 mx-auto overflow-hidden text-base flex flex-col justify-between ${containerBg}`}
        style={{
          boxSizing: 'border-box',
        }}
      >
        {/* Subtle Watermark if enabled */}
        {showWatermark && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.04] select-none z-0">
            <img src="/logo/logo-mark.png" alt="watermark" className="w-[520px] h-[520px] object-contain" />
          </div>
        )}

        <div className="relative z-10">
          {/* Header Section */}
          <div className={`pb-8 ${headerBorder} flex flex-row items-start justify-between gap-6`}>
            {/* Logo and Business Info */}
            <div className="flex flex-col gap-3 max-w-[500px]">
              <div className="flex items-center gap-3">
                <img
                  src={logoSrc}
                  alt={business.name}
                  className="h-20 max-w-[240px] object-contain object-left"
                  crossOrigin="anonymous"
                />
              </div>

              <div>
                <h1 className="text-3xl font-extrabold tracking-tight font-serif" style={{ color: isDark ? '#fff' : '#111' }}>
                  {business.name}
                </h1>
                <p className="text-sm uppercase tracking-widest font-bold opacity-85 mt-1" style={{ color: accentColor }}>
                  {business.tagline}
                </p>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium opacity-90 mt-1">
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-amber-500 shrink-0" />
                  <a href={`https://${business.website}`} target="_blank" rel="noreferrer" className="hover:underline font-bold">
                    {business.website}
                  </a>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-bold">{business.phone}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  {business.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span className="font-semibold">{business.address}</span>
                </span>
              </div>
            </div>

            {/* Invoice Meta Card */}
            <div className="text-right flex flex-col items-end gap-2.5">
              <div className="text-4xl font-black tracking-tight font-serif" style={{ color: accentColor }}>
                INVOICE
              </div>
              <div className="text-base font-mono font-black tracking-wider px-3.5 py-1.5 rounded-lg bg-black/5 dark:bg-white/10 border-2 border-current/20">
                #{invoiceNumber}
              </div>
              <div>{getStatusBadge()}</div>

              <div className="mt-2 text-sm space-y-1.5 font-medium opacity-90">
                <div>
                  <span className="opacity-70">Issue Date: </span>
                  <span className="font-bold">{issueDate}</span>
                </div>
                <div>
                  <span className="opacity-70">Event / Due Date: </span>
                  <span className="font-black text-amber-700 dark:text-amber-400">{dueDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Client & Event Details Section */}
          <div className="my-7 p-6 rounded-2xl border-2 border-current/15 bg-black/[0.025] dark:bg-white/[0.025] grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-black uppercase tracking-wider opacity-75 mb-2" style={{ color: accentColor }}>
                INVOICE TO (CLIENT)
              </p>
              <h3 className="text-xl font-extrabold tracking-tight">{client.name || 'Valued Client'}</h3>
              <p className="text-sm font-semibold opacity-90 mt-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> {client.phone || 'Phone not provided'}
              </p>
              {client.email && (
                <p className="text-sm opacity-85 mt-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" /> {client.email}
                </p>
              )}
            </div>

            <div className="border-l-2 border-current/15 pl-8">
              <p className="text-xs font-black uppercase tracking-wider opacity-75 mb-2" style={{ color: accentColor }}>
                EVENT INFORMATION
              </p>
              <div className="space-y-1.5">
                <div className="text-base font-bold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>{client.eventType || 'Photography Coverage'}</span>
                </div>
                <div className="text-sm font-semibold opacity-90 flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
                  <span>{client.eventVenue || 'Rajbari / Client Location'}</span>
                </div>
                {client.notes && (
                  <p className="text-xs italic opacity-80 mt-1 pl-6">
                    "{client.notes}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-hidden rounded-xl border-2 border-current/15 mb-7">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={tableHeadBg}>
                  <th className="py-3 px-4 text-sm font-extrabold uppercase tracking-wider w-12 text-center">#</th>
                  <th className="py-3 px-4 text-sm font-extrabold uppercase tracking-wider">Service / Package Description</th>
                  <th className="py-3 px-4 text-sm font-extrabold uppercase tracking-wider text-center w-20">Qty</th>
                  <th className="py-3 px-4 text-sm font-extrabold uppercase tracking-wider text-right w-32">Rate</th>
                  <th className="py-3 px-4 text-sm font-extrabold uppercase tracking-wider text-right w-36">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-current/10">
                {items.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="py-4 px-4 text-center font-mono opacity-70 font-bold text-sm">{idx + 1}</td>
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-base tracking-tight">{item.title}</div>
                      {item.description && (
                        <div className="text-sm opacity-85 mt-1 leading-relaxed font-sans">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-base">{item.quantity}</td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-base opacity-95">
                      ৳{formatMoney(item.rate)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-black text-lg">
                      ৳{formatMoney(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary & Calculations */}
          <div className="grid grid-cols-12 gap-7 items-start mb-7">
            {/* Payment Details Column */}
            <div className="col-span-7 space-y-4">
              <div className="p-5 rounded-2xl border-2 border-current/15 bg-black/[0.02] dark:bg-white/[0.02] space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2" style={{ color: accentColor }}>
                  <Landmark className="w-4 h-4" /> PAYMENT METHODS & ACCOUNTS
                </h4>

                {/* BRAC Bank Account Card */}
                {paymentDetails.bankName && (
                  <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs sm:text-sm space-y-1">
                    <div className="flex items-center justify-between font-bold text-blue-700 dark:text-blue-300">
                      <span className="flex items-center gap-1.5">
                        <Landmark className="w-4 h-4" /> {paymentDetails.bankName}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20">
                        Branch: {paymentDetails.bankBranch}, {paymentDetails.bankDistrict}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="opacity-80">A/C Name:</span>
                      <span className="font-bold">{paymentDetails.bankAccountName}</span>
                    </div>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="opacity-80">A/C Number:</span>
                      <span className="font-mono font-black text-sm sm:text-base tracking-wider bg-white/70 dark:bg-black/30 px-2 py-0.5 rounded border border-current/20">
                        {paymentDetails.bankAccountNumber}
                      </span>
                    </div>
                  </div>
                )}

                {/* Mobile Banking (bKash & Nagad) */}
                <div className="space-y-1.5 text-sm pt-1">
                  {paymentDetails.bKashNumber && (
                    <div className="flex items-center justify-between py-0.5">
                      <span className="font-bold text-pink-600 dark:text-pink-400">bKash (Send Money):</span>
                      <span className="font-mono font-bold text-base">{paymentDetails.bKashNumber}</span>
                    </div>
                  )}
                  {paymentDetails.nagadNumber && (
                    <div className="flex items-center justify-between py-0.5">
                      <span className="font-bold text-orange-600 dark:text-orange-400">Nagad (Send Money):</span>
                      <span className="font-mono font-bold text-base">{paymentDetails.nagadNumber}</span>
                    </div>
                  )}
                  {paymentDetails.notes && (
                    <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold pt-1 italic">
                      * {paymentDetails.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms Preview */}
              <div className="p-4 rounded-xl border border-current/15 text-xs opacity-90 space-y-1.5">
                <p className="font-black uppercase tracking-wider text-[11px]" style={{ color: accentColor }}>
                  BOOKING TERMS & CONDITIONS:
                </p>
                <ul className="list-disc pl-5 space-y-1 leading-relaxed">
                  {terms.slice(0, 5).map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Totals Summary Column */}
            <div className="col-span-5">
              <div className={`p-5 rounded-2xl ${summaryBg} space-y-3 text-sm`}>
                <div className="flex justify-between items-center opacity-85">
                  <span className="font-medium">Subtotal:</span>
                  <span className="font-mono font-bold text-base">৳{formatMoney(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400 font-semibold">
                    <span>
                      Discount {discountType === 'percentage' ? `(${discountValue}%)` : ''}:
                    </span>
                    <span className="font-mono font-bold text-base">- ৳{formatMoney(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center font-extrabold text-base pt-2.5 border-t-2 border-current/20">
                  <span>Total Amount:</span>
                  <span className="font-mono text-xl font-black">৳{formatMoney(grandTotal)}</span>
                </div>

                <div className="flex justify-between items-center text-blue-700 dark:text-blue-400 font-bold">
                  <span>Advance Received:</span>
                  <span className="font-mono font-bold text-base">৳{formatMoney(advancePaid)}</span>
                </div>

                <div className={`mt-4 p-4 rounded-xl flex justify-between items-center ${dueBadgeBg} shadow-md`}>
                  <span className="font-black tracking-wider uppercase text-sm">
                    {balanceDue === 0 ? 'STATUS:' : 'BALANCE DUE:'}
                  </span>
                  <span className="font-mono text-2xl font-black tracking-tight">
                    {balanceDue === 0 ? 'FULLY PAID' : `৳${formatMoney(balanceDue)}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer & Signature Section */}
        <div className="relative z-10 pt-6 mt-4 border-t-2 border-current/15">
          <div className="flex items-end justify-between">
            <div className="text-xs opacity-85 space-y-1">
              <p className="font-black tracking-wide uppercase text-sm" style={{ color: accentColor }}>
                Thank you for choosing {business.name}!
              </p>
              <p className="font-semibold">Hotline: {business.phone} | {business.email}</p>
              <p className="opacity-75">Official Website: <span className="underline font-bold">{business.website}</span></p>
            </div>

            <div className="text-center w-64">
              <div className="h-12 border-b-2 border-dashed border-current/40 flex items-end justify-center pb-1">
                <span className="font-serif italic text-2xl font-bold tracking-wide text-amber-700 dark:text-amber-400">
                  {signatureName}
                </span>
              </div>
              <p className="text-sm font-extrabold mt-2 uppercase tracking-wider">{signatureName}</p>
              <p className="text-xs opacity-75 font-semibold">{signatureTitle}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';
