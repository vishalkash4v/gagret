import { createFileRoute } from "@tanstack/react-router";
import { PageLayout, Prose } from "@/components/site/PageLayout";

const title = "Cancellation & Refund Policy — Go4Task";
const description =
  "How cancellations work for Go4Task customers and when provider access fees are refunded or credited back.";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/refund-policy" },
    ],
    links: [{ rel: "canonical", href: "/refund-policy" }],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <PageLayout title="Cancellation & Refund Policy" intro="Last updated: 1 August 2026">
      <Prose>
        <h2>Customer cancellations</h2>
        <ul>
          <li>Cancelling before a professional arrives is always free.</li>
          <li>Because customers pay no platform fee, there is nothing for Go4Task to refund.</li>
          <li>Repeated late cancellations may temporarily limit new job postings.</li>
        </ul>

        <h2>Provider access fee refunds</h2>
        <p>The flat access fee is credited back to your wallet when:</p>
        <ul>
          <li>The customer cancels the booking before work begins.</li>
          <li>The customer is unreachable and support confirms a no-show.</li>
          <li>A duplicate or fraudulent job posting is detected.</li>
        </ul>
        <p>
          Approved refunds appear as wallet credit within 24 hours, or return to the original payment
          method in 5–7 business days on request.
        </p>

        <h2>Free promotional bookings</h2>
        <p>
          Bookings that used a free-booking credit are restored to your account if the job is
          cancelled by the customer.
        </p>

        <h2>How to raise a request</h2>
        <p>
          Open the booking in the app and tap <strong>Report an issue</strong>, or email
          cqlsysvishal@gmail.com with your booking ID. Most requests are resolved within 48 hours.
        </p>
      </Prose>
    </PageLayout>
  );
}
