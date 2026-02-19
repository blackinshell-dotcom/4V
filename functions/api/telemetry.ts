export interface Env {
  DB: D1Database;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type",
      "cache-control": "no-store",
    },
  });
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;

  // CORS preflight
  if (request.method === "OPTIONS") return json({ ok: true }, 200);

  const url = new URL(request.url);

  // GET /api/telemetry?since=ISO_TIMESTAMP
  if (request.method === "GET") {
    const since = url.searchParams.get("since") || "1970-01-01T00:00:00.000Z";

    const { results } = await env.DB.prepare(
      `SELECT id, device_id, odometer_km, created_at, updated_at
       FROM telemetry
       WHERE updated_at > ?
       ORDER BY updated_at ASC
       LIMIT 500`
    )
      .bind(since)
      .all();

    return json({ ok: true, results, serverTime: new Date().toISOString() });
  }

  // POST /api/telemetry  (upsert)
  if (request.method === "POST") {
    const body = (await request.json()) as {
      id: string;
      device_id: string;
      odometer_km: number;
      created_at?: string;
      updated_at?: string;
    };

    if (!body?.id || !body?.device_id || typeof body.odometer_km !== "number") {
      return json({ ok: false, error: "Missing/invalid fields" }, 400);
    }

    const now = new Date().toISOString();
    const createdAt = body.created_at || now;
    const updatedAt = body.updated_at || now;

    await env.DB.prepare(
      `INSERT INTO telemetry (id, device_id, odometer_km, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         device_id=excluded.device_id,
         odometer_km=excluded.odometer_km,
         updated_at=excluded.updated_at`
    )
      .bind(body.id, body.device_id, body.odometer_km, createdAt, updatedAt)
      .run();

    return json({ ok: true, saved: { ...body, created_at: createdAt, updated_at: updatedAt } });
  }

  return json({ ok: false, error: "Method not allowed" }, 405);
};
