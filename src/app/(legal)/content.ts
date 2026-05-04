// MARK: - Imports
//
// Pure data module — no JSX, no runtime dependencies. The three legal
// documents (Terms / Privacy / Disclaimer) live here as structured
// data so both the live web pages and the downloadable PDF render
// from a single source of truth. Updating a clause means editing this
// file once; both surfaces follow.

// MARK: - Inline Run Model
//
// An inline run is a span of text inside a paragraph or bullet that
// optionally carries marks (bold, italic) or a link. Every paragraph
// is therefore an array of runs that consumers stitch together. This
// is more verbose to author than a markdown string, but type-safe
// and trivially renderable in both the JSX path (web) and the
// react-pdf path (PDF) without a parser.

export type LegalRun = {
  text: string;
  /** Renders bold across both web (`<strong>`) and PDF. */
  bold?: boolean;
  /** Internal app links (e.g. "/terms") and external URLs both
   *  flow through `href`. The renderers decide how to anchor them. */
  href?: string;
};

/** A paragraph or bullet line is just a sequence of runs. */
export type LegalBlock = LegalRun[];

// MARK: - Section Model
//
// Each section has an `<h2>` heading and a body that is itself a
// list of items. An item is either:
//   • a paragraph (a single block)
//   • a bullet list (an array of blocks)
//   • an `<h3>` subheading (used in the Privacy doc to split §6
//     into "Usage Data", "Onboarding Preferences", etc.)
//
// Modelling the body as a heterogeneous list (rather than separate
// paragraphs/bullets/subheadings arrays) preserves authoring order,
// which is critical because a section may interleave a paragraph,
// a bullet list, and another paragraph and we need to render in
// the same order.

export type LegalItem =
  | { type: "paragraph"; block: LegalBlock }
  | { type: "bullets"; blocks: LegalBlock[] }
  | { type: "subheading"; text: string };

export type LegalSection = {
  /** The section's `<h2>` heading text. */
  heading: string;
  body: LegalItem[];
};

// MARK: - Document Model

export type LegalDoc = {
  /** Used for `<h1>`, PDF document title, and the download filename. */
  title: string;
  /** "Last updated" or "Effective date" — Privacy uses the latter. */
  effectiveDateLabel: "Last updated" | "Effective date";
  /** UK-format DD/MM/YYYY string, displayed at the top of each doc. */
  effectiveDate: string;
  /**
   * Optional intro paragraphs rendered before the first numbered
   * section. The Disclaimer uses this for the all-caps "IMPORTANT:
   * PLEASE READ" preamble that sits above §1.
   */
  intro?: LegalBlock[];
  sections: LegalSection[];
};

// MARK: - Authoring Helpers
//
// Tiny helpers to keep the document data readable. They're just
// shorthand for object literals; nothing magical.

const t = (text: string): LegalRun => ({ text });
const b = (text: string): LegalRun => ({ text, bold: true });
const a = (text: string, href: string): LegalRun => ({ text, href });
const p = (...runs: LegalRun[]): LegalItem => ({ type: "paragraph", block: runs });
const sub = (text: string): LegalItem => ({ type: "subheading", text });
const bullets = (...blocks: LegalBlock[]): LegalItem => ({
  type: "bullets",
  blocks,
});

// MARK: - Shared Strings

const SUPPORT_EMAIL = "bevytheapp@gmail.com";
const TERMS_HREF = "/terms";
const PRIVACY_HREF = "/privacy";
const DISCLAIMER_HREF = "/disclaimer";
const ICO_URL = "https://ico.org.uk";
const ICO_COMPLAINT_URL = "https://ico.org.uk/make-a-complaint/";
const MIXPANEL_OPTOUT = "https://mixpanel.com/optout/";
const MIXPANEL_TERMS = "https://mixpanel.com/terms/";

const EFFECTIVE_DATE = "04/05/2026";

// MARK: - Terms of Service

