import { createFileRoute } from "@tanstack/react-router";

const UPSTREAM = "https://providersbackend.vercel.app/api/admin";

/**
 * Server-side pass-through to the marketplace backend.
 * The upstream API does not send CORS headers, so browser calls must be relayed here.
 * Only the caller's own Authorization header is forwarded — no credentials are stored server-side.
 */
async function proxy({ request, params }: { request: Request; params: Record<string, string> }) {
  const splat = params["_splat"] ?? "";
  const url = new URL(request.url);
  const target = `${UPSTREAM}/${splat}${url.search}`;

  const headers = new Headers();
  const auth = request.headers.get("authorization");
  if (auth) headers.set("authorization", auth);
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  headers.set("accept", "application/json");

  const method = request.method.toUpperCase();
  const init: RequestInit = { method, headers };
  if (method !== "GET" && method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  try {
    const upstream = await fetch(target, init);
    const body = await upstream.arrayBuffer();
    return new Response(body, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "application/json",
        "cache-control": "no-store",
      },
    });
  } catch {
    return new Response(JSON.stringify({ message: "Upstream API unreachable" }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }
}

export const Route = createFileRoute("/api/public/admin-proxy/$")({
  server: {
    handlers: {
      GET: proxy,
      POST: proxy,
      PUT: proxy,
      PATCH: proxy,
      DELETE: proxy,
    },
  },
});
