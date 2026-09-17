import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';

const root = process.argv[2] || '../cybercrime-app';
const documents = [
  ['legal-identity', 'LegalIdentityScreen', 'Legal identity', 'Registration, certifications and organizational details.'],
  ['mission', 'Mission', 'Our mission', 'Cyber awareness, citizen assistance and free public service camps.'],
  ['security-and-privacy', 'SecurityAndPrivacy', 'Security & privacy', 'Volunteer verification, oversight and privacy standards.'],
  ['data-storage-policy', 'DataStoragePolicyScreen', 'Data source & storage policy', 'Data sources, account access, searches, location and account deletion.'],
  ['advocate-verification', 'AdvocateVerification', 'Advocate verification & access', 'How advocate access works, user responsibilities and data sharing.'],
  ['privacy-policy', 'PrivacyPolicy', 'Privacy policy', 'The Cyber Help Desk application’s data protection policy.'],
  ['terms-and-conditions', 'TermsOfService', 'Terms & conditions', 'The Cyber Help Desk application’s service agreement.'],
];
function visit(node, callback) {
  if (!node || typeof node !== 'object') return;
  callback(node);
  for (const [key, value] of Object.entries(node)) {
    if (key === 'loc') continue;
    if (Array.isArray(value)) value.forEach(child => visit(child, callback));
    else if (value && typeof value === 'object') visit(value, callback);
  }
}
function valueText(node) {
  if (node.type === 'JSXText') return node.value.replace(/\s+/g, ' ').trim();
  if (node.type === 'JSXExpressionContainer') return valueText(node.expression);
  if (node.type === 'StringLiteral') return node.value;
  if (node.type === 'CallExpression' && node.callee.name === 't' && node.arguments[0]?.type === 'StringLiteral') return node.arguments[0].value;
  return '';
}
const output = documents.map(([slug, name, title, description]) => {
  const source = `app/(screen)/${name}.tsx`;
  const ast = parse(fs.readFileSync(path.join(root, source), 'utf8'), { sourceType: 'module', plugins: ['typescript', 'jsx'] });
  const blocks = [];
  visit(ast, node => {
    if (node.type !== 'JSXElement' || node.openingElement.name.name !== 'Text') return;
    const text = node.children.map(valueText).filter(Boolean).join(' ');
    if (!text) return;
    const styles = [];
    visit(node.openingElement, item => { if (item.type === 'MemberExpression' && item.object.name === 'styles') styles.push(item.property.name); });
    const heading = styles.some(style => /sectionTitle|clauseTitle|subtitle|heading|cardTitle/i.test(style));
    if (!styles.includes('headerTitle')) blocks.push({ type: heading ? 'heading' : 'paragraph', text });
  });
  return { slug, title, description, source, effectiveDate: ['PrivacyPolicy', 'TermsOfService'].includes(name) ? 'August 24, 2026' : null, blocks };
});
const groundSource = 'app/(screen)/groundVerification.tsx';
const ast = parse(fs.readFileSync(path.join(root, groundSource), 'utf8'), { sourceType: 'module', plugins: ['typescript', 'jsx'] });
const blocks = [];
visit(ast, node => {
  if (node.type !== 'VariableDeclarator' || node.id.name !== 'groundVerificationContent') return;
  for (const element of node.init.elements) {
    const properties = Object.fromEntries(element.properties.map(p => [p.key.name, p.value]));
    if (properties.items) properties.items.elements.forEach(item => blocks.push({ type: 'paragraph', text: '• ' + item.value }));
    else blocks.push({ type: ['title', 'subtitle'].includes(properties.type.value) ? 'heading' : 'paragraph', text: properties.text.value });
  }
});
output.push({ slug: 'ground-verification', title: 'Ground verification', description: 'Understanding identity fraud and the purpose of verification.', source: groundSource, blocks });
fs.writeFileSync('src/data/appDocuments.json', JSON.stringify(output, null, 2) + '\n');
console.log(`Imported ${output.length} documents with ${output.reduce((n,d)=>n+d.blocks.length,0)} text blocks.`);
