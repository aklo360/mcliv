import {useEffect} from 'react';
import {useLocation} from 'react-router';
import type {Route} from './+types/workshops';
import {ProductCarousel} from '~/components/ProductCarousel';

const EMAIL = 'info@mcliv.studio';
const bookingSubject = 'MCLIV Workshop + Studio Tour';
const bookingBody = [
  'Name:',
  'Preferred dates:',
  'Group size:',
  'Workshop focus:',
  'Accessibility needs:',
].join('\n');
const bookingLink = `mailto:${EMAIL}?subject=${encodeURIComponent(
  bookingSubject,
)}&body=${encodeURIComponent(bookingBody)}`;
const privateLink = `mailto:${EMAIL}?subject=${encodeURIComponent(
  'MCLIV Private Workshop Inquiry',
)}`;
const workshopImages = [
  {
    id: 'workshops-01',
    url: '/images/workshops/studiotour1.jpg',
    altText: 'MCLIV studio tour',
    width: 2400,
    height: 3000,
  },
];
const workshopGalleryImages = [
  {
    id: 'workshops-02',
    url: '/images/workshops/studiotour2.jpg',
    altText: 'Studio tour gallery image one',
    width: 2400,
    height: 1350,
  },
  {
    id: 'workshops-03',
    url: '/images/workshops/studiotour3.jpg',
    altText: 'Studio tour gallery image two',
    width: 2400,
    height: 1350,
  },
  {
    id: 'workshops-04',
    url: '/images/workshops/studiotour4.jpg',
    altText: 'Studio tour gallery image three',
    width: 2400,
    height: 1350,
  },
  {
    id: 'workshops-05',
    url: '/images/workshops/studiotour5.jpg',
    altText: 'Studio tour gallery image four',
    width: 2400,
    height: 1350,
  },
  {
    id: 'workshops-06',
    url: '/images/workshops/studiotour6.jpg',
    altText: 'Studio tour gallery image five',
    width: 2400,
    height: 1350,
  },
  {
    id: 'workshops-07',
    url: '/images/workshops/studiotour7.jpg',
    altText: 'Studio tour gallery image six',
    width: 2400,
    height: 1350,
  },
  {
    id: 'workshops-08',
    url: '/images/workshops/studiotour8.jpg',
    altText: 'Studio tour gallery image seven',
    width: 2400,
    height: 1350,
  },
  {
    id: 'workshops-09',
    url: '/images/workshops/studiotour9.jpg',
    altText: 'Studio tour gallery image eight',
    width: 2400,
    height: 1350,
  },
  {
    id: 'workshops-10',
    url: '/images/workshops/studiotour10.jpg',
    altText: 'Studio tour gallery image nine',
    width: 2400,
    height: 1350,
  },
  {
    id: 'workshops-11',
    url: '/images/workshops/studiotour11.jpg',
    altText: 'Studio tour gallery image ten',
    width: 2400,
    height: 1350,
  },
  {
    id: 'workshops-12',
    url: '/images/workshops/studiotour12.jpg',
    altText: 'Studio tour gallery image eleven',
    width: 2400,
    height: 1350,
  },
  {
    id: 'workshops-13',
    url: '/images/workshops/studiotour13.jpg',
    altText: 'Studio tour gallery image twelve',
    width: 2400,
    height: 1350,
  },
  {
    id: 'workshops-14',
    url: '/images/workshops/studiotour14.jpg',
    altText: 'Studio tour gallery image thirteen',
    width: 2400,
    height: 1350,
  },
  {
    id: 'workshops-15',
    url: '/images/workshops/studiotour15.jpg',
    altText: 'Studio tour gallery image fourteen',
    width: 2400,
    height: 1350,
  },
  {
    id: 'workshops-16',
    url: '/images/workshops/studiotour16.jpg',
    altText: 'Studio tour gallery image fifteen',
    width: 2400,
    height: 1350,
  },
  {
    id: 'workshops-17',
    url: '/images/workshops/studiotour17.jpg',
    altText: 'Studio tour gallery image sixteen',
    width: 2400,
    height: 1350,
  },
  {
    id: 'workshops-18',
    url: '/images/workshops/studiotour18.jpg',
    altText: 'Studio tour gallery image seventeen',
    width: 2400,
    height: 1350,
  },
];

