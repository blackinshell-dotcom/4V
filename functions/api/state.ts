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

  if (request.method === "OPTIONS") return json({ ok: true });

  // We keep it simple: one shared record for your whole app.
  // (Later, if you want per-user accounts, we can partition by userId.)
  const KEY = "moto_state";

  if (request.method === "GET") {
    const row = await env.DB.prepare(
      `SELECT key, state_json, updated_at FROM app_state WHERE key = ? LIMIT 1`
    ).bind(KEY).first<{ key: string; state_json: string; updated_at: string }>();

    return json({
      ok: true,
      record: row
        ? { key: row.key, state: JSON.parse(row.state_json), updated_at: row.updated_at }
        : null,
      serverTime: new Date().toISOString(),
    });
  }

  if (request.method === "POST") {
    const body = (await request.json()) as {
      state: unknown;
      updated_at?: string; // client can send, otherwise server will set
    };

    if (!("state" in body)) return json({ ok: false, error: "Missing state" }, 400);

    const updatedAt = body.updated_at || new Date().toISOString();
    const stateJson = JSON.stringify(body.state);

    await env.DB.prepare(
      `INSERT INTO app_state (key, state_json, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET
         state_json=excluded.state_json,
         updated_at=excluded.updated_at`
    )
      .bind(KEY, stateJson, updatedAt)
      .run();

    return json({ ok: true, updated_at: updatedAt });
  }

  return json({ ok: false, error: "Method not allowed" }, 405);
};
