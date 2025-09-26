import { SOCIAL } from "@/lib/site";
import { siYoutube, siTiktok, siX, siInstagram } from "simple-icons";

type Props = {
  className?: string;
};

export default function SocialLinks({ className = "" }: Props) {
  const c = `${className}`.trim();
  const emailAddress = SOCIAL.email.replace(/^mailto:/, "");
  return (
    <div className={c}>
      <div className="mx-auto max-w-7xl px-6">
        <nav aria-label="Social and contact" className="py-4">
          <ul className="flex items-center justify-center gap-5">
            <li>
              <a
                href={SOCIAL.email}
                title={emailAddress}
                aria-label="Email"
                className="inline-flex p-2 text-black/70 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50 rounded"
              >
                <span className="sr-only">Email</span>
                <EmailIcon className="h-5 w-5" titleText={emailAddress} />
              </a>
            </li>
            <li>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex p-2 text-black/70 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50 rounded"
              >
                <span className="sr-only">Instagram</span>
                <BrandIcon path={siInstagram.path} className="h-5 w-5" />
              </a>
            </li>
            <li>
              <a
                href={SOCIAL.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="inline-flex p-2 text-black/70 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50 rounded"
              >
                <span className="sr-only">YouTube</span>
                <BrandIcon path={siYoutube.path} className="h-5 w-5" />
              </a>
            </li>
            <li>
              <a
                href={SOCIAL.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="inline-flex p-2 text-black/70 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50 rounded"
              >
                <span className="sr-only">X</span>
                <BrandIcon path={siX.path} className="h-5 w-5" />
              </a>
            </li>
            <li>
              <a
                href={SOCIAL.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex p-2 text-black/70 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50 rounded"
              >
                <span className="sr-only">TikTok</span>
                <BrandIcon path={siTiktok.path} className="h-5 w-5" />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

function EmailIcon({ className = "", titleText }: { className?: string; titleText?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {titleText ? <title>{titleText}</title> : null}
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M22 7 12.8 13.9a2 2 0 0 1-1.6 0L2 7" />
      </g>
    </svg>
  );
}

function BrandIcon({ path, className = "" }: { path: string; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d={path} fill="currentColor" />
    </svg>
  );
}
