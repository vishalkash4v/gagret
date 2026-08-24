import { createFileRoute } from "@tanstack/react-router";
import { PageLayout, Prose } from "@/components/site/PageLayout";

const title = "About Us — HomeFix Hyper-Local Home Services";
const description =
  "HomeFix is a hyper-local home services app built in Una, Himachal Pradesh, with free bookings for customers and a fair flat access fee for pros.";

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
      title="About HomeFix"
      intro="A fairer way to book home services in small-town India."
    >
      <Prose>
        <p>
          HomeFix started in Una, Himachal Pradesh with a simple frustration: finding a reliable
          plumber or electrician meant calling three neighbours and hoping. Meanwhile, skilled local
          pros were paying heavy subscriptions and commissions to big platforms for leads that rarely
          converted.
        </p>

        <h2>Our model</h2>
        <ul>
          <li><strong>Customers pay nothing.</strong> Post a job, collect bids, hire the best.</li>
          <li><strong>Providers keep their earnings.</strong> One small flat access fee, charged only on a confirmed booking.</li>
          <li><strong>Everything stays local.</strong> Jobs are matched inside a 50km radius.</li>
        </ul>

        <h2>What we care about</h2>
        <p>
          Verified identities, honest quotes, and pros who are treated like partners rather than
          leads. Every rupee a professional earns beyond the access fee stays with them.
        </p>

        <h2>Say hello</h2>
        <p>
          HomeFix, Una, Himachal Pradesh · +91 62304 50047 · cqlsysvishal@gmail.com
        </p>
      </Prose>
    </PageLayout>
  );
}
