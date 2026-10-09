// Long-form case-study sections, read only by scripts/pages.mjs (kept out of the client bundle).
// These are self-initiated concepts: describe the thinking and the build, never invented results.
export const stories = {
  'aurum-estates': [
    ['The challenge in detail', 'Selling a home that does not exist yet is a trust problem. Buyers of residences at this level are used to private tours, not brochures, and most of them live abroad. They need to understand light, scale and view before they will even book a flight. A conventional property site with renders and a PDF would put Aurum in the same pile as every other off-plan launch.'],
    ['Design direction', 'We kept the interface almost silent: warm stone colours, generous space and serif headlines that feel like an architect\'s monograph. The 3D tours carry the emotion. Each residence is lit for golden hour, and the camera moves at walking pace so the space feels real rather than like a video game.'],
    ['How it works', 'Every residence loads as a compressed real-time model that runs smoothly on a laptop and falls back to a guided video on older phones. Buyers can move room by room, switch between day and evening light, and save favourite views. Each enquiry is scored on budget, timeline and residence interest, then passed to the right sales concierge with a private-viewing slot already proposed.'],
    ['What this concept shows', 'Real-time 3D can replace the first site visit for premium property, and automation can make sure every serious enquiry gets a personal reply within minutes. The same approach suits villa projects, plotted developments and hospitality launches across India.'],
  ],
  'noir-atelier': [
    ['The challenge in detail', 'Fragrance is bought through the nose, which a website cannot reach. Noir Atelier\'s boutiques relied on staff guiding customers through notes and memories. Online, a bottle on a white background says nothing about the scent, and at this price customers need a reason to trust what they cannot smell.'],
    ['Design direction', 'Black lacquer, cream type and a single deep red: the store borrows the restraint of the boutique. Each fragrance gets an editorial page with its notes written as a short story, so customers choose a mood rather than a list of ingredients.'],
    ['How it works', 'A custom Shopify Plus theme built from a blank page, with a 3D bottle customers can turn and uncork. A discovery set of small samples is the entry product: once it ships, a Klaviyo sequence follows up with tasting notes and a credit towards a full bottle, turning a low-risk first order into a confident second one.'],
    ['What this concept shows', 'Premium products that are hard to judge online sell through storytelling and a low-risk first step. The same structure works for skincare, tea, coffee and other sensory products, including Indian D2C brands selling nationwide.'],
  ],
  'vanta-motors': [
    ['The challenge in detail', 'A car reveal happens once. The site has to hold up while a livestream sends a wave of visitors at the same moment, explain an unfamiliar electric car in seconds, and take a paid reservation before the excitement fades. A slow page or a broken checkout on launch night cannot be fixed later.'],
    ['Design direction', 'Dark, cinematic and fast: the car is the hero, lit like a studio shoot, with a countdown that turns into the configurator the moment the reveal happens. Copy is short and confident, with the key numbers (range, acceleration and price) always one glance away.'],
    ['How it works', 'The configurator renders paint, wheels and interior in real time in the browser. Static pages and assets are served from the edge so traffic spikes do not slow the site, and the reservation flow takes a deposit in two steps with a confirmation that is ready to share on social media.'],
    ['What this concept shows', 'Launches need speed, spectacle and a frictionless way to commit. The same pattern fits product drops, real-estate launches and event ticketing, wherever demand arrives all at once.'],
  ],
  'halcyon-clinics': [
    ['The challenge in detail', 'Five clinics, three channels and one tired front desk. Enquiries arrived on Instagram, WhatsApp and the website at all hours, many of them asking the same questions about treatments, prices and availability. Slow replies meant valuable consultations went to faster competitors.'],
    ['Design direction', 'Calm and clinical: soft stone colours, clear type and plenty of space, so the brand feels trustworthy rather than salesy. The content system gives every post the same quiet confidence, with templates the clinic team can use themselves.'],
    ['How it works', 'An AI assistant answers common questions from approved information only, collects the details a consultant needs, and books consultations straight into the clinic calendar. Anything medical or unusual is handed to a person immediately. Every conversation lands in one shared inbox, and a monthly dashboard shows enquiries, bookings and response times by channel.'],
    ['What this concept shows', 'Automation does not have to feel robotic: it can make a premium service feel more attentive by answering instantly and giving staff their time back. The same setup suits dental and dermatology practices, salons, coaching institutes and real-estate teams.'],
  ],
  'kairos-horology': [
    ['The challenge in detail', 'Collectors buy fine watches on detail: the finishing of the movement, the bevels, the way the balance wheel moves. Photographs flatten all of it. With only 150 pieces a year, the brand also needed a fair way to allocate each release without a website crash or a queue of disappointed collectors.'],
    ['Design direction', 'Warm blacks, brass accents and editorial typography, like a fine watch catalogue. Product pages lead with craft: the hours of hand-finishing, the materials and the maker, before the price.'],
    ['How it works', 'A Shopify storefront with a macro 3D viewer: collectors can open the caseback and watch the movement beat, built from Blender models optimised for the web. Releases use an allocation system: collectors register interest, the brand reviews requests, and invited buyers receive a private checkout link.'],
    ['What this concept shows', 'Limited, high-value products need more than a standard store: a way to show craft and a fair way to sell scarce stock. The approach fits jewellery, art editions and handmade luxury goods.'],
  ],
  'solace-resorts': [
    ['The challenge in detail', 'On booking platforms, a three-villa property is one listing among thousands, compared on price next to hotels half its rate, while the platform keeps a large share of every booking. Solace needed guests to discover it, fall for it and book directly.'],
    ['Design direction', 'Sunlit, unhurried and coastal: full-bleed photography and video, terracotta accents and motion that drifts like the tide. The site sells the stay (the view, the food, the quiet) before it shows a room rate.'],
    ['How it works', 'A direct-booking engine connected to the property management system keeps availability accurate. A short-form video series filmed on location feeds Instagram and links back to the site. After booking, an automated journey sends directions, arrival details and offers for private dinners and experiences.'],
    ['What this concept shows', 'Small luxury properties can win direct bookings with a site that feels like the place itself and content that keeps them in front of travellers. The same approach suits resorts, homestays and boutique hotels across Uttarakhand.'],
  ],
}
