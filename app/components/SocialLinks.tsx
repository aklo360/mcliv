import {SOCIAL} from '~/lib/site';
import {siInstagram, siYoutube, siX, siTiktok} from 'simple-icons';
import {FiMail} from 'react-icons/fi';

type Props = {
  className?: string;
  items?: Array<'email' | 'instagram' | 'youtube' | 'twitter' | 'tiktok'>;
};

export function SocialLinks({className = '', items}: Props) {
  const c = `${className}`.trim();
  const emailAddress = SOCIAL.email.replace(/^mailto:/, '');
  const entries = [
    {
      id: 'email',
      href: SOCIAL.email,
      label: 'Email',
      title: emailAddress,
      icon: <FiMail size={18} aria-hidden />,
      external: false,
    },
    {
      id: 'instagram',
      href: SOCIAL.instagram,
      label: 'Instagram',
      icon: <BrandIcon path={siInstagram.path} />,
      external: true,
    },
    {
      id: 'youtube',
      href: SOCIAL.youtube,
      label: 'YouTube',
      icon: <BrandIcon path={siYoutube.path} />,
      external: true,
    },
    {
      id: 'twitter',
      href: SOCIAL.twitter,
      label: 'X',
      icon: <BrandIcon path={siX.path} />,
      external: true,
    },
    {
      id: 'tiktok',
      href: SOCIAL.tiktok,
      label: 'TikTok',
      icon: <BrandIcon path={siTiktok.path} />,
      external: true,
    },
  ] as const;
  const selection = items
    ? items
        .map((id) => entries.find((entry) => entry.id === id))
        .filter((entry): entry is (typeof entries)[number] => Boolean(entry))
    : entries;
  return (
    <div className={c}>
      <nav aria-label="Social and contact">
        <ul className="social-list">
          {selection.map((entry) => (
            <li key={entry.id}>
              <a
                href={entry.href}
                title={entry.title}
                aria-label={entry.label}
                className="social-link"
                {...(entry.external
                  ? {target: '_blank', rel: 'noopener noreferrer'}
                  : {})}
              >
                {entry.icon}
                <span className="sr-only">{entry.label}</span>
              </a>
            </li>
          ))}
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
