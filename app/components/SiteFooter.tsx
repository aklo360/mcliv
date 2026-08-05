import {brandText} from '~/components/BrandMark';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-row">
        <span className="mono">© 2026 {brandText('MCLIV')} Studio</span>
      </div>
      <div className="footer-row footer-links mono">
        <a href="https://instagram.com/mcliv_studio" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href="mailto:info@mcliv.studio">Email</a>
      </div>
    </footer>
  );
}
