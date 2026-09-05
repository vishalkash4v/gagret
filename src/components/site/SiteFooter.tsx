import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";

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
  { label: "Go4Task on Facebook", Icon: Facebook, href: "https://www.facebook.com/profile.php?id=61593731445729" },
  { label: "Go4Task on Instagram", Icon: Instagram, href: "https://www.instagram.com/go4task" },
  { label: "Go4Task on X", Icon: Twitter, href: "https://x.com/go4task" },
  { label: "Go4Task on LinkedIn", Icon: Linkedin, href: "https://www.linkedin.com/in/go-for-task-a79a63433/" },
  { label: "Go4Task on YouTube", Icon: Youtube, href: "https://youtube.com/@go4task?si=qWGlwqbmvFtJUEsx" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-primary/20 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="inline-flex items-center rounded-md bg-white px-3 py-1.5" aria-label="Go4Task home">
            <img
              src="/go4task-logo.png"
              alt="Go4Task - Home Services Marketplace"
              width={180}
              height={68}
              className="h-12 w-auto object-contain"
              loading="lazy"
            />
          </Link>
          <p className="mt-4 text-sm text-primary-foreground/80">
            A service marketplace that helps customers request services, compare eligible provider offers and complete bookings through the Go4Task app.
          </p>
          <ul className="mt-5 flex gap-2">
            {socials.map(({ label, Icon, href }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/10 transition-colors hover:bg-accent hover:text-accent-foreground">
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
              <li key={l.to}><Link to={l.to} className="text-primary-foreground/80 transition-colors hover:text-accent">{l.label}</Link></li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-foreground/90">Legal</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {legalLinks.map((l) => (
              <li key={l.to}><Link to={l.to} className="text-primary-foreground/80 transition-colors hover:text-accent">{l.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-foreground/90">Get in Touch</h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><a href="tel:+916230450047" className="hover:text-accent">+91 62304 50047</a></li>
            <li className="flex items-start gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><a href="mailto:go4task@gmail.com" className="break-all hover:text-accent">go4task@gmail.com</a></li>
            <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><address className="not-italic">Una, Himachal Pradesh, India</address></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15 px-4 py-5 text-center text-xs text-primary-foreground/70">© 2026 Go4Task. All rights reserved.</div>
    </footer>
  );
}
