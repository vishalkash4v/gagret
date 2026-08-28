import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarCheck, IndianRupee, ShieldCheck, Users } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ErrorState } from "@/components/admin/DataState";
import { Skeleton } from "@/components/ui/skeleton";
import { api, apiErrorMessage, formatCurrency, unwrapObject } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dashboard — HomeFix Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DashboardPage,
});

interface DashboardData {
  totalUsers?: number;
  totalProviders?: number;
  totalBookings?: number;
  totalEarnings?: number;
  counts?: Record<string, number>;
  graphs?: {
    dailyBookings?: Array<Record<string, unknown>>;
    monthlyBookings?: Array<Record<string, unknown>>;
  };
}

function num(data: DashboardData, ...keys: string[]) {
  for (const key of keys) {
    const direct = (data as Record<string, unknown>)[key];
    if (typeof direct === "number") return direct;
    const nested = data.counts?.[key];
    if (typeof nested === "number") return nested;
  }
  return 0;
}

function normalise(rows: Array<Record<string, unknown>> | undefined, labelKeys: string[]) {
  return (rows ?? []).map((row) => {
    const labelKey = labelKeys.find((k) => row[k] !== undefined) ?? Object.keys(row)[0];
    const rawLabel = row[labelKey ?? ""];
    const label =
      rawLabel && typeof rawLabel === "object"
        ? Object.values(rawLabel as Record<string, unknown>).join("-")
        : String(rawLabel ?? "");
    const value = Number(row["count"] ?? row["total"] ?? row["bookings"] ?? row["value"] ?? 0);
    return { label, value };
  });
}

function DashboardPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => unwrapObject<DashboardData>((await api.get("/admin/dashboard")).data),
    retry: 1,
  });

  const metrics = [
    { label: "Total Users", value: num(data ?? {}, "totalUsers", "users"), Icon: Users },
    { label: "Total Providers", value: num(data ?? {}, "totalProviders", "providers"), Icon: ShieldCheck },
    { label: "Total Bookings", value: num(data ?? {}, "totalBookings", "bookings"), Icon: CalendarCheck },
    {
      label: "Total Earnings",
      value: formatCurrency(num(data ?? {}, "totalEarnings", "earnings", "revenue")),
      Icon: IndianRupee,
    },
  ];

  const daily = normalise(data?.graphs?.dailyBookings, ["date", "day", "_id", "label"]);
  const monthly = normalise(data?.graphs?.monthlyBookings, ["month", "_id", "label"]);

  return (
    <AdminLayout title="Dashboard">
      {error ? (
        <div className="rounded-xl border border-border bg-card">
          <ErrorState message={apiErrorMessage(error, "Could not load dashboard")} onRetry={() => refetch()} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map(({ label, value, Icon }) => (
              <article key={label} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">{label}</p>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                {isLoading ? (
                  <Skeleton className="mt-3 h-8 w-24" />
                ) : (
                  <p className="mt-3 text-3xl font-extrabold">{value}</p>
                )}
              </article>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <h2 className="text-base font-bold">Last 7 Days Bookings</h2>
              {isLoading ? (
                <Skeleton className="mt-4 h-64 w-full" />
              ) : daily.length === 0 ? (
                <p className="mt-8 text-center text-sm text-muted-foreground">No booking data yet.</p>
              ) : (
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={daily}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "0.5rem",
                          color: "var(--card-foreground)",
                        }}
                      />
                      <Bar dataKey="value" name="Bookings" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <h2 className="text-base font-bold">Monthly Bookings</h2>
              {isLoading ? (
                <Skeleton className="mt-4 h-64 w-full" />
              ) : monthly.length === 0 ? (
                <p className="mt-8 text-center text-sm text-muted-foreground">No booking data yet.</p>
              ) : (
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "0.5rem",
                          color: "var(--card-foreground)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Bookings"
                        stroke="var(--accent)"
                        strokeWidth={3}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
