import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Search } from 'lucide-react';
import AppContentLayout, { AppDownload } from '../components/AppContentLayout';
import { appFeatures } from '../data/appFeatures';
export default function AppFeatures() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const filtered = appFeatures.filter(item => (category === 'All' || item.category === category) && `${item.title} ${item.text} ${item.details.join(' ')}`.toLowerCase().includes(query.toLowerCase()));
  return <AppContentLayout title="One app. Many ways to stay informed." eyebrow="EXPLORE CYBER HELP DESK" intro="Discover the app’s awareness, learning, support and verification features. Some tools require sign-in, enrollment or an approved role.">
    <div className="app-filter-bar"><label className="app-search"><Search size={18} /><input aria-label="Search app features" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search features, support or learning…" /></label><div className="app-filter-tabs">{['All', ...new Set(appFeatures.map(item => item.category))].map(item => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
    <p aria-live="polite">{filtered.length} features found</p><div className="app-feature-grid">{filtered.map(item => <article className="app-info-card" key={item.title}><span className="ngo-eyebrow">{item.category}</span><h2>{item.title}</h2><p>{item.text}</p><ul>{item.details.map(detail => <li key={detail}>{detail}</li>)}</ul>{item.link && <Link className="ngo-text-link" to={item.link}>Read more <ArrowUpRight size={16} /></Link>}</article>)}</div>{filtered.length === 0 && <p className="app-source-note">No features match. Try another search or category.</p>}<AppDownload />
  </AppContentLayout>;
}
