// Contact / get-involved form endpoint.
// TODO: forward submissions to email (e.g. Resend) or storage (e.g. Firebase).
// For now it validates and accepts so the UI is fully wired; connect a backend
// by dropping the integration in below.

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as Record<string, unknown>;

    if (!data.email || typeof data.email !== "string") {
      return Response.json({ ok: false, error: "Email required" }, { status: 400 });
    }

    console.log("[contact] submission received:", data);

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
