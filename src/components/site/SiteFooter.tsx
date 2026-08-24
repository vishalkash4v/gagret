import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Wrench, Youtube } from "lucide-react";

const quickLinks = [
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
  { label: "FAQ", to: "/faq" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Cancellation & Refund Policy", to: "/refund-policy" },
];

const socials = [
  { label: "HomeFix on Facebook", Icon: Facebook },
  { label: "HomeFix on Instagram", Icon: Instagram },
  { label: "HomeFix on LinkedIn", Icon: Linkedin },
  { label: "HomeFix on YouTube", Icon: Youtube },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Wrench className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-extrabold">HomeFix</span>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/75">
            Hyper-local home services with a fair bidding model. Free for customers, flat access fee
            for pros — no subscriptions, ever.
          </p>
          <ul className="mt-5 flex gap-2">
            {socials.map(({ label, Icon }) => (
              <li key={label}>
                <a
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/10 transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Quick links">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-foreground/90">Quick Links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-primary-foreground/75 transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-foreground/90">Legal</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {legalLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-primary-foreground/75 transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-foreground/90">Get in Touch</h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/75">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <a href="tel:+916230450047" className="hover:text-accent">+91 62304 50047</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <a href="mailto:cqlsysvishal@gmail.com" className="break-all hover:text-accent">
                cqlsysvishal@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <address className="not-italic">Una, Himachal Pradesh, India</address>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15 px-4 py-5 text-center text-xs text-primary-foreground/65">
        © 2026 HomeFix. All rights reserved.
      </div>
    </footer>
  );
}