export const termsDoc: LegalDoc = {
  title: "Terms of Service",
  effectiveDateLabel: "Last updated",
  effectiveDate: EFFECTIVE_DATE,
  sections: [
    {
      heading: "1. Introduction",
      body: [
        p(
          t(
            "Welcome to Bevy, an AI-powered truth or dare mobile application operated by Anant Jain (\u201CCompany,\u201D \u201Cwe,\u201D \u201Cour,\u201D or \u201Cus\u201D). These Terms of Service (\u201CTerms\u201D) govern your use of our mobile application Bevy (the \u201CService\u201D), including any related in-person events we may host.",
          ),
        ),
        p(
          t("Our "),
          a("Privacy Policy", PRIVACY_HREF),
          t(" and "),
          a("Legal Disclaimer", DISCLAIMER_HREF),
          t(
            " also form part of this agreement. Your agreement with us includes these Terms, our Privacy Policy, and our Legal Disclaimer (collectively, the \u201CAgreements\u201D).",
          ),
        ),
        p(
          t(
            `If you do not agree with the Agreements, you may not use the Service. Please contact us at ${SUPPORT_EMAIL} with any questions.`,
          ),
        ),
      ],
    },
    {
      heading: "2. Eligibility",
      body: [
        p(
          t(
            "The Service is intended only for individuals at least eighteen (18) years old. By using the Service, you warrant that you are at least 18 and have the full authority to enter into this agreement. Where we host in-person Bevy meetups, attendance is also restricted to individuals aged 18 or older; we may require proof of age at the door.",
          ),
        ),
      ],
    },
    {
      heading: "3. AI-Generated Content",
      body: [
        p(
          t(
            "Bevy uses artificial intelligence to generate truth or dare prompts. You acknowledge that: AI-generated content may be unpredictable, inaccurate, inappropriate, or offensive; you are solely responsible for evaluating the suitability and safety of any content before acting on it; we do not guarantee the accuracy, safety, or appropriateness of AI-generated content; AI-generated content does not constitute professional advice of any kind; you must not rely on AI-generated content as a substitute for professional judgement; we reserve the right to modify, filter, or remove content at any time; and you assume all risk associated with your use of AI-generated content.",
          ),
        ),
      ],
    },
    {
      heading: "4. User Conduct and Safety",
      body: [
        p(
          t(
            "When participating in truth or dare activities, you acknowledge that: you participate entirely at your own risk; you will not perform any dare that is illegal, dangerous, or harmful; you will not coerce any person to participate against their will; you are solely responsible for your own actions regardless of any AI prompt; you will ensure activities are conducted safely and lawfully; and you will not use the Service while impaired.",
          ),
        ),
        p(
          t(
            "If you attend a Bevy in-person meetup, you additionally agree to: behave respectfully toward other attendees, hosts, and venue staff; comply with the venue\u2019s rules and any reasonable instructions from the host; refrain from harassment, intimidation, or any unlawful conduct; and accept that the host may ask you to leave for breach of these Terms or applicable law. We reserve the right to refuse entry or remove any attendee at our discretion.",
          ),
        ),
      ],
    },
    {
      heading: "5. Notifications",
      body: [
        p(
          t(
            "By using our Service and granting notification permissions, you may receive local notifications on your device. These notifications are generated entirely on your device and may include reminders and promotional messages about the app. You can disable notifications at any time through your device\u2019s settings.",
          ),
        ),
      ],
    },
    {
      heading: "6. Subscriptions and Payments",
      body: [
        p(
          t(
            "Premium features are available via subscription. Token packages and Sponsor Circle contributions are available as one-time, in-app purchases. All prices are subject to change. Payment is charged to your Apple ID account at confirmation. Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period. Subscriptions may be managed through your Apple ID Account Settings. Free trial cancellation must be done 24 hours before the trial ends. Tokens do not expire but token balances are stored on your device (in the iOS Keychain) rather than in iCloud, and may be affected if you delete or reinstall the app on a device not signed into the same Apple ID. Your card data, custom content, preferences, and achievement progress are separately synced to your iCloud account where iCloud is enabled (see our Privacy Policy). You may restore prior eligible purchases at any time from within the Service via the \u201CRestore Status\u201D or equivalent control. Your use through the Apple App Store is also subject to Apple\u2019s terms and conditions. All purchases are final and non-refundable except as required by law or Apple\u2019s refund policies.",
          ),
        ),
      ],
    },
    {
      heading: "6A. Sponsor Circle and In-Person Meetups",
      body: [
        p(
          t(
            "The Sponsor Circle is an optional way to support Bevy through one-time in-app contributions. Each contribution is an Apple in-app purchase with the following characteristics:",
          ),
        ),
        bullets(
          [
            t(
              "Your first contribution permanently grants you sponsor status, the \u201CPremium Edition for Life\u201D entitlement (i.e. all Premium features, with no further subscription required), and the Gunmetal sponsor app icon. Subsequent contributions advance you up the tier ladder (Cobalt, Palladium, Iridium) and unlock additional sponsor app icons.",
            ),
          ],
          [
            t(
              "Sponsor status is granted for the life of your Apple ID\u2019s relationship with the Service. Sponsor data (your contribution count, total contributed amount, and date of first contribution) is stored in the iOS Keychain and may sync via iCloud Keychain to your other Apple devices signed into the same Apple ID, subject to your iCloud Keychain settings. See our ",
            ),
            a("Privacy Policy", PRIVACY_HREF),
            t(" for details."),
          ],
          [
            b(
              "Sponsor contributions are donations to support the development of the Service and the funding of Bevy in-person meetups.",
            ),
            t(
              " They are not payments for any specific event, ticket, or guaranteed deliverable. We do not promise that any particular meetup will take place at any particular time, in any particular city, or at all.",
            ),
          ],
          [
            t(
              "Sponsor perks tied to in-person meetups (such as reserved seating, bring-a-friend access, sponsor-only closing rounds, public thanks at meetups, or having your name attached to the announcement of a meetup you fund) are ",
            ),
            b("only available where and when we choose to host meetups"),
            t(
              ". App-side perks (the Premium entitlement, exclusive sponsor app icons, lifetime sponsor status, and our personal thanks) are global and not contingent on geography or meetup attendance.",
            ),
          ],
          [
            t(
              "If a meetup is cancelled, postponed, or relocated, your sponsor status, app-side entitlements, and existing tier are unaffected. Contributions are not refundable on the basis that a meetup did or did not happen.",
            ),
          ],
          [
            t(
              "Refunds for in-app purchases (subscriptions, tokens, and sponsor contributions) are governed by Apple\u2019s refund policies and applicable law. We do not process refunds directly; you should request a refund through Apple if you believe one is warranted.",
            ),
          ],
        ),
        p(
          t(
            "The first-round drink perk advertised under Gunmetal (\u201CFirst-Round Drink at Select Meetups\u201D) is provided at our discretion at meetups where we have arranged this with the venue, and is not guaranteed at every meetup.",
          ),
        ),
      ],
    },
    {
      heading: "7. Content",
      body: [
        p(
          t(
            "Content found on or through this Service is the property of Anant Jain or used with permission. You may not distribute, modify, transmit, reuse, download, repost, copy, or use said Content for commercial purposes without express written permission.",
          ),
        ),
      ],
    },
    {
      heading: "8. User-Created Content",
      body: [
        p(
          t(
            "The Service allows you to create custom truth and dare cards, custom packs, and to write private notes on the back of any card. This content is stored on your device and, where you are signed into iCloud, also synced to your private Apple iCloud account so it follows you across your Apple devices. It is not uploaded to our servers. You retain ownership of any content you create. We are not responsible for the loss of locally stored or iCloud-synced content if you delete the app, reset your device, sign out of iCloud, or clear Bevy\u2019s iCloud data.",
          ),
        ),
        p(
          t(
            "Where you submit a card prompt, suggestion, or other text-based contribution to us through any channel, including for use at a meetup, you grant us a non-exclusive, worldwide, royalty-free licence to use, reproduce, and display the contribution in connection with the Service. This grant does not extend to private notes, custom cards, or custom packs that remain in your own iCloud account; we have no access to those and seek no licence to them.",
          ),
        ),
      ],
    },
    {
      heading: "9. Prohibited Uses",
      body: [
        p(
          t(
            "You agree not to use the Service in any way that violates any law; to exploit or harm minors; to transmit spam; to impersonate any person; to restrict anyone\u2019s enjoyment of the Service; to generate illegal or objectionable content; or to reverse-engineer the Service\u2019s AI models. Additionally, you agree not to overburden the Service, use bots or scrapers, introduce malicious code, attack the Service, or take any action to damage Company ratings.",
          ),
        ),
      ],
    },
    {
      heading: "10. Analytics",
      body: [
        p(
          t(
            "We use Mixpanel, a third-party analytics provider, to collect anonymous usage data to monitor and improve the Service. No personally identifiable information is collected. See our ",
          ),
          a("Privacy Policy", PRIVACY_HREF),
          t(" for details and opt-out options."),
        ),
      ],
    },
    {
      heading: "11. Intellectual Property",
      body: [
        p(
          t(
            "The Service and its original content, features, and functionality are the exclusive property of Anant Jain. The Service is protected by copyright, trademark, and other laws of the United Kingdom and international treaties.",
          ),
        ),
      ],
    },
    {
      heading: "12. Error Reporting and Feedback",
      body: [
        p(
          t(
            `You may provide feedback at ${SUPPORT_EMAIL}. You acknowledge that you shall not retain any intellectual property rights in the Feedback, and you grant us an exclusive, transferable, irrevocable, perpetual right to use the Feedback in any manner and for any purpose.`,
          ),
        ),
      ],
    },
    {
      heading: "13. Links to Other Websites",
      body: [
        p(
          t(
            "We have no control over and assume no responsibility for third-party websites or services linked from our Service.",
          ),
        ),
      ],
    },
    {
      heading: "14. Disclaimer of Warranty",
      body: [
        p(
          b(
            "THE SERVICES ARE PROVIDED \u201CAS IS\u201D AND \u201CAS AVAILABLE.\u201D WE MAKE NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING NO WARRANTY REGARDING THE ACCURACY, SAFETY, APPROPRIATENESS, OR SUITABILITY OF ANY AI-GENERATED CONTENT. AI-GENERATED CONTENT IS PROVIDED FOR ENTERTAINMENT PURPOSES ONLY. WE DISCLAIM ALL WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE.",
          ),
        ),
      ],
    },
    {
      heading: "15. Limitation of Liability",
      body: [
        p(
          b(
            "TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, PUNITIVE, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE, ANY AI-GENERATED CONTENT, OR ANY ACTIVITY PERFORMED IN CONNECTION WITH THE SERVICE. LIABILITY IS LIMITED TO THE AMOUNT PAID BY YOU IN THE TWELVE MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM. NOTHING IN THESE TERMS SHALL EXCLUDE LIABILITY FOR DEATH OR PERSONAL INJURY CAUSED BY NEGLIGENCE, FRAUD, OR ANY OTHER LIABILITY THAT CANNOT BE EXCLUDED UNDER APPLICABLE LAW.",
          ),
        ),
      ],
    },
    {
      heading: "16. Indemnification",
      body: [
        p(
          t(
            "You agree to defend, indemnify, and hold harmless the Company from any claims, damages, or expenses arising from your use of the Service, your violation of these Terms, or any activity you perform in connection with AI-generated content.",
          ),
        ),
      ],
    },
    {
      heading: "17. Dispute Resolution",
      body: [
        p(
          t(
            "Before filing any legal action, you agree to attempt informal resolution for at least 30 days. Unresolved disputes shall be determined by binding arbitration under the London Court of International Arbitration (LCIA) Rules in London, England. ",
          ),
          b(
            "YOU AND THE COMPANY AGREE THAT EACH MAY BRING CLAIMS ONLY IN INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY CLASS ACTION.",
          ),
          t(" Either party may seek injunctive relief in any court for intellectual property matters."),
        ),
      ],
    },
    {
      heading: "18. Governing Law",
      body: [
        p(
          t(
            "These Terms shall be governed by the laws of England and Wales. Subject to arbitration, the courts of England and Wales shall have exclusive jurisdiction.",
          ),
        ),
      ],
    },
    {
      heading: "19. Changes to Service",
      body: [
        p(
          t("We reserve the right to withdraw or amend the Service at any time without notice."),
        ),
      ],
    },
    {
      heading: "20. Amendments to Terms",
      body: [
        p(
          t(
            "We may amend these Terms at any time. Your continued use constitutes acceptance. For material changes, we will make reasonable efforts to provide notice.",
          ),
        ),
      ],
    },
    {
      heading: "21. Waiver and Severability",
      body: [
        p(
          t(
            "No waiver of any term shall be deemed a continuing waiver. If any provision is held invalid, the remaining provisions continue in full force.",
          ),
        ),
      ],
    },
    {
      heading: "22. Entire Agreement",
      body: [
        p(
          t(
            "These Terms, together with the Privacy Policy and Legal Disclaimer, constitute the sole and entire agreement between you and the Company regarding the Service.",
          ),
        ),
      ],
    },
    {
      heading: "23. Acknowledgement",
      body: [
        p(
          b(
            "BY USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS AND AGREE TO BE BOUND BY THEM.",
          ),
        ),
      ],
    },
    {
      heading: "24. Contact Us",
      body: [
        p(
          t(`By email: ${SUPPORT_EMAIL}\nOperator: Anant Jain\nLocation: London, United Kingdom`),
        ),
      ],
    },
  ],
};

