import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/site/PageLayout";

const title = "FAQ — Go4Task Customer & Provider Marketplace";
const description =
  "Answers about Go4Task service requests, nearby providers, multiple offers, KYC, booking confirmation, platform fees and provider promotions.";

const faqs = [
  {
    q: "Can I join Go4Task as a customer or a provider?",
    a: "Yes. Go4Task supports both customer and provider accounts. Customers can request services, while providers can offer the services they are eligible to provide.",
  },
  {
    q: "How does a customer request a service?",
    a: "The customer selects the required service and submits the relevant request details. Go4Task can automatically make the request available to nearby providers who match the applicable service and eligibility criteria.",
  },
  {
    q: "Can a customer receive multiple offers?",
    a: "Yes. Multiple eligible providers may send offers for the same request. The customer can review the available offers and accept or reject them according to the options provided in the app.",
  },
  {
    q: "How is the provider finally assigned?",
    a: "After reviewing offers, the customer selects a preferred provider. The applicable final confirmation is then completed before the selected provider is assigned to the booking. Once confirmed, relevant contact details may be shared so both parties can coordinate the service.",
  },
  {
    q: "Why does a provider need KYC?",
    a: "Provider KYC is part of Go4Task's verification and eligibility process. A provider must complete the applicable KYC requirements before being permitted to send eligible offers. KYC verification does not guarantee the quality, safety or outcome of a service.",
  },
  {
    q: "How is my phone number verified?",
    a: "Customer phone numbers are verified through OTP-based verification using Firebase or another verification service used by Go4Task.",
  },
  {
    q: "How many services can a provider select?",
    a: "The provider service-category limit is a platform setting. It may currently be limited to a certain number, such as three, and Go4Task may increase or decrease that limit in the future.",
  },
  {
    q: "Does Go4Task charge a platform fee?",
    a: "Go4Task may charge a platform fee on applicable orders or bookings. The applicable amount, structure and conditions may be updated from time to time and will be governed by the information and terms applicable when the booking is processed.",
  },
  {
    q: "Do providers get free bookings or promotions?",
    a: "Go4Task may offer eligible providers free bookings, credits or other promotional benefits. The number and conditions of these benefits can change, and a promotion may be paused or withdrawn subject to its stated terms.",
  },
  {
    q: "Does KYC mean a provider is guaranteed to be trustworthy?",
    a: "No. KYC and verification are intended to support platform safety and identity checks. They are not a guarantee of a provider's conduct, workmanship, licensing status or service result.",
  },
  {
    q: "What happens if a provider behaves improperly?",
    a: "Go4Task may investigate complaints, restrict or suspend accounts, preserve relevant records and disclose KYC or other relevant information to authorised authorities where required or permitted by applicable law.",
  },
  {
    q: "Which services and locations are available?",
    a: "Available services and locations depend on the current Go4Task platform coverage and provider availability. The catalogue and service area may expand or change over time.",
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
      intro="Everything about customer requests, provider offers, verification and booking confirmation."
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
