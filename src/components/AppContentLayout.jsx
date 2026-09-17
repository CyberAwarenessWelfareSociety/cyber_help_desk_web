import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Header from './Home/Header';
import { appStores } from '../data/appFeatures';
import '../styles/ngo.css';
export function AppDownload() {
  return <section className="ngo-contact-panel app-download" id="download"><div><span className="ngo-eyebrow">CYBER HELP DESK APP</span><h2>Keep awareness within reach.</h2><p>Use the app for live tests, support tools, community participation and learning on the go.</p></div><div className="ngo-actions"><a className="ngo-button" href={appStores.android} target="_blank" rel="noreferrer">Google Play <ArrowUpRight size={16} /></a><a className="ngo-button" href={appStores.ios} target="_blank" rel="noreferrer">App Store <ArrowUpRight size={16} /></a></div></section>;
}
export default function AppContentLayout({
  title,
  eyebrow = 'CYBER AWARENESS WELFARE SOCIETY',
  intro,
  children
}) {
  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute('content');
    document.title = `${title} | Cyber Awareness Welfare Society`;
    description?.setAttribute('content', intro);
    return () => {
      document.title = previousTitle;
      if (previousDescription != null) description?.setAttribute('content', previousDescription);
    };
  }, [title, intro]);
  return <div className="ngo-site"><Header /><main className="ngo-container ngo-section app-page"><div className="app-breadcrumb"><Link to="/">Home</Link><span>/</span><span>{title}</span></div><div className="app-page-heading"><span className="ngo-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></div>{children}</main></div>;
}