// MARK: - Privacy Policy

export const privacyDoc: LegalDoc = {
  title: "Privacy Policy",
  effectiveDateLabel: "Effective date",
  effectiveDate: EFFECTIVE_DATE,
  sections: [
    {
      heading: "1. Introduction",
      body: [
        p(
          t(
            "Welcome to Bevy, an AI-powered truth or dare mobile application operated by Anant Jain (\u201Cus,\u201D \u201Cwe,\u201D or \u201Cour\u201D). This Privacy Policy governs your use of Bevy (the \u201CService\u201D), including any related in-person meetups we host, and explains how we collect, safeguard, and disclose information resulting from your use of our Service.",
          ),
        ),
        p(
          t(
            "We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, the terms used herein have the same meanings as in our Terms of Service.",
          ),
        ),
        p(
          t(
            "Our Terms of Service (\u201CTerms\u201D) govern all use of our Service and, together with this Privacy Policy and our Legal Disclaimer, constitute your agreement with us (\u201CAgreement\u201D).",
          ),
        ),
      ],
    },
    {
      heading: "2. Data Controller",
      body: [
        p(
          t(
            "For the purposes of the UK General Data Protection Regulation (UK GDPR), the EU General Data Protection Regulation (EU GDPR), and other applicable data protection laws, the data controller is:",
          ),
        ),
        p(
          t(`Anant Jain\nEmail: ${SUPPORT_EMAIL}\nLocation: London, United Kingdom`),
        ),
      ],
    },
    {
      heading: "3. Definitions",
      body: [
        p(b("SERVICE:"), t(" The Bevy mobile application operated by Anant Jain.")),
        p(b("PERSONAL DATA:"), t(" Any information relating to an identified or identifiable natural person.")),
        p(
          b("USAGE DATA:"),
          t(" Data collected automatically, either generated by the use of the Service or from the Service infrastructure itself."),
        ),
        p(
          b("AI DATA:"),
          t(" Data processed by or generated through our artificial intelligence systems, including prompt identifiers and interaction patterns."),
        ),
        p(
          b("DATA CONTROLLER:"),
          t(" The natural or legal person who determines the purposes and means of processing personal data. For this Privacy Policy, Anant Jain is the Data Controller."),
        ),
        p(
          b("DATA PROCESSORS (OR SERVICE PROVIDERS):"),
          t(" Any natural or legal person who processes data on behalf of the Data Controller."),
        ),
        p(b("DATA SUBJECT:"), t(" Any living individual who is the subject of Personal Data.")),
        p(b("USER:"), t(" The individual using our Service. The User corresponds to the Data Subject.")),
      ],
    },
    {
      heading: "4. Legal Basis for Processing (UK GDPR / EU GDPR)",
      body: [
        p(t("We process your Personal Data on one or more of the following legal bases:")),
        bullets(
          [
            b("Consent:"),
            t(" You have given consent to the processing of your Personal Data for one or more specific purposes."),
          ],
          [
            b("Performance of a Contract:"),
            t(" Processing is necessary for the performance of a contract to which you are a party."),
          ],
          [
            b("Legitimate Interests:"),
            t(
              " Processing is necessary for our legitimate interests, such as improving the Service and understanding usage patterns, except where such interests are overridden by your interests or fundamental rights and freedoms.",
            ),
          ],
          [
            b("Legal Obligation:"),
            t(" Processing is necessary for compliance with a legal obligation to which we are subject."),
          ],
        ),
      ],
    },
    {
      heading: "5. No User Accounts",
      body: [
        p(
          t(
            "Bevy does not require or support user accounts. There is no registration, login, or sign-up process. We do not collect your name, email address, phone number, or any other account-related personal information. While we do not maintain user accounts, our analytics and subscription management services generate anonymous identifiers to provide the Service. These identifiers cannot be used to identify you personally.",
          ),
        ),
        p(
          t(
            "App preferences, user-created content (custom cards and packs), private card notes, achievement progress, and similar app state are stored on your device and, where you are signed into iCloud, also synced to your Apple iCloud account so they follow you across your Apple devices. We do not have a server-side copy of this data; the iCloud copy lives in your private iCloud database under your Apple ID and is governed by Apple\u2019s privacy practices. See \u00a76 (\u201CTypes of Data Collected\u201D) for the specifics of what is synced.",
          ),
        ),
      ],
    },
    {
      heading: "6. Types of Data Collected",
      body: [
        sub("Usage Data (via Analytics)"),
        p(
          t(
            "We use Mixpanel, a third-party analytics service, to collect anonymous usage data. This includes: device type and model, operating system version, the features of the Service you use, interaction patterns and frequency of use, session duration, app version, and anonymous device identifiers generated by Mixpanel. We do not collect your IP address directly, though Mixpanel may process IP addresses for geolocation purposes on their servers. Mixpanel\u2019s automatic event tracking is disabled; we only track specific, defined events.",
          ),
        ),
        sub("Onboarding Preferences"),
        p(
          t(
            "During onboarding, the app collects your gameplay preferences (such as play mode, mood, comfort level, and challenge style). These are sent to our analytics provider in anonymous, aggregated form to help us improve the Service. Your onboarding preferences are also stored locally on your device to personalise your experience.",
          ),
        ),
        sub("AI Interaction Data"),
        p(
          t(
            "When you use our AI-powered features, we send only a numeric prompt identifier to our AI backend. We do not send your personal data, the text of cards, your search queries, or any user-generated content to our servers. Interaction patterns (such as frequency of AI feature usage) are tracked anonymously via analytics.",
          ),
        ),
        sub("Subscription and Purchase Data"),
        p(
          t(
            "Subscription and in-app purchase transactions are processed entirely by Apple through the App Store. We use RevenueCat, a third-party subscription management service, to verify purchase status and manage entitlements. RevenueCat generates an anonymous user identifier that is cross-referenced with our analytics to understand subscription behaviour in aggregate. This anonymous identifier is included as a property on analytics events to enable aggregate analysis of subscription behaviour. We do not have access to your payment details, credit card information, or Apple ID.",
          ),
        ),
        sub("Sponsor Circle Data"),
        p(
          t(
            "If you make one or more Sponsor Circle contributions, we store the following data on your device in the iOS Keychain: the cumulative number of contributions you have made, the cumulative total contribution amount in your local currency at the time of purchase (in minor units, i.e. cents/pence), and the date of your first contribution. These three values, taken together, are what we use locally to determine your sponsor tier (Gunmetal / Cobalt / Palladium / Iridium) and to keep your \u201CPremium Edition for Life\u201D entitlement active even if your Apple subscription entitlement is not visible at the time of an offline check. Sponsor data uses iCloud Keychain rather than the iCloud database described under \u201CiCloud Data Sync\u201D \u2014 these are two separate Apple sync infrastructures that we use for different categories of data.",
          ),
        ),
        p(
          t(
            "Sponsor data is stored in the \u201Csyncable\u201D iOS Keychain namespace, which means it may be synced via iCloud Keychain across other Apple devices signed into the same Apple ID, subject to your iCloud Keychain settings. This is so your sponsor status and Premium-for-life grant follow you between your devices. If iCloud Keychain is disabled, the data remains on the device on which it was created. We do not have access to your sponsor data on our servers; it lives only on your device(s) and within Apple\u2019s iCloud Keychain infrastructure.",
          ),
        ),
        sub("Photo Library Access"),
        p(
          t(
            "With your permission, Bevy may save card images to your device\u2019s photo library. We do not read from or access your existing photos.",
          ),
        ),
        sub("Photography and Recording at In-Person Meetups"),
        p(
          t(
            `If you attend a Bevy in-person meetup, we may, with your prior consent obtained at the door (a verbal or written opt-in), take photographs or video footage that includes you for use in our marketing materials, social media, and the Bevy website. Photo/video consent is opt-in and separate from your sponsor status; declining does not affect your perks or your access to the meetup. You may withdraw your consent for future use at any time by emailing ${SUPPORT_EMAIL}. Where reasonably practicable, we will remove or anonymise existing imagery on request.`,
          ),
        ),
        sub("Local Notifications"),
        p(
          t(
            "With your permission, Bevy may send local notifications to remind you to play. These notifications are generated and scheduled entirely on your device and are not sent from any server. They may include promotional messages about the app.",
          ),
        ),
        sub("Widget Data"),
        p(
          t(
            "If you use the Bevy home screen widget, card prompts and related display data are shared between the app and the widget extension via a local shared container on your device. No data leaves your device for this purpose.",
          ),
        ),
        sub("Local Game Data"),
        p(t("Game progress, achievements, and gameplay statistics are stored on your device. Where iCloud sync is available (see below), they may also be mirrored to your private iCloud account so they follow you between devices signed into the same Apple ID.")),
        sub("iCloud Data Sync"),
        p(
          t(
            "Bevy uses Apple\u2019s iCloud (CloudKit private database and NSUbiquitousKeyValueStore) to keep your local data in sync across the Apple devices you sign into with the same Apple ID. The synced categories are: (a) your built-in card state (which cards you have saved or excluded from play, and any private notes you have written on the back of a card); (b) your user-created custom cards and packs (including any private notes on them); (c) your app preferences (NSFW toggle, selected app icon, current bundle, notification preferences, and game-setup options); and (d) your achievement progress (the master progress map and supporting counters). The iCloud copy lives in your own private iCloud database and your iCloud key-value store \u2014 we do not have access to it on our servers. If you are not signed into iCloud, or if iCloud sync is unavailable, this data simply remains on the device on which it was created. You can stop syncing at any time by signing out of iCloud or by disabling iCloud for Bevy in your device settings.",
          ),
        ),
        sub("Private Card Notes"),
        p(
          t(
            "Bevy lets you write a free-text private note on the back of any card. These notes are entirely private to you. They are stored in the same iCloud location as the rest of your card data described above; they are never sent to our servers, our analytics provider, or our AI infrastructure. Where a note exists on a card, viewing it from the back of the card is gated behind your device\u2019s biometric authentication or device passcode (see \u201CBiometric Authentication\u201D below).",
          ),
        ),
        sub("Biometric Authentication"),
        p(
          t(
            "Bevy uses Apple\u2019s LocalAuthentication framework to gate certain on-device actions behind your device\u2019s Face ID, Touch ID, or device passcode. The gates are: (i) enabling adult-content (\u201CNSFW\u201D) display from the safe-for-work default state; (ii) opening the back of a card that has a private note on it; and (iii) the optional \u201Cunlock notes for this session\u201D toggle. Your biometric data (face geometry or fingerprint) never leaves the device, and we never receive or store it. Apple\u2019s system simply tells our app whether the local authentication challenge succeeded or failed; we receive a boolean result and nothing more.",
          ),
        ),
        sub("Data We Do NOT Collect"),
        p(
          t(
            "We do not collect: your name, email address, or any personally identifiable contact information (except where you provide them to us voluntarily, e.g. by emailing us about a support issue or attending an in-person meetup); special category data (racial or ethnic origin, political opinions, religious beliefs, trade union membership, genetic or biometric data, health data, or data concerning sex life or sexual orientation); biometric template data of any kind (Face ID and Touch ID never leave your device); financial or payment information (all payments are processed by Apple); precise geolocation data; contacts, microphone, or any other device sensor data; the text content of cards you view, create, or interact with; or the text content of private notes you write on the back of cards.",
          ),
        ),
      ],
    },
    {
      heading: "7. Use of Data",
      body: [
        p(
          t(
            "We use the collected anonymous data for the following purposes: to provide and maintain our Service; to understand how the Service is used and identify areas for improvement; to detect, prevent, and address technical issues; to monitor aggregate usage patterns; and to improve the quality and relevance of AI-generated content using aggregated, anonymous data.",
          ),
        ),
        p(
          t(
            "We do not use, read, or analyse the content stored in your iCloud-synced app data (cards, packs, private notes, preferences, achievement progress). That data is held in your private iCloud database and on your device(s); we do not have a copy of it on our servers and we do not derive analytics insights from it.",
          ),
        ),
      ],
    },
    {
      heading: "8. Retention of Data",
      body: [
        p(
          t(
            `Anonymous analytics data is retained for up to 24 months. AI interaction data (prompt identifiers) is not stored on our servers beyond the duration of the request. Locally stored data (preferences, custom cards, packs, private notes, achievement progress) remains on your device until you delete the app or clear its data. Where iCloud sync is enabled, the same data is also stored in your private iCloud database and may persist there even after you delete the app from a particular device, until you sign out of iCloud or remove Bevy\u2019s data from your iCloud settings. Certain security-sensitive data (such as subscription status, token balances, and Sponsor Circle ledger fields) is stored in the iOS Keychain, which may persist across app reinstalls until manually cleared by the operating system. Sponsor Circle data specifically is stored in the syncable Keychain namespace and may persist across other Apple devices you sign into with the same Apple ID for as long as iCloud Keychain is enabled, even if you delete the app on every device. Photographs and video taken at in-person meetups, where you have consented, are retained for as long as we use them in our marketing materials; you may request removal at any time by emailing ${SUPPORT_EMAIL}. We will retain data as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.`,
          ),
        ),
      ],
    },
    {
      heading: "9. Transfer of Data",
      body: [
        p(
          t(
            "Your anonymous usage data may be processed by our service providers in countries outside the United Kingdom or the EEA. Where we transfer data outside of the UK or the EEA, we ensure that adequate safeguards are in place, including transfers to countries with an adequacy decision, the use of Standard Contractual Clauses (SCCs), and other lawful transfer mechanisms.",
          ),
        ),
        p(
          t(
            "Your iCloud-synced data (cards, packs, private notes, preferences, achievement progress, and Sponsor Circle ledger fields) is hosted by Apple in the regions Apple chooses based on your Apple ID and iCloud account location. Apple\u2019s data residency, encryption, and transfer practices are governed by Apple\u2019s privacy policy and end-user agreements, not by us. We do not control where Apple stores or processes this data because we do not hold it.",
          ),
        ),
      ],
    },
    {
      heading: "10. Disclosure of Data",
      body: [
        p(
          t(
            "We may disclose anonymous usage data: for law enforcement purposes if required by law; in connection with a business transaction such as a merger or acquisition; to our service providers bound by data processing agreements; and if we believe disclosure is necessary to protect the rights, property, or safety of the Company, our users, or others.",
          ),
        ),
      ],
    },
    {
      heading: "11. Security of Data",
      body: [
        p(
          t(
            "We implement appropriate technical and organisational measures to protect your data, including: encryption of data in transit using TLS/SSL; HMAC-signed API requests for AI service communication; secure storage of sensitive local data (subscription status, token balances) in the iOS Keychain; regular security assessments; and secure development practices. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.",
          ),
        ),
      ],
    },
    {
      heading: "12. Data Breach Notification",
      body: [
        p(
          t(
            "In the event of a personal data breach that is likely to result in a risk to the rights and freedoms of natural persons, we will notify the relevant supervisory authority within 72 hours, notify affected data subjects without undue delay where the breach is likely to result in a high risk, and document all personal data breaches.",
          ),
        ),
      ],
    },
    {
      heading: "13. Your Data Protection Rights Under UK GDPR and EU GDPR",
      body: [
        p(
          t(
            `If you are a resident of the United Kingdom, the EU, or the EEA, you have the following rights: the right of access; the right to rectification; the right to erasure; the right to restrict processing; the right to object to processing; the right to data portability; the right to withdraw consent; and rights related to automated decision-making. As we do not maintain user accounts, exercising these rights will primarily relate to your anonymous analytics data and to any meetup imagery in which you appear. Contact us at ${SUPPORT_EMAIL} and we will assist you in identifying and processing your request.`,
          ),
        ),
        p(
          b("Sponsor Circle data, iCloud-synced content, and locally stored data:"),
          t(
            " because this data lives on your device(s), in your private iCloud database, and inside iCloud Keychain (as applicable), you control it directly. You can delete it by: deleting the Bevy app from each device; signing out of iCloud or clearing iCloud Keychain; or removing Bevy\u2019s iCloud data from your device\u2019s Settings (Settings \u203a [Your Name] \u203a iCloud \u203a Manage Account Storage \u203a Bevy). We do not hold copies on our servers and therefore cannot delete this data on your behalf. Note that erasing local sponsor data will revoke the corresponding sponsor app icons and the \u201CPremium Edition for Life\u201D entitlement on the device or account from which it was erased.",
          ),
        ),
        p(
          t("You have the right to complain to the UK Information Commissioner\u2019s Office (ICO) at "),
          a(ICO_URL, ICO_URL),
          t(", or your local EU/EEA data protection authority."),
        ),
      ],
    },
    {
      heading: "14. Your Rights Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA)",
      body: [
        p(
          t(
            `If you are a California resident, you have the following rights: the right to know what Personal Data we collect; the right to delete; the right to correct; the right to opt-out of sale or sharing (we do not sell your data); the right to non-discrimination; and the right to limit use of sensitive personal information (we do not collect sensitive personal information as defined by the CCPA/CPRA). To exercise any of these rights, contact us at ${SUPPORT_EMAIL}. We will respond within 45 days.`,
          ),
        ),
      ],
    },
    {
      heading: "15. Service Providers",
      body: [
        p(t("We employ the following third-party service providers:")),
        bullets(
          [
            b("Mixpanel"),
            t(" \u2014 Analytics. Collects anonymous usage data to help us understand how the Service is used. To opt out, visit "),
            a("Mixpanel Opt-out", MIXPANEL_OPTOUT),
            t(". For more information, visit "),
            a("Mixpanel Terms", MIXPANEL_TERMS),
            t("."),
          ],
          [
            b("RevenueCat"),
            t(" \u2014 Subscription and purchase management. Verifies subscription status and manages in-app purchase entitlements."),
          ],
          [
            b("Modal"),
            t(" \u2014 AI infrastructure hosting. Hosts the backend that processes AI-powered features. Only numeric prompt identifiers are sent to this service; no personal data is transmitted."),
          ],
          [
            b("Apple iCloud"),
            t(" \u2014 Cross-device sync infrastructure. We use Apple\u2019s CloudKit private database, NSUbiquitousKeyValueStore, and iCloud Keychain to keep your app data (cards, packs, private notes, preferences, achievement progress, sponsor ledger) in sync across the Apple devices you sign into with the same Apple ID. The data lives in your private iCloud account, not on our servers. Apple\u2019s handling of this data is governed by Apple\u2019s own privacy policy."),
          ],
        ),
        p(
          t(
            "Mixpanel, RevenueCat, and Modal are bound by data processing agreements and are contractually obligated to keep data confidential and process it only as instructed. Apple iCloud is governed by your existing iCloud terms with Apple; we are not a party to that relationship.",
          ),
        ),
      ],
    },
    {
      heading: "16. No Advertising or Remarketing",
      body: [
        p(
          t(
            "We do not use any advertising SDKs, remarketing services, or behavioural advertising technologies. We do not serve ads within the app, and we do not share your data with advertising networks.",
          ),
        ),
      ],
    },
    {
      heading: "17. Links to Other Sites",
      body: [
        p(
          t(
            "Our Service may contain links to other sites not operated by us. We strongly advise you to review the Privacy Policy of every site you visit. We assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.",
          ),
        ),
      ],
    },
    {
      heading: "18. Children\u2019s Privacy",
      body: [
        p(
          t(
            `Our Service is not intended for use by children under the age of 18. We do not knowingly collect personally identifiable information from children under 18. If you become aware that a child has provided us with Personal Data, please contact us immediately at ${SUPPORT_EMAIL}.`,
          ),
        ),
      ],
    },
    {
      heading: "19. AI-Specific Privacy Disclosures",
      body: [
        p(
          t(
            "Our AI systems generate truth or dare prompts. Only a numeric prompt identifier is sent to our AI backend; no personal data, card text, or user-generated content is transmitted. Data shared with our AI infrastructure provider is governed by a data processing agreement. The Service uses AI to automatically generate content, but this does not produce legal effects concerning you.",
          ),
        ),
      ],
    },
    {
      heading: "20. International Data Transfers",
      body: [
        p(
          t(
            "For transfers outside the UK/EEA, we rely on UK adequacy regulations, the UK International Data Transfer Agreement (IDTA) or EU Standard Contractual Clauses (SCCs), and other appropriate safeguards. You may request a copy of the safeguards by contacting us.",
          ),
        ),
      ],
    },
    {
      heading: "21. Changes to This Privacy Policy",
      body: [
        p(
          t(
            "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the \u201CEffective date\u201D at the top. For material changes, we will make reasonable efforts to notify you via a prominent notice on our Service.",
          ),
        ),
      ],
    },
    {
      heading: "22. Contact Us",
      body: [
        p(
          t(
            "If you have any questions about this Privacy Policy, wish to exercise your data protection rights, or have a complaint, please contact us:",
          ),
        ),
        p(t(`By email: ${SUPPORT_EMAIL}\nOperator: Anant Jain\nLocation: London, United Kingdom`)),
        p(
          t("For UK residents, you may lodge a complaint with the ICO: "),
          a(ICO_COMPLAINT_URL, ICO_COMPLAINT_URL),
          t("."),
        ),
      ],
    },
  ],
};

