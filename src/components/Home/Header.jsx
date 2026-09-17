import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react';
import logo from '../../assets/icon.png';
import documents from '../../data/appDocuments.json';
import '../../styles/ngo.css';
export default function Header() {
  const [open, setOpen] = useState(false);
  const closeNavigation = event => {
    if (!event.target.closest('a')) return;
    setOpen(false);
    event.currentTarget.querySelectorAll('details[open]').forEach(menu => menu.removeAttribute('open'));
  };
  return <header className="ngo-header"><div className="ngo-topline"><span>Awareness first. Transparency always.</span><a href="/documents/caws-partnership-proposal.pdf" target="_blank" rel="noreferrer">Our partnership proposal <ArrowUpRight size={13} /></a></div><nav className="ngo-nav" aria-label="Main navigation"><Link to="/" className="ngo-brand" onClick={() => setOpen(false)}><img src={logo} alt="" /><span>Cyber Awareness<span>WELFARE SOCIETY</span></span></Link><button className="ngo-menu" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="ngo-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><div id="ngo-navigation" className={`ngo-links ${open ? 'is-open' : ''}`} onClick={closeNavigation} onKeyDown={event => {
        if (event.key === 'Escape') {
          event.currentTarget.querySelectorAll('details[open]').forEach(menu => menu.removeAttribute('open'));
          setOpen(false);
        }
      }}>
 <details className="app-nav-dropdown"><summary>Who we are <ChevronDown size={13} /></summary><div className="app-dropdown-panel"><Link to="/about">About CAWS · overview</Link>{documents.map(doc => <Link key={doc.slug} to={`/${doc.slug}`}>{doc.title}</Link>)}<Link to="/contact-us">Contact us</Link></div></details>
 <a href="/#programmes">Our programmes</a><details className="app-nav-dropdown"><summary>Learn & participate <ChevronDown size={13} /></summary><div className="app-dropdown-panel"><Link to="/live-tests">Live tests & certificates</Link><Link to="/course">Courses & classes</Link><Link to="/mycourse">My enrolled courses</Link><a href="/#learning">Practice awareness quiz</a><Link to="/volunteer">Become a volunteer</Link><Link to="/gallery">Community gallery</Link><Link to="/login">Member sign in</Link></div></details><Link to="/app-features">The app</Link><Link className="ngo-button small" to="/partnership">Partner with us <ArrowUpRight size={16} /></Link></div></nav></header>;
}
