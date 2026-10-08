import type { Demand, FileRef } from './store.ts'

const file = (name: string, mime: string, content: string, final = false): FileRef => ({
  name,
  size: new Blob([content]).size,
  url: `data:${mime};charset=utf-8,${encodeURIComponent(content)}`,
  final,
})

const seal = (bg: string, fg: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><circle cx="120" cy="120" r="112" fill="${bg}" stroke="${fg}" stroke-width="6"/><circle cx="120" cy="120" r="92" fill="none" stroke="${fg}" stroke-width="2"/><text x="120" y="112" text-anchor="middle" font-family="Georgia, serif" font-size="64" font-weight="700" fill="${fg}">50</text><text x="120" y="142" text-anchor="middle" font-family="Georgia, serif" font-size="20" letter-spacing="4" fill="${fg}">YEARS</text><text x="120" y="170" text-anchor="middle" font-family="Georgia, serif" font-size="13" letter-spacing="2" fill="${fg}">ON VERDI STREET</text></svg>`

const TEAM = { author: 'Arnaldo', role: 'team' } as const
const CLIENT = { author: "Anthony's team", role: 'client' } as const

/** Sample requests, written around what anthonysautocraft.com actually offers. */
export const seed: Demand[] = [
  {
    id: 'AAC-005',
    title: 'Blog post: OEM vs. aftermarket parts after a collision',
    service: 'SEO & AI',
    status: 'delivered',
    entries: [
      {
        id: 'AAC-005-1',
        at: '2026-08-27T09:30:00',
        ...CLIENT,
        headline: 'Requested',
        body: "Customers keep asking why our estimates are higher than the insurance company's preferred shop. We'd like a blog post that explains OEM parts versus aftermarket parts in plain language, something the front desk can send as a link.",
      },
      {
        id: 'AAC-005-2',
        at: '2026-09-01T14:10:00',
        ...TEAM,
        headline: 'Outline and target searches',
        status: 'progress',
        body: 'Checked what people in Marin search before they call a body shop. The post will answer three questions: what OEM means, when an insurer can push aftermarket parts in California, and what that changes for a lease return or a warranty claim.\n\nThe outline has six sections and ends with the free estimate phone number.',
      },
      {
        id: 'AAC-005-3',
        at: '2026-09-08T11:00:00',
        ...TEAM,
        headline: 'First draft ready',
        status: 'review',
        body: 'The draft is 1,150 words. It names the certifications you hold instead of talking about OEM in general, and it links to the Tesla, Mercedes-Benz and BMW pages.\n\nPlease check the paragraph about insurance supplements. It describes your process, so it has to match what the office really does.',
        files: [
          file(
            'oem-vs-aftermarket-draft.txt',
            'text/plain',
            'OEM vs. aftermarket parts after a collision (draft)\n\nSample file. The draft text of the article would be here.',
          ),
        ],
      },
      {
        id: 'AAC-005-4',
        at: '2026-09-10T08:45:00',
        ...CLIENT,
        body: "The insurance paragraph is right. One change: we don't offer a loaner, we coordinate a rental. Please fix that wording.",
      },
      {
        id: 'AAC-005-5',
        at: '2026-09-10T10:20:00',
        ...TEAM,
        body: 'Fixed. The post now says rental coordination everywhere.',
      },
      {
        id: 'AAC-005-6',
        at: '2026-09-15T16:00:00',
        ...TEAM,
        headline: 'Published on the blog',
        status: 'delivered',
        body: 'The post is live on the blog and linked from the Auto Body and Refinishing pages. The article and its three questions are marked up so search engines and AI assistants can quote the answers.\n\nThe final text is attached in case you want to reuse it in an email to customers.',
        files: [
          file(
            'oem-vs-aftermarket-parts.txt',
            'text/plain',
            'OEM vs. aftermarket parts after a collision\n\nSample file. The published text of the article would be here.',
            true,
          ),
        ],
      },
    ],
  },
  {
    id: 'AAC-006',
    title: 'Anniversary seal: 50 years on Verdi Street',
    service: 'Graphic Design',
    status: 'delivered',
    entries: [
      {
        id: 'AAC-006-1',
        at: '2026-08-31T10:15:00',
        ...CLIENT,
        headline: 'Requested',
        body: "We've been on Verdi Street for more than 50 years and it's only a line of text on the homepage. Can we get a seal for the site, Instagram and printed estimates?",
      },
      {
        id: 'AAC-006-2',
        at: '2026-09-03T15:30:00',
        ...TEAM,
        headline: 'First version of the seal',
        status: 'review',
        body: 'First version attached: a round seal in the dark blue and white of your logo, so it sits beside the OEM certification logos without competing with them.\n\nPlease confirm the wording before I finish the details: "50 years on Verdi Street" or "50+ years".',
        files: [file('verdi-street-seal-draft.svg', 'image/svg+xml', seal('#0b2a4a', '#ffffff'))],
      },
      {
        id: 'AAC-006-3',
        at: '2026-09-04T09:05:00',
        ...CLIENT,
        body: '"50 years on Verdi Street". We also need a version for the dark footer of the site.',
      },
      {
        id: 'AAC-006-4',
        at: '2026-09-09T13:40:00',
        ...TEAM,
        headline: 'Final seal delivered',
        status: 'delivered',
        body: 'The seal is final, in a color version and a white version for dark backgrounds. Both are vector files, so the print shop can scale them for estimates and window decals.\n\nThe color version is already on the homepage next to the review stars.',
        files: [
          file('verdi-street-seal-color.svg', 'image/svg+xml', seal('#0b2a4a', '#ffffff'), true),
          file('verdi-street-seal-white.svg', 'image/svg+xml', seal('none', '#ffffff'), true),
        ],
      },
    ],
  },
  {
    id: 'AAC-007',
    title: 'October social media calendar',
    service: 'Social Media',
    status: 'progress',
    entries: [
      {
        id: 'AAC-007-1',
        at: '2026-09-21T09:00:00',
        ...TEAM,
        headline: 'Requested',
        body: "October plan for Instagram and Facebook. I'm opening this so the shop can see what's scheduled and send photos for the posts that need them.",
      },
      {
        id: 'AAC-007-2',
        at: '2026-09-25T16:20:00',
        ...TEAM,
        headline: 'Twelve posts planned',
        status: 'progress',
        body: 'Twelve posts, three per week. Four show finished repairs, three explain a certification, two introduce people in the shop, two answer a common estimate question, and one covers the fall event.\n\nThe calendar is attached. Posts marked "photo needed" depend on pictures from the shop floor.',
        files: [
          file(
            'october-calendar.csv',
            'text/csv',
            'date,platform,topic,photo needed\n2026-10-05,Instagram,Finished repair,no\n2026-10-07,Facebook,What Mercedes-Benz Elite certification means,no\n2026-10-09,Instagram,Inside the paint booth,yes\n',
          ),
        ],
      },
      {
        id: 'AAC-007-3',
        at: '2026-10-02T11:10:00',
        ...TEAM,
        headline: 'First week scheduled',
        body: 'The posts for October 5, 7 and 9 are scheduled. The paint booth post on the 9th still uses an older photo and will be swapped as soon as a new one arrives.',
      },
      {
        id: 'AAC-007-4',
        at: '2026-10-05T08:30:00',
        ...CLIENT,
        body: 'Sending paint booth photos tomorrow for the week 2 posts.',
      },
    ],
  },
  {
    id: 'AAC-008',
    title: 'Tesla certification page refresh',
    service: 'Website',
    status: 'review',
    entries: [
      {
        id: 'AAC-008-1',
        at: '2026-09-14T10:00:00',
        ...CLIENT,
        headline: 'Requested',
        body: 'The Tesla page still talks about Model S and Model X only, and the approval badge is the old one. Most Teslas we see now are Model 3 and Model Y. Can we update it?',
      },
      {
        id: 'AAC-008-2',
        at: '2026-09-17T15:00:00',
        ...TEAM,
        headline: 'Audit of the current page',
        status: 'progress',
        body: "Went through the page the way a Tesla owner would after an accident. Four things stand out: the approval badge is the previous version, Model 3 and Model Y aren't mentioned, the main photo is 2.1 MB and slows the page on a phone, and the estimate phone number only appears at the bottom.\n\nPlan: rewrite the page around what a Tesla-approved repair changes for the owner, and move the estimate call to the top.",
      },
      {
        id: 'AAC-008-3',
        at: '2026-09-24T12:30:00',
        ...TEAM,
        headline: 'New copy and layout drafted',
        body: 'The draft opens with the approval and what it means in practice: structural repairs done with Tesla parts and procedures, which keeps the warranty intact. Below that come Model 3 and Model Y structural repair, aluminum work, rental coordination, and five questions owners ask before they choose a shop.\n\nThe copy is attached. Photos stay the same for now, except the main one, which I compressed.',
        files: [
          file(
            'tesla-page-copy-draft.txt',
            'text/plain',
            'Tesla-approved collision repair in San Rafael (draft)\n\nSample file. The draft copy of the page would be here.',
          ),
        ],
      },
      {
        id: 'AAC-008-4',
        at: '2026-09-25T09:20:00',
        ...CLIENT,
        body: 'Reads well. Should Rivian and Lucid be on this page too?',
      },
      {
        id: 'AAC-008-5',
        at: '2026-09-25T11:45:00',
        ...TEAM,
        body: 'Better on their own. Mixing brands would weaken this page for Tesla searches. I opened AAC-011 to expand the EV collision page for Rivian and Lucid.',
      },
      {
        id: 'AAC-008-6',
        at: '2026-10-02T14:00:00',
        ...TEAM,
        headline: 'Preview ready for your review',
        status: 'review',
        body: 'The new page is built on a private preview address, sent to your email today. Nothing on the live site has changed.\n\nWhat I need from you: confirm the list of models and the wording of the Tesla approval. After your OK it goes live the same day.',
      },
    ],
  },
  {
    id: 'AAC-009',
    title: 'Google Business Profile: new facility photos',
    service: 'Google Profile',
    status: 'review',
    entries: [
      {
        id: 'AAC-009-1',
        at: '2026-09-18T10:40:00',
        ...TEAM,
        headline: 'Requested',
        body: 'Most photos on the Google profile are several years old, and none show the aluminum repair bay or the paint booth. People comparing body shops on Maps look at the photos before they read anything.',
      },
      {
        id: 'AAC-009-2',
        at: '2026-09-23T13:15:00',
        ...TEAM,
        headline: 'Shot list sent',
        status: 'review',
        body: "Twelve photos would cover it: the front of the building from Verdi Street, the estimate desk, the aluminum bay, the frame bench, the paint booth, two finished cars and the team. The full list is attached, with the angle for each one.\n\nPhone photos are fine if they're taken in daylight and held sideways. Once they arrive I'll edit, name and upload them.",
        files: [
          file(
            'facility-shot-list.txt',
            'text/plain',
            'Facility shot list\n\n1. Front of the building from Verdi Street\n2. Estimate desk\n3. Aluminum repair bay\n4. Frame bench\n5. Paint booth\n\nSample file. The full list of twelve shots would be here.',
          ),
        ],
      },
      {
        id: 'AAC-009-3',
        at: '2026-09-30T08:50:00',
        ...CLIENT,
        body: "The photographer is here Thursday. You'll have them Friday.",
      },
    ],
  },
  {
    id: 'AAC-010',
    title: 'Google Ads: Marin County collision repair campaign',
    service: 'Paid Ads',
    status: 'progress',
    entries: [
      {
        id: 'AAC-010-1',
        at: '2026-09-22T09:10:00',
        ...CLIENT,
        headline: 'Requested',
        body: 'We want more estimate calls from Mill Valley, Tiburon and Sausalito. Mostly insurance collision work, not small dents.',
      },
      {
        id: 'AAC-010-2',
        at: '2026-09-26T14:30:00',
        ...TEAM,
        headline: 'Keyword and location plan',
        status: 'progress',
        body: 'Built the keyword list around collision repair and certified repair searches, and left out paintless dent and detailing terms so the budget goes to larger jobs. Targeting covers Mill Valley, Tiburon, Sausalito and Larkspur, with San Rafael at a lower bid since you already show up there without ads.',
        files: [
          file(
            'marin-collision-keywords.csv',
            'text/csv',
            'keyword,match type,location\ncollision repair mill valley,phrase,Mill Valley\nauto body shop tiburon,phrase,Tiburon\ncertified collision repair sausalito,phrase,Sausalito\ntesla approved body shop marin,phrase,Marin County\n',
          ),
        ],
      },
      {
        id: 'AAC-010-3',
        at: '2026-10-01T10:00:00',
        ...TEAM,
        headline: 'Campaign structure built',
        body: 'Three ad groups: collision repair, OEM certified repair and EV collision. Ads run Monday to Friday, 7 AM to 5 PM, so nobody calls a closed shop, and every ad carries the call button to (415) 456-7591.\n\nNothing is live yet. The account is yours, and Google bills the ad spend directly to your card.',
      },
      {
        id: 'AAC-010-4',
        at: '2026-10-06T16:45:00',
        ...TEAM,
        headline: 'Call and form tracking installed',
        body: 'Calls from ads and estimate form submissions now count as conversions, each tagged with the campaign that produced it. This is what lets the monthly report show cost per estimate request instead of clicks.\n\nNext: a final check of the ad copy, then launch.',
      },
    ],
  },
  {
    id: 'AAC-011',
    title: 'EV collision page: add Rivian and Lucid',
    service: 'Website',
    status: 'requested',
    entries: [
      {
        id: 'AAC-011-1',
        at: '2026-09-25T11:50:00',
        ...TEAM,
        headline: 'Requested',
        body: 'This came out of the Tesla page review (AAC-008). Rivian and Lucid owners search by brand, and the EV Collision Specialists page only mentions them in one sentence. Proposal: one section per brand on that page, with the structural repair details for each.',
      },
    ],
  },
  {
    id: 'AAC-012',
    title: 'Shop tour video for the Our Facility page',
    service: 'Brand Content',
    status: 'requested',
    entries: [
      {
        id: 'AAC-012-1',
        at: '2026-10-05T15:20:00',
        ...CLIENT,
        headline: 'Requested',
        body: "We'd like a short video walking through the shop for the Our Facility page. We already have the TV commercials, but nothing that shows the equipment.",
      },
      {
        id: 'AAC-012-2',
        at: '2026-10-07T09:30:00',
        ...TEAM,
        body: "Got it. I'll come back this week with a shot plan and what a filming morning would involve.",
      },
    ],
  },
]
