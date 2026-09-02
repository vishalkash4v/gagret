import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageLayout } from "@/components/site/PageLayout";

const title = "Contact Go4Task — Support for Customers & Providers";
const description =
  "Reach the Go4Task team in Una, Himachal Pradesh. Call +91 62304 50047 or email cqlsysvishal@gmail.com for support, partnerships or provider onboarding.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const items = [
  {
    Icon: Phone,
    label: "Call or WhatsApp",
    value: "+91 62304 50047",
    href: "tel:+916230450047",
    note: "Mon–Sat, 9:00 AM – 8:00 PM IST",
  },
  {
    Icon: Mail,
    label: "Email us",
    value: "cqlsysvishal@gmail.com",
    href: "mailto:cqlsysvishal@gmail.com",
    note: "Replies within one working day",
  },
  {
    Icon: MapPin,
    label: "Visit us",
    value: "Una, Himachal Pradesh, India",
    note: "Serving a 50km hyper-local radius",
  },
];

function ContactPage() {
  return (
    <PageLayout
      title="Contact Us"
      intro="Questions about a booking, a bid, or joining as a verified pro? We're one message away."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(({ Icon, label, value, href, note }) => (
          <article key={label} className="surface-card p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-base font-bold">{label}</h2>
            {href ? (
              <a href={href} className="mt-1 block break-all font-semibold text-primary hover:underline">
                {value}
              </a>
            ) : (
              <p className="mt-1 font-semibold text-foreground">{value}</p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">{note}</p>
          </article>
        ))}
      </div>
    </PageLayout>
  );
}
