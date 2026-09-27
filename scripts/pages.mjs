// Generates static, crawlable pages (case studies, services, journal) + sitemap. Runs before every build.
import fs from 'node:fs'
import { projects } from '../src/projects.js'
import { services, posts } from '../src/content.js'
import { locations } from '../src/locations.js'

const SITE = 'https://brandforge-media.vercel.app'
const PHONE = '+91-93112-67085'
const inr = (n) => '₹' + n.toLocaleString('en-IN')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const strip = (s) => s.replace(/<[^>]+>/g, '')

const page = ({ path, title, desc, body, ld = [] }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="canonical" href="${SITE}${path}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="BrandForge" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${SITE}${path}" />
  <meta property="og:image" content="${SITE}/og.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="theme-color" content="#0e0d0c" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&family=Geist+Mono:wght@400&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/src/style.css" />
${ld.map((j) => `  <script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>
<body>
  <div class="grain" aria-hidden="true"></div>
  <div class="cursor" aria-hidden="true"></div>
${fs.readFileSync('partials/header.html', 'utf8')}
  <main>
${body}
  </main>
${fs.readFileSync('partials/footer.html', 'utf8')}
  <script type="module" src="/src/main.js"></script>
</body>
</html>
`
const crumbs = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + path })) })
const head = (label, [a, b]) => `    <section class="page-head grid">
      <p class="mono"><span>(${label})</span></p>
      <h1 class="page-title lines"><span class="line"><span>${a}</span></span><span class="line"><span><em>${b}</em></span></span></h1>
    </section>`
const prose = (sections) => sections.map(([h, p], i) => `    <section class="case grid">
      <h2 class="mono case__label"><span>(0${i + 1})</span> ${h}</h2>
      <p class="case__text">${p}</p>
    </section>`).join('\n')
const write = (file, html) => { fs.mkdirSync(file.split('/').slice(0, -1).join('/'), { recursive: true }); fs.writeFileSync(file, html) }
const urls = ['/', '/work.html', '/journal/']

// case studies
projects.forEach((p, i) => {
  const next = projects[(i + 1) % projects.length], path = `/work/${p.slug}.html`
  urls.push(path)
  write(`work/${p.slug}.html`, page({
    path, title: `${p.name.join(' ')} — ${p.sector} concept · BrandForge`, desc: strip(p.brief),
    ld: [crumbs([['Home', '/'], ['Work', '/work.html'], [p.name.join(' '), path]]),
      { '@context': 'https://schema.org', '@type': 'CreativeWork', name: `${p.name.join(' ')} (concept)`, creator: { '@type': 'Organization', name: 'BrandForge' }, genre: p.tags, image: `${SITE}/shots/${p.slug}.webp`, description: strip(p.brief) }],
    body: `    <div class="case-page" data-slug="${p.slug}">
    <section class="page-head grid">
      <p class="mono"><span>(Concept)</span> ${p.tags}</p>
      <h1 class="page-title lines"><span class="line"><span>${p.name[0]}</span></span><span class="line"><span><em>${p.name[1]}</em></span></span></h1>
      <dl class="facts mono">
        <div><dt>Sector</dt><dd>${p.sector}</dd></div><div><dt>Year</dt><dd>2026</dd></div><div><dt>Type</dt><dd>Self-initiated concept</dd></div>
      </dl>
    </section>
    <div class="case-cover" data-slot="cover"></div>
${prose([['The brief', p.brief], ['Our approach', p.approach]])}
    <section class="case grid">
      <h2 class="mono case__label"><span>(03)</span> Deliverables</h2>
      <ul class="deliverables">${p.deliverables.map((d) => `<li>${d}</li>`).join('')}</ul>
    </section>
    <section class="stats grid">${p.scope.map(([k, v]) => `<p><strong>${v}</strong><span class="mono">${k}</span></p>`).join('')}</section>
    <a class="next grid" href="/work/${next.slug}.html" data-cursor="Next"><span class="mono">Next project</span><strong class="next__title">${next.name[0]} <em>${next.name[1]}</em></strong></a>
    </div>`,
  }))
})

// services
services.forEach((s) => {
  const path = `/services/${s.slug}.html`
  urls.push(path)
  write(`services/${s.slug}.html`, page({
    path, title: s.metaTitle, desc: s.metaDesc,
    ld: [crumbs([['Home', '/'], ['Services', '/#services'], [s.nav, path]]),
      { '@context': 'https://schema.org', '@type': 'Service', name: s.metaTitle.split(' — ')[0], description: s.metaDesc, provider: { '@type': 'Organization', name: 'BrandForge', url: SITE, telephone: PHONE }, areaServed: 'IN',
        ...(s.price && { offers: { '@type': 'Offer', name: s.price.label, priceCurrency: 'INR', priceSpecification: { '@type': 'PriceSpecification', minPrice: s.price.from, priceCurrency: 'INR' }, url: SITE + path } }) },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: s.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }],
    body: `${head(`Services · ${s.nav}`, s.title)}
    <section class="case grid"><p class="case__text case__lead">${s.intro}</p></section>
${s.price ? `    <section class="stats grid"><p><strong>From ${inr(s.price.from)}</strong><span class="mono">${s.price.label}</span></p></section>
` : ''}${prose(s.sections)}
    <section class="case grid">
      <h2 class="mono case__label"><span>(0${s.sections.length + 1})</span> What you get</h2>
      <ul class="deliverables">${s.deliverables.map((d) => `<li>${d}</li>`).join('')}</ul>
    </section>
    <section class="stats grid">${s.process.map(([k, v], i) => `<p><strong>0${i + 1} ${k}</strong><span class="mono">${v}</span></p>`).join('')}</section>
    <section class="case grid faq">
      <h2 class="mono case__label"><span>(FAQ)</span> Common questions</h2>
      <div class="faq__list">${s.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
    </section>
    <a class="next grid" href="/#contact" data-cursor="Talk"><span class="mono">Start a ${s.nav} project</span><strong class="next__title">Let's <em>talk</em></strong></a>`,
  }))
})

