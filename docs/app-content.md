# Cyber Help Desk content on the website

## Sources

The public information was read from the sibling `../cybercrime-app` project. No account records, search results, credentials or private incident data are copied.

`src/data/appDocuments.json` holds 259 text blocks from eight complete informational screens:

- `app/(screen)/LegalIdentityScreen.tsx`
- `app/(screen)/Mission.tsx`
- `app/(screen)/SecurityAndPrivacy.tsx`
- `app/(screen)/DataStoragePolicyScreen.tsx`
- `app/(screen)/AdvocateVerification.tsx`
- `app/(screen)/PrivacyPolicy.tsx`
- `app/(screen)/TermsOfService.tsx`
- `app/(screen)/groundVerification.tsx`

Regenerate the text using `node scripts/import-app-content.mjs [path-to-cybercrime-app]`. The importer parses static displayed text; it does not execute the app. Review source-policy differences before replacing the committed content. This is a snapshot, not automatic production synchronization.

Feature descriptions were adapted from the home, Who We Are, library, courses, classes, live-tests, live-test-room, live-test-result, volunteer, emergency-sos and help-option screens. Live-test dates, scores and participant records are not copied; official participation remains in the app. The website course catalogue uses the existing `/api/courses` integration, matching the app endpoint.

## Source differences

- Privacy and terms are dated August 24, 2026 and describe 48-hour inactivity closure and user-initiated deletion. The security screen instead says five days after closure. The website preserves the source documents and highlights the disagreement.
- The security screen makes a blanket non-sharing statement, while the privacy/terms and advocate screen describe specific emergency and consent-based disclosures. A note links readers to those provisions.
- The data-storage screen describes phone-based accounts; privacy describes Google OAuth name/email collection. Both remain available with context.
- Legal identity says 80G is not granted. Public summaries do not promise 80G benefits. Registration and certification statements are attributed to the app, not independently certified by this migration.
- Source legal wording and references are preserved verbatim in the documents. Request organizational clarification before treating those descriptions as verified legal guidance.
- Contact actions use the displayed `support@cyberawareness.ngo` address, correcting a misspelling in one app email action.

## Website features

- Responsive Who We Are and learning menus, full documents, contents navigation and printing.
- About hub, live-test guide, course catalogue, volunteer information, contact page and FAQs.
- Searchable/filterable app-feature directory and Android/iOS store links.
- Course loading, error/retry and empty states. Enrollment and class routes are preserved.
