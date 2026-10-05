# SL Cleaning Services website

React + Vite site, hosted on Vercel.

## Run it
    npm install
    npm run dev
    npm run build

Create a `.env` file with your form key (it is not stored in the project):

    VITE_WEB3FORMS_KEY=your-key-here

## Where to edit things
- `src/config.js`: phone, email, Google review link, hero/about photos, cities, testimonials, before/after photos, FAQ
- `src/App.jsx`: homepage sections and quote form
- `src/pages/Area.jsx`: the `/cleaning/<city>` pages
- `public/`: photos (WebP), `sitemap.xml`, `robots.txt`

Testimonials, Before/After and the Google review button stay hidden until you add content in `src/config.js`.
After adding a city in `config.js`, also add it to `public/sitemap.xml`.