// India: hub + one page per city
urls.push('/india/')
write('india/index.html', page({
  path: '/india/', title: 'Website Design, Shopify & Automation Agency in India — BrandForge',
  desc: 'BrandForge works with businesses across India: 3D websites, Shopify stores, automation and social content for brands in Dehradun, Delhi NCR, Mumbai, Pune, Bengaluru, Hyderabad and Chennai.',
  ld: [crumbs([['Home', '/'], ['India', '/india/']])],
  body: `${head('India', ['Working with brands', 'across India'])}
    <section class="case grid"><p class="case__text case__lead">From the hills of Uttarakhand to the D2C brands of Bengaluru, we build websites, stores and systems for Indian businesses that want to look world-class.</p></section>
    <ol class="rows">${locations.map((l, i) => `<li><a class="row grid" href="/india/${l.slug}.html"><span class="mono">0${i + 1}</span><strong>${l.city}</strong><span class="mono">${l.region}</span><span class="mono">→</span></a></li>`).join('')}</ol>`,
}))
locations.forEach((l) => {
  const path = `/india/${l.slug}.html`
  urls.push(path)
  write(`india/${l.slug}.html`, page({
    path, title: l.metaTitle, desc: l.metaDesc,
    ld: [crumbs([['Home', '/'], ['India', '/india/'], [l.city, path]]),
      { '@context': 'https://schema.org', '@type': 'ProfessionalService', name: `BrandForge — ${l.city}`, url: SITE + path, description: l.metaDesc, email: 'brandforgemediaa@gmail.com', telephone: PHONE, priceRange: '₹18,000+', areaServed: { '@type': 'City', name: l.city } },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: l.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }],
    body: `${head(`Website design &amp; digital marketing · ${l.city}`, l.title)}
    <section class="case grid"><p class="case__text case__lead">${l.intro}</p></section>
${prose(l.sections)}
    <section class="case grid">
      <h2 class="mono case__label"><span>(0${l.sections.length + 1})</span> Services in ${l.city}</h2>
      <ul class="deliverables">${services.map((s) => `<li><a href="/services/${s.slug}.html">${s.metaTitle.split(' — ')[0].replace(' Agency', '')} →</a></li>`).join('')}</ul>
    </section>
    <section class="case grid faq">
      <h2 class="mono case__label"><span>(FAQ)</span> ${l.city} questions</h2>
      <div class="faq__list">${l.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
    </section>
    <a class="next grid" href="/#contact" data-cursor="Talk"><span class="mono">Start a project in ${l.city}</span><strong class="next__title">Let's <em>talk</em></strong></a>`,
  }))
})

// journal
urls.push(...posts.map((p) => `/journal/${p.slug}.html`))
write('journal/index.html', page({
  path: '/journal/', title: 'Journal — BrandForge', desc: 'Notes from BrandForge on 3D web design, Shopify, automation and social content.',
  body: `${head('Journal', ['Notes from', 'the forge'])}
    <ol class="rows">${posts.map((p, i) => `<li><a class="row grid" href="/journal/${p.slug}.html"><span class="mono">0${i + 1}</span><strong>${p.title}</strong><span class="mono">Article</span><span class="mono">${p.date.slice(0, 4)}</span></a></li>`).join('')}</ol>`,
}))
posts.forEach((p) => {
  const path = `/journal/${p.slug}.html`
  write(`journal/${p.slug}.html`, page({
    path, title: `${p.title} — BrandForge Journal`, desc: p.metaDesc,
    ld: [crumbs([['Home', '/'], ['Journal', '/journal/'], [p.title, path]]),
      { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, datePublished: p.date, description: p.metaDesc, image: `${SITE}/og.png`, author: { '@type': 'Organization', name: 'BrandForge' }, publisher: { '@type': 'Organization', name: 'BrandForge' } }],
    body: `    <article>
    <section class="page-head grid">
      <p class="mono"><span>(Journal)</span> <time datetime="${p.date}">${p.date}</time></p>
      <h1 class="page-title article-title">${p.title}</h1>
    </section>
    <section class="case grid"><p class="case__text case__lead">${p.intro}</p></section>
${p.sections.map(([h, t]) => `    <section class="case grid"><h2 class="mono case__label">${h}</h2><p class="case__text">${t}</p></section>`).join('\n')}
    <a class="next grid" href="/#contact" data-cursor="Talk"><span class="mono">${p.outro}</span><strong class="next__title">Let's <em>talk</em></strong></a>
    </article>`,
  }))
})

fs.writeFileSync('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}
</urlset>
`)
console.log(`pages: ${urls.length} urls`)
