import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialLinks from "@/components/SocialLinks";
import Hero from "@/components/Hero";
import ReleaseCard from "@/components/ReleaseCard";
import ActivationCard from "@/components/ActivationCard";
import MultimediaCard from "@/components/MultimediaCard";
import Carousel from "@/components/Carousel";

export default function MainPage() {
  return (
    <main className="fade-in">
      <Header showLogo={false} transparent />
      <Hero />
      {/* About / Our Mission */}
      <section id="about" className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="h2 text-center">Our Mission</h2>
        <p className="text-center text-neutral-700 mt-4">
        We develop limited-run capsule collections and experiential activations that subvert the way we think about the world while creating lasting transformative impact beyond mere spectacle. 
        <br />
        <br />
        The name MCLIV (roman numeral 1154) is a nod to the Baader-Meinhof Phenomenon. Once seen, it cannot be unseen, it’s everywhere. Attention multiplies meaning, through art objects and experiences that evoke mindful conscious awareness, we elevate signal from the noise. 

        </p>
      </section>
      {/* Fresh, centered pillar sections */}
      <section id="releases" className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="h2 text-center">Releases</h2>
        <p className="text-center text-neutral-700 max-w-2xl mx-auto mb-8">
          Objects, furniture, prints and wearables from the studio — material restraint, precise craft.
        </p>
        <Carousel
          startIndex={0}
          items={[
            <ReleaseCard key="r0" title="Studio Cap" image="/images/releases/hat1.png" status="Available" editionNumber={1} />,
            <ReleaseCard key="r1" title="Edition Chair" image="/images/releases/chair1.png" status="Upcoming" editionNumber={2} />,
            <ReleaseCard key="r2" title="Signal Tee" image="/images/releases/shirt1.png" status="Sold Out" editionNumber={3} />,
          ]}
        />
      </section>

      <section id="activations" className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="h2 text-center">Activations</h2>
        <p className="text-center text-neutral-700 max-w-2xl mx-auto mb-8">
          Culinary, installation, and experiential productions that are transcendent & meaningful.
        </p>
        <Carousel
          startIndex={1}
          items={[
            <ActivationCard key="a0" title="Culinary Installation" image="/images/activations/event1.png" blurb="Meditative tasting sequence with sound and light." />,
            <ActivationCard key="a1" title="Site-Specific Piece" image="/images/activations/event2.jpg" blurb="Frequency pattern woven into architectural surface." />,
            <ActivationCard key="a2" title="Brand Collaboration" image="/images/activations/event3.jpg" blurb="Limited-run activation with mindful craft." />,
          ]}
        />
      </section>

      <section id="multimedia" className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="h2 text-center">Multimedia</h2>
        <p className="text-center text-neutral-700 max-w-2xl mx-auto mb-8">
          Photo/Video, Web, Logos & Brand Identity Systems Design.
        </p>
        <Carousel
          startIndex={1}
          items={[
            <MultimediaCard key="m0" category="Web" image="/images/multimedia/campaign1.png" />,
            <MultimediaCard key="m1" category="Photo" image="/images/multimedia/campaign1.png" />,
            <MultimediaCard key="m2" category="Video" image="/images/multimedia/campaign1.png" />,
            <MultimediaCard key="m3" category="Web" image="/images/multimedia/campaign1.png" />,
          ]}
        />
      </section>

      {/* Contact CTA */}
      <section id="contact" className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="h2">Contact</h2>
        <p className="text-neutral-700 mt-4 mb-8">For collaborations, commissions, and press inquiries.</p>
        <a
          href="mailto:info@mcliv.studio"
          className="inline-flex items-center gap-2 border border-black/15 rounded-md px-6 py-3 text-sm hover:bg-black hover:text-white transition"
        >
          Email info@mcliv.studio
        </a>
      </section>
      <SocialLinks />
      <Footer />
    </main>
  );
}
