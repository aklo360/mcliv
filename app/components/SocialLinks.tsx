import {SOCIAL} from '~/lib/site';
import {siInstagram, siYoutube, siX, siTiktok} from 'simple-icons';
import {FiMail} from 'react-icons/fi';

type Props = {
  className?: string;
};

export function SocialLinks({className = ''}: Props) {
  const c = `${className}`.trim();
  const emailAddress = SOCIAL.email.replace(/^mailto:/, '');
  return (
    <div className={c}>
      <nav aria-label="Social and contact">
        <ul className="social-list">
          <li>
            <a
              href={SOCIAL.email}
              title={emailAddress}
              aria-label="Email"
              className="social-link"
            >
              <FiMail size={18} aria-hidden />
              <span className="sr-only">Email</span>
            </a>
          </li>
          <li>
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="social-link"
            >
              <BrandIcon path={siInstagram.path} />
              <span className="sr-only">Instagram</span>
            </a>
          </li>
          <li>
            <a
              href={SOCIAL.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="social-link"
            >
              <BrandIcon path={siYoutube.path} />
              <span className="sr-only">YouTube</span>
            </a>
          </li>
          <li>
            <a
              href={SOCIAL.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="social-link"
            >
              <BrandIcon path={siX.path} />
              <span className="sr-only">X</span>
            </a>
          </li>
          <li>
            <a
              href={SOCIAL.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="social-link"
            >
              <BrandIcon path={siTiktok.path} />
              <span className="sr-only">TikTok</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function BrandIcon({path}: {path: string}) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="social-icon">
      <path d={path} fill="currentColor" />
    </svg>
  );
}
