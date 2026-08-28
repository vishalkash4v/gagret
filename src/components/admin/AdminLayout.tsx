import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BadgePercent,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  Receipt,
  ShieldCheck,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearToken, getToken } from "@/lib/admin-api";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", Icon: Users },
  { to: "/admin/providers", label: "Providers", Icon: ShieldCheck },
  { to: "/admin/services", label: "Services", Icon: Wrench },
  { to: "/admin/bookings", label: "Bookings", Icon: CalendarCheck },
  { to: "/admin/offers", label: "Offers", Icon: BadgePercent },
  { to: "/admin/transactions", label: "Transactions", Icon: Receipt },
] as const;

export function AdminLayout({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [authorized, setAuthorized] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      window.location.replace("/admin/login");
    } else {
      setAuthorized(true);
    }
  }, [navigate]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function handleLogout() {
    clearToken();
    navigate({ to: "/admin/login", replace: true });
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 text-sm text-muted-foreground">
        Checking session…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 -translate-x-full border-r border-border bg-card transition-transform lg:translate-x-0",
          open && "translate-x-0",
        )}
        aria-label="Admin navigation"
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <span className="font-display text-lg font-extrabold">
            Home<span className="text-accent">Fix</span>{" "}
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Admin</span>
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="lg:hidden"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <nav className="space-y-1 p-3">
          {navItems.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                pathname === to && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-card/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <h1 className="text-lg font-bold">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </Button>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
