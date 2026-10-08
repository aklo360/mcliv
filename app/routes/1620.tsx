import {Link, Outlet} from 'react-router';
import type {Route} from './+types/1620';
import exhibitionStyles from '~/styles/exhibition-1620.css?url';

export const links: Route.LinksFunction = () => [{rel: 'stylesheet', href: exhibitionStyles}];

export default function ExhibitionLayout() {
  return (
    <div className="exhibition">
      <a className="exhibition-skip" href="#exhibition-content">Skip to content</a>
      <header className="exhibition-header">
        <Link to="/" aria-label="MCLIV Studio home"><img src="/icons/logo.svg" alt="MCLIV" width="112" height="40" /></Link>
        <Link to="/1620" className="exhibition-label">Group exhibition</Link>
        <Link to="/cart" className="exhibition-label">Bag</Link>
      </header>
      <main id="exhibition-content"><Outlet /></main>
      <footer className="exhibition-footer">
        <Link to="/">MCLIV Studio</Link>
        <span className="exhibition-label">18 artists · One shared format</span>
        <a href="mailto:info@mcliv.studio">Contact</a>
      </footer>
    </div>
  );
}
