import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Download, MapPin, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/site/Button";
import {
  getServiceBySlug,
  humanizeServiceSlug,
  SITE_DESCRIPTION,
  SITE_URL,
} from "@/lib/seo";

export const Route = createFileRoute("/services/$service")({
  head: ({ params }) => {
    const service = getServiceBySlug(params.service);
    const name = service?.name ?? humanizeServiceSlug(params.service);
    const description =
      service?.description ??
      `Explore ${name} on Go4Task and check whether eligible professionals are available in your area.`;
    const canonical = `${SITE_URL}/services/${encodeURIComponent(params.service.toLowerCase())}`;

    return {
      meta: [
        {
          title: `${name} Near Me — Book ${service?.shortName ?? name} | Go4Task`,
        },
        { name: "description", content: description },
        {
          name: "robots",
          content: service ? "index, follow, max-image-preview:large" : "noindex, follow",
        },
        { property: "og:title", content: `${name} Near Me — Go4Task` },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonical },
        { property: "og:image", content: `${SITE_URL}/go4task-logo-hd.png` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${name} Near Me — Go4Task` },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: `${SITE_URL}/go4task-logo-hd.png` },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: service
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "WebPage",
                    "@id": `${canonical}#webpage`,
                    url: canonical,
                    name: `${name} Near Me — Book ${service.shortName} | Go4Task`,
                    description,
                    isPartOf: { "@id": `${SITE_URL}/#website` },
                  },
                  {
                    "@type": "Service",
                    "@id": `${canonical}#service`,
                    name: service.shortName,
                    serviceType: service.name,
                    description,
                    url: canonical,
                    provider: { "@id": `${SITE_URL}/#organization` },
                    areaServed: { "@type": "Country", name: "India" },
                    availableChannel: {
                      "@type": "ServiceChannel",
                      serviceUrl: `${SITE_URL}/#download`,
                    },
                  },
                  {
                    "@type": "BreadcrumbList",
                    itemListElement: [
                      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
                      { "@type": "ListItem", position: 3, name: service.name, item: canonical },
                    ],
                  },
                ],
              }),
            },
          ]
        : [],
    };
  },
  component: ServicePage,
});

function ServicePage() {
  const { service: slug } = Route.useParams();
  const service = getServiceBySlug(slug);
  const name = service?.name ?? humanizeServiceSlug(slug);

  if (!service) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="max-w-xl text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-primary">Service not found</p>
            <h1 className="mt-3 text-3xl font-extrabold">{name}</h1>
            <p className="mt-4 text-muted-foreground">
              This service page is not currently part of the public Go4Task service catalogue. Check the services directory for currently supported categories.
            </p>
            <Button as="a" href="/services" variant="accent" size="lg" className="mt-6">Browse all services</Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-secondary px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/services" className="hover:text-foreground hover:underline">Services</Link>
              <span className="mx-2">/</span>
              <span>{service.name}</span>
            </nav>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary shadow-[var(--shadow-soft)]">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  Home service
                </span>
                <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  {service.name} <span className="text-accent">near you</span>
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                  {service.description} Go4Task helps you create a service request, receive offers from eligible providers and choose the professional that fits your requirements. Actual availability depends on your location and active provider coverage.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button as="a" href="/#download" variant="accent" size="lg">
                    <Download className="h-5 w-5" aria-hidden="true" />
                    Book {service.name}
                  </Button>
                  <Button as="a" href="/services" variant="muted" size="lg">Browse other services</Button>
                </div>
              </div>

              <div className="surface-card p-6 sm:p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-extrabold">A simple way to get started</h2>
                <ol className="mt-5 space-y-4">
                  {[
                    "Choose the service and describe what you need.",
                    "Your request can reach eligible nearby providers.",
                    "Review available offers and provider information.",
                    "Select your preferred offer and complete confirmation.",
                  ].map((item, index) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{index + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6" aria-labelledby="jobs-heading">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <h2 id="jobs-heading" className="text-3xl font-extrabold sm:text-4xl">Common {service.name.toLowerCase()} jobs</h2>
              <p className="mt-3 text-muted-foreground">When available in your area, providers may be able to help with tasks such as:</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {service.jobs.map((job) => (
                <article key={job} className="surface-card flex items-start gap-3 p-5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                  <h3 className="text-sm font-bold">{job}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-secondary px-4 py-14 sm:px-6" aria-labelledby="service-faq-heading">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <h2 id="service-faq-heading" className="text-3xl font-extrabold">Questions about {service.name.toLowerCase()}</h2>
              <p className="mt-3 text-muted-foreground">Availability, pricing and provider response depend on the request and your area.</p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <details className="surface-card p-5">
                <summary className="cursor-pointer font-bold">Can I book {service.name.toLowerCase()} near me?</summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Open the Go4Task app, choose the service and enter your job details. If eligible providers are active in your area, the request can be made available to them.</p>
              </details>
              <details className="surface-card p-5">
                <summary className="cursor-pointer font-bold">Can I compare more than one offer?</summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Multiple eligible providers may send offers. You can review the available offers and select the one that suits your requirements.</p>
              </details>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-2xl bg-promo-gradient p-7 text-accent-foreground shadow-lift sm:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground/75">Go4Task marketplace</p>
                <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">Ready to request {service.name.toLowerCase()}?</h2>
                <p className="mt-3 text-sm leading-relaxed text-accent-foreground/85">{SITE_DESCRIPTION} Download the app and check current provider availability for your area.</p>
              </div>
              <Button as="a" href="/#download" variant="primary" size="lg" className="w-full md:w-auto">
                Get the app <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6">
          <div className="mx-auto max-w-6xl text-center">
            <Link to="/services" className="text-sm font-semibold text-primary hover:underline">Back to all Go4Task services</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
