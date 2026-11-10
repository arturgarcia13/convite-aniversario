/**
 * Cloudflare Pages Function: /api/rsvp
 * Compatible with Cloudflare KV / D1, or edge memory
 */
export async function onRequestPost({ request, env }) {
  try {
    const { name, attending } = await request.json();

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return new Response(JSON.stringify({ error: 'O nome é obrigatório.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const now = new Date().toISOString();
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name: name.trim(),
      attending: Boolean(attending),
      createdAt: now,
      updatedAt: now
    };

    // If Cloudflare KV is bound to env.RSVPS
    if (env && env.RSVPS) {
      let list = [];
      const raw = await env.RSVPS.get('rsvps_list');
      if (raw) list = JSON.parse(raw);

      const existingIdx = list.findIndex(r => r.name.toLowerCase() === entry.name.toLowerCase());
      if (existingIdx >= 0) {
        list[existingIdx] = entry;
      } else {
        list.unshift(entry);
      }
      await env.RSVPS.put('rsvps_list', JSON.stringify(list));
    }

    return new Response(JSON.stringify({ success: true, rsvp: entry }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
