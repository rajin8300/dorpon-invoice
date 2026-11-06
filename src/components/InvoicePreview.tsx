import React, { forwardRef } from 'react';
import { InvoiceData } from '../types/invoice';
import { Phone, Mail, Globe, MapPin, Calendar, MapPinHouse, CheckCircle2, AlertCircle } from 'lucide-react';

interface InvoicePreviewProps {
  data: InvoiceData;
  scale?: number;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ data }, ref) => {
    const {
      invoiceNumber,
      issueDate,
      dueDate,
      status,
      template,
      currency,
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

    let containerBg = 'bg-white text-slate-900 border border-slate-200';
    let accentColor = '#b8860b'; // Gold
    let headerBorder = 'border-b border-amber-500/20';
    let tableHeadBg = 'bg-amber-50 text-amber-950 font-semibold';
    let summaryBg = 'bg-amber-50/70 border border-amber-200/80';
    let dueBadgeBg = 'bg-amber-500 text-white';

    if (isLuxury) {
      containerBg = 'bg-[#fffdfa] text-[#1c1917] border border-[#e8d8be] shadow-2xl';
      accentColor = '#c59a3f';
      headerBorder = 'border-b-2 border-[#d4af37]/40';
      tableHeadBg = 'bg-[#1c1917] text-[#f7e7ce]';
      summaryBg = 'bg-[#faf6ee] border border-[#e8d8be]';
      dueBadgeBg = 'bg-[#c59a3f] text-white';
    } else if (isDark) {
      containerBg = 'bg-[#141210] text-[#f0ebe3] border border-[#2b2620] shadow-2xl';
      accentColor = '#e5b869';
      headerBorder = 'border-b border-[#3d3428]';
      tableHeadBg = 'bg-[#211d17] text-[#e5b869]';
      summaryBg = 'bg-[#1c1915] border border-[#332c22]';
      dueBadgeBg = 'bg-[#e5b869] text-[#141210] font-bold';
    } else if (isRoyal) {
      containerBg = 'bg-[#ffffff] text-[#0f172a] border border-slate-300 shadow-2xl';
      accentColor = '#0f766e';
      headerBorder = 'border-b-2 border-teal-700';
      tableHeadBg = 'bg-teal-900 text-teal-50';
      summaryBg = 'bg-teal-50/70 border border-teal-200';
      dueBadgeBg = 'bg-teal-700 text-white';
    } else {
      // Minimal Light
      containerBg = 'bg-white text-slate-800 border border-slate-200 shadow-xl';
      accentColor = '#2563eb';
      headerBorder = 'border-b border-slate-200';
      tableHeadBg = 'bg-slate-100 text-slate-800';
      summaryBg = 'bg-slate-50 border border-slate-200';
      dueBadgeBg = 'bg-slate-900 text-white';
    }

    // Logo source resolution
    let logoSrc = business.customLogoUrl || `/logo/${business.logoType}`;
    // If dark template and black logo selected, switch to cream/gold for contrast if needed
    if (isDark && business.logoType === 'logo-black.png') {
      logoSrc = '/logo/logo-cream.png';
    }

    const getStatusBadge = () => {
      switch (status) {
        case 'paid':
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" /> PAID IN FULL
            </span>
          );
        case 'partial':
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-500/15 text-blue-600 border border-blue-500/30">
              PARTIAL ADVANCE RECEIVED
            </span>
          );
        case 'booked':
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-500/15 text-amber-600 border border-amber-500/30">
              DATE BOOKED / CONFIRMED
            </span>
          );
        case 'overdue':
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-rose-500/15 text-rose-600 border border-rose-500/30">
              <AlertCircle className="w-3.5 h-3.5" /> OVERDUE
            </span>
          );
        default:
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-slate-500/15 text-slate-500 border border-slate-500/30">
              DRAFT ESTIMATE
            </span>
          );
      }
    };

    return (
      <div
        ref={ref}
        id="invoice-capture-node"
        className={`relative w-[800px] min-h-[1130px] p-10 md:p-12 mx-auto overflow-hidden text-sm flex flex-col justify-between ${containerBg}`}
        style={{
          boxSizing: 'border-box',
        }}
      >
        {/* Subtle Watermark if enabled */}
        {showWatermark && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.035] select-none z-0">
            <img src="/logo/logo-mark.png" alt="watermark" className="w-[500px] h-[500px] object-contain" />
          </div>
        )}

        <div className="relative z-10">
          {/* Header Section */}
          <div className={`pb-8 ${headerBorder} flex flex-row items-start justify-between gap-6`}>
            {/* Logo and Business Info */}
            <div className="flex flex-col gap-3 max-w-[480px]">
              <div className="flex items-center gap-3">
                <img
                  src={logoSrc}
                  alt={business.name}
                  className="h-16 max-w-[200px] object-contain object-left"
                  crossOrigin="anonymous"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight font-serif" style={{ color: isDark ? '#fff' : '#111' }}>
                  {business.name}
                </h1>
                <p className="text-xs uppercase tracking-widest font-semibold opacity-75 mt-0.5" style={{ color: accentColor }}>
                  {business.tagline}
                </p>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-80 mt-1">
                <span className="inline-flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-amber-500" />
                  <a href={`https://${business.website}`} target="_blank" rel="noreferrer" className="hover:underline">
                    {business.website}
                  </a>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  {business.phone}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  {business.email}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {business.address}
                </span>
              </div>
            </div>

            {/* Invoice Meta Card */}
            <div className="text-right flex flex-col items-end gap-2">
              <div className="text-3xl font-extrabold tracking-tight font-serif" style={{ color: accentColor }}>
                INVOICE
              </div>
              <div className="text-sm font-mono font-bold tracking-wider px-2.5 py-1 rounded bg-black/5 dark:bg-white/10 border border-current/10">
                #{invoiceNumber}
              </div>
              <div className="mt-1">{getStatusBadge()}</div>

              <div className="mt-2 text-xs space-y-1 opacity-80">
                <div>
                  <span className="opacity-60">Issue Date: </span>
                  <span className="font-semibold">{issueDate}</span>
                </div>
                <div>
                  <span className="opacity-60">Event / Due Date: </span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">{dueDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Client & Event Details Section */}
          <div className="my-6 p-5 rounded-xl border border-current/10 bg-black/[0.02] dark:bg-white/[0.02] grid grid-cols-2 gap-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider opacity-60 mb-1.5" style={{ color: accentColor }}>
                INVOICE TO (CLIENT)
              </p>
              <h3 className="text-base font-bold tracking-tight">{client.name || 'Valued Client'}</h3>
              <p className="text-xs opacity-80 mt-1 flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-emerald-500" /> {client.phone || 'Phone not provided'}
              </p>
              {client.email && (
                <p className="text-xs opacity-80 mt-0.5 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-blue-500" /> {client.email}
                </p>
              )}
            </div>

            <div className="border-l border-current/10 pl-6">
              <p className="text-[11px] font-bold uppercase tracking-wider opacity-60 mb-1.5" style={{ color: accentColor }}>
                EVENT INFORMATION
              </p>
              <div className="space-y-1">
                <div className="text-sm font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>{client.eventType || 'Photography Coverage'}</span>
                </div>
                <div className="text-xs opacity-80 flex items-start gap-1.5">
                  <MapPinHouse className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                  <span>{client.eventVenue || 'Rajbari / Client Location'}</span>
                </div>
                {client.notes && (
                  <p className="text-[11px] italic opacity-70 mt-1 pl-5">
                    "{client.notes}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-hidden rounded-lg border border-current/10 mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={tableHeadBg}>
                  <th className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider w-12 text-center">#</th>
                  <th className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider">Service / Package Description</th>
                  <th className="py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-center w-16">Qty</th>
                  <th className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-right w-28">Rate</th>
                  <th className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-right w-32">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-current/10 text-xs">
                {items.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-black/[0.015] dark:hover:bg-white/[0.015]">
                    <td className="py-3 px-4 text-center font-mono opacity-60 font-semibold">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-sm tracking-tight">{item.title}</div>
                      {item.description && (
                        <div className="text-[11px] opacity-75 mt-0.5 leading-relaxed font-sans">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold">{item.quantity}</td>
                    <td className="py-3 px-4 text-right font-mono font-medium opacity-90">
                      ৳{formatMoney(item.rate)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-sm">
                      ৳{formatMoney(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary & Calculations */}
          <div className="grid grid-cols-12 gap-6 items-start mb-6">
            {/* Payment Details Column */}
            <div className="col-span-7 space-y-3">
              <div className="p-4 rounded-xl border border-current/10 bg-black/[0.02] dark:bg-white/[0.02]">
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: accentColor }}>
                  PAYMENT METHODS / ACCOUNT
                </h4>
                <div className="space-y-1.5 text-xs">
                  {paymentDetails.bKashNumber && (
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-pink-600">bKash:</span>
                      <span className="font-mono font-medium">{paymentDetails.bKashNumber}</span>
                    </div>
                  )}
                  {paymentDetails.nagadNumber && (
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-orange-600">Nagad:</span>
                      <span className="font-mono font-medium">{paymentDetails.nagadNumber}</span>
                    </div>
                  )}
                  {paymentDetails.bankDetails && (
                    <div className="pt-1 text-[11px] opacity-80 border-t border-current/10">
                      <span className="font-semibold block mb-0.5">Bank Transfer:</span>
                      <span>{paymentDetails.bankDetails}</span>
                    </div>
                  )}
                  {paymentDetails.notes && (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium pt-1 italic">
                      * {paymentDetails.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms Preview */}
              <div className="p-3.5 rounded-lg border border-current/10 text-[10.5px] opacity-80 space-y-1">
                <p className="font-bold uppercase tracking-wider text-[10px]" style={{ color: accentColor }}>
                  TERMS & CONDITIONS:
                </p>
                <ul className="list-disc pl-4 space-y-0.5 leading-snug">
                  {terms.slice(0, 4).map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Totals Summary Column */}
            <div className="col-span-5">
              <div className={`p-4 rounded-xl ${summaryBg} space-y-2.5 text-xs`}>
                <div className="flex justify-between items-center opacity-80">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold">৳{formatMoney(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                    <span>
                      Discount {discountType === 'percentage' ? `(${discountValue}%)` : ''}:
                    </span>
                    <span className="font-mono font-semibold">- ৳{formatMoney(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center font-bold text-sm pt-2 border-t border-current/15">
                  <span>Total Amount:</span>
                  <span className="font-mono text-base">৳{formatMoney(grandTotal)}</span>
                </div>

                <div className="flex justify-between items-center text-blue-600 dark:text-blue-400 font-medium">
                  <span>Advance Received:</span>
                  <span className="font-mono font-semibold">৳{formatMoney(advancePaid)}</span>
                </div>

                <div className={`mt-3 p-3 rounded-lg flex justify-between items-center ${dueBadgeBg}`}>
                  <span className="font-bold tracking-wide uppercase text-xs">
                    {balanceDue === 0 ? 'STATUS:' : 'BALANCE DUE:'}
                  </span>
                  <span className="font-mono text-lg font-black tracking-tight">
                    {balanceDue === 0 ? 'FULLY PAID' : `৳${formatMoney(balanceDue)}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer & Signature Section */}
        <div className="relative z-10 pt-6 mt-4 border-t border-current/10">
          <div className="flex items-end justify-between">
            <div className="text-[11px] opacity-75 space-y-0.5">
              <p className="font-bold tracking-wide uppercase" style={{ color: accentColor }}>
                Thank you for choosing {business.name}!
              </p>
              <p>For inquiries & support: {business.phone} | {business.email}</p>
              <p className="opacity-60">Official Portfolio: <span className="underline">{business.website}</span></p>
            </div>

            <div className="text-center w-56">
              <div className="h-10 border-b border-dashed border-current/30 flex items-end justify-center pb-1">
                <span className="font-serif italic text-lg opacity-80 tracking-wide text-amber-600 dark:text-amber-400">
                  {signatureName}
                </span>
              </div>
              <p className="text-xs font-bold mt-1.5 uppercase tracking-wider">{signatureName}</p>
              <p className="text-[10px] opacity-65 font-medium">{signatureTitle}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';
