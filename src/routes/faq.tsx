import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/site/PageLayout";

const title = "FAQ — Go4Task Home Services & Provider Access Fee";
const description =
  "Answers about Go4Task: how bidding works, why it is free for customers, the flat access fee for providers, and the first 3 free bookings offer.";

const faqs = [
  {
    q: "Is Go4Task really free for customers?",
    a: "Yes. Posting a job, receiving bids, chatting with pros and confirming a booking are 100% free. You only pay the professional for the work itself, at the price you accepted.",
  },
  {
    q: "How does the bidding model work?",
    a: "You describe the job and verified professionals within 50km send you quotes. You compare price, rating and distance, then accept the offer that suits you best.",
  },
  {
    q: "What do service providers pay?",
    a: "No subscriptions and no hidden commissions. A small flat access fee is charged only when a customer confirms your booking — if you don't win the job, you pay nothing.",
  },
  {
    q: "What is the current promo for providers?",
    a: "Your first 3 bookings are absolutely free. Refer another provider who joins and completes verification, and you get 3 more free bookings.",
  },
  {
    q: "How are professionals verified?",
    a: "Every pro submits government ID, address proof and skill details. We review documents and check reviews continuously; repeat low ratings remove a pro from the feed.",
  },
  {
    q: "Which services are available?",
    a: "Plumbing, electrical, carpentry, appliance repair, painting, deep cleaning, RO and AC servicing, pest control and general handyman work.",
  },
  {
    q: "Which areas do you serve?",
    a: "We are live in Una, Himachal Pradesh and surrounding towns, matching jobs within a 50km hyper-local radius. New districts are added every month.",
  },
  {
    q: "Is the iOS app available?",
    a: "The Android app is live now. The iOS app is in final review and will be announced on this page and in the app.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <PageLayout
      title="Frequently Asked Questions"
      intro="Everything about our bidding model, verification and the provider access fee."
    >
      <div className="space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="surface-card group px-5 py-4">
            <summary className="cursor-pointer list-none text-base font-semibold text-card-foreground marker:hidden">
              <h2 className="inline text-base font-semibold">{f.q}</h2>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </PageLayout>
  );
}
