import { createFileRoute } from "@tanstack/react-router";
import { PageLayout, Prose } from "@/components/site/PageLayout";

const title = "About Go4Task — Customer & Provider Service Marketplace";
const description =
  "Learn how Go4Task connects customers with nearby service professionals through service requests, provider offers, KYC verification and booking confirmation.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageLayout
      title="About Go4Task"
      intro="One marketplace connecting people who need services with professionals who provide them."
    >
      <Prose>
        <p>
          Go4Task is designed as a two-sided service marketplace. A person can join as a customer and
          request a service, or join as a provider and offer eligible services to customers nearby.
        </p>

        <h2>For customers</h2>
        <p>
          Customers can create a service request with the required job details. Go4Task can automatically
          make that request available to nearby providers who match the relevant service and platform
          eligibility criteria. Providers can then respond with offers.
        </p>
        <p>
          Customers may receive multiple offers and can review, accept or reject them before choosing the
          provider they prefer. The selected provider completes the applicable final confirmation before
          the booking is assigned. Contact details may be shared between the customer and selected provider
          after the booking is confirmed so they can coordinate the service.
        </p>

        <h2>For providers</h2>
        <p>
          Providers choose the service categories they want to offer. The number of categories a provider
          may select is a platform setting and may be increased or decreased by Go4Task in the future.
          Providers must complete the applicable KYC and verification requirements before they can send
          eligible offers.
        </p>

        <h2>Verification and trust</h2>
        <p>
          Customer phone numbers are verified through OTP-based verification. Provider KYC is used for
          identity and eligibility checks. Verification is intended to support trust and platform safety;
          it does not constitute a guarantee that a provider will perform a service to a particular standard.
        </p>

        <h2>Platform fees and promotions</h2>
        <p>
          Go4Task may charge providers a platform fee for applicable orders or bookings. The applicable fee,
          structure and conditions may be changed by Go4Task from time to time, subject to applicable law
          and the information presented to users at the relevant time.
        </p>
        <p>
          Go4Task may also provide free bookings, credits or other promotional benefits to providers. Any
          such promotion may have eligibility conditions and may be changed, paused or withdrawn according
          to its stated terms.
        </p>

        <h2>Our role</h2>
        <p>
          Go4Task provides the technology and marketplace through which customers and providers can find
          each other, exchange offers and manage bookings. Unless expressly stated otherwise, service
          providers are independent parties responsible for the services they provide, their conduct,
          pricing, licences, permissions and legal obligations.
        </p>

        <h2>Contact</h2>
        <p>Go4Task, Una, Himachal Pradesh · +91 62304 50047 · cqlsysvishal@gmail.com</p>
      </Prose>
    </PageLayout>
  );
}
