import { createFileRoute } from "@tanstack/react-router";
import { PageLayout, Prose } from "@/components/site/PageLayout";

const title = "Privacy Policy — HomeFix";
const description =
  "How HomeFix collects, uses and protects customer and service provider data across our home services marketplace.";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/privacy-policy" },
    ],
    links: [{ rel: "canonical", href: "/privacy-policy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageLayout title="Privacy Policy" intro="Last updated: 1 August 2026">
      <Prose>
        <p>
          HomeFix ("we", "us") operates a hyper-local home services marketplace. This policy explains
          what we collect, why we collect it, and the choices you have.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li><strong>Account details:</strong> name, phone number, email address and city.</li>
          <li><strong>Job details:</strong> service descriptions, photos, preferred slots and approximate location used to match nearby professionals.</li>
          <li><strong>Provider verification:</strong> government ID, address proof and skill documents.</li>
          <li><strong>Usage data:</strong> device type, app version and diagnostic logs.</li>
        </ul>

        <h2>How we use your information</h2>
        <ul>
          <li>Match your job with verified professionals within a 50km radius.</li>
          <li>Enable bidding, chat, booking confirmations and support requests.</li>
          <li>Charge the provider access fee on confirmed bookings and prevent fraud.</li>
          <li>Send service updates and, with consent, offers such as free-booking promotions.</li>
        </ul>

        <h2>What we never do</h2>
        <p>
          We do not sell your personal data. Your exact address is shared with a professional only
          after you accept their bid.
        </p>

        <h2>Data retention and security</h2>
        <p>
          Data is stored on encrypted infrastructure and retained only as long as needed for legal,
          tax and dispute-resolution purposes. Access is restricted to authorised staff.
        </p>

        <h2>Your rights</h2>
        <p>
          You can request access, correction or deletion of your data, and withdraw marketing consent
          at any time by writing to <strong>cqlsysvishal@gmail.com</strong>.
        </p>

        <h2>Contact</h2>
        <p>
          HomeFix, Una, Himachal Pradesh, India. Phone: +91 62304 50047. Email:
          cqlsysvishal@gmail.com
        </p>
      </Prose>
    </PageLayout>
  );
}
