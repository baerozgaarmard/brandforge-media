// Concept projects: fictional brands, self-initiated work showing BrandForge's range.
// Replace (or prepend) real client work as it lands; everything renders from this list.
export const projects = [
  {
    slug: 'aurum-estates',
    name: ['Aurum', 'Estates'],
    tags: '3D Web · Automation',
    sector: 'Luxury real estate',
    palette: { bg: '#141a17', fg: '#d9c8a3', accent: '#b89b5e' },
    brief: 'A private developer selling eight $12M+ residences before ground breaks. Buyers fly in from four continents, so the sale has to happen before anyone can walk the property.',
    approach: 'We built a real-time 3D walkthrough of every residence, lit for golden hour and <em>explorable room by room</em> in the browser, then wired enquiries into a concierge pipeline that books private viewings automatically.',
    deliverables: ['Immersive WebGL property tours', 'Brand identity refresh', 'Lead scoring + CRM automation', 'Private-viewing booking flow'],
    scope: [['Timeline', '14 weeks'], ['Team', '6 specialists'], ['Stack', 'Three.js · HubSpot · Make']],
  },
  {
    slug: 'noir-atelier',
    name: ['Noir', 'Atelier'],
    tags: 'Shopify · 3D',
    sector: 'Niche fragrance',
    palette: { bg: '#0b0b0c', fg: '#ece6dc', accent: '#8e1b1b' },
    brief: 'A Parisian perfume house moving from boutiques to global direct-to-consumer, at €240 a bottle. Fragrance is impossible to smell online, so the store had to sell the feeling instead.',
    approach: 'A custom Shopify Plus flagship where each scent is a <em>3D bottle you can turn and uncork</em>, paired with scent-note storytelling, gifting flows and a discovery-set funnel.',
    deliverables: ['Shopify Plus custom theme', '3D bottle configurator', 'Discovery-set funnel', 'Klaviyo lifecycle flows'],
    scope: [['Timeline', '12 weeks'], ['Team', '5 specialists'], ['Stack', 'Shopify Plus · Three.js · Klaviyo']],
  },
  {
    slug: 'vanta-motors',
    name: ['Vanta', 'Motors'],
    tags: '3D Web · Launch',
    sector: 'Electric performance cars',
    palette: { bg: '#0b0707', fg: '#f0e6e4', accent: '#e0312a' },
    brief: 'An electric grand-tourer revealed to the world in a single night, with a $1,000 reservation fee and a waitlist that had to convert while the livestream was still running.',
    approach: 'A cinematic launch site with a <em>real-time car configurator</em>: paint, wheels and interior rendered live, a countdown-to-reveal mode, and one-tap reservations built for traffic spikes.',
    deliverables: ['WebGL car configurator', 'Launch-night microsite', 'Reservation + deposit flow', 'Social launch films'],
    scope: [['Timeline', '16 weeks'], ['Team', '8 specialists'], ['Stack', 'Three.js · GSAP · Stripe']],
  },
  {
    slug: 'halcyon-clinics',
    name: ['Halcyon', 'Clinics'],
    tags: 'Automation · Social',
    sector: 'Premium aesthetic clinics',
    palette: { bg: '#e9e3da', fg: '#1d2a2a', accent: '#6f8f86' },
    brief: 'A group of five premium clinics where front-desk staff spent more time answering DMs than looking after patients, and consultations worth $3–8K slipped through the cracks.',
    approach: 'An AI concierge that answers enquiries across Instagram, WhatsApp and web, <em>qualifies and books consultations</em>, and feeds a calm, clinical content system across every channel.',
    deliverables: ['AI booking concierge', 'Omnichannel inbox automation', 'Content system + templates', 'Monthly reporting dashboard'],
    scope: [['Timeline', '10 weeks'], ['Team', '4 specialists'], ['Stack', 'OpenAI · Make · Meta API']],
  },
  {
    slug: 'kairos-horology',
    name: ['Kairos', 'Horology'],
    tags: 'Shopify · 3D · Social',
    sector: 'Independent watchmaking',
    palette: { bg: '#15110d', fg: '#f1e7d6', accent: '#c7924a' },
    brief: 'A watchmaker releasing 150 hand-finished pieces a year at $9,500 each. Collectors buy on detail, and a flat product photo shows none of the 200 hours inside each watch.',
    approach: 'A Shopify storefront built around a <em>macro 3D movement viewer</em>: collectors can open the caseback and watch the balance wheel beat, with allocation-based drops for each release.',
    deliverables: ['Shopify storefront', '3D movement viewer', 'Allocation drop system', 'Macro content series'],
    scope: [['Timeline', '12 weeks'], ['Team', '5 specialists'], ['Stack', 'Shopify · Three.js · Blender']],
  },
  {
    slug: 'solace-resorts',
    name: ['Solace', 'Resorts'],
    tags: 'Web · Social · Automation',
    sector: 'Boutique hospitality',
    palette: { bg: '#1c2621', fg: '#efe8dc', accent: '#d58a5b' },
    brief: 'Three cliffside villas at $2,400 a night, leaning on booking platforms that took 18% of every stay and let guests compare them to hotels half the price.',
    approach: 'An immersive direct-booking site that <em>moves like the coastline</em>, a short-form content engine filmed on location, and automated pre-arrival journeys that upsell private experiences.',
    deliverables: ['Immersive booking website', 'Direct-booking engine', 'Reels content engine', 'Guest journey automation'],
    scope: [['Timeline', '11 weeks'], ['Team', '6 specialists'], ['Stack', 'Webflow · Cloudbeds · Make']],
  },
]

// Brand-coloured cover with the site design in a browser frame (designs: /mockups, rendered to /public/shots).
export const cover = (p) => `
  <div class="cover" style="--bg:${p.palette.bg};--fg:${p.palette.fg};--ac:${p.palette.accent}">
    <span class="cover__meta mono">${p.sector}</span>
    <div class="shot">
      <div class="shot__bar"><i></i><i></i><i></i><span>${p.name.join('').toLowerCase()}.com</span></div>
      <img src="/shots/${p.slug}.webp" alt="${p.name.join(' ')} website design" loading="lazy" />
    </div>
    <span class="cover__meta cover__meta--end mono">Concept · 2026</span>
  </div>`
