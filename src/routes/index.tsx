import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Apple,
  BadgeCheck,
  CalendarDays,
  ClipboardList,
  Gift,
  Handshake,
  IndianRupee,
  MapPinned,
  Play,
  Send,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  Users,
} from "lucide-react";
import heroImage from "@/assets/hero-handyman.jpg";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { AppShowcase } from "@/components/site/AppShowcase";
import { Button } from "@/components/site/Button";
import { StoreBadges } from "@/components/site/StoreBadges";

const title = "Go4Task — Find Local Service Professionals & Get Multiple Offers";
const description =
  "Go4Task connects customers with nearby eligible service professionals. Request a service, receive offers, compare providers, select your preferred provider and complete the booking confirmation.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Go4Task",
          description,
          telephone: "+91-6230450047",
          email: "go4task@gmail.com",
          areaServed: "India",
        }),
      },
    ],
  }),
  component: LandingPage,
});

const customerSteps = [
  {
    Icon: ClipboardList,
    title: "Create a Service Request",
    text: "Choose the service you need, describe the work, add the required details and submit your request.",
  },
  {
    Icon: MapPinned,
    title: "Reach Nearby Providers",
    text: "Your request is automatically made available to nearby providers who are eligible for that service.",
  },
  {
    Icon: Send,
    title: "Receive Multiple Offers",
    text: "Eligible providers can send their offers. Review price, provider details, ratings and other available information.",
  },
  {
    Icon: Handshake,
    title: "Select & Confirm",
    text: "Accept or reject offers and choose the provider that suits you. The applicable final confirmation is completed before assignment.",
  },
];

const providerSteps = [
  {
    Icon: Users,
    title: "Choose Your Services",
    text: "Join as a provider and select the service categories you currently offer. Go4Task may increase or decrease the permitted number of categories.",
  },
  {
    Icon: UserRoundCheck,
    title: "Complete KYC",
    text: "Complete the required KYC and verification process. Providers must meet applicable eligibility requirements before sending offers.",
  },
  {
    Icon: MapPinned,
    title: "Receive Nearby Requests",
    text: "Relevant customer requests can be shown to eligible providers based on service, location and other platform criteria.",
  },
  {
    Icon: IndianRupee,
    title: "Send an Offer",
    text: "Review a request and submit your price and offer details. Applicable platform fees and promotional rules may change from time to time.",
  },
];

const features = [
  {
    Icon: ShieldCheck,
    title: "Phone Verification",
    text: "Customer phone numbers are verified through OTP-based verification using Firebase or another verification service used by Go4Task.",
  },
  {
    Icon: BadgeCheck,
    title: "Provider KYC",
    text: "Provider KYC helps Go4Task verify eligibility and maintain platform trust. Verification does not guarantee service quality or outcomes.",
  },
  {
    Icon: Users,
    title: "Multiple Provider Offers",
    text: "Customers can receive and evaluate multiple offers before selecting a provider, subject to provider availability and platform rules.",
  },
  {
    Icon: Handshake,
    title: "Confirmation Before Assignment",
    text: "After a customer selects an offer, the applicable final confirmation is completed before the provider is assigned to the booking.",
  },
];

