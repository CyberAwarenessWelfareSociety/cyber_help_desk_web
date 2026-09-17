import { Link } from 'react-router-dom';
import AppContentLayout from '../components/AppContentLayout';
import documents from '../data/appDocuments.json';
const notes = {
  'security-and-privacy': 'This app screen says deletion occurs five days after closure and describes contact details as never shared. The privacy policy and terms dated August 24, 2026 instead describe a 48-hour inactivity process and emergency disclosures. The advocate-access document also describes consent-based contact sharing. Read those documents for the more specific provisions.',
  'data-storage-policy': 'This document describes phone-based registration. The privacy policy separately describes name and email collection for Google OAuth. The information requested depends on the account or feature flow; both source documents are provided here.',
  'legal-identity': 'These are the organization details published in the app, including its registration wording and certification status. For registration certificates or clarification, contact CAWS.',
  'ground-verification': 'This is the app’s published explanation, including its original legal references and examples. Contact CAWS to clarify a proposed verification request.'
};
export default function AppDocument({
  slug
}) {
  const doc = documents.find(item => item.slug === slug);
  const headings = doc.blocks.map((block, index) => ({
    ...block,
    index
  })).filter(block => block.type === 'heading');
  return <AppContentLayout title={doc.title} eyebrow="WHO WE ARE · ORGANIZATION & POLICIES" intro={doc.description}>
    <div className="app-document-meta"><span>Published in the Cyber Help Desk app</span>{doc.effectiveDate && <span>Effective: {doc.effectiveDate}</span>}<button onClick={() => window.print()}>Print this document</button></div>
    {notes[slug] && <aside className="app-source-note"><strong>Reading the app’s information</strong><p>{notes[slug]}</p><Link to="/privacy-policy">Privacy policy</Link> · <Link to="/terms-and-conditions">Terms & conditions</Link> · <Link to="/contact-us">Contact CAWS</Link></aside>}
    <div className="app-document-layout"><aside className="app-toc"><h2>On this page</h2>{headings.map(block => <a key={block.index} href={`#section-${block.index}`}>{block.text.replace(/^•\s*/, '')}</a>)}<Link to="/about">← All Who We Are information</Link></aside><article className="app-document">{doc.blocks.map((block, index) => block.type === 'heading' ? <h2 key={index} id={`section-${index}`}>{block.text.replace(/^•\s*/, '')}</h2> : <p key={index}>{block.text}</p>)}</article></div>
    <nav className="app-related" aria-label="Related organization documents">{documents.filter(item => item.slug !== slug).map(item => <Link key={item.slug} to={`/${item.slug}`}>{item.title}</Link>)}</nav>
  </AppContentLayout>;
}
