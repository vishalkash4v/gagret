import { createFileRoute } from "@tanstack/react-router";
import { PageLayout, Prose } from "@/components/site/PageLayout";

const title = "Terms & Conditions — HomeFix";
const description =
  "The terms governing use of the HomeFix home services app for customers and service providers, including the flat access fee model.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageLayout title="Terms & Conditions" intro="Last updated: 1 August 2026">
      <Prose>
        <h2>1. About the platform</h2>
        <p>
          HomeFix connects customers with independent local service professionals. We are a
          marketplace: the professional, not HomeFix, performs the service and is responsible for the
          quality of their work.
        </p>

        <h2>2. Customer terms</h2>
        <ul>
          <li>Using HomeFix as a customer is free — posting, bidding and booking carry no platform fee.</li>
          <li>Job descriptions must be accurate and lawful.</li>
          <li>Payment for completed work is settled directly with the professional at the accepted price.</li>
        </ul>

        <h2>3. Provider terms</h2>
        <ul>
          <li>No subscription and no percentage commission.</li>
          <li>A small flat access fee is payable only when a customer confirms your booking.</li>
          <li>Promotional free bookings (first 3 bookings, plus 3 per successful referral) are non-transferable and may not be combined with abuse of duplicate accounts.</li>
          <li>Providers must hold any licence or certification required for their trade.</li>
        </ul>

        <h2>4. Conduct</h2>
        <p>
          Off-platform solicitation to avoid access fees, fake reviews, and misuse of customer contact
          details may lead to suspension.
        </p>

        <h2>5. Liability</h2>
        <p>
          Our liability is limited to fees paid to HomeFix in the preceding three months. Disputes
          about workmanship are mediated by our support team in good faith.
        </p>

        <h2>6. Governing law</h2>
        <p>These terms are governed by the laws of India, with courts in Una, Himachal Pradesh having jurisdiction.</p>
      </Prose>
    </PageLayout>
  );
}
