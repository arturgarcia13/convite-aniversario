export async function onRequestGet({ env }) {
  try {
    let list = [];
    if (env && env.RSVPS) {
      const raw = await env.RSVPS.get('rsvps_list');
      if (raw) list = JSON.parse(raw);
    }
    return new Response(JSON.stringify({ rsvps: list }), {
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