function LandingPage() {
  const [audience, setAudience] = useState<"customers" | "providers">("customers");
  const steps = audience === "customers" ? customerSteps : providerSteps;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main>
        <section className="bg-hero-gradient text-primary-foreground" aria-labelledby="hero-heading">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/12 px-3 py-1.5 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                One app for customers & service professionals
              </span>
              <h1 id="hero-heading" className="mt-5 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
                Find the Right Professional for Your Task.
              </h1>
              <p className="mt-5 max-w-xl text-base text-primary-foreground/85 sm:text-lg">
                Request a service, reach nearby eligible providers, receive multiple offers, compare your options and choose the provider that works best for you.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button as="a" href="#download" variant="accent" size="lg">
                  <Play className="h-5 w-5" aria-hidden="true" />
                  Download Android App
                </Button>
                <Button as="button" type="button" variant="muted" size="lg" disabled aria-disabled="true">
                  <Apple className="h-5 w-5" aria-hidden="true" />
                  iOS App — Coming Soon
                </Button>
              </div>

              <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
                {[
                  ["1", "Request a service"],
                  ["2", "Compare offers"],
                  ["3", "Confirm your provider"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/8 p-4">
                    <span className="text-2xl font-extrabold text-accent">{value}</span>
                    <span className="mt-1 block text-sm font-semibold">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src={heroImage}
                alt="Go4Task service professional with toolkit"
                width={1280}
                height={1024}
                className="w-full rounded-2xl object-cover shadow-lift"
              />
              <div className="surface-card absolute -bottom-5 left-4 flex items-center gap-3 px-4 py-3 sm:left-8">
                <BadgeCheck className="h-6 w-6 text-success" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-card-foreground">Provider verification</p>
                  <p className="text-xs text-muted-foreground">KYC is required for eligible provider offers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="for-providers" aria-labelledby="promo-heading" className="px-4 py-12 sm:px-6">
          <div className="bg-promo-gradient mx-auto max-w-6xl rounded-2xl px-6 py-9 text-accent-foreground shadow-lift sm:px-10">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-accent-foreground/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  <Gift className="h-3.5 w-3.5" aria-hidden="true" />
                  Provider promotional offer
                </span>
                <h2 id="promo-heading" className="mt-4 text-2xl font-extrabold sm:text-3xl">
                  Start providing services with Go4Task
                </h2>
                <p className="mt-3 text-sm font-medium text-accent-foreground/90 sm:text-base">
                  Go4Task may provide free bookings or other promotional benefits to eligible providers. The number, eligibility, duration and conditions of these promotions may be changed, paused or withdrawn at any time.
                </p>
              </div>
              <Button as="a" href="#download" variant="primary" size="lg" className="w-full md:w-auto">
                Join as a Provider
              </Button>
            </div>
          </div>
        </section>

        <section id="how-it-works" aria-labelledby="how-heading" className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 id="how-heading" className="text-3xl font-extrabold sm:text-4xl">How Go4Task Works</h2>
              <p className="mt-3 text-muted-foreground">
                A simple customer-to-provider workflow designed around requests, offers and final confirmation.
              </p>
            </div>

            <div role="tablist" aria-label="Choose audience" className="mx-auto mt-8 flex w-full max-w-xs rounded-xl border border-border bg-secondary p-1">
              {(["customers", "providers"] as const).map((key) => (
                <button
                  key={key}
                  role="tab"
                  type="button"
                  id={`tab-${key}`}
                  aria-selected={audience === key}
                  aria-controls="steps-panel"
                  onClick={() => setAudience(key)}
                  className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold capitalize transition-colors ${audience === key ? "bg-card text-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground hover:text-foreground"}`}
                >
                  For {key}
                </button>
              ))}
            </div>

            <ol id="steps-panel" role="tabpanel" aria-labelledby={`tab-${audience}`} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(({ Icon, title: stepTitle, text }, i) => (
                <li key={stepTitle} className="surface-card p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-display text-2xl font-extrabold text-border">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{stepTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="flow-heading" className="bg-secondary px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-primary shadow-[var(--shadow-soft)]">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                Built around your booking journey
              </span>
              <h2 id="flow-heading" className="mt-4 text-3xl font-extrabold sm:text-4xl">
                Request → Offers → Selection → Final Confirmation
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Customers start with a service request. Nearby eligible providers can respond with offers. Customers may accept or reject offers and choose the provider they prefer. The applicable final confirmation is then completed; once the booking is assigned, contact details can be shared between the customer and the selected provider to coordinate the service.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Customer phone verification by OTP",
                  "Provider KYC before eligible offers",
                  "Multiple offers can be compared",
                  "Contact details shared after confirmation",
                ].map((item) => (
                  <div key={item} className="surface-card flex items-start gap-3 p-4 text-sm font-semibold">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <img
              src="/go4task-customer-home.png"
              alt="Go4Task customer app showing services and offers"
              width={941}
              height={1672}
              loading="lazy"
              decoding="async"
              className="mx-auto max-h-[680px] w-auto rounded-2xl shadow-lift"
            />
          </div>
        </section>

        <AppShowcase />

        <section aria-labelledby="why-heading" className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 id="why-heading" className="text-3xl font-extrabold sm:text-4xl">Why Go4Task?</h2>
              <p className="mt-3 text-muted-foreground">
                A marketplace workflow that keeps verification, choice and booking confirmation at the centre.
              </p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ Icon, title: featureTitle, text }) => (
                <article key={featureTitle} className="surface-card p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-soft text-success">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-bold">{featureTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="download" aria-labelledby="download-heading" className="bg-hero-gradient px-4 py-16 text-primary-foreground sm:px-6">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 id="download-heading" className="text-3xl font-extrabold sm:text-4xl">
                One app. Two ways to get things done.
              </h2>
              <p className="mt-4 max-w-xl text-primary-foreground/85">
                Join as a customer to request services and compare provider offers, or join as a provider to offer your skills to nearby customers after completing the applicable verification.
              </p>
              <StoreBadges className="mt-8" />
              <p className="mt-5 text-sm text-primary-foreground/70">
                Need more details? <Link to="/faq" className="font-semibold underline hover:text-accent">Read the FAQ</Link>{" "}
                or <Link to="/contact" className="font-semibold underline hover:text-accent">talk to our team</Link>.
              </p>
            </div>
            <div className="surface-card overflow-hidden p-2">
              <img
                src="/go4task-signup.png"
                alt="Go4Task signup screen for customers and providers"
                width={941}
                height={1672}
                loading="lazy"
                decoding="async"
                className="mx-auto max-h-[620px] w-auto rounded-xl"
              />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
