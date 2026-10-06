// One place for business details and editable content.
export const business = {
  name: "SL Cleaning Services",
  phone: "(562) 507-2586",
  phoneHref: "+15625072586",
  // Tip: switch to an address on your own domain, e.g. hello@slcleaningservices.online
  email: "lscleaningservices1845@gmail.com",
  url: "https://slcleaningservices.online",
  // Paste your Google review link here to show a "Review us on Google" button.
  googleReviewUrl: "",
};

export const images = {
  hero: "/Living_Room_cleaned.webp",
  about: "/kitchen_cleaned.webp",
};

export const cities = [
  { name: "Los Angeles", slug: "los-angeles", county: "Los Angeles County" },
  { name: "Long Beach", slug: "long-beach", county: "Los Angeles County" },
  { name: "Pasadena", slug: "pasadena", county: "Los Angeles County" },
  { name: "Torrance", slug: "torrance", county: "Los Angeles County" },
  { name: "Glendale", slug: "glendale", county: "Los Angeles County" },
  { name: "Anaheim", slug: "anaheim", county: "Orange County" },
  { name: "Irvine", slug: "irvine", county: "Orange County" },
  { name: "Santa Ana", slug: "santa-ana", county: "Orange County" },
  { name: "Huntington Beach", slug: "huntington-beach", county: "Orange County" },
  { name: "Costa Mesa", slug: "costa-mesa", county: "Orange County" },
];

// Add real customer reviews here. The section stays hidden while this list is empty.
// Example: { name: "Maria G.", area: "Long Beach", text: "Exactly what I asked for." }
export const testimonials = [];

// Work photos shown when someone taps "Look at our work" on a service card.
// Keys match the service page slugs below.
// Each item: { before, after, caption, captionEs }. "before" is optional.
// (Later, the admin panel will supply these instead of this list.)
// Each service has its own page at /<slug> (e.g. slcleaningservices.online/residential).
export const servicePages = [
  { slug: "residential", title: "Residential Cleaning", description: "A dependable clean for kitchens, bathrooms, bedrooms, living spaces, and the details that make your home feel fresh." },
  { slug: "deep-cleaning", title: "Deep Cleaning", description: "A more detailed clean for homes that need extra attention, including hard-to-reach areas and built-up dirt." },
  { slug: "move-in-move-out", title: "Move-In / Move-Out", description: "Get your space ready for the next chapter with a thorough clean before moving in or handing over the keys." },
  { slug: "commercial", title: "Commercial Cleaning", description: "Professional cleaning support for offices and other commercial spaces that need a clean, presentable environment." },
];

export const work = {
  // Gallery photos are managed in the admin panel (Vercel Blob).
  // Do not add static images here — use admin.slcleaningservices.online
  residential: [],
  "deep-cleaning": [],
  "move-in-move-out": [],
  commercial: [],
};

// Add your own policies here (supplies, cancellations, pets, payment, insurance).
// Each item has English (q, a) and Spanish (es: { q, a }) text.
export const faqs = [
  {
    q: "How do I get a quote?",
    a: "Fill out the quote form on this page, call, or text us. Tell us about your space and the cleaning you need, and we'll get back to you with next steps.",
    es: { q: "¿Cómo pido una cotización?", a: "Llena el formulario de cotización de esta página, llámanos o escríbenos. Cuéntanos sobre tu espacio y la limpieza que necesitas, y te responderemos con los siguientes pasos." },
  },
  {
    q: "Which areas do you serve?",
    a: "We serve all of Los Angeles County and all of Orange County. If you're outside those areas, contact us and we'll see if we can make it work.",
    es: { q: "¿Qué zonas atienden?", a: "Atendemos todo el condado de Los Ángeles y todo el condado de Orange. Si estás fuera de esas zonas, contáctanos y vemos si podemos atenderte." },
  },
  {
    q: "What types of cleaning do you offer?",
    a: "Residential cleaning, deep cleaning, move-in and move-out cleaning, and commercial cleaning for offices and other spaces.",
    es: { q: "¿Qué tipos de limpieza ofrecen?", a: "Limpieza residencial, limpieza profunda, limpieza de mudanza (entrada y salida) y limpieza comercial para oficinas y otros espacios." },
  },
  {
    q: "Can I schedule cleanings on a regular basis?",
    a: "Yes. The quote form lets you choose one time, weekly, every 2 weeks, or monthly.",
    es: { q: "¿Puedo programar limpiezas de forma regular?", a: "Sí. En el formulario de cotización puedes elegir una sola vez, cada semana, cada 2 semanas o cada mes." },
  },
];
