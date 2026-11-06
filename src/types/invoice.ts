export type InvoiceStatus = 'draft' | 'booked' | 'partial' | 'paid' | 'overdue';

export type TemplateTheme = 'minimal-light' | 'luxury-gold' | 'cinematic-dark' | 'royal-classic';

export interface InvoiceItem {
  id: string;
  title: string;
  description?: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface BusinessInfo {
  name: string;
  tagline: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  logoType: string;
  customLogoUrl?: string;
}

export interface ClientInfo {
  name: string;
  phone: string;
  email?: string;
  eventType: string;
  eventDate: string;
  eventVenue: string;
  notes?: string;
}

export interface PaymentDetails {
  bKashNumber: string;
  nagadNumber: string;
  rocketNumber?: string;
  bankDetails: string;
  notes: string;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  template: TemplateTheme;
  currency: string;
  business: BusinessInfo;
  client: ClientInfo;
  items: InvoiceItem[];
  discountType: 'percentage' | 'flat';
  discountValue: number;
  advancePaid: number;
  terms: string[];
  signatureName: string;
  signatureTitle: string;
  paymentDetails: PaymentDetails;
  showWatermark?: boolean;
}
