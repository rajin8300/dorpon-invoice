import { InvoiceData, PackageItem } from '../types/invoice';

export const DEFAULT_TERMS: string[] = [
  'Booking confirmation requires 50% advance payment.',
  'Remaining balance must be cleared on event day before wrap-up.',
  'All edited high-resolution photos delivered within 15-21 working days.',
  'Cinematic 4K teaser & full highlights delivered within 30-40 working days.',
  'Raw files delivered via Portable SSD or Cloud Drive link.',
  'Travel, food, and accommodation outside Rajbari to be borne by client.'
];

export const INITIAL_PACKAGES: PackageItem[] = [
  {
    id: 'pkg-1',
    title: 'Full Day Wedding Photography (Premium)',
    description: '2 Senior Photographers, Unlimited Raw Shots, 100+ Master Edited High-Res Photos, Stage & Candid Coverage',
    rate: 22000,
    category: 'Wedding',
    isCustom: false,
  },
  {
    id: 'pkg-2',
    title: 'Cinematic Wedding Teaser & Film (4K)',
    description: '2 Cinematographers, Gimbal & Prime Lenses, 1-2 Min Instagram Teaser + 10-15 Min 4K Cinematic Highlights Film',
    rate: 25000,
    category: 'Cinematography',
    isCustom: false,
  },
  {
    id: 'pkg-3',
    title: 'Gaye Holud / Mehendi Night Package',
    description: '1 Senior Photographer + 1 Cinematographer, 4-5 Hours Event Coverage, Color Graded Reel & Photos',
    rate: 15000,
    category: 'Holud',
    isCustom: false,
  },
  {
    id: 'pkg-4',
    title: 'Reception Evening Grand Coverage',
    description: '2 Photographers + 1 Cinematographer, Stage, Couple & Guest Portraits, 80+ Retouched Photos',
    rate: 18000,
    category: 'Reception',
    isCustom: false,
  },
  {
    id: 'pkg-5',
    title: 'Exclusive Pre/Post Wedding Couple Shoot',
    description: 'Stylized outdoor couple portrait session, 30 Fine Art Retouched Magazine-Style Photos',
    rate: 10000,
    category: 'Portrait',
    isCustom: false,
  },
  {
    id: 'pkg-6',
    title: 'Exclusive Flush Mount Photo Album (12x24 inch)',
    description: '30 Pages Hardbound, Velvet/Leatherette Box, Metallic Lamination, Archival Silk Paper',
    rate: 8000,
    category: 'Album',
    isCustom: false,
  },
  {
    id: 'pkg-7',
    title: '4K Drone Aerial Cinematography',
    description: 'FAA Certified Aerial Pilot, Venue Bird-Eye Views, Cinematic Flyover Angles & Ceremony Entrance',
    rate: 7000,
    category: 'Drone',
    isCustom: false,
  },
  {
    id: 'pkg-8',
    title: 'Traditional Long Ceremony Video Coverage',
    description: 'Full unedited ceremony recording with high-fidelity lapel audio, delivered in 1080p HD',
    rate: 12000,
    category: 'Video',
    isCustom: false,
  }
];

export const SERVICE_PRESETS = INITIAL_PACKAGES;


export const LOGO_OPTIONS = [
  { id: 'logo-gold.png', label: 'Gold Logo (Transparent)', src: '/logo/logo-gold.png', type: 'gold' },
  { id: 'logo-black.png', label: 'Dark Logo (Transparent)', src: '/logo/logo-black.png', type: 'dark' },
  { id: 'logo-cream.png', label: 'Cream Logo (Transparent)', src: '/logo/logo-cream.png', type: 'light' },
  { id: 'logo-white.png', label: 'White Logo (Transparent)', src: '/logo/logo-white.png', type: 'light' },
  { id: 'logo-mark.png', label: 'Icon Mark', src: '/logo/logo-mark.png', type: 'mark' },
  { id: 'Darpon-01.png', label: 'Original Lockup 1', src: '/logo/Darpon-01.png', type: 'full' },
  { id: 'Darpon-02.png', label: 'Original Lockup 2', src: '/logo/Darpon-02.png', type: 'full' },
];

export const getInitialInvoiceData = (): InvoiceData => {
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setDate(today.getDate() + 14);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  const randomNum = Math.floor(100 + Math.random() * 900);
  const currentYear = today.getFullYear();

  return {
    id: `inv_${Date.now()}`,
    invoiceNumber: `DP-${currentYear}-${randomNum}`,
    issueDate: formatDate(today),
    dueDate: formatDate(nextMonth),
    status: 'booked',
    template: 'luxury-gold',
    currency: 'BDT ৳',
    business: {
      name: 'দর্পণ — Dorpon',
      tagline: 'Photography & Cinematography',
      website: 'rajinmd.com',
      phone: '01740-744170',
      email: 'contact@rajinmd.com',
      address: 'Rajbari, Faridpur, Dhaka',
      facebook: 'facebook.com/dorpon830',
      instagram: '@rajin.830',
      logoType: 'logo-gold.png',
    },
    client: {
      name: 'Nafis & Sadia Wedding',
      phone: '01812-345678',
      email: 'client@gmail.com',
      eventType: 'Wedding & Reception Coverage',
      eventDate: formatDate(nextMonth),
      eventVenue: 'Officers Club Banquet Hall, Rajbari',
      notes: 'Stage setup & outdoor sunset couple portrait session included.',
    },
    items: [
      {
        id: '1',
        title: 'Full Day Wedding Photography (Premium)',
        description: '2 Senior Photographers, full ceremony coverage, 100+ master retouched photos, unlimited raw shots',
        quantity: 1,
        rate: 22000,
        total: 22000,
      },
      {
        id: '2',
        title: 'Cinematic Wedding Teaser & Film (4K)',
        description: '2 Cinematographers, prime lenses + gimbal, 1 min Instagram reel + 12 min highlights film',
        quantity: 1,
        rate: 25000,
        total: 25000,
      },
      {
        id: '3',
        title: 'Exclusive Flush Mount Photo Album (12x24 inch)',
        description: '30 Pages flush mount album, leatherette box, metallic archival paper',
        quantity: 1,
        rate: 8000,
        total: 8000,
      }
    ],
    discountType: 'flat',
    discountValue: 3000,
    advancePaid: 25000,
    terms: [...DEFAULT_TERMS],
    signatureName: 'Rajin Ahamed',
    signatureTitle: 'Founder & Lead Cinematographer',
    paymentDetails: {
      bankName: 'BRAC Bank',
      bankAccountName: 'Rajin Traders',
      bankAccountNumber: '2054833740001',
      bankBranch: 'Rajbari',
      bankDistrict: 'Rajbari',
      bKashNumber: '01740-744170 (Personal)',
      nagadNumber: '01740-744170 (Personal)',
      rocketNumber: '01740-744170-4',
      notes: 'Please share payment screenshot / transaction ID on WhatsApp (+880 1740-744170) for instant confirmation.'
    },
    showWatermark: false
  };
};
