import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/site/Button";
import { SEO_SERVICES, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";

const title = "Home Services — Plumbers, Electricians, AC, Cleaning & More | Go4Task";
const description =
  "Explore Go4Task home services including plumbing, electrical work, carpentry, AC repair, cleaning, painting, CCTV installation, Wi-Fi installation and more.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/services` },
      { property: "og:image", content: `${SITE_URL}/go4task-logo-hd.png` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: `${SITE_URL}/go4task-logo-hd.png` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/services` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${SITE_URL}/services#webpage`,
              url: `${SITE_URL}/services`,
              name: title,
              description,
              isPartOf: { "@id": `${SITE_URL}/#website` },
              about: { "@id": `${SITE_URL}/#organization` },
            },
            {
              "@type": "ItemList",
              itemListElement: SEO_SERVICES.map((service, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: service.name,
                url: `${SITE_URL}/services/${service.slug}`,
              })),
            },
          ],
        }),
      },
    ],
  }),
  component: ServicesIndexPage,
});

function ServicesIndexPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-secondary px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-primary shadow-[var(--shadow-soft)]">
              <Search className="h-4 w-4" aria-hidden="true" />
              Home services marketplace
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">Find the right home service professional</h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              {SITE_DESCRIPTION} Browse service categories below, then open the app to request the service you need and receive offers from eligible nearby providers.
            </p>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6" aria-labelledby="services-heading">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="services-heading" className="text-2xl font-extrabold sm:text-3xl">Popular services</h2>
                <p className="mt-2 text-sm text-muted-foreground">Service availability varies by area and active provider coverage.</p>
              </div>
              <Link to="/faq" className="text-sm font-semibold text-primary hover:underline">Read common questions</Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SEO_SERVICES.map((service) => (
                <Link
                  key={service.slug}
                  to="/services/$service"
                  params={{ service: service.slug }}
                  className="surface-card group flex h-full flex-col p-5 transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{service.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                </Link>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-primary/10 bg-primary-soft/60 p-6 sm:p-8">
              <h2 className="text-xl font-extrabold">Need a service that is not listed?</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Go4Task can expand its service catalogue over time. If your service is available in the app, you can request it directly and the platform can route the request to eligible providers.
              </p>
              <Button as="a" href="/#download" variant="accent" size="lg" className="mt-5">Get the Go4Task App</Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
