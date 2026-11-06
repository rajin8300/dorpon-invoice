import { InvoiceData, InvoiceItem } from '../types/invoice';

export const DEFAULT_TERMS: string[] = [
  'Booking is confirmed upon receiving 50% advance payment.',
  'Remaining balance must be cleared on the event day before leaving the venue.',
  'All edited photos will be delivered within 15-21 working days.',
  'Cinematic teaser & video highlights will be delivered within 30-40 working days.',
  'Raw / unedited files will be provided via Cloud Drive / Portable SSD provided by client.',
  'Travel, food, and lodging costs outside Rajbari are to be covered by the client.'
];

export const SERVICE_PRESETS: { title: string; desc: string; rate: number }[] = [
  {
    title: 'Full Day Wedding Photography (Premium)',
    desc: '2 Senior Photographers, Unlimited Raw Shots, 100+ Master Edited High-Res Photos',
    rate: 22000
  },
  {
    title: 'Cinematic Wedding Teaser & Film (4K)',
    desc: '2 Cinematographers, Gimbal & Prime Lenses, 1-2 Min Teaser + 10-15 Min Cinematic Highlights',
    rate: 25000
  },
  {
    title: 'Gaye Holud / Mehendi Night Coverage',
    desc: '1 Senior Photographer + 1 Cinematographer, 4-5 hours coverage, Event Highlights Reel',
    rate: 15000
  },
  {
    title: 'Reception Evening Package',
    desc: '2 Photographers + 1 Cinematographer, Stage & Candid coverage, 60+ Edited Photos',
    rate: 18000
  },
  {
    title: 'Exclusive Couple Portrait Session',
    desc: 'Pre/Post wedding outdoor/indoor stylized shoot, 30 Fine Art Retouched Photos',
    rate: 10000
  },
  {
    title: 'Premium Photo Album (12x24 inch)',
    desc: '20 Pages Hardbound, Velvet/Leatherette Cover, Waterproof Metallic Lamination',
    rate: 8000
  },
  {
    title: '4K Drone / Aerial Cinematography',
    desc: 'FAA certified pilot, Venue & Event bird-eye footage, cinematic flyovers',
    rate: 7000
  },
  {
    title: 'Traditional Long Video Coverage',
    desc: 'Complete ceremony recording with crisp audio feed, delivered in 1080p Full HD',
    rate: 12000
  }
];

export const LOGO_OPTIONS = [
  { id: 'logo-black.png', label: 'Dark Logo (Transparent)', src: '/logo/logo-black.png', type: 'dark' },
  { id: 'logo-gold.png', label: 'Gold Logo (Transparent)', src: '/logo/logo-gold.png', type: 'gold' },
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
      address: 'Rajbari, Bangladesh',
      facebook: 'facebook.com/dorpon830',
      instagram: '@rajin.830',
      logoType: 'logo-black.png',
    },
    client: {
      name: 'Nafis & Sadia Wedding',
      phone: '01812-345678',
      email: 'nafis.wed@gmail.com',
      eventType: 'Wedding & Reception Coverage',
      eventDate: formatDate(nextMonth),
      eventVenue: 'Rajbari Officers Club Banquet Hall',
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
        title: 'Premium Photo Album (12x24 inch)',
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
      bKashNumber: '01740-744170 (Personal / Send Money)',
      nagadNumber: '01740-744170 (Personal)',
      rocketNumber: '01740-744170-4',
      bankDetails: 'City Bank Ltd. | A/C: 1502... | Branch: Rajbari',
      notes: 'Please share transaction ID or screenshot after payment for instant receipt confirmation.'
    },
    showWatermark: false
  };
};