// MARK: - Legal Disclaimer

export const disclaimerDoc: LegalDoc = {
  title: "Legal Disclaimer",
  effectiveDateLabel: "Last updated",
  effectiveDate: EFFECTIVE_DATE,
  intro: [
    [t("BEVY WAIVER AND RELEASE OF LIABILITY, ASSUMPTION OF RISK, AND INDEMNITY AGREEMENT")],
    [
      b(
        "IMPORTANT: PLEASE READ THIS LEGAL DISCLAIMER CAREFULLY BEFORE USING THE BEVY APPLICATION. THIS DOCUMENT FORMS PART OF YOUR AGREEMENT WITH US, TOGETHER WITH OUR ",
      ),
      a("TERMS OF SERVICE", TERMS_HREF),
      b(" AND "),
      a("PRIVACY POLICY", PRIVACY_HREF),
      b("."),
    ],
  ],
  sections: [
    {
      heading: "1. Participation Agreement",
      body: [
        p(
          t(
            "You, the consumer and end-user of this product, including every other user and participant with whom you may engage in Bevy activities, acknowledge that you shall abide by and be bound by all terms of this agreement and will comply with all applicable laws while participating in Bevy activities. By downloading, installing, or using the Bevy application, you confirm that you have read, understood, and agree to be bound by all terms herein. If you do not agree, you must not use the Bevy application.",
          ),
        ),
      ],
    },
    {
      heading: "2. AI-Generated Content Disclaimer",
      body: [
        p(t("Bevy uses artificial intelligence to generate truth or dare prompts and related content. You acknowledge and agree that:")),
        bullets(
          [t("AI-generated content is provided for entertainment purposes only and does not constitute professional advice of any kind.")],
          [t("Despite our best efforts, AI-generated content may occasionally be inaccurate, inappropriate, offensive, misleading, or unsuitable.")],
          [t("We do not guarantee that AI-generated content will be free from errors, bias, harmful suggestions, or inappropriate material.")],
          [t("You are solely responsible for evaluating the suitability, safety, and appropriateness of any AI-generated content before acting on it.")],
          [t("We expressly disclaim any and all liability for any actions taken by you or any third party based on AI-generated content.")],
          [t("You must not treat AI-generated prompts as instructions, directives, or commands. All content is merely a suggestion for entertainment.")],
          [t(`If you encounter harmful, inappropriate, or dangerous content, please report it immediately to ${SUPPORT_EMAIL}.`)],
        ),
      ],
    },
    {
      heading: "3. Assumption of Risk",
      body: [
        p(
          t(
            "You understand and acknowledge that engaging in truth or dare activities inherently involves risks including personal injury, emotional distress, property damage, and other losses. There may be risks not known or foreseeable at this time, including risks from the unpredictable nature of AI-generated content. You are aware of potential risks including physical injury, emotional harm, embarrassment, property damage, and in extreme cases, serious injury or death. You are under no obligation to perform any dare or answer any truth prompt. You are solely responsible for assessing safety before undertaking any activity. You should not participate while under the influence of substances that impair judgement. You should not participate if you have any medical or psychological condition that could be aggravated.",
          ),
        ),
        p(
          b(
            "YOU HEREBY ASSUME FULL RESPONSIBILITY AND VOLUNTARILY ASSUME ALL RISK for all damages, injuries, and losses that you and any other party may sustain in connection with Bevy activities.",
          ),
        ),
      ],
    },
    {
      heading: "3A. In-Person Meetups",
      body: [
        p(
          t(
            "Bevy may from time to time host in-person meetups (the \u201CMeetups\u201D) at third-party venues. Your attendance at a Meetup is entirely at your own risk and you specifically acknowledge and accept that:",
          ),
        ),
        bullets(
          [
            t(
              "The venue is not owned, controlled, or operated by us. We are not responsible for the condition of the venue, its compliance with health and safety regulations, the conduct of its staff, or any incident occurring on its premises (including, without limitation, slips, trips, falls, food allergies, alcohol-related harm, or property loss).",
            ),
          ],
          [
            t(
              "You are responsible for your own travel to and from the Meetup, including any costs and any incidents that occur during travel.",
            ),
          ],
          [
            t(
              "Where alcohol is consumed at a Meetup, you are responsible for moderating your own consumption and for arranging safe transportation home.",
            ),
          ],
          [
            t(
              "Other attendees are not employees, agents, or representatives of the Company. We are not responsible for the conduct of other attendees, and we make no representations about who will attend.",
            ),
          ],
          [
            t(
              "We may, but are not obligated to, intervene in any dispute or unsafe situation. If a situation feels unsafe, you should remove yourself from it immediately and, where appropriate, contact emergency services.",
            ),
          ],
          [
            t(
              "We may cancel, postpone, or relocate a Meetup at any time and for any reason. We are not liable for any expenses (travel, accommodation, time off work, etc.) you may incur in connection with a cancelled or relocated Meetup.",
            ),
          ],
          [
            t(
              "Sponsor Circle contributions are donations supporting the Service and Meetups generally; they do not entitle you to any specific Meetup, ticket, or refundable interest in any event. See our ",
            ),
            a("Terms of Service", TERMS_HREF),
            t(" for further detail."),
          ],
          [
            t(
              "If photographs or video are taken at a Meetup, your inclusion in marketing materials is contingent on your prior, opt-in consent. See our ",
            ),
            a("Privacy Policy", PRIVACY_HREF),
            t(" for further detail."),
          ],
        ),
      ],
    },
    {
      heading: "4. Health and Safety Warnings",
      body: [
        bullets(
          [t("Do not perform any dare that involves illegal activity, danger, or harm.")],
          [t("Do not perform any dare involving motor vehicles, heavy machinery, or equipment requiring full attention.")],
          [t("Do not perform any dare involving consuming substances to which you or others may be allergic.")],
          [t("Do not use the Service in situations where distraction could lead to injury (driving, swimming, cycling, etc.).")],
          [t("Ensure all participants are willing, consenting adults. Never coerce anyone to participate.")],
          [t("Respect the physical and emotional boundaries of all participants at all times.")],
          [t("If anyone feels unsafe, stop immediately.")],
          [t("If any injury occurs, seek appropriate medical attention immediately.")],
          [t("At in-person Meetups, follow the venue\u2019s safety rules and any reasonable instructions from the host.")],
        ),
      ],
    },
    {
      heading: "5. No Professional Advice",
      body: [
        p(
          t(
            "The Service and all content provided through it is for entertainment purposes only. Nothing constitutes medical, legal, psychological, financial, safety, or any other kind of professional advice. Always seek the advice of a qualified professional.",
          ),
        ),
      ],
    },
    {
      heading: "6. Release and Waiver",
      body: [
        p(
          b("TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW,"),
          t(
            " you hereby RELEASE, WAIVE, DISCHARGE, and COVENANT NOT TO SUE Anant Jain, the operator of this product, together with any affiliates, agents, contractors, service providers, and representatives (collectively, the \u201CReleasees\u201D), from any liability for all claims, demands, losses, expenses, or damages arising from: participating in Bevy activities; attending any in-person Bevy Meetup; acting on or relying upon AI-generated content; any interaction with other users or with other Meetup attendees; or any technical malfunction, error, or failure of the Service.",
          ),
        ),
        p(
          b(
            "NOTHING IN THIS DISCLAIMER SHALL EXCLUDE OR LIMIT LIABILITY FOR: (A) DEATH OR PERSONAL INJURY CAUSED BY NEGLIGENCE; (B) FRAUD OR FRAUDULENT MISREPRESENTATION; OR (C) ANY OTHER LIABILITY THAT CANNOT BE EXCLUDED OR LIMITED UNDER THE LAWS OF ENGLAND AND WALES.",
          ),
        ),
      ],
    },
    {
      heading: "7. Indemnification",
      body: [
        p(
          t(
            "You agree that if you or anyone on your behalf makes a claim against the Releasees as a result of Bevy activities, including activities prompted by AI-generated content or anything occurring at a Meetup, YOU SHALL INDEMNIFY, REIMBURSE, and HOLD HARMLESS the Releasees from all injuries, costs, damages, claims, and incidental damages, including legal fees.",
          ),
        ),
      ],
    },
    {
      heading: "8. Third-Party Content and Services",
      body: [
        p(
          t(
            "The Service may integrate with or link to third-party services, including AI infrastructure providers (Modal), analytics services (Mixpanel), subscription management services (RevenueCat), and Apple iCloud (CloudKit, NSUbiquitousKeyValueStore, and iCloud Keychain) for cross-device sync of your app data. We are not responsible for the content, privacy practices, or terms of any third-party service. Mixpanel, Modal, and RevenueCat are bound by data processing agreements with us; Apple iCloud operates under your existing iCloud terms with Apple.",
          ),
        ),
      ],
    },
    {
      heading: "9. Governing Law and Jurisdiction",
      body: [
        p(
          t(
            "This Legal Disclaimer shall be governed by and construed in accordance with the laws of England and Wales. Subject to the dispute resolution provisions in our Terms of Service, the courts of England and Wales shall have exclusive jurisdiction.",
          ),
        ),
      ],
    },
    {
      heading: "10. Severability",
      body: [
        p(t("If any provision is determined to be invalid, all other provisions remain valid and enforceable.")),
      ],
    },
    {
      heading: "11. Amendments",
      body: [
        p(
          t(
            "We reserve the right to modify this Legal Disclaimer at any time by posting the updated version and updating the \u201CLast updated\u201D date. Your continued use constitutes acceptance of those changes.",
          ),
        ),
      ],
    },
    {
      heading: "12. Entire Agreement",
      body: [
        p(
          t("This Legal Disclaimer, together with our "),
          a("Terms of Service", TERMS_HREF),
          t(" and "),
          a("Privacy Policy", PRIVACY_HREF),
          t(", constitutes the entire agreement between you and the Company regarding the matters addressed herein."),
        ),
      ],
    },
    {
      heading: "13. Acknowledgement",
      body: [
        p(
          b(
            "BY DOWNLOADING, INSTALLING, OR USING THE BEVY APPLICATION, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTAND THIS LEGAL DISCLAIMER AND ARE AWARE THAT BY USING THIS PRODUCT YOU MAY BE WAIVING IMPORTANT LEGAL RIGHTS TO THE MAXIMUM EXTENT PERMITTED BY LAW.",
          ),
        ),
      ],
    },
    {
      heading: "14. Contact Us",
      body: [
        p(t(`By email: ${SUPPORT_EMAIL}\nOperator: Anant Jain\nLocation: London, United Kingdom`)),
      ],
    },
  ],
};

// MARK: - Doc Lookup

/** Maps a route segment ("terms" / "privacy" / "disclaimer") to its
 *  document. Used by the layout to resolve the active doc for the
 *  download button. */
export const docsBySegment: Record<string, LegalDoc> = {
  terms: termsDoc,
  privacy: privacyDoc,
  disclaimer: disclaimerDoc,
};