export const meta: Route.MetaFunction = () => {
  const title = 'Workshops · MCLIV Studio';
  const description =
    'Guided multi-floor behind-the-scenes studio tour and hands-on art workshop hosted by founder John Black in NYC.';
  return [
    {title},
    {name: 'description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
  ];
};

export default function WorkshopsPage() {
  const {hash, key} = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = decodeURIComponent(hash.slice(1));
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    let attempts = 0;
    const maxAttempts = 20;

    const scrollToHash = () => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }

      attempts += 1;
      if (attempts < maxAttempts) {
        setTimeout(scrollToHash, 50);
      }
    };

    scrollToHash();
  }, [hash, key]);

  return (
    <main className="workshops-page">
      <section className="workshops-hero">
        <div className="workshops-hero-copy">
          <p className="eyebrow">Workshops</p>
          <h1 className="workshops-title">
            Guided multi-floor studio tour + hands-on art workshop.
          </h1>
          <p className="workshops-lede">
            Step inside the WTC3 Art Studios for an intimate behind-the-scenes walk-through of three floors of artist workspaces where you'll see their process, materials, and works in progress. The session culminates in a guided hands-on painting workshop hosted by founder John Black, focused on stream of consciousness technique and creation as an act of mindfulness.
          </p>
          <div className="workshops-cta">
            <a className="primary" href={bookingLink}>
              Request a slot
            </a>
            <a className="ghost" href="#details">
              View details
            </a>
          </div>
          <div className="workshops-hero-meta">
            <span className="meta">3 WORLD TRADE CENTER</span>
            <span className="meta">2 HOURS</span>
            <span className="meta">10 GUESTS</span>
          </div>
        </div>
        <div className="workshops-hero-media">
          <div className="workshops-hero-image">
            <img
              src={workshopImages[0].url}
              alt={workshopImages[0].altText ?? 'MCLIV studio tour'}
              loading="eager"
            />
          </div>
        </div>
      </section>

      <section id="galleries" className="workshops-gallery">
        <ProductCarousel
          images={workshopGalleryImages}
          title="MCLIV Studio Tour Gallery"
          sizes="(min-width: 1200px) 1200px, 92vw"
        />
      </section>

      <section id="details" className="section-shell workshops-section">
        <div className="section-header">
          <p className="eyebrow">Experience</p>
          <h2 className="section-title">What you will do</h2>
          <p className="section-lede">
            The workshop is designed for any level of creative enthusiast even if you've never made art before. It's also designed for non-artists, collectors or virtually anyone who
            wants to gain a deeper understanding of an artist's authentic process. Each session balances
            studio immersion with focused time on actual painting on canvas.
          </p>
        </div>
        <div className="section-grid workshops-grid">
          <article className="section-card">
            <h3>Studio tour</h3>
            <p>
              Guided walk-through of the multi-floor workspace, where you'll be introduced to every Artist's work and their personal studio space.
            </p>
          </article>
          <article className="section-card">
            <h3>Hands-on workshop</h3>
            <p>
              Create a small-format study exploring stream of consciousness technique, rhythm and balance focusing on internal self-reflection and therapeutic mindfulness.
            </p>
          </article>
          <article className="section-card">
            <h3>Takeaways</h3>
            <p>
              Leave with your work, documented process notes and a deeper understanding of your own personal creative interworkings.
            </p>
          </article>
        </div>
      </section>

      <section className="section-shell workshops-section workshops-section--dark">
        <div className="section-header">
          <p className="eyebrow">Logistics</p>
          <h2 className="section-title">Session details</h2>
          <p className="section-lede">
            Sessions are scheduled by request and tailored to the group. We confirm availability
            within 48 hours of inquiry.
          </p>
        </div>
        <div className="inline-stats workshops-stats">
          <div>
            <span className="stat-label">Duration</span>
            <span className="stat-value">2 hours</span>
          </div>
          <div>
            <span className="stat-label">Group size</span>
            <span className="stat-value">Up to 10 guests</span>
          </div>
          <div>
            <span className="stat-label">Materials</span>
            <span className="stat-value">Included</span>
          </div>
          <div>
            <span className="stat-label">Location</span>
            <span className="stat-value">3 World Trade Center, NYC</span>
          </div>
        </div>
      </section>

    </main>
  );
}
