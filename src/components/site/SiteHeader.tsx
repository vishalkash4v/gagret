import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Wrench, Download } from "lucide-react";
import { Button } from "./Button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "For Providers", href: "/#for-providers" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2" aria-label="HomeFix home">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight">
            Home<span className="text-accent">Fix</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button as="a" href="/#download" variant="accent" size="md">
            <Download className="h-4 w-4" aria-hidden="true" />
            Download App
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground md:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <nav aria-label="Mobile" className="border-t border-border bg-background px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button as="a" href="/#download" variant="accent" size="md" className="mt-3 w-full" onClick={() => setOpen(false)}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Download App
          </Button>
        </nav>
      )}
    </header>
  );
}
